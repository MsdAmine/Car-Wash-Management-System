package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.VehicleRequest;
import com.carwash.car_wash_api.dto.response.VehicleResponse;
import com.carwash.car_wash_api.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /**
     * GET /api/v1/vehicles/customer/{customerId}
     * Admin endpoint to view all vehicles belonging to a specific customer.
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<VehicleResponse>> getVehiclesByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByCustomerId(customerId));
    }

    /**
     * POST /api/v1/vehicles
     * Registers a new vehicle for the authenticated user.
     */
    
    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return new ResponseEntity<>(vehicleService.createVehicle(request), HttpStatus.CREATED);
    }

    /**
     * GET /api/v1/vehicles
     * Returns a list of vehicles owned by the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getMyVehicles() {
        return ResponseEntity.ok(vehicleService.getMyVehicles());
    }

    /**
     * GET /api/v1/vehicles/{id}
     * Returns details of a specific vehicle owned by the user.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    /**
     * PUT /api/v1/vehicles/{id}
     * Updates an existing vehicle's details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable UUID id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    /**
     * DELETE /api/v1/vehicles/{id}
     * Removes a vehicle from the user's account.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}