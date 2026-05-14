package com.carwash.car_wash_api.dto.response;

import com.carwash.car_wash_api.model.enums.PaymentMethod;
import com.carwash.car_wash_api.model.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private UUID id;
    private UUID bookingId;
    private Long customerId;
    private String customerEmail;
    private BigDecimal amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paidAt;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
