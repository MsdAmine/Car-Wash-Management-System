package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.OperatingHoursDayRequest;
import com.carwash.car_wash_api.dto.request.UpdateOperatingHoursRequest;
import com.carwash.car_wash_api.dto.response.OperatingHoursResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.OperatingHours;
import com.carwash.car_wash_api.repository.OperatingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperatingHoursService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final OperatingHoursRepository operatingHoursRepository;

    @Transactional(readOnly = true)
    public List<OperatingHoursResponse> getAll() {
        return operatingHoursRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<OperatingHoursResponse> updateAll(UpdateOperatingHoursRequest request) {
        for (OperatingHoursDayRequest day : request.getDays()) {
            OperatingHours oh = operatingHoursRepository.findByDayOfWeek(day.getDayOfWeek())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Operating hours not found for day: " + day.getDayOfWeek()));
            oh.setOpenTime(LocalTime.parse(day.getOpenTime(), TIME_FORMATTER));
            oh.setCloseTime(LocalTime.parse(day.getCloseTime(), TIME_FORMATTER));
            oh.setOpen(day.isOpen());
            operatingHoursRepository.save(oh);
        }
        return operatingHoursRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private OperatingHoursResponse toResponse(OperatingHours oh) {
        return OperatingHoursResponse.builder()
                .id(oh.getId())
                .dayOfWeek(oh.getDayOfWeek())
                .openTime(oh.getOpenTime().format(TIME_FORMATTER))
                .closeTime(oh.getCloseTime().format(TIME_FORMATTER))
                .isOpen(oh.isOpen())
                .build();
    }
}
