package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.BusinessSettingsRequest;
import com.carwash.car_wash_api.dto.response.BusinessSettingsResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.BusinessSettingsService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BusinessSettingsController.class)
class BusinessSettingsControllerTest {

    @TestConfiguration
    @EnableWebSecurity
    static class SecurityTestConfig {
        @Bean
        @Order(-1)
        public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers(HttpMethod.GET, "/api/v1/settings/**").hasAnyRole("ADMIN", "EMPLOYEE")
                            .requestMatchers(HttpMethod.PUT, "/api/v1/settings/**").hasRole("ADMIN")
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
    private BusinessSettingsService businessSettingsService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private BusinessSettingsResponse settingsResponse;
    private BusinessSettingsRequest validRequest;

    @BeforeEach
    void setUp() {
        settingsResponse = BusinessSettingsResponse.builder()
                .id(1L)
                .businessName("WashFlow")
                .phone("555-0100")
                .address("123 Main St")
                .city("Anytown")
                .cancellationHours(24)
                .updatedAt(LocalDateTime.now())
                .build();

        validRequest = BusinessSettingsRequest.builder()
                .businessName("WashFlow Updated")
                .phone("555-0200")
                .address("456 Oak Ave")
                .city("Newtown")
                .cancellationHours(48)
                .build();
    }

    // ── GET /api/v1/settings/business ──────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getSettings_asAdmin_returns200() throws Exception {
        when(businessSettingsService.getSettings()).thenReturn(settingsResponse);

        mockMvc.perform(get("/api/v1/settings/business"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessName").value("WashFlow"))
                .andExpect(jsonPath("$.cancellationHours").value(24));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getSettings_asEmployee_returns200() throws Exception {
        when(businessSettingsService.getSettings()).thenReturn(settingsResponse);

        mockMvc.perform(get("/api/v1/settings/business"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessName").value("WashFlow"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getSettings_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/settings/business"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getSettings_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/settings/business"))
                .andExpect(status().isUnauthorized());
    }

    // ── PUT /api/v1/settings/business ──────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_asAdmin_returns200() throws Exception {
        BusinessSettingsResponse updated = BusinessSettingsResponse.builder()
                .id(1L)
                .businessName("WashFlow Updated")
                .phone("555-0200")
                .address("456 Oak Ave")
                .city("Newtown")
                .cancellationHours(48)
                .updatedAt(LocalDateTime.now())
                .build();

        when(businessSettingsService.updateSettings(any(BusinessSettingsRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/v1/settings/business")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.businessName").value("WashFlow Updated"))
                .andExpect(jsonPath("$.cancellationHours").value(48));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateSettings_asCustomer_returns403() throws Exception {
        mockMvc.perform(put("/api/v1/settings/business")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withBlankBusinessName_returns400() throws Exception {
        BusinessSettingsRequest invalid = BusinessSettingsRequest.builder()
                .businessName("")
                .cancellationHours(24)
                .build();

        mockMvc.perform(put("/api/v1/settings/business")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_withCancellationHoursAboveMax_returns400() throws Exception {
        BusinessSettingsRequest invalid = BusinessSettingsRequest.builder()
                .businessName("WashFlow")
                .cancellationHours(200)
                .build();

        mockMvc.perform(put("/api/v1/settings/business")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateSettings_whenSettingsNotFound_returns404() throws Exception {
        when(businessSettingsService.updateSettings(any(BusinessSettingsRequest.class)))
                .thenThrow(new ResourceNotFoundException("Business settings not found"));

        mockMvc.perform(put("/api/v1/settings/business")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }
}
