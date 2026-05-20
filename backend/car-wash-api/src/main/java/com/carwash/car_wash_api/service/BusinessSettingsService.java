package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.BusinessSettingsRequest;
import com.carwash.car_wash_api.dto.response.BusinessSettingsResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.BusinessSettings;
import com.carwash.car_wash_api.repository.BusinessSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BusinessSettingsService {

    private final BusinessSettingsRepository businessSettingsRepository;

    @Transactional(readOnly = true)
    public BusinessSettingsResponse getSettings() {
        return toResponse(findSettings());
    }

    @Transactional
    public BusinessSettingsResponse updateSettings(BusinessSettingsRequest request) {
        BusinessSettings settings = findSettings();
        settings.setBusinessName(request.getBusinessName());
        settings.setPhone(request.getPhone());
        settings.setAddress(request.getAddress());
        settings.setCity(request.getCity());
        if (request.getCancellationHours() != null) {
            settings.setCancellationHours(request.getCancellationHours());
        }
        return toResponse(businessSettingsRepository.save(settings));
    }

    private BusinessSettings findSettings() {
        return businessSettingsRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Business settings not found"));
    }

    private BusinessSettingsResponse toResponse(BusinessSettings settings) {
        return BusinessSettingsResponse.builder()
                .id(settings.getId())
                .businessName(settings.getBusinessName())
                .phone(settings.getPhone())
                .address(settings.getAddress())
                .city(settings.getCity())
                .cancellationHours(settings.getCancellationHours())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
