package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.VehicleRequest;
import com.carwash.car_wash_api.dto.response.VehicleResponse;
import com.carwash.car_wash_api.exception.AccessDeniedException;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.VehicleMapper;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.entity.Vehicle;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.model.enums.VehicleType;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock private VehicleRepository vehicleRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleMapper vehicleMapper;

    @InjectMocks private VehicleService vehicleService;

    private User owner;
    private User otherUser;
    private Vehicle vehicle;
    private VehicleRequest request;
    private VehicleResponse response;
    private UUID vehicleId;

    @BeforeEach
    void setUp() {
        vehicleId = UUID.randomUUID();

        owner = User.builder()
                .id(1L)
                .email("owner@example.com")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        otherUser = User.builder()
                .id(2L)
                .email("other@example.com")
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();

        request = VehicleRequest.builder()
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .build();

        vehicle = Vehicle.builder()
                .id(vehicleId)
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .owner(owner)
                .build();

        response = VehicleResponse.builder()
                .id(vehicleId)
                .brand("Toyota")
                .model("Camry")
                .licensePlate("ABC-123")
                .type(VehicleType.SEDAN)
                .ownerEmail("owner@example.com")
                .build();

    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void mockSecurityContext(String email) {
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(email);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    // ── createVehicle ─────────────────────────────────────────────────────────

    @Test
    void createVehicle_success() {
        mockSecurityContext(owner.getEmail());
        when(vehicleRepository.existsByLicensePlate("ABC-123")).thenReturn(false);
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleMapper.toEntity(request)).thenReturn(vehicle);
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        VehicleResponse result = vehicleService.createVehicle(request);

        assertThat(result).isEqualTo(response);
        assertThat(vehicle.getOwner()).isEqualTo(owner);
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void createVehicle_duplicateLicensePlate_throwsDuplicateResourceException() {
        when(vehicleRepository.existsByLicensePlate("ABC-123")).thenReturn(true);

        assertThatThrownBy(() -> vehicleService.createVehicle(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("license plate");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    void createVehicle_ownerNotFound_throwsResourceNotFoundException() {
        mockSecurityContext(owner.getEmail());
        when(vehicleRepository.existsByLicensePlate("ABC-123")).thenReturn(false);
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.createVehicle(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Owner not found");
    }

    // ── getMyVehicles ─────────────────────────────────────────────────────────

    @Test
    void getMyVehicles_returnsOwnedVehicles() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findByOwnerId(owner.getId())).thenReturn(List.of(vehicle));
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        List<VehicleResponse> result = vehicleService.getMyVehicles();

        assertThat(result).hasSize(1).containsExactly(response);
    }

    @Test
    void getMyVehicles_returnsEmptyListWhenNoVehicles() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findByOwnerId(owner.getId())).thenReturn(List.of());

        List<VehicleResponse> result = vehicleService.getMyVehicles();

        assertThat(result).isEmpty();
    }

    // ── getVehicleById ────────────────────────────────────────────────────────

    @Test
    void getVehicleById_success() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        VehicleResponse result = vehicleService.getVehicleById(vehicleId);

        assertThat(result).isEqualTo(response);
    }

    @Test
    void getVehicleById_notFound_throwsResourceNotFoundException() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.getVehicleById(vehicleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Vehicle not found");
    }

    @Test
    void getVehicleById_wrongOwner_throwsAccessDeniedException() {
        mockSecurityContext(otherUser.getEmail());
        when(userRepository.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> vehicleService.getVehicleById(vehicleId))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("permission");
    }

    // ── updateVehicle ─────────────────────────────────────────────────────────

    @Test
    void updateVehicle_success() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        VehicleResponse result = vehicleService.updateVehicle(vehicleId, request);

        assertThat(result).isEqualTo(response);
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void updateVehicle_sameLicensePlate_doesNotCheckForDuplicate() {
        mockSecurityContext(owner.getEmail());
        // Updating with the same plate should not trigger the uniqueness check
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        vehicleService.updateVehicle(vehicleId, request); // request has same plate "ABC-123"

        verify(vehicleRepository, never()).existsByLicensePlate(any());
    }

    @Test
    void updateVehicle_newPlateAlreadyInUse_throwsDuplicateResourceException() {
        mockSecurityContext(owner.getEmail());
        VehicleRequest updateRequest = VehicleRequest.builder()
                .brand("Honda")
                .model("Civic")
                .licensePlate("XYZ-999")
                .type(VehicleType.SEDAN)
                .build();

        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.existsByLicensePlate("XYZ-999")).thenReturn(true);

        assertThatThrownBy(() -> vehicleService.updateVehicle(vehicleId, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("license plate");
    }

    @Test
    void updateVehicle_wrongOwner_throwsAccessDeniedException() {
        mockSecurityContext(otherUser.getEmail());
        when(userRepository.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> vehicleService.updateVehicle(vehicleId, request))
                .isInstanceOf(AccessDeniedException.class);
    }

    // ── deleteVehicle ─────────────────────────────────────────────────────────

    @Test
    void deleteVehicle_success() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        vehicleService.deleteVehicle(vehicleId);

        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void deleteVehicle_notFound_throwsResourceNotFoundException() {
        mockSecurityContext(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.deleteVehicle(vehicleId))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(vehicleRepository, never()).delete(any());
    }

    @Test
    void deleteVehicle_wrongOwner_throwsAccessDeniedException() {
        mockSecurityContext(otherUser.getEmail());
        when(userRepository.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));

        assertThatThrownBy(() -> vehicleService.deleteVehicle(vehicleId))
                .isInstanceOf(AccessDeniedException.class);

        verify(vehicleRepository, never()).delete(any());
    }

    // ── getVehiclesByCustomerId ───────────────────────────────────────────────

    @Test
    void getVehiclesByCustomerId_success() {
        when(userRepository.existsById(owner.getId())).thenReturn(true);
        when(vehicleRepository.findByOwnerId(owner.getId())).thenReturn(List.of(vehicle));
        when(vehicleMapper.toResponse(vehicle)).thenReturn(response);

        List<VehicleResponse> result = vehicleService.getVehiclesByCustomerId(owner.getId());

        assertThat(result).hasSize(1).containsExactly(response);
    }

    @Test
    void getVehiclesByCustomerId_customerNotFound_throwsResourceNotFoundException() {
        Long nonExistentId = 999L;
        when(userRepository.existsById(nonExistentId)).thenReturn(false);

        assertThatThrownBy(() -> vehicleService.getVehiclesByCustomerId(nonExistentId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Customer with ID 999");
    }

    @Test
    void getVehiclesByCustomerId_returnsEmptyListForCustomerWithNoVehicles() {
        when(userRepository.existsById(owner.getId())).thenReturn(true);
        when(vehicleRepository.findByOwnerId(owner.getId())).thenReturn(List.of());

        List<VehicleResponse> result = vehicleService.getVehiclesByCustomerId(owner.getId());

        assertThat(result).isEmpty();
    }
}
