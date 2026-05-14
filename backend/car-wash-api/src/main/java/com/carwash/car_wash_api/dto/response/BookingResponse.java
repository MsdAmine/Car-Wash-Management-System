package com.carwash.car_wash_api.dto.response;

import com.carwash.car_wash_api.model.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private UUID id;

    private Long customerId;
    private String customerEmail;

    private UUID vehicleId;
    private String vehicleLicensePlate;

    private UUID washServiceId;
    private String washServiceName;
    private BigDecimal washServicePrice;
    private Integer durationMinutes;

    private BookingStatus status;
    private LocalDateTime appointmentDateTime;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
