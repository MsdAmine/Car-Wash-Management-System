package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {

    @NotNull(message = "Booking ID is required")
    private UUID bookingId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 10, fraction = 2, message = "Amount must have at most 10 integer digits and 2 decimal places")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
