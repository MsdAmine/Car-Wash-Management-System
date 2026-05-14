package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.BookingRequest;
import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.exception.AccessDeniedException;
import com.carwash.car_wash_api.exception.InvalidBookingException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.BookingMapper;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.entity.Vehicle;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final WashServiceRepository washServiceRepository;
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User customer = resolveCurrentUser();

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        validateVehicleOwnership(vehicle, customer);

        WashService washService = washServiceRepository.findById(request.getWashServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + request.getWashServiceId()));

        validateActiveWashService(washService);

        validateAppointmentDateTime(request.getAppointmentDateTime());

        // #220 — calculate end time from service duration
        LocalDateTime endDateTime = request.getAppointmentDateTime()
                .plusMinutes(washService.getDurationMinutes());

        validateNoConflictingBooking(vehicle, request.getAppointmentDateTime(), endDateTime);

        // #221 — snapshot the service price as the booking total
        BigDecimal totalPrice = washService.getPrice();

        Booking booking = Booking.builder()
                .customer(customer)
                .vehicle(vehicle)
                .washService(washService)
                .appointmentDateTime(request.getAppointmentDateTime())
                .endDateTime(endDateTime)
                .totalPrice(totalPrice)
                .notes(request.getNotes())
                .build();

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    // #217 — validate the vehicle belongs to the authenticated customer
    private void validateVehicleOwnership(Vehicle vehicle, User customer) {
        if (!vehicle.getOwner().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You do not have permission to book with this vehicle");
        }
    }

    // #218 — validate the requested wash service is currently active
    private void validateActiveWashService(WashService washService) {
        if (!Boolean.TRUE.equals(washService.getActive())) {
            throw new InvalidBookingException(
                    "Wash service '" + washService.getName() + "' is not available for booking");
        }
    }

    // #219 — validate the appointment is at least 30 minutes in the future and within 90 days
    private void validateAppointmentDateTime(LocalDateTime appointmentDateTime) {
        LocalDateTime now = LocalDateTime.now();
        if (!appointmentDateTime.isAfter(now.plusMinutes(30))) {
            throw new InvalidBookingException(
                    "Appointment must be scheduled at least 30 minutes from now");
        }
        if (appointmentDateTime.isAfter(now.plusDays(90))) {
            throw new InvalidBookingException(
                    "Appointment cannot be scheduled more than 90 days in advance");
        }
    }

    // #220 — detect time-range overlaps instead of exact-time matches
    private void validateNoConflictingBooking(Vehicle vehicle, LocalDateTime appointmentDateTime, LocalDateTime endDateTime) {
        boolean conflict = bookingRepository.existsOverlappingBooking(
                vehicle.getId(),
                appointmentDateTime,
                endDateTime,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );
        if (conflict) {
            throw new InvalidBookingException(
                    "This vehicle already has a booking that overlaps the requested time slot");
        }
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
