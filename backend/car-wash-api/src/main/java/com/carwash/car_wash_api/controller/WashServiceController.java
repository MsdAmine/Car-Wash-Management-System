package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.ErrorResponse;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.service.WashServiceService;
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
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
@Tag(name = "Wash Service Management", description = "Endpoints for managing car wash services. Read operations are public; create, update, deactivate, and delete require ADMIN role.")
public class WashServiceController {

    private final WashServiceService washServiceService;

    // ── POST /api/v1/services ─────────────────────────────────────────────────

    @Operation(
            summary = "Create a new wash service",
            description = "Creates a new car wash service. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Wash service created successfully",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "A wash service with this name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<WashServiceResponse> createWashService(@Valid @RequestBody WashServiceRequest request) {
        return new ResponseEntity<>(washServiceService.createWashService(request), HttpStatus.CREATED);
    }

    // ── GET /api/v1/services ──────────────────────────────────────────────────

    @Operation(
            summary = "List all wash services",
            description = "Returns all wash services (active and inactive). Publicly accessible."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Wash services retrieved successfully",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<WashServiceResponse>> getAllWashServices() {
        return ResponseEntity.ok(washServiceService.getAllWashServices());
    }

    // ── GET /api/v1/services/active ───────────────────────────────────────────

    @Operation(
            summary = "List active wash services",
            description = "Returns only active wash services. Publicly accessible."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active wash services retrieved successfully",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class)))
    })
    @GetMapping("/active")
    public ResponseEntity<List<WashServiceResponse>> getActiveWashServices() {
        return ResponseEntity.ok(washServiceService.getActiveWashServices());
    }

    // ── GET /api/v1/services/{id} ─────────────────────────────────────────────

    @Operation(
            summary = "Get a wash service by ID",
            description = "Returns details of a single wash service. Publicly accessible."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Wash service found",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class))),
            @ApiResponse(responseCode = "404", description = "Wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<WashServiceResponse> getWashServiceById(@PathVariable UUID id) {
        return ResponseEntity.ok(washServiceService.getWashServiceById(id));
    }

    // ── PUT /api/v1/services/{id} ─────────────────────────────────────────────

    @Operation(
            summary = "Update a wash service",
            description = "Updates an existing wash service by ID. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Wash service updated successfully",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "A wash service with this name already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<WashServiceResponse> updateWashService(
            @PathVariable UUID id,
            @Valid @RequestBody WashServiceRequest request) {
        return ResponseEntity.ok(washServiceService.updateWashService(id, request));
    }

    // ── PATCH /api/v1/services/{id}/deactivate ────────────────────────────────

    @Operation(
            summary = "Deactivate a wash service",
            description = "Sets a wash service as inactive by ID. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Wash service deactivated successfully",
                    content = @Content(schema = @Schema(implementation = WashServiceResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<WashServiceResponse> deactivateWashService(@PathVariable UUID id) {
        return ResponseEntity.ok(washServiceService.deactivateWashService(id));
    }

    // ── DELETE /api/v1/services/{id} ──────────────────────────────────────────

    @Operation(
            summary = "Delete a wash service",
            description = "Permanently deletes a wash service by ID. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Wash service deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Wash service not found",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWashService(@PathVariable UUID id) {
        washServiceService.deleteWashService(id);
        return ResponseEntity.noContent().build();
    }
}
