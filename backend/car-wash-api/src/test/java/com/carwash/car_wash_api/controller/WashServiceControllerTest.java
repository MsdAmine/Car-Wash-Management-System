package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.JwtService;
import com.carwash.car_wash_api.service.WashServiceService;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(WashServiceController.class)
class WashServiceControllerTest {

    /**
     * Mirrors production authorization rules from SecurityConfig without JWT infrastructure.
     * GET /api/v1/services/** is public; write/delete operations require ADMIN.
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
                            .requestMatchers(HttpMethod.GET, "/api/v1/services/**").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/**").hasRole("ADMIN")
                            .requestMatchers("/api/v1/services/**").hasRole("ADMIN")
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
    private WashServiceService washServiceService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private UUID serviceId;
    private WashServiceRequest validRequest;
    private WashServiceResponse serviceResponse;
    private WashServiceResponse inactiveServiceResponse;

    @BeforeEach
    void setUp() {
        serviceId = UUID.randomUUID();

        validRequest = WashServiceRequest.builder()
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .build();

        serviceResponse = WashServiceResponse.builder()
                .id(serviceId)
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .active(true)
                .build();

        inactiveServiceResponse = WashServiceResponse.builder()
                .id(serviceId)
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .active(false)
                .build();
    }

    // ── POST /api/v1/services ─────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withValidRequest_returns201() throws Exception {
        when(washServiceService.createWashService(any(WashServiceRequest.class))).thenReturn(serviceResponse);

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Basic Wash"))
                .andExpect(jsonPath("$.price").value(9.99))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withMissingName_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withNameTooShort_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("X")  // below min length of 2
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withZeroPrice_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("Basic Wash")
                .price(new BigDecimal("0.00"))  // fails @DecimalMin("0.01")
                .durationMinutes(30)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withNegativePrice_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("Basic Wash")
                .price(new BigDecimal("-5.00"))  // fails @DecimalMin("0.01")
                .durationMinutes(30)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withZeroDuration_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("Basic Wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(0)  // fails @Min(1)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withExcessiveDuration_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("Basic Wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(481)  // fails @Max(480)
                .build();

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createWashService_withDuplicateName_returns409() throws Exception {
        when(washServiceService.createWashService(any(WashServiceRequest.class)))
                .thenThrow(new DuplicateResourceException("A wash service with this name already exists"));

        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createWashService_asCustomer_returns403() throws Exception {
        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createWashService_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/v1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/services ──────────────────────────────────────────────────

    @Test
    void getAllWashServices_returnsListWith200() throws Exception {
        when(washServiceService.getAllWashServices()).thenReturn(List.of(serviceResponse));

        mockMvc.perform(get("/api/v1/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Basic Wash"));
    }

    @Test
    void getAllWashServices_returnsEmptyList() throws Exception {
        when(washServiceService.getAllWashServices()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // ── GET /api/v1/services/active ───────────────────────────────────────────

    @Test
    void getActiveWashServices_returnsActiveOnly() throws Exception {
        when(washServiceService.getActiveWashServices()).thenReturn(List.of(serviceResponse));

        mockMvc.perform(get("/api/v1/services/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].active").value(true));
    }

    @Test
    void getActiveWashServices_returnsEmptyList() throws Exception {
        when(washServiceService.getActiveWashServices()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/services/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // ── GET /api/v1/services/{id} ─────────────────────────────────────────────

    @Test
    void getWashServiceById_withValidId_returns200() throws Exception {
        when(washServiceService.getWashServiceById(serviceId)).thenReturn(serviceResponse);

        mockMvc.perform(get("/api/v1/services/{id}", serviceId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(serviceId.toString()))
                .andExpect(jsonPath("$.name").value("Basic Wash"));
    }

    @Test
    void getWashServiceById_whenNotFound_returns404() throws Exception {
        when(washServiceService.getWashServiceById(serviceId))
                .thenThrow(new ResourceNotFoundException("Wash service not found with ID: " + serviceId));

        mockMvc.perform(get("/api/v1/services/{id}", serviceId))
                .andExpect(status().isNotFound());
    }

    // ── PUT /api/v1/services/{id} ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateWashService_withValidRequest_returns200() throws Exception {
        when(washServiceService.updateWashService(eq(serviceId), any(WashServiceRequest.class)))
                .thenReturn(serviceResponse);

        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Basic Wash"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateWashService_withMissingPrice_returns400() throws Exception {
        WashServiceRequest invalid = WashServiceRequest.builder()
                .name("Basic Wash")
                .durationMinutes(30)
                // price intentionally omitted — @NotNull triggers 400
                .build();

        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateWashService_whenNotFound_returns404() throws Exception {
        when(washServiceService.updateWashService(eq(serviceId), any(WashServiceRequest.class)))
                .thenThrow(new ResourceNotFoundException("Wash service not found with ID: " + serviceId));

        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateWashService_withDuplicateName_returns409() throws Exception {
        when(washServiceService.updateWashService(eq(serviceId), any(WashServiceRequest.class)))
                .thenThrow(new DuplicateResourceException("A wash service with this name already exists"));

        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateWashService_asCustomer_returns403() throws Exception {
        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateWashService_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(put("/api/v1/services/{id}", serviceId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());
    }

    // ── PATCH /api/v1/services/{id}/deactivate ────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void deactivateWashService_asAdmin_returns200() throws Exception {
        when(washServiceService.deactivateWashService(serviceId)).thenReturn(inactiveServiceResponse);

        mockMvc.perform(patch("/api/v1/services/{id}/deactivate", serviceId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deactivateWashService_whenNotFound_returns404() throws Exception {
        when(washServiceService.deactivateWashService(serviceId))
                .thenThrow(new ResourceNotFoundException("Wash service not found with ID: " + serviceId));

        mockMvc.perform(patch("/api/v1/services/{id}/deactivate", serviceId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void deactivateWashService_asCustomer_returns403() throws Exception {
        mockMvc.perform(patch("/api/v1/services/{id}/deactivate", serviceId))
                .andExpect(status().isForbidden());
    }

    @Test
    void deactivateWashService_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(patch("/api/v1/services/{id}/deactivate", serviceId))
                .andExpect(status().isUnauthorized());
    }

    // ── DELETE /api/v1/services/{id} ──────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteWashService_asAdmin_returns204() throws Exception {
        doNothing().when(washServiceService).deleteWashService(serviceId);

        mockMvc.perform(delete("/api/v1/services/{id}", serviceId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteWashService_whenNotFound_returns404() throws Exception {
        doThrow(new ResourceNotFoundException("Wash service not found with ID: " + serviceId))
                .when(washServiceService).deleteWashService(serviceId);

        mockMvc.perform(delete("/api/v1/services/{id}", serviceId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void deleteWashService_asCustomer_returns403() throws Exception {
        mockMvc.perform(delete("/api/v1/services/{id}", serviceId))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteWashService_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/v1/services/{id}", serviceId))
                .andExpect(status().isUnauthorized());
    }
}
