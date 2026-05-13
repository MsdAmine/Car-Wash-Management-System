package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.WashServiceMapper;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Transactional(readOnly = true)
    public List<WashServiceResponse> getAllWashServices() {
        return washServiceRepository.findAll().stream()
                .map(washServiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WashServiceResponse> getActiveWashServices() {
        return washServiceRepository.findByActiveTrue().stream()
                .map(washServiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WashServiceResponse getWashServiceById(UUID id) {
        WashService washService = washServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + id));
        return washServiceMapper.toResponse(washService);
    }

    @Transactional
    public WashServiceResponse updateWashService(UUID id, WashServiceRequest request) {
        WashService washService = washServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + id));

        if (!washService.getName().equalsIgnoreCase(request.getName()) &&
                washServiceRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("A wash service with this name already exists");
        }

        washService.setName(request.getName());
        washService.setDescription(request.getDescription());
        washService.setPrice(request.getPrice());
        washService.setDurationMinutes(request.getDurationMinutes());
        if (request.getActive() != null) {
            washService.setActive(request.getActive());
        }

        return washServiceMapper.toResponse(washServiceRepository.save(washService));
    }

    @Transactional
    public WashServiceResponse deactivateWashService(UUID id) {
        WashService washService = washServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + id));

        washService.setActive(false);
        return washServiceMapper.toResponse(washServiceRepository.save(washService));
    }

    @Transactional
    public void deleteWashService(UUID id) {
        WashService washService = washServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + id));
        washServiceRepository.delete(washService);
    }
}
