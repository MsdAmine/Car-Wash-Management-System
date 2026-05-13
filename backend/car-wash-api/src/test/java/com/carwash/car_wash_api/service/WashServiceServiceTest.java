package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.WashServiceRequest;
import com.carwash.car_wash_api.dto.response.WashServiceResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.WashServiceMapper;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WashServiceServiceTest {

    @Mock private WashServiceRepository washServiceRepository;
    @Mock private WashServiceMapper washServiceMapper;

    @InjectMocks private WashServiceService washServiceService;

    private UUID serviceId;
    private WashService washService;
    private WashServiceRequest request;
    private WashServiceResponse response;

    @BeforeEach
    void setUp() {
        serviceId = UUID.randomUUID();

        washService = WashService.builder()
                .id(serviceId)
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .active(true)
                .build();

        request = WashServiceRequest.builder()
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .build();

        response = WashServiceResponse.builder()
                .id(serviceId)
                .name("Basic Wash")
                .description("A quick exterior wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(30)
                .active(true)
                .build();
    }

    // ── createWashService ─────────────────────────────────────────────────────

    @Test
    void createWashService_success() {
        when(washServiceRepository.existsByName("Basic Wash")).thenReturn(false);
        when(washServiceMapper.toEntity(request)).thenReturn(washService);
        when(washServiceRepository.save(washService)).thenReturn(washService);
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        WashServiceResponse result = washServiceService.createWashService(request);

        assertThat(result).isEqualTo(response);
        verify(washServiceRepository).save(washService);
    }

    @Test
    void createWashService_duplicateName_throwsDuplicateResourceException() {
        when(washServiceRepository.existsByName("Basic Wash")).thenReturn(true);

        assertThatThrownBy(() -> washServiceService.createWashService(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("name already exists");

        verify(washServiceRepository, never()).save(any());
    }

    // ── getAllWashServices ────────────────────────────────────────────────────

    @Test
    void getAllWashServices_returnsList() {
        when(washServiceRepository.findAll()).thenReturn(List.of(washService));
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        List<WashServiceResponse> result = washServiceService.getAllWashServices();

        assertThat(result).hasSize(1).containsExactly(response);
    }

    @Test
    void getAllWashServices_returnsEmptyList() {
        when(washServiceRepository.findAll()).thenReturn(List.of());

        List<WashServiceResponse> result = washServiceService.getAllWashServices();

        assertThat(result).isEmpty();
    }

    // ── getActiveWashServices ─────────────────────────────────────────────────

    @Test
    void getActiveWashServices_returnsOnlyActiveServices() {
        when(washServiceRepository.findByActiveTrue()).thenReturn(List.of(washService));
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        List<WashServiceResponse> result = washServiceService.getActiveWashServices();

        assertThat(result).hasSize(1).containsExactly(response);
    }

    @Test
    void getActiveWashServices_returnsEmptyWhenNoneActive() {
        when(washServiceRepository.findByActiveTrue()).thenReturn(List.of());

        List<WashServiceResponse> result = washServiceService.getActiveWashServices();

        assertThat(result).isEmpty();
    }

    // ── getWashServiceById ────────────────────────────────────────────────────

    @Test
    void getWashServiceById_success() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        WashServiceResponse result = washServiceService.getWashServiceById(serviceId);

        assertThat(result).isEqualTo(response);
    }

    @Test
    void getWashServiceById_notFound_throwsResourceNotFoundException() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washServiceService.getWashServiceById(serviceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Wash service not found");
    }

    // ── updateWashService ─────────────────────────────────────────────────────

    @Test
    void updateWashService_success() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));
        when(washServiceRepository.save(washService)).thenReturn(washService);
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        WashServiceResponse result = washServiceService.updateWashService(serviceId, request);

        assertThat(result).isEqualTo(response);
        verify(washServiceRepository).save(washService);
    }

    @Test
    void updateWashService_sameName_doesNotCheckForDuplicate() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));
        when(washServiceRepository.save(washService)).thenReturn(washService);
        when(washServiceMapper.toResponse(washService)).thenReturn(response);

        washServiceService.updateWashService(serviceId, request);

        verify(washServiceRepository, never()).existsByName(any());
    }

    @Test
    void updateWashService_newNameAlreadyExists_throwsDuplicateResourceException() {
        WashServiceRequest updateRequest = WashServiceRequest.builder()
                .name("Premium Wash")
                .price(new BigDecimal("19.99"))
                .durationMinutes(60)
                .build();

        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));
        when(washServiceRepository.existsByName("Premium Wash")).thenReturn(true);

        assertThatThrownBy(() -> washServiceService.updateWashService(serviceId, updateRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("name already exists");

        verify(washServiceRepository, never()).save(any());
    }

    @Test
    void updateWashService_notFound_throwsResourceNotFoundException() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washServiceService.updateWashService(serviceId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Wash service not found");
    }

    // ── deactivateWashService ─────────────────────────────────────────────────

    @Test
    void deactivateWashService_success() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));
        when(washServiceRepository.save(washService)).thenReturn(washService);

        WashServiceResponse deactivatedResponse = WashServiceResponse.builder()
                .id(serviceId)
                .name("Basic Wash")
                .active(false)
                .build();
        when(washServiceMapper.toResponse(washService)).thenReturn(deactivatedResponse);

        WashServiceResponse result = washServiceService.deactivateWashService(serviceId);

        assertThat(washService.getActive()).isFalse();
        assertThat(result.getActive()).isFalse();
        verify(washServiceRepository).save(washService);
    }

    @Test
    void deactivateWashService_notFound_throwsResourceNotFoundException() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washServiceService.deactivateWashService(serviceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Wash service not found");

        verify(washServiceRepository, never()).save(any());
    }

    // ── deleteWashService ─────────────────────────────────────────────────────

    @Test
    void deleteWashService_success() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(washService));

        washServiceService.deleteWashService(serviceId);

        verify(washServiceRepository).delete(washService);
    }

    @Test
    void deleteWashService_notFound_throwsResourceNotFoundException() {
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> washServiceService.deleteWashService(serviceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Wash service not found");

        verify(washServiceRepository, never()).delete(any());
    }
}
