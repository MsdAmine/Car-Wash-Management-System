package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.AssignEmployeeRequest;
import com.carwash.car_wash_api.dto.response.BookingAssignmentResponse;
import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.dto.response.ErrorResponse;
import com.carwash.car_wash_api.service.BookingAssignmentService;
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
@RequiredArgsConstructor
@Tag(name = "Booking Assignments", description = "Endpoints for assigning employees to bookings and querying assignment data. Admin manages assignments; employees view their own.")
public class BookingAssignmentController {

    private final BookingAssignmentService assignmentService;

    // ── POST /api/v1/bookings/{bookingId}/assign ──────────────────────────────

    @Operation(
            summary = "Assign an employee to a booking",
            description = "Assigns an active employee to a PENDING or CONFIRMED booking. Requires ADMIN role. The same employee cannot be assigned twice to the same booking.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Employee assigned successfully",
                    content = @Content(schema = @Schema(implementation = BookingAssignmentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request or booking is not assignable",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking or employee not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Employee already assigned to this booking",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/api/v1/bookings/{bookingId}/assign")
    public ResponseEntity<BookingAssignmentResponse> assignEmployee(
            @PathVariable UUID bookingId,
            @Valid @RequestBody AssignEmployeeRequest request) {
        return new ResponseEntity<>(assignmentService.assignEmployee(bookingId, request), HttpStatus.CREATED);
    }

    // ── DELETE /api/v1/bookings/{bookingId}/assign/{employeeId} ───────────────

    @Operation(
            summary = "Remove an employee from a booking",
            description = "Removes a previously assigned employee from a booking. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Employee removed from booking successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking or assignment not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/api/v1/bookings/{bookingId}/assign/{employeeId}")
    public ResponseEntity<Void> removeEmployee(
            @PathVariable UUID bookingId,
            @PathVariable UUID employeeId) {
        assignmentService.removeEmployee(bookingId, employeeId);
        return ResponseEntity.noContent().build();
    }

    // ── GET /api/v1/bookings/{bookingId}/assignments ──────────────────────────

    @Operation(
            summary = "Get assignments for a booking",
            description = "Returns all employee assignments for a specific booking. Requires ADMIN or EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assignments retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingAssignmentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/api/v1/bookings/{bookingId}/assignments")
    public ResponseEntity<List<BookingAssignmentResponse>> getAssignmentsForBooking(
            @PathVariable UUID bookingId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsForBooking(bookingId));
    }

    // ── GET /api/v1/employees/{employeeId}/bookings ───────────────────────────

    @Operation(
            summary = "Get all assigned bookings for an employee",
            description = "Returns all booking assignments for a given employee. Requires ADMIN or EMPLOYEE role. Employees should use their own employee ID.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assigned bookings retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingAssignmentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Employee not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/api/v1/employees/{employeeId}/bookings")
    public ResponseEntity<List<BookingAssignmentResponse>> getAssignedBookingsForEmployee(
            @PathVariable UUID employeeId) {
        return ResponseEntity.ok(assignmentService.getAssignedBookingsForEmployee(employeeId));
    }

    @GetMapping("/api/v1/employees/{employeeId}/bookings/details")
    public ResponseEntity<List<BookingResponse>> getAssignedBookingDetailsForEmployee(
            @PathVariable UUID employeeId) {
        return ResponseEntity.ok(assignmentService.getAssignedBookingDetailsForEmployee(employeeId));
    }

    // ── GET /api/v1/employees/me/bookings/today ───────────────────────────────

    @Operation(
            summary = "Get today's assigned bookings for the current employee",
            description = "Returns all booking assignments whose appointment falls on today for the authenticated employee. Requires EMPLOYEE or ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Today's assigned bookings retrieved successfully",
                    content = @Content(schema = @Schema(implementation = BookingAssignmentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Employee or Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "No employee profile found for current user",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/api/v1/employees/me/bookings/today")
    public ResponseEntity<List<BookingAssignmentResponse>> getMyTodaysAssignedBookings() {
        return ResponseEntity.ok(assignmentService.getMyTodaysAssignedBookings());
    }

    @GetMapping("/api/v1/employees/me/bookings/today/details")
    public ResponseEntity<List<BookingResponse>> getMyTodaysAssignedBookingDetails() {
        return ResponseEntity.ok(assignmentService.getMyTodaysAssignedBookingDetails());
    }
}
