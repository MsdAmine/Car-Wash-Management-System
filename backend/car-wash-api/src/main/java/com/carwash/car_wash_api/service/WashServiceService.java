package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.mapper.WashServiceMapper;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WashServiceService {

    private final WashServiceRepository washServiceRepository;
    private final WashServiceMapper washServiceMapper;

    @Transactional
    public WashServiceResponse createWashService(WashServiceRequest request) {
        if (washServiceRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("A wash service with this name already exists");
        }

        WashService washService = washServiceMapper.toEntity(request);
        WashService saved = washServiceRepository.save(washService);
        return washServiceMapper.toResponse(saved);
    }
}
