package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;
}
