package com.carwash.car_wash_api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RescheduleBookingRequest {
    @NotNull(message = "New appointment date and time is required")
    private LocalDateTime appointmentDateTime;
}
