package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.OperatingHoursDayRequest;
import com.carwash.car_wash_api.dto.request.UpdateOperatingHoursRequest;
import com.carwash.car_wash_api.dto.response.OperatingHoursResponse;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.JwtService;
import com.carwash.car_wash_api.service.OperatingHoursService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OperatingHoursController.class)
class OperatingHoursControllerTest {

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
    private OperatingHoursService operatingHoursService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private List<OperatingHoursResponse> allHours;
    private UpdateOperatingHoursRequest validUpdateRequest;

    @BeforeEach
    void setUp() {
        allHours = List.of(
                OperatingHoursResponse.builder().id(1L).dayOfWeek("MONDAY")   .openTime("08:00").closeTime("18:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(2L).dayOfWeek("TUESDAY")  .openTime("08:00").closeTime("18:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(3L).dayOfWeek("WEDNESDAY").openTime("08:00").closeTime("18:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(4L).dayOfWeek("THURSDAY") .openTime("08:00").closeTime("18:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(5L).dayOfWeek("FRIDAY")   .openTime("08:00").closeTime("18:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(6L).dayOfWeek("SATURDAY") .openTime("09:00").closeTime("17:00").isOpen(true).build(),
                OperatingHoursResponse.builder().id(7L).dayOfWeek("SUNDAY")   .openTime("08:00").closeTime("18:00").isOpen(false).build()
        );

        validUpdateRequest = UpdateOperatingHoursRequest.builder()
                .days(List.of(
                        OperatingHoursDayRequest.builder().dayOfWeek("MONDAY").openTime("09:00").closeTime("17:00").isOpen(true).build(),
                        OperatingHoursDayRequest.builder().dayOfWeek("SUNDAY").openTime("09:00").closeTime("17:00").isOpen(false).build()
                ))
                .build();
    }

    // ── GET /api/v1/settings/hours ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_asAdmin_returns200WithSevenEntries() throws Exception {
        when(operatingHoursService.getAll()).thenReturn(allHours);

        mockMvc.perform(get("/api/v1/settings/hours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7))
                .andExpect(jsonPath("$[0].dayOfWeek").value("MONDAY"))
                .andExpect(jsonPath("$[6].isOpen").value(false));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAll_asEmployee_returns200() throws Exception {
        when(operatingHoursService.getAll()).thenReturn(allHours);

        mockMvc.perform(get("/api/v1/settings/hours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAll_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/settings/hours"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAll_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/settings/hours"))
                .andExpect(status().isUnauthorized());
    }

    // ── PUT /api/v1/settings/hours ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateAll_asAdmin_returns200() throws Exception {
        when(operatingHoursService.updateAll(any(UpdateOperatingHoursRequest.class))).thenReturn(allHours);

        mockMvc.perform(put("/api/v1/settings/hours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(7));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateAll_asCustomer_returns403() throws Exception {
        mockMvc.perform(put("/api/v1/settings/hours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUpdateRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateAll_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(put("/api/v1/settings/hours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validUpdateRequest)))
                .andExpect(status().isUnauthorized());
    }
}
