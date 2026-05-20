package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.BookingRequest;
import com.carwash.car_wash_api.exception.InvalidBookingException;
import com.carwash.car_wash_api.mapper.BookingMapper;
import com.carwash.car_wash_api.model.entity.OperatingHours;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.entity.Vehicle;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.model.enums.VehicleType;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.OperatingHoursRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceOperatingHoursTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private UserRepository userRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private WashServiceRepository washServiceRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private BookingAssignmentRepository bookingAssignmentRepository;
    @Mock private OperatingHoursRepository operatingHoursRepository;
    @Mock private BookingMapper bookingMapper;

    @InjectMocks private BookingService bookingService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void mockCurrentUser(User user) {
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(auth.getName()).thenReturn(user.getEmail());
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
    }

    @Test
    void createBooking_onClosedDay_throwsInvalidBookingException() {
        User customer = User.builder().id(1L).email("c@example.com").role(Role.CUSTOMER).enabled(true).build();
        mockCurrentUser(customer);

        UUID vehicleId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();

        Vehicle vehicle = Vehicle.builder().id(vehicleId).owner(customer)
                .type(VehicleType.SEDAN).licensePlate("TST-001").build();
        WashService service = WashService.builder().id(serviceId).name("Basic")
                .price(new BigDecimal("9.99")).durationMinutes(30).active(true).build();

        // Book 10 days from now; determine the actual day of week
        LocalDateTime appointment = LocalDateTime.now().plusDays(10)
                .withHour(10).withMinute(0).withSecond(0).withNano(0);
        String dayOfWeek = appointment.getDayOfWeek().name();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(service));

        OperatingHours closed = OperatingHours.builder()
                .dayOfWeek(dayOfWeek)
                .openTime(LocalTime.of(8, 0))
                .closeTime(LocalTime.of(18, 0))
                .open(false)
                .build();
        when(operatingHoursRepository.findByDayOfWeek(dayOfWeek)).thenReturn(Optional.of(closed));

        BookingRequest request = BookingRequest.builder()
                .vehicleId(vehicleId)
                .washServiceId(serviceId)
                .appointmentDateTime(appointment)
                .build();

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("not available on this day");
    }

    @Test
    void createBooking_outsideOpeningHours_throwsInvalidBookingException() {
        User customer = User.builder().id(1L).email("c@example.com").role(Role.CUSTOMER).enabled(true).build();
        mockCurrentUser(customer);

        UUID vehicleId = UUID.randomUUID();
        UUID serviceId = UUID.randomUUID();

        Vehicle vehicle = Vehicle.builder().id(vehicleId).owner(customer)
                .type(VehicleType.SEDAN).licensePlate("TST-002").build();
        // 60-minute service starting at 06:00 — before opening at 08:00
        WashService service = WashService.builder().id(serviceId).name("Full Service")
                .price(new BigDecimal("19.99")).durationMinutes(60).active(true).build();

        LocalDateTime appointment = LocalDateTime.now().plusDays(10)
                .withHour(6).withMinute(0).withSecond(0).withNano(0);
        String dayOfWeek = appointment.getDayOfWeek().name();

        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(vehicle));
        when(washServiceRepository.findById(serviceId)).thenReturn(Optional.of(service));

        OperatingHours oh = OperatingHours.builder()
                .dayOfWeek(dayOfWeek)
                .openTime(LocalTime.of(8, 0))
                .closeTime(LocalTime.of(18, 0))
                .open(true)
                .build();
        when(operatingHoursRepository.findByDayOfWeek(dayOfWeek)).thenReturn(Optional.of(oh));

        BookingRequest request = BookingRequest.builder()
                .vehicleId(vehicleId)
                .washServiceId(serviceId)
                .appointmentDateTime(appointment)
                .build();

        assertThatThrownBy(() -> bookingService.createBooking(request))
                .isInstanceOf(InvalidBookingException.class)
                .hasMessageContaining("operating hours");
    }
}
