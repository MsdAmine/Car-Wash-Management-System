package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.VehicleRequest;
import com.carwash.car_wash_api.dto.response.VehicleResponse;
import com.carwash.car_wash_api.mapper.VehicleMapper;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.entity.Vehicle;
import com.carwash.car_wash_api.repository.VehicleRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    /**
     * Retrieves a specific vehicle by ID.
     * Validates that the vehicle belongs to the authenticated user.
     */
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(UUID vehicleId) {
        // 1. Identify the current user
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 2. Find the vehicle
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + vehicleId));

        // 3. Ownership Check (Security Rule Enforcement)
        if (!vehicle.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access Denied: You do not own this vehicle");
        }

        return vehicleMapper.toResponse(vehicle);
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> getMyVehicles() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(owner.getId());

        return vehicles.stream()
                .map(vehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new RuntimeException("Vehicle with this license plate already exists");
        }

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Vehicle vehicle = vehicleMapper.toEntity(request);
        vehicle.setOwner(owner);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }
}