package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.AdminDashboardResponse;
import com.carwash.car_wash_api.dto.response.CustomerDashboardResponse;
import com.carwash.car_wash_api.dto.response.EmployeeDashboardResponse;
import com.carwash.car_wash_api.dto.response.RevenueDataPointResponse;
import com.carwash.car_wash_api.dto.response.ServiceStatResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.DashboardService;
import com.carwash.car_wash_api.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    /**
     * Mirrors the production dashboard authorization rules from SecurityConfig
     * without JWT infrastructure.
     */
    @TestConfiguration
    @EnableWebSecurity
    static class SecurityTestConfig {
        @Bean
        @Order(-1)
        public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/admin").hasRole("ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/customer").hasRole("CUSTOMER")
                            .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/employee").hasRole("EMPLOYEE")
                            .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/revenue").hasRole("ADMIN")
                            .anyRequest().authenticated()
                    )
                    .exceptionHandling(ex -> ex
                            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                    )
                    .sessionManagement(session -> session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .build();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private AdminDashboardResponse adminResponse;
    private CustomerDashboardResponse customerResponse;
    private EmployeeDashboardResponse employeeResponse;
    private List<RevenueDataPointResponse> revenueResponse;

    @BeforeEach
    void setUp() {
        adminResponse = AdminDashboardResponse.builder()
                .totalBookings(100L)
                .todaysBookings(5L)
                .pendingBookings(12L)
                .completedBookings(80L)
                .dailyRevenue(new BigDecimal("350.00"))
                .monthlyRevenue(new BigDecimal("4200.00"))
                .mostRequestedServices(List.of(
                        new ServiceStatResponse("Full Wash", 40L),
                        new ServiceStatResponse("Quick Rinse", 30L)
                ))
                .build();

        customerResponse = CustomerDashboardResponse.builder()
                .upcomingBookings(3L)
                .previousBookings(7L)
                .registeredVehicles(2L)
                .build();

        employeeResponse = EmployeeDashboardResponse.builder()
                .assignedBookings(15L)
                .bookingsInProgress(3L)
                .build();

        revenueResponse = List.of(
                new RevenueDataPointResponse("May 18", new BigDecimal("120.00")),
                new RevenueDataPointResponse("May 19", new BigDecimal("250.00")),
                new RevenueDataPointResponse("May 20", new BigDecimal("0.00"))
        );
    }

    // ── GET /api/v1/dashboard/admin ───────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAdminDashboard_asAdmin_returns200() throws Exception {
        when(dashboardService.getAdminDashboard()).thenReturn(adminResponse);

        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalBookings").value(100))
                .andExpect(jsonPath("$.todaysBookings").value(5))
                .andExpect(jsonPath("$.pendingBookings").value(12))
                .andExpect(jsonPath("$.completedBookings").value(80))
                .andExpect(jsonPath("$.dailyRevenue").value(350.00))
                .andExpect(jsonPath("$.monthlyRevenue").value(4200.00))
                .andExpect(jsonPath("$.mostRequestedServices.length()").value(2))
                .andExpect(jsonPath("$.mostRequestedServices[0].serviceName").value("Full Wash"))
                .andExpect(jsonPath("$.mostRequestedServices[0].bookingCount").value(40));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAdminDashboard_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAdminDashboard_asEmployee_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAdminDashboard_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/dashboard/customer ────────────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getCustomerDashboard_asCustomer_returns200() throws Exception {
        when(dashboardService.getCustomerDashboard()).thenReturn(customerResponse);

        mockMvc.perform(get("/api/v1/dashboard/customer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.upcomingBookings").value(3))
                .andExpect(jsonPath("$.previousBookings").value(7))
                .andExpect(jsonPath("$.registeredVehicles").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getCustomerDashboard_asAdmin_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/customer"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getCustomerDashboard_asEmployee_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/customer"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getCustomerDashboard_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/customer"))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/dashboard/employee ────────────────────────────────────────

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getEmployeeDashboard_asEmployee_returns200() throws Exception {
        when(dashboardService.getEmployeeDashboard()).thenReturn(employeeResponse);

        mockMvc.perform(get("/api/v1/dashboard/employee"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedBookings").value(15))
                .andExpect(jsonPath("$.bookingsInProgress").value(3));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getEmployeeDashboard_whenNoEmployeeProfile_returns404() throws Exception {
        when(dashboardService.getEmployeeDashboard())
                .thenThrow(new ResourceNotFoundException("No employee profile found for the current user"));

        mockMvc.perform(get("/api/v1/dashboard/employee"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getEmployeeDashboard_asAdmin_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/employee"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getEmployeeDashboard_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/employee"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getEmployeeDashboard_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/employee"))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/dashboard/revenue ─────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getRevenueSeries_asAdmin_withDailyPeriod_returns200() throws Exception {
        when(dashboardService.getRevenueTimeSeries("daily", 3)).thenReturn(revenueResponse);

        mockMvc.perform(get("/api/v1/dashboard/revenue")
                        .param("period", "daily")
                        .param("days", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].label").value("May 18"))
                .andExpect(jsonPath("$[0].revenue").value(120.00))
                .andExpect(jsonPath("$[1].label").value("May 19"))
                .andExpect(jsonPath("$[2].revenue").value(0.00));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getRevenueSeries_asAdmin_usesDefaults_returns200() throws Exception {
        when(dashboardService.getRevenueTimeSeries("daily", 7)).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/dashboard/revenue"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getRevenueSeries_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/revenue"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getRevenueSeries_asEmployee_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/revenue"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getRevenueSeries_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/revenue"))
                .andExpect(status().isUnauthorized());
    }
}
