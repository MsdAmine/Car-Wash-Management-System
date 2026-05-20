package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.EmployeeResponse;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.EmployeeService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @TestConfiguration
    @EnableWebSecurity
    static class SecurityTestConfig {
        @Bean
        @Order(-1)
        public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/v1/employees/**").hasRole("ADMIN")
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
    private EmployeeService employeeService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private List<EmployeeResponse> availableEmployees;

    @BeforeEach
    void setUp() {
        availableEmployees = List.of(
                EmployeeResponse.builder()
                        .id(UUID.randomUUID())
                        .userId(10L)
                        .email("washer@example.com")
                        .firstName("Tom")
                        .lastName("Lee")
                        .position(EmployeePosition.WASHER)
                        .hireDate(LocalDate.of(2024, 1, 15))
                        .status(EmployeeStatus.ACTIVE)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        );
    }

    // ── GET /api/v1/employees/available ───────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAvailableEmployees_asAdmin_returns200() throws Exception {
        when(employeeService.getAvailableEmployees("2025-06-01", "10:00", 60))
                .thenReturn(availableEmployees);

        mockMvc.perform(get("/api/v1/employees/available")
                        .param("date", "2025-06-01")
                        .param("time", "10:00")
                        .param("duration", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].email").value("washer@example.com"))
                .andExpect(jsonPath("$[0].position").value("WASHER"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAvailableEmployees_noAvailableEmployees_returnsEmptyList() throws Exception {
        when(employeeService.getAvailableEmployees("2025-06-01", "10:00", 60))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/employees/available")
                        .param("date", "2025-06-01")
                        .param("time", "10:00")
                        .param("duration", "60"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getAvailableEmployees_asCustomer_returns403() throws Exception {
        mockMvc.perform(get("/api/v1/employees/available")
                        .param("date", "2025-06-01")
                        .param("time", "10:00")
                        .param("duration", "60"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAvailableEmployees_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/employees/available")
                        .param("date", "2025-06-01")
                        .param("time", "10:00")
                        .param("duration", "60"))
                .andExpect(status().isUnauthorized());
    }
}
