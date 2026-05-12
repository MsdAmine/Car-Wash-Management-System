package com.carwash.car_wash_api.dto.response;

import com.carwash.car_wash_api.model.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private UUID id;
    private String brand;
    private String model;
    private String licensePlate;
    private VehicleType type;
    private String ownerEmail; // Expose only necessary owner info
}