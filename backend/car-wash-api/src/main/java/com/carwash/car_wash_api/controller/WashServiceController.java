package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.service.WashServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class WashServiceController {

    private final WashServiceService washServiceService;

    @PostMapping
    public ResponseEntity<WashServiceResponse> createWashService(@Valid @RequestBody WashServiceRequest request) {
        return new ResponseEntity<>(washServiceService.createWashService(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WashServiceResponse>> getAllWashServices() {
        return ResponseEntity.ok(washServiceService.getAllWashServices());
    }

    @GetMapping("/active")
    public ResponseEntity<List<WashServiceResponse>> getActiveWashServices() {
        return ResponseEntity.ok(washServiceService.getActiveWashServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WashServiceResponse> getWashServiceById(@PathVariable UUID id) {
        return ResponseEntity.ok(washServiceService.getWashServiceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WashServiceResponse> updateWashService(
            @PathVariable UUID id,
            @Valid @RequestBody WashServiceRequest request) {
        return ResponseEntity.ok(washServiceService.updateWashService(id, request));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<WashServiceResponse> deactivateWashService(@PathVariable UUID id) {
        return ResponseEntity.ok(washServiceService.deactivateWashService(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWashService(@PathVariable UUID id) {
        washServiceService.deleteWashService(id);
        return ResponseEntity.noContent().build();
    }
}
