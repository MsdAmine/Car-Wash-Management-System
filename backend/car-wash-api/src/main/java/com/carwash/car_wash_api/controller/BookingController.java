package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.BookingRequest;
import com.carwash.car_wash_api.dto.request.RescheduleBookingRequest;
import com.carwash.car_wash_api.dto.request.UpdateBookingStatusRequest;
import com.carwash.car_wash_api.dto.response.AvailableSlotsResponse;
import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.dto.response.ErrorResponse;
import com.carwash.car_wash_api.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Booking Management", description = "Endpoints for booking and appointment workflow. Customers create and cancel their own bookings; admins and employees manage all bookings.")
public class BookingController {

    private final BookingService bookingService;

    // ── POST /api/v1/bookings ─────────────────────────────────────────────────

    @Operation(
            summary = "Create a booking",
            description = "Creates a new booking for the authenticated customer. The vehicle must belong to the customer and the wash service must be active. Appointment must be at least 30 minutes and at most 90 days in the future.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Booking created successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or booking conflict",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Vehicle does not belong to authenticated customer",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Vehicle or wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(request), HttpStatus.CREATED);
    }

    // ── GET /api/v1/bookings/available-slots ─────────────────────────────────

    @Operation(
            summary = "Get available time slots",
            description = "Returns all candidate time slots for the given date and wash service. Each slot indicates whether it is available or already booked. Returns an empty list when the business is closed on that day.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Slots retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AvailableSlotsResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Wash service not found or inactive",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/available-slots")
    public ResponseEntity<AvailableSlotsResponse> getAvailableSlots(
            @RequestParam String date,
            @RequestParam UUID serviceId) {
        return ResponseEntity.ok(bookingService.getAvailableSlots(date, serviceId));
    }

    // ── GET /api/v1/bookings/my ───────────────────────────────────────────────

    @Operation(
            summary = "Get my bookings",
            description = "Returns all bookings belonging to the authenticated customer.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    // ── GET /api/v1/bookings/{id} ─────────────────────────────────────────────

    @Operation(
            summary = "Get a booking by ID",
            description = "Returns a single booking. Customers can only access their own bookings; admins can access any booking.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking found",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Booking belongs to a different customer",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // ── GET /api/v1/bookings/today ────────────────────────────────────────────

    @Operation(
            summary = "Get today's bookings",
            description = "Returns all bookings whose appointment falls on today. Requires ADMIN or EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Today's bookings retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/today")
    public ResponseEntity<List<BookingResponse>> getTodaysBookings() {
        return ResponseEntity.ok(bookingService.getTodaysBookings());
    }

    // ── GET /api/v1/bookings ──────────────────────────────────────────────────

    @Operation(
            summary = "List all bookings",
            description = "Returns every booking in the system. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "All bookings retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ── PATCH /api/v1/bookings/{id}/status ───────────────────────────────────

    @Operation(
            summary = "Update booking status",
            description = "Updates the status of a booking (e.g. PENDING → CONFIRMED → COMPLETED). Requires ADMIN or EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking status updated successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status value",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

    // ── PATCH /api/v1/bookings/{id}/reschedule ───────────────────────────────

    @Operation(
            summary = "Reschedule my booking",
            description = "Customer reschedules their own PENDING or CONFIRMED booking to a new date and time.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking rescheduled successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid time or booking cannot be rescheduled",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Booking belongs to a different customer",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<BookingResponse> rescheduleMyBooking(
            @PathVariable UUID id,
            @Valid @RequestBody RescheduleBookingRequest request) {
        return ResponseEntity.ok(bookingService.rescheduleMyBooking(id, request));
    }

    // ── PATCH /api/v1/bookings/{id}/cancel ───────────────────────────────────

    @Operation(
            summary = "Cancel a booking",
            description = "Cancels the authenticated customer's own booking. Only PENDING bookings can be cancelled.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking cancelled successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Booking is not in PENDING status",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Booking belongs to a different customer",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}
