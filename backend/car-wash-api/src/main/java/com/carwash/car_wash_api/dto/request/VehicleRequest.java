package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[A-Z0-9- ]+$", message = "Invalid license plate format")
    private String licensePlate;

    @NotNull(message = "Vehicle type is required")
    private VehicleType type;
}