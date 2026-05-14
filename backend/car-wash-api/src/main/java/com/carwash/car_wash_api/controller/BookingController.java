package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.BookingRequest;
import com.carwash.car_wash_api.dto.request.UpdateBookingStatusRequest;
import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * POST /api/v1/bookings
     * Create a new booking for the authenticated customer.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(request), HttpStatus.CREATED);
    }

    /**
     * GET /api/v1/bookings/my
     * Return all bookings belonging to the authenticated customer.
     */
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    /**
     * GET /api/v1/bookings/{id}
     * Return a single booking. Customers can only access their own; admins can access any.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    /**
     * GET /api/v1/bookings/today
     * Return all bookings scheduled for today (admin / employee only).
     */
    @GetMapping("/today")
    public ResponseEntity<List<BookingResponse>> getTodaysBookings() {
        return ResponseEntity.ok(bookingService.getTodaysBookings());
    }

    /**
     * GET /api/v1/bookings
     * Return all bookings in the system (admin only).
     */
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * PATCH /api/v1/bookings/{id}/status
     * Update the status of a booking (admin / employee only).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

    /**
     * PATCH /api/v1/bookings/{id}/cancel
     * Cancel the authenticated customer's own PENDING booking.
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
