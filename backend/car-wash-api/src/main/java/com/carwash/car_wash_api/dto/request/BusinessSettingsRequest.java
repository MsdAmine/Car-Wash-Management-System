package com.carwash.car_wash_api.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSettingsRequest {

    @NotBlank(message = "Business name is required")
    private String businessName;

    private String phone;
    private String address;
    private String city;

    @Min(value = 0, message = "Cancellation hours must be at least 0")
    @Max(value = 168, message = "Cancellation hours must be at most 168")
    private Integer cancellationHours;
}
