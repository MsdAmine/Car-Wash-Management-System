package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.AdminDashboardResponse;
import com.carwash.car_wash_api.dto.response.CustomerDashboardResponse;
import com.carwash.car_wash_api.dto.response.EmployeeDashboardResponse;
import com.carwash.car_wash_api.dto.response.ErrorResponse;
import com.carwash.car_wash_api.dto.response.HeatmapResponse;
import com.carwash.car_wash_api.dto.response.RevenueDataPointResponse;
import com.carwash.car_wash_api.dto.response.ServiceBookingStatResponse;
import com.carwash.car_wash_api.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Role-scoped dashboard summary endpoints providing key statistics for admins, customers, and employees.")
public class DashboardController {

    private final DashboardService dashboardService;

    // ── GET /api/v1/dashboard/admin ───────────────────────────────────────────

    @Operation(
            summary = "Admin dashboard summary",
            description = "Returns system-wide statistics: total, today's, pending, and completed bookings; daily and monthly revenue; and the top 5 most requested services. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin dashboard data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = AdminDashboardResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    // ── GET /api/v1/dashboard/customer ────────────────────────────────────────

    @Operation(
            summary = "Customer dashboard summary",
            description = "Returns the authenticated customer's statistics: upcoming bookings, previous (completed) bookings, and registered vehicle count. Requires CUSTOMER role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Customer dashboard data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CustomerDashboardResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Customer role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/customer")
    public ResponseEntity<CustomerDashboardResponse> getCustomerDashboard() {
        return ResponseEntity.ok(dashboardService.getCustomerDashboard());
    }

    // ── GET /api/v1/dashboard/employee ────────────────────────────────────────

    @Operation(
            summary = "Employee dashboard summary",
            description = "Returns the authenticated employee's statistics: total assigned bookings and bookings currently in progress (IN_PROGRESS status). Requires EMPLOYEE role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Employee dashboard data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = EmployeeDashboardResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Employee role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Employee profile not found for authenticated user",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/employee")
    public ResponseEntity<EmployeeDashboardResponse> getEmployeeDashboard() {
        return ResponseEntity.ok(dashboardService.getEmployeeDashboard());
    }

    // ── GET /api/v1/dashboard/revenue ─────────────────────────────────────────

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueDataPointResponse>> getRevenueSeries(
            @RequestParam(defaultValue = "daily") String period,
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getRevenueTimeSeries(period, days));
    }

    // ── GET /api/v1/dashboard/bookings-by-service ─────────────────────────────

    @Operation(
            summary = "Bookings by service",
            description = "Returns all-time booking counts per wash service, sorted by count descending, with percentage of total. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Booking statistics per service retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/bookings-by-service")
    public ResponseEntity<List<ServiceBookingStatResponse>> getBookingsByService() {
        return ResponseEntity.ok(dashboardService.getBookingsByService());
    }

    // ── GET /api/v1/dashboard/activity-heatmap ────────────────────────────────

    @Operation(
            summary = "Booking activity heatmap",
            description = "Returns a 10×7 heatmap of booking counts by hour-slot (rows) and day-of-week (columns) for the last 90 days. Status filter: CONFIRMED, IN_PROGRESS, COMPLETED. Requires ADMIN role.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Activity heatmap retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "Admin role required",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/activity-heatmap")
    public ResponseEntity<HeatmapResponse> getActivityHeatmap() {
        return ResponseEntity.ok(dashboardService.getActivityHeatmap());
    }
}
