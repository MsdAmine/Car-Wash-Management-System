package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @Size(min = 2, max = 50, message = "Brand must be between 2 and 50 characters")
    private String brand;

    @NotBlank(message = "Model is required")
    @Size(min = 1, max = 50, message = "Model must be between 1 and 50 characters")
    private String model;

    @NotBlank(message = "License plate is required")
    @Size(min = 3, max = 15, message = "License plate must be between 3 and 15 characters")
    @Pattern(regexp = "^[A-Z0-9- ]+$", message = "License plate can only contain uppercase letters, numbers, hyphens, and spaces")
    private String licensePlate;

    @NotNull(message = "Vehicle type is required")
    private VehicleType type;
}