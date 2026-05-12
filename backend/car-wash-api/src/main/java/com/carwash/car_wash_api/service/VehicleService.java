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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    /**
     * Retrieves all vehicles belonging to the currently authenticated user.
     * Respects ownership boundaries by filtering by the active user's ID.
     */
    @Transactional(readOnly = true)
    public List<VehicleResponse> getMyVehicles() {
        // 1. Identify the current user from the SecurityContext
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 2. Fetch only vehicles owned by this user via the repository
        List<Vehicle> vehicles = vehicleRepository.findByOwnerId(owner.getId());

        // 3. Map entities to Response DTOs
        return vehicles.stream()
                .map(vehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new vehicle for the authenticated user.
     * Enforces unique license plates and ownership rules.
     */
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