package com.carwash.car_wash_api.mapper;

import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.model.entity.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking) {
        if (booking == null)
            return null;

        return BookingResponse.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer() != null ? booking.getCustomer().getId() : null)
                .customerEmail(booking.getCustomer() != null ? booking.getCustomer().getEmail() : null)
                .vehicleId(booking.getVehicle() != null ? booking.getVehicle().getId() : null)
                .vehicleLicensePlate(booking.getVehicle() != null ? booking.getVehicle().getLicensePlate() : null)
                .washServiceId(booking.getWashService() != null ? booking.getWashService().getId() : null)
                .washServiceName(booking.getWashService() != null ? booking.getWashService().getName() : null)
                .washServicePrice(booking.getWashService() != null ? booking.getWashService().getPrice() : null)
                .durationMinutes(booking.getWashService() != null ? booking.getWashService().getDurationMinutes() : null)
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .appointmentDateTime(booking.getAppointmentDateTime())
                .endDateTime(booking.getEndDateTime())
                .startedAt(booking.getStartedAt())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
