package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.BusinessSettingsRequest;
import com.carwash.car_wash_api.dto.response.BusinessSettingsResponse;
import com.carwash.car_wash_api.service.BusinessSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/settings/business")
@RequiredArgsConstructor
public class BusinessSettingsController {

    private final BusinessSettingsService businessSettingsService;

    @GetMapping
    public ResponseEntity<BusinessSettingsResponse> getSettings() {
        return ResponseEntity.ok(businessSettingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<BusinessSettingsResponse> updateSettings(
            @Valid @RequestBody BusinessSettingsRequest request) {
        return ResponseEntity.ok(businessSettingsService.updateSettings(request));
    }
}
