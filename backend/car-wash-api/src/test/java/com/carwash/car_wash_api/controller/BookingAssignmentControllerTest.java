package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.AssignEmployeeRequest;
import com.carwash.car_wash_api.dto.response.BookingAssignmentResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.InvalidEmployeeOperationException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.BookingAssignmentService;
import com.carwash.car_wash_api.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingAssignmentController.class)
class BookingAssignmentControllerTest {

    /**
     * Mirrors the production authorization rules from SecurityConfig for booking
     * assignment endpoints without JWT infrastructure.
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
                            .requestMatchers(HttpMethod.GET, "/api/v1/employees/me/bookings/today").hasAnyRole("ADMIN", "EMPLOYEE")
                            .requestMatchers(HttpMethod.GET, "/api/v1/employees/*/bookings").hasAnyRole("ADMIN", "EMPLOYEE")
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/**").hasRole("ADMIN")
                            .requestMatchers("/api/v1/bookings/*/assign**").hasRole("ADMIN")
                            .requestMatchers("/api/v1/bookings/*/assignments").hasAnyRole("ADMIN", "EMPLOYEE")
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

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingAssignmentService assignmentService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private UUID bookingId;
    private UUID employeeId;
    private UUID assignmentId;
    private AssignEmployeeRequest validRequest;
    private BookingAssignmentResponse assignmentResponse;

    @BeforeEach
    void setUp() {
        bookingId = UUID.randomUUID();
        employeeId = UUID.randomUUID();
        assignmentId = UUID.randomUUID();

        validRequest = AssignEmployeeRequest.builder()
                .employeeId(employeeId)
                .build();

        assignmentResponse = BookingAssignmentResponse.builder()
                .id(assignmentId)
                .bookingId(bookingId)
                .employeeId(employeeId)
                .employeeFirstName("John")
                .employeeLastName("Doe")
                .employeePosition(EmployeePosition.WASHER)
                .assignedByUserId(1L)
                .assignedByEmail("admin@example.com")
                .assignedAt(LocalDateTime.now())
                .build();
    }

    // ── POST /api/v1/bookings/{bookingId}/assign ──────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_asAdmin_returns201() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenReturn(assignmentResponse);

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(assignmentId.toString()))
                .andExpect(jsonPath("$.bookingId").value(bookingId.toString()))
                .andExpect(jsonPath("$.employeeId").value(employeeId.toString()))
                .andExpect(jsonPath("$.employeeFirstName").value("John"))
                .andExpect(jsonPath("$.employeePosition").value("WASHER"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_withMissingEmployeeId_returns400() throws Exception {
        AssignEmployeeRequest invalid = AssignEmployeeRequest.builder().build();

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_whenBookingNotAssignable_returns400() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenThrow(new InvalidEmployeeOperationException(
                        "Cannot assign an employee to a CANCELLED booking"));

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_whenEmployeeInactive_returns400() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenThrow(new InvalidEmployeeOperationException(
                        "Cannot assign an inactive employee to a booking"));

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_whenBookingNotFound_returns404() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenThrow(new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_whenEmployeeNotFound_returns404() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenThrow(new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void assignEmployee_whenAlreadyAssigned_returns409() throws Exception {
        when(assignmentService.assignEmployee(eq(bookingId), any(AssignEmployeeRequest.class)))
                .thenThrow(new DuplicateResourceException(
                        "Employee is already assigned to this booking"));

        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void assignEmployee_asEmployee_returns403() throws Exception {
        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void assignEmployee_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/v1/bookings/{bookingId}/assign", bookingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());
    }

    // ── DELETE /api/v1/bookings/{bookingId}/assign/{employeeId} ───────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void removeEmployee_asAdmin_returns204() throws Exception {
        doNothing().when(assignmentService).removeEmployee(bookingId, employeeId);

        mockMvc.perform(delete("/api/v1/bookings/{bookingId}/assign/{employeeId}", bookingId, employeeId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void removeEmployee_whenAssignmentNotFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException(
                "No assignment found for employee ID " + employeeId + " on booking ID " + bookingId))
                .when(assignmentService).removeEmployee(bookingId, employeeId);

        mockMvc.perform(delete("/api/v1/bookings/{bookingId}/assign/{employeeId}", bookingId, employeeId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void removeEmployee_asEmployee_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/bookings/{bookingId}/assign/{employeeId}", bookingId, employeeId))
                .andExpect(status().isForbidden());
    }

    @Test
    void removeEmployee_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/v1/bookings/{bookingId}/assign/{employeeId}", bookingId, employeeId))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/bookings/{bookingId}/assignments ──────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignmentsForBooking_asAdmin_returns200() throws Exception {
        when(assignmentService.getAssignmentsForBooking(bookingId))
                .thenReturn(List.of(assignmentResponse));

        mockMvc.perform(get("/api/v1/bookings/{bookingId}/assignments", bookingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].bookingId").value(bookingId.toString()))
                .andExpect(jsonPath("$[0].employeeId").value(employeeId.toString()));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAssignmentsForBooking_asEmployee_returns200() throws Exception {
        when(assignmentService.getAssignmentsForBooking(bookingId))
                .thenReturn(List.of(assignmentResponse));

        mockMvc.perform(get("/api/v1/bookings/{bookingId}/assignments", bookingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignmentsForBooking_returnsEmptyList() throws Exception {
        when(assignmentService.getAssignmentsForBooking(bookingId))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/bookings/{bookingId}/assignments", bookingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignmentsForBooking_whenBookingNotFound_returns404() throws Exception {
        when(assignmentService.getAssignmentsForBooking(bookingId))
                .thenThrow(new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        mockMvc.perform(get("/api/v1/bookings/{bookingId}/assignments", bookingId))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAssignmentsForBooking_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/bookings/{bookingId}/assignments", bookingId))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/employees/{employeeId}/bookings ───────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignedBookingsForEmployee_asAdmin_returns200() throws Exception {
        when(assignmentService.getAssignedBookingsForEmployee(employeeId))
                .thenReturn(List.of(assignmentResponse));

        mockMvc.perform(get("/api/v1/employees/{employeeId}/bookings", employeeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].employeeId").value(employeeId.toString()));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAssignedBookingsForEmployee_asEmployee_returns200() throws Exception {
        when(assignmentService.getAssignedBookingsForEmployee(employeeId))
                .thenReturn(List.of(assignmentResponse));

        mockMvc.perform(get("/api/v1/employees/{employeeId}/bookings", employeeId))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAssignedBookingsForEmployee_whenNotFound_returns404() throws Exception {
        when(assignmentService.getAssignedBookingsForEmployee(employeeId))
                .thenThrow(new ResourceNotFoundException("Employee not found with ID: " + employeeId));

        mockMvc.perform(get("/api/v1/employees/{employeeId}/bookings", employeeId))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAssignedBookingsForEmployee_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/employees/{employeeId}/bookings", employeeId))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/employees/me/bookings/today ───────────────────────────────

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getMyTodaysAssignedBookings_asEmployee_returns200() throws Exception {
        when(assignmentService.getMyTodaysAssignedBookings())
                .thenReturn(List.of(assignmentResponse));

        mockMvc.perform(get("/api/v1/employees/me/bookings/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].employeeFirstName").value("John"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getMyTodaysAssignedBookings_asAdmin_returns200() throws Exception {
        when(assignmentService.getMyTodaysAssignedBookings())
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/employees/me/bookings/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getMyTodaysAssignedBookings_whenNoEmployeeProfile_returns404() throws Exception {
        when(assignmentService.getMyTodaysAssignedBookings())
                .thenThrow(new ResourceNotFoundException(
                        "No employee profile found for the current user"));

        mockMvc.perform(get("/api/v1/employees/me/bookings/today"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMyTodaysAssignedBookings_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/employees/me/bookings/today"))
                .andExpect(status().isUnauthorized());
    }
}
