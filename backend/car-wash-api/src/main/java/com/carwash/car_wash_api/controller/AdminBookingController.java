package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.AdminBookingRequest;
import com.carwash.car_wash_api.dto.request.RescheduleBookingRequest;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
@Tag(name = "Admin Booking Management", description = "Admin-only endpoints for creating bookings on behalf of customers.")
public class AdminBookingController {

    private final BookingService bookingService;

    @Operation(
            summary = "Create a booking for a customer",
            description = "Admin creates a booking on behalf of an existing customer. The vehicle must belong to the specified customer.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Booking created successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or booking conflict",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Customer, vehicle, or wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<BookingResponse> createBookingForCustomer(
            @Valid @RequestBody AdminBookingRequest request) {
        return new ResponseEntity<>(bookingService.createBookingForCustomer(request), HttpStatus.CREATED);
    }

    @Operation(
            summary = "Reschedule a booking",
            description = "Admin reschedules an existing booking to a new date and time. The booking must not be CANCELLED or COMPLETED.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking rescheduled successfully",
                    content = @Content(schema = @Schema(implementation = BookingResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid time or booking cannot be rescheduled",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<BookingResponse> rescheduleBooking(
            @PathVariable UUID id,
            @Valid @RequestBody RescheduleBookingRequest request) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, request));
    }
}
