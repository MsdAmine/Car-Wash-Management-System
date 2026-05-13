package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.VehicleRequest;
import com.carwash.car_wash_api.dto.response.VehicleResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.enums.VehicleType;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.service.JwtService;
import com.carwash.car_wash_api.service.VehicleService;
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
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

    /**
     * Mirrors the production authorization rules from SecurityConfig without
     * the JWT infrastructure, so controller tests verify security boundaries.
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
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/**").hasRole("ADMIN")
                            .requestMatchers("/api/v1/vehicles/**").hasAnyRole("CUSTOMER", "ADMIN")
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
    private VehicleService vehicleService;

    // Required by JwtAuthenticationFilter (a @Component filter bean loaded by @WebMvcTest)
    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    private UUID vehicleId;
    private VehicleRequest validRequest;
    private VehicleResponse vehicleResponse;

    @BeforeEach
    void setUp() {
        vehicleId = UUID.randomUUID();

        validRequest = VehicleRequest.builder()
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .build();

        vehicleResponse = VehicleResponse.builder()
                .id(vehicleId)
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .ownerEmail("customer@example.com")
                .build();
    }

    // ── POST /api/v1/vehicles ─────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createVehicle_withValidRequest_returns201() throws Exception {
        when(vehicleService.createVehicle(any(VehicleRequest.class))).thenReturn(vehicleResponse);

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.brand").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Camry"))
                .andExpect(jsonPath("$.licensePlate").value("ABC-123"))
                .andExpect(jsonPath("$.type").value("SEDAN"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createVehicle_withMissingBrand_returns400() throws Exception {
        VehicleRequest invalid = VehicleRequest.builder()
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .build();

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createVehicle_withLowercaseLicensePlate_returns400() throws Exception {
        VehicleRequest invalid = VehicleRequest.builder()
                .brand("Toyota")
                .model("Camry")
                .licensePlate("abc-123") // pattern requires uppercase
                .type(VehicleType.SEDAN)
                .build();

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void createVehicle_withDuplicateLicensePlate_returns409() throws Exception {
        when(vehicleService.createVehicle(any(VehicleRequest.class)))
                .thenThrow(new DuplicateResourceException("A vehicle with this license plate is already registered"));

        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void createVehicle_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/api/v1/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/vehicles ──────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getMyVehicles_returnsListWith200() throws Exception {
        when(vehicleService.getMyVehicles()).thenReturn(List.of(vehicleResponse));

        mockMvc.perform(get("/api/v1/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].brand").value("Toyota"))
                .andExpect(jsonPath("$[0].ownerEmail").value("customer@example.com"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getMyVehicles_returnsEmptyList() throws Exception {
        when(vehicleService.getMyVehicles()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getMyVehicles_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/vehicles"))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/vehicles/{id} ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getVehicleById_withValidId_returns200() throws Exception {
        when(vehicleService.getVehicleById(vehicleId)).thenReturn(vehicleResponse);

        mockMvc.perform(get("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(vehicleId.toString()))
                .andExpect(jsonPath("$.brand").value("Toyota"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getVehicleById_whenNotFound_returns404() throws Exception {
        when(vehicleService.getVehicleById(vehicleId))
                .thenThrow(new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        mockMvc.perform(get("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void getVehicleById_whenNotOwner_returns403() throws Exception {
        when(vehicleService.getVehicleById(vehicleId))
                .thenThrow(new com.carwash.car_wash_api.exception.AccessDeniedException(
                        "You do not have permission to access this vehicle"));

        mockMvc.perform(get("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isForbidden());
    }

    @Test
    void getVehicleById_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isUnauthorized());
    }

    // ── PUT /api/v1/vehicles/{id} ─────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateVehicle_withValidRequest_returns200() throws Exception {
        when(vehicleService.updateVehicle(eq(vehicleId), any(VehicleRequest.class)))
                .thenReturn(vehicleResponse);

        mockMvc.perform(put("/api/v1/vehicles/{id}", vehicleId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand").value("Toyota"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateVehicle_withMissingType_returns400() throws Exception {
        VehicleRequest invalid = VehicleRequest.builder()
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                // type intentionally omitted — @NotNull triggers 400
                .build();

        mockMvc.perform(put("/api/v1/vehicles/{id}", vehicleId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateVehicle_whenNotFound_returns404() throws Exception {
        when(vehicleService.updateVehicle(eq(vehicleId), any(VehicleRequest.class)))
                .thenThrow(new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        mockMvc.perform(put("/api/v1/vehicles/{id}", vehicleId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void updateVehicle_withDuplicateLicensePlate_returns409() throws Exception {
        when(vehicleService.updateVehicle(eq(vehicleId), any(VehicleRequest.class)))
                .thenThrow(new DuplicateResourceException("The new license plate is already in use"));

        mockMvc.perform(put("/api/v1/vehicles/{id}", vehicleId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void updateVehicle_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(put("/api/v1/vehicles/{id}", vehicleId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validRequest)))
                .andExpect(status().isUnauthorized());
    }

    // ── DELETE /api/v1/vehicles/{id} ──────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteVehicle_asAdmin_returns204() throws Exception {
        doNothing().when(vehicleService).deleteVehicle(vehicleId);

        mockMvc.perform(delete("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void deleteVehicle_asCustomer_returns403() throws Exception {
        // SecurityConfig restricts DELETE /api/v1/** to ADMIN only
        mockMvc.perform(delete("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteVehicle_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/v1/vehicles/{id}", vehicleId))
                .andExpect(status().isUnauthorized());
    }

    // ── GET /api/v1/vehicles/customer/{customerId} ────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    void getVehiclesByCustomer_asAdmin_returns200() throws Exception {
        Long customerId = 1L;
        when(vehicleService.getVehiclesByCustomerId(customerId)).thenReturn(List.of(vehicleResponse));

        mockMvc.perform(get("/api/v1/vehicles/customer/{customerId}", customerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].ownerEmail").value("customer@example.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getVehiclesByCustomer_whenCustomerNotFound_returns404() throws Exception {
        Long nonExistentId = 999L;
        when(vehicleService.getVehiclesByCustomerId(nonExistentId))
                .thenThrow(new ResourceNotFoundException("Customer with ID " + nonExistentId + " does not exist"));

        mockMvc.perform(get("/api/v1/vehicles/customer/{customerId}", nonExistentId))
                .andExpect(status().isNotFound());
    }

    @Test
    void getVehiclesByCustomer_whenUnauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/vehicles/customer/1"))
                .andExpect(status().isUnauthorized());
    }
}
