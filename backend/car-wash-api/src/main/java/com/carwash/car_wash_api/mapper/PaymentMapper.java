package com.carwash.car_wash_api.mapper;

import com.carwash.car_wash_api.dto.response.PaymentResponse;
import com.carwash.car_wash_api.model.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {
        if (payment == null)
            return null;

        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking() != null ? payment.getBooking().getId() : null)
                .customerId(payment.getBooking() != null && payment.getBooking().getCustomer() != null
                        ? payment.getBooking().getCustomer().getId() : null)
                .customerEmail(payment.getBooking() != null && payment.getBooking().getCustomer() != null
                        ? payment.getBooking().getCustomer().getEmail() : null)
                .amount(payment.getAmount())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .paidAt(payment.getPaidAt())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
