package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePaymentStatusRequest {

    @NotNull(message = "Status is required")
    private PaymentStatus status;
}
