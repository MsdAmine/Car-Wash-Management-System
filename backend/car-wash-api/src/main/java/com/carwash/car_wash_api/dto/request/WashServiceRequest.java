package com.carwash.car_wash_api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for creating or updating a wash service")
public class WashServiceRequest {

    @Schema(description = "Unique name of the wash service", example = "Basic Wash", minLength = 2, maxLength = 100)
    @NotBlank(message = "Service name is required")
    @Size(min = 2, max = 100, message = "Service name must be between 2 and 100 characters")
    private String name;

    @Schema(description = "Optional description of the wash service", example = "A quick exterior wash", maxLength = 500)
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Schema(description = "Price of the wash service in USD (must be greater than 0)", example = "9.99")
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal price;

    @Schema(description = "Duration of the wash service in minutes (1–480)", example = "30")
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 480, message = "Duration must not exceed 480 minutes")
    private Integer durationMinutes;

    @Schema(description = "Whether this service is active and bookable (defaults to true when omitted)", example = "true")
    private Boolean active;
}
