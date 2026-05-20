package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.UpdateOperatingHoursRequest;
import com.carwash.car_wash_api.dto.response.OperatingHoursResponse;
import com.carwash.car_wash_api.service.OperatingHoursService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/settings/hours")
@RequiredArgsConstructor
public class OperatingHoursController {

    private final OperatingHoursService operatingHoursService;

    @GetMapping
    public ResponseEntity<List<OperatingHoursResponse>> getAll() {
        return ResponseEntity.ok(operatingHoursService.getAll());
    }

    @PutMapping
    public ResponseEntity<List<OperatingHoursResponse>> updateAll(
            @Valid @RequestBody UpdateOperatingHoursRequest request) {
        return ResponseEntity.ok(operatingHoursService.updateAll(request));
    }
}
