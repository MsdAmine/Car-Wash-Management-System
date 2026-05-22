package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.response.AvailableSlotsResponse;
import com.carwash.car_wash_api.dto.response.TimeSlotResponse;
import com.carwash.car_wash_api.mapper.BookingMapper;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.OperatingHours;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.OperatingHoursRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceAvailableSlotsTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private WashServiceRepository washServiceRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private BookingAssignmentRepository bookingAssignmentRepository;
    @Mock private OperatingHoursRepository operatingHoursRepository;
    @Mock private BookingMapper bookingMapper;

    @InjectMocks private BookingService bookingService;

    private WashService activeService(UUID id, int duration) {
        return WashService.builder()
                .id(id)
                .name("Basic Wash")
                .price(new BigDecimal("9.99"))
                .durationMinutes(duration)
                .active(true)
                .build();
    }

    private OperatingHours openHours(String day, int openHour, int closeHour) {
        return OperatingHours.builder()
                .dayOfWeek(day)
                .openTime(LocalTime.of(openHour, 0))
                .closeTime(LocalTime.of(closeHour, 0))
                .open(true)
                .build();
    }

    @Test
    void slotGeneration_producesCorrectStartTimes() {
        // openTime=08:00, closeTime=11:00, duration=60 → 5 slots: 08:00–10:00 inclusive
        UUID serviceId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2025, 6, 2);
        String day = date.getDayOfWeek().name();

        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(activeService(serviceId, 60)));
        when(operatingHoursRepository.findByDayOfWeek(day)).thenReturn(Optional.of(openHours(day, 8, 11)));
        when(bookingRepository.findOverlappingBookings(any(), any(), any())).thenReturn(List.of());

        AvailableSlotsResponse response = bookingService.getAvailableSlots("2025-06-02", serviceId);

        assertThat(response.getSlots()).hasSize(5);
        assertThat(response.getSlots().get(0).getTime()).isEqualTo("08:00");
        assertThat(response.getSlots().get(1).getTime()).isEqualTo("08:30");
        assertThat(response.getSlots().get(4).getTime()).isEqualTo("10:00");
        assertThat(response.getSlots()).allMatch(TimeSlotResponse::isAvailable);
    }

    @Test
    void overlappingBooking_marksSlotUnavailable() {
        // openTime=08:00, closeTime=10:00, duration=60 → slots: 08:00, 08:30, 09:00
        // slot 08:00–09:00 is occupied; the other two are free
        UUID serviceId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2025, 6, 2);
        String day = date.getDayOfWeek().name();

        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(activeService(serviceId, 60)));
        when(operatingHoursRepository.findByDayOfWeek(day)).thenReturn(Optional.of(openHours(day, 8, 10)));

        LocalDateTime bookedStart = date.atTime(8, 0);
        LocalDateTime bookedEnd   = date.atTime(9, 0);
        when(bookingRepository.findOverlappingBookings(eq(bookedStart), eq(bookedEnd), any()))
                .thenReturn(List.of(mock(Booking.class)));
        when(bookingRepository.findOverlappingBookings(eq(date.atTime(8, 30)), eq(date.atTime(9, 30)), any()))
                .thenReturn(List.of());
        when(bookingRepository.findOverlappingBookings(eq(date.atTime(9, 0)), eq(date.atTime(10, 0)), any()))
                .thenReturn(List.of());

        AvailableSlotsResponse response = bookingService.getAvailableSlots("2025-06-02", serviceId);

        assertThat(response.getSlots()).hasSize(3);
        assertThat(response.getSlots().get(0).isAvailable()).isFalse();
        assertThat(response.getSlots().get(0).getReason()).isEqualTo("Already booked");
        assertThat(response.getSlots().get(1).isAvailable()).isTrue();
        assertThat(response.getSlots().get(2).isAvailable()).isTrue();
    }

    @Test
    void slotEndingExactlyAtCloseTime_isIncluded() {
        // openTime=09:00, closeTime=10:00, duration=60
        // lastValidStart = 09:00 → slot 09:00 included (ends exactly at closeTime 10:00)
        UUID serviceId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2025, 6, 2);
        String day = date.getDayOfWeek().name();

        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(activeService(serviceId, 60)));
        when(operatingHoursRepository.findByDayOfWeek(day)).thenReturn(Optional.of(openHours(day, 9, 10)));
        when(bookingRepository.findOverlappingBookings(any(), any(), any())).thenReturn(List.of());

        AvailableSlotsResponse response = bookingService.getAvailableSlots("2025-06-02", serviceId);

        assertThat(response.getSlots()).hasSize(1);
        assertThat(response.getSlots().get(0).getTime()).isEqualTo("09:00");
        assertThat(response.getSlots().get(0).isAvailable()).isTrue();
    }

    @Test
    void slotEndingAfterCloseTime_isExcluded() {
        // openTime=08:00, closeTime=09:00, duration=60
        // lastValidStart = 08:00 → only slot 08:00 is valid; 08:30 would end at 09:30 > closeTime
        UUID serviceId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2025, 6, 2);
        String day = date.getDayOfWeek().name();

        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(activeService(serviceId, 60)));
        when(operatingHoursRepository.findByDayOfWeek(day)).thenReturn(Optional.of(openHours(day, 8, 9)));
        when(bookingRepository.findOverlappingBookings(any(), any(), any())).thenReturn(List.of());

        AvailableSlotsResponse response = bookingService.getAvailableSlots("2025-06-02", serviceId);

        assertThat(response.getSlots()).hasSize(1);
        assertThat(response.getSlots().get(0).getTime()).isEqualTo("08:00");
    }
}
