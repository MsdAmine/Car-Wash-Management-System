package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.PaymentRequest;
import com.carwash.car_wash_api.dto.request.UpdatePaymentStatusRequest;
import com.carwash.car_wash_api.dto.response.ErrorResponse;
import com.carwash.car_wash_api.dto.response.PaymentResponse;
import com.carwash.car_wash_api.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Tag(name = "Payment Management", description = "Endpoints for manual payment tracking. Admins and employees record payments; customers view their own payment history.")
public class PaymentController {

    private final PaymentService paymentService;

    // ── POST /api/v1/payments ─────────────────────────────────────────────────

    @Operation(
            summary = "Create a payment record",
            description = "Records a payment for a booking. The amount must match the booking's total price. Only one payment record is allowed per booking. Requires ADMIN or EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Payment record created successfully",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or amount mismatch",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Payment already exists for this booking",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
        return new ResponseEntity<>(paymentService.createPayment(request), HttpStatus.CREATED);
    }

    // ── GET /api/v1/payments ──────────────────────────────────────────────────

    @Operation(
            summary = "List all payments",
            description = "Returns every payment record in the system. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "All payments retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // ── GET /api/v1/payments/my ───────────────────────────────────────────────

    @Operation(
            summary = "Get my payment history",
            description = "Returns all payment records associated with the authenticated customer's bookings.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payment history retrieved successfully",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> getMyPaymentHistory() {
        return ResponseEntity.ok(paymentService.getMyPaymentHistory());
    }

    // ── GET /api/v1/payments/booking/{bookingId} ──────────────────────────────

    @Operation(
            summary = "Get payment by booking ID",
            description = "Returns the payment record for a given booking. Customers can only access payments for their own bookings; admins can access any.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payment found",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Booking belongs to a different customer",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Booking or payment not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBookingId(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }

    // ── PATCH /api/v1/payments/{id}/confirm ──────────────────────────────────

    @Operation(
            summary = "Confirm a payment",
            description = "Marks a payment as CONFIRMED and records the confirmation timestamp. Requires ADMIN or EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payment confirmed successfully",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Payment is already confirmed",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin or Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Payment not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<PaymentResponse> confirmPayment(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.confirmPayment(id));
    }

    // ── PATCH /api/v1/payments/{id}/status ───────────────────────────────────

    @Operation(
            summary = "Update payment status",
            description = "Updates the status of a payment to any value (e.g. PENDING → CONFIRMED, CONFIRMED → REFUNDED). Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Payment status updated successfully",
                    content = @Content(schema = @Schema(implementation = PaymentResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid status value",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Payment not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(paymentService.updatePaymentStatus(id, request));
    }
}
