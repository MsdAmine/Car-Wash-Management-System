package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.AvailableSlotsResponse;
import com.carwash.car_wash_api.dto.response.TimeSlotResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.BookingService;
import com.carwash.car_wash_api.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

    /**
     * Mirrors the production authorization rules for booking endpoints:
     * all booking paths require authentication; service layer enforces ownership.
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
                            .requestMatchers("/api/v1/bookings/**").authenticated()
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
    private BookingService bookingService;

    // Required by JwtAuthenticationFilter (a @Component bean loaded by @WebMvcTest)
    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private UUID serviceId;
    private AvailableSlotsResponse slotsResponse;
    private AvailableSlotsResponse emptySlotsResponse;

    @BeforeEach
    void setUp() {
        serviceId = UUID.randomUUID();

        List<TimeSlotResponse> slots = List.of(
                TimeSlotResponse.builder().time("08:00").available(true).reason(null).build(),
                TimeSlotResponse.builder().time("08:30").available(false).reason("Already booked").build()
        );

        slotsResponse = AvailableSlotsResponse.builder()
                .date("2025-05-19")
                .serviceId(serviceId.toString())
                .serviceName("Basic Wash")
                .durationMinutes(60)
                .slots(slots)
                .build();

        emptySlotsResponse = AvailableSlotsResponse.builder()
                .date("2025-05-18")
                .serviceId(serviceId.toString())
                .serviceName("Basic Wash")
                .durationMinutes(60)
                .slots(List.of())
                .build();
    }

    // ── GET /api/v1/bookings/available-slots ─────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAvailableSlots_asCustomer_returns200WithSlots() throws Exception {
        when(bookingService.getAvailableSlots(eq("2025-05-19"), eq(serviceId)))
                .thenReturn(slotsResponse);

        mockMvc.perform(get("/api/v1/bookings/available-slots")
                        .param("date", "2025-05-19")
                        .param("serviceId", serviceId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.date").value("2025-05-19"))
                .andExpect(jsonPath("$.serviceName").value("Basic Wash"))
                .andExpect(jsonPath("$.durationMinutes").value(60))
                .andExpect(jsonPath("$.slots").isArray())
                .andExpect(jsonPath("$.slots.length()").value(2))
                .andExpect(jsonPath("$.slots[0].time").value("08:00"))
                .andExpect(jsonPath("$.slots[0].available").value(true))
                .andExpect(jsonPath("$.slots[1].available").value(false))
                .andExpect(jsonPath("$.slots[1].reason").value("Already booked"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAvailableSlots_forClosedDay_returns200WithEmptySlots() throws Exception {
        when(bookingService.getAvailableSlots(eq("2025-05-18"), eq(serviceId)))
                .thenReturn(emptySlotsResponse);

        mockMvc.perform(get("/api/v1/bookings/available-slots")
                        .param("date", "2025-05-18")
                        .param("serviceId", serviceId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slots").isArray())
                .andExpect(jsonPath("$.slots.length()").value(0));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAvailableSlots_withInvalidServiceId_returns404() throws Exception {
        UUID unknownId = UUID.randomUUID();
        when(bookingService.getAvailableSlots(any(String.class), eq(unknownId)))
                .thenThrow(new ResourceNotFoundException("Wash service not found with ID: " + unknownId));

        mockMvc.perform(get("/api/v1/bookings/available-slots")
                        .param("date", "2025-05-19")
                        .param("serviceId", unknownId.toString()))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAvailableSlots_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/bookings/available-slots")
                        .param("date", "2025-05-19")
                        .param("serviceId", serviceId.toString()))
                .andExpect(status().isUnauthorized());
    }
}
