package com.carwash.car_wash_api.mapper;

import com.carwash.car_wash_api.dto.request.VehicleRequest;
import com.carwash.car_wash_api.dto.response.VehicleResponse;
import com.carwash.car_wash_api.model.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    /**
     * Converts a VehicleRequest DTO to a Vehicle Entity.
     * Note: The 'owner' must be set separately in the Service layer.
     */
    public Vehicle toEntity(VehicleRequest request) {
        if (request == null)
            return null;

        return Vehicle.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .licensePlate(request.getLicensePlate())
                .type(request.getType())
                .build();
    }

    /**
     * Converts a Vehicle Entity to a VehicleResponse DTO.
     */
    public VehicleResponse toResponse(Vehicle vehicle) {
        if (vehicle == null)
            return null;

        return VehicleResponse.builder()
                .id(vehicle.getId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .licensePlate(vehicle.getLicensePlate())
                .type(vehicle.getType())
                .ownerEmail(vehicle.getOwner() != null ? vehicle.getOwner().getEmail() : null)
                .build();
    }
}
