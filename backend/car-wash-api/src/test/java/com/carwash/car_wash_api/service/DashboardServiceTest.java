package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.response.AdminDashboardResponse;
import com.carwash.car_wash_api.dto.response.CustomerDashboardResponse;
import com.carwash.car_wash_api.dto.response.EmployeeDashboardResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.PaymentStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.PaymentRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private VehicleRepository vehicleRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private BookingAssignmentRepository bookingAssignmentRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private DashboardService dashboardService;

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // ── getAdminDashboard ─────────────────────────────────────────────────────

    @Test
    void getAdminDashboard_returnsAggregatedStats() {
        when(bookingRepository.count()).thenReturn(100L);
        when(bookingRepository.countTodaysBookings(any(), any())).thenReturn(5L);
        when(bookingRepository.countByStatus(BookingStatus.PENDING)).thenReturn(12L);
        when(bookingRepository.countByStatus(BookingStatus.COMPLETED)).thenReturn(80L);
        when(paymentRepository.sumRevenueByStatusAndPaidAtBetween(eq(PaymentStatus.CONFIRMED), any(), any()))
                .thenReturn(new BigDecimal("350.00"))
                .thenReturn(new BigDecimal("4200.00"));
        when(bookingRepository.findTopRequestedServices(any(Pageable.class)))
                .thenReturn(List.of(
                        new Object[]{"Full Wash", 40L},
                        new Object[]{"Quick Rinse", 30L}
                ));

        AdminDashboardResponse result = dashboardService.getAdminDashboard();

        assertThat(result.getTotalBookings()).isEqualTo(100L);
        assertThat(result.getTodaysBookings()).isEqualTo(5L);
        assertThat(result.getPendingBookings()).isEqualTo(12L);
        assertThat(result.getCompletedBookings()).isEqualTo(80L);
        assertThat(result.getDailyRevenue()).isEqualByComparingTo("350.00");
        assertThat(result.getMonthlyRevenue()).isEqualByComparingTo("4200.00");
        assertThat(result.getMostRequestedServices()).hasSize(2);
        assertThat(result.getMostRequestedServices().get(0).getServiceName()).isEqualTo("Full Wash");
        assertThat(result.getMostRequestedServices().get(0).getBookingCount()).isEqualTo(40L);
    }

    @Test
    void getAdminDashboard_withNoPayments_returnsZeroRevenue() {
        when(bookingRepository.count()).thenReturn(0L);
        when(bookingRepository.countTodaysBookings(any(), any())).thenReturn(0L);
        when(bookingRepository.countByStatus(BookingStatus.PENDING)).thenReturn(0L);
        when(bookingRepository.countByStatus(BookingStatus.COMPLETED)).thenReturn(0L);
        when(paymentRepository.sumRevenueByStatusAndPaidAtBetween(eq(PaymentStatus.CONFIRMED), any(), any()))
                .thenReturn(BigDecimal.ZERO);
        when(bookingRepository.findTopRequestedServices(any(Pageable.class)))
                .thenReturn(List.of());

        AdminDashboardResponse result = dashboardService.getAdminDashboard();

        assertThat(result.getTotalBookings()).isZero();
        assertThat(result.getDailyRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getMostRequestedServices()).isEmpty();
    }

    @Test
    void getAdminDashboard_limitsTopServicesToFive() {
        when(bookingRepository.count()).thenReturn(200L);
        when(bookingRepository.countTodaysBookings(any(), any())).thenReturn(10L);
        when(bookingRepository.countByStatus(any())).thenReturn(50L);
        when(paymentRepository.sumRevenueByStatusAndPaidAtBetween(any(), any(), any()))
                .thenReturn(BigDecimal.ZERO);

        List<Object[]> topFive = List.of(
                new Object[]{"Svc1", 50L},
                new Object[]{"Svc2", 40L},
                new Object[]{"Svc3", 30L},
                new Object[]{"Svc4", 20L},
                new Object[]{"Svc5", 10L}
        );
        when(bookingRepository.findTopRequestedServices(any(Pageable.class))).thenReturn(topFive);

        AdminDashboardResponse result = dashboardService.getAdminDashboard();

        assertThat(result.getMostRequestedServices()).hasSize(5);

        // Verify that the repository was called with a page size of 5
        verify(bookingRepository).findTopRequestedServices(argThat(p -> p.getPageSize() == 5));
    }

    // ── getCustomerDashboard ──────────────────────────────────────────────────

    @Test
    void getCustomerDashboard_returnsStatsForAuthenticatedCustomer() {
        User customer = buildUser(1L, "customer@example.com", Role.CUSTOMER);
        mockSecurityContext("customer@example.com");
        when(userRepository.findByEmail("customer@example.com")).thenReturn(Optional.of(customer));

        when(bookingRepository.countByCustomerIdAndStatusInAndAppointmentDateTimeAfter(
                eq(customer.getId()), any(), any())).thenReturn(3L);
        when(bookingRepository.countByCustomerIdAndStatus(customer.getId(), BookingStatus.COMPLETED))
                .thenReturn(7L);
        when(vehicleRepository.countByOwnerId(customer.getId())).thenReturn(2L);

        CustomerDashboardResponse result = dashboardService.getCustomerDashboard();

        assertThat(result.getUpcomingBookings()).isEqualTo(3L);
        assertThat(result.getPreviousBookings()).isEqualTo(7L);
        assertThat(result.getRegisteredVehicles()).isEqualTo(2L);
    }

    @Test
    void getCustomerDashboard_whenUserNotFound_throwsResourceNotFoundException() {
        mockSecurityContext("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dashboardService.getCustomerDashboard())
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── getEmployeeDashboard ──────────────────────────────────────────────────

    @Test
    void getEmployeeDashboard_returnsStatsForAuthenticatedEmployee() {
        User user = buildUser(2L, "emp@example.com", Role.EMPLOYEE);
        UUID employeeId = UUID.randomUUID();
        Employee employee = buildEmployee(employeeId, user);

        mockSecurityContext("emp@example.com");
        when(userRepository.findByEmail("emp@example.com")).thenReturn(Optional.of(user));
        when(employeeRepository.findByUserId(user.getId())).thenReturn(Optional.of(employee));
        when(bookingAssignmentRepository.countByEmployeeId(employeeId)).thenReturn(15L);
        when(bookingAssignmentRepository.countInProgressByEmployeeId(employeeId)).thenReturn(3L);

        EmployeeDashboardResponse result = dashboardService.getEmployeeDashboard();

        assertThat(result.getAssignedBookings()).isEqualTo(15L);
        assertThat(result.getBookingsInProgress()).isEqualTo(3L);
    }

    @Test
    void getEmployeeDashboard_whenNoEmployeeProfile_throwsResourceNotFoundException() {
        User user = buildUser(3L, "noProfile@example.com", Role.EMPLOYEE);

        mockSecurityContext("noProfile@example.com");
        when(userRepository.findByEmail("noProfile@example.com")).thenReturn(Optional.of(user));
        when(employeeRepository.findByUserId(user.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dashboardService.getEmployeeDashboard())
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("No employee profile found");
    }

    @Test
    void getEmployeeDashboard_whenUserNotFound_throwsResourceNotFoundException() {
        mockSecurityContext("ghost@example.com");
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dashboardService.getEmployeeDashboard())
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private void mockSecurityContext(String email) {
        Authentication auth = new UsernamePasswordAuthenticationToken(email, null, List.of());
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
    }

    private User buildUser(Long id, String email, Role role) {
        return User.builder()
                .id(id)
                .email(email)
                .role(role)
                .enabled(true)
                .build();
    }

    private Employee buildEmployee(UUID id, User user) {
        return Employee.builder()
                .id(id)
                .user(user)
                .position(EmployeePosition.WASHER)
                .hireDate(LocalDate.now())
                .active(true)
                .build();
    }
}
