package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    // Find all vehicles belonging to a specific user (Customer)
    List<Vehicle> findByOwnerId(Long ownerId);

    // Find a specific vehicle by its license plate (for validation)
    Optional<Vehicle> findByLicensePlate(String licensePlate);

    // Check if a license plate already exists before saving
    boolean existsByLicensePlate(String licensePlate);
}