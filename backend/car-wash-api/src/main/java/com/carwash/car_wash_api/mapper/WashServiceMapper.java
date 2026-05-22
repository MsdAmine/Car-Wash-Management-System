package com.carwash.car_wash_api.mapper;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.model.entity.WashService;
import org.springframework.stereotype.Component;

@Component
public class WashServiceMapper {

    public WashService toEntity(WashServiceRequest request) {
        if (request == null) return null;
        return WashService.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .active(request.getActive() != null ? request.getActive() : true)
                .imageUrl(request.getImageUrl())
                .build();
    }

    public WashServiceResponse toResponse(WashService washService) {
        if (washService == null) return null;
        return WashServiceResponse.builder()
                .id(washService.getId())
                .name(washService.getName())
                .description(washService.getDescription())
                .price(washService.getPrice())
                .durationMinutes(washService.getDurationMinutes())
                .active(washService.getActive())
                .imageUrl(washService.getImageUrl())
                .createdAt(washService.getCreatedAt())
                .updatedAt(washService.getUpdatedAt())
                .build();
    }
}
