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
     * Deletes a vehicle after verifying ownership.
     * Respects security boundaries to prevent unauthorized deletions.
     */
    @Transactional
    public void deleteVehicle(UUID vehicleId) {
        // 1. Identify the current authenticated user
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 2. Find the vehicle to be deleted
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + vehicleId));

        // 3. Ownership Check (Critical Security Rule)
        if (!vehicle.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access Denied: You cannot delete a vehicle you do not own");
        }

        // 4. Perform the deletion
        vehicleRepository.delete(vehicle);
    }

    public VehicleResponse updateVehicle(UUID vehicleId, VehicleRequest request) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (!vehicle.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access Denied: Ownership verification failed");
        }

        if (!vehicle.getLicensePlate().equalsIgnoreCase(request.getLicensePlate()) &&
            vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
                throw new RuntimeException("Vehicle with this license plate already exists");
        }

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setType(request.getType());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(updatedVehicle);
    }

    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(UUID vehicleId) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

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