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

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    /**
     * Creates a new vehicle for the authenticated user.
     * Enforces unique license plates and ownership rules.
     */
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        // 1. Check if license plate already exists
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new RuntimeException("Vehicle with this license plate already exists");
        }

        // 2. Get the currently authenticated user's email from SecurityContext
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User owner = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // 3. Map Request DTO to Entity
        Vehicle vehicle = vehicleMapper.toEntity(request);

        // 4. Set the owner (Access Rule Enforcement)
        vehicle.setOwner(owner);

        // 5. Save and return the Response DTO
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }
}
