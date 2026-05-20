package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.response.AdminDashboardResponse;
import com.carwash.car_wash_api.dto.response.CustomerDashboardResponse;
import com.carwash.car_wash_api.dto.response.EmployeeDashboardResponse;
import com.carwash.car_wash_api.dto.response.RevenueDataPointResponse;
import com.carwash.car_wash_api.dto.response.ServiceStatResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.Payment;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.model.enums.PaymentStatus;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.PaymentRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int TOP_SERVICES_LIMIT = 5;

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final VehicleRepository vehicleRepository;
    private final EmployeeRepository employeeRepository;
    private final BookingAssignmentRepository bookingAssignmentRepository;
    private final UserRepository userRepository;

    // #319 — admin dashboard summary
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        YearMonth currentMonth = YearMonth.now();
        LocalDateTime startOfMonth = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = currentMonth.atEndOfMonth().plusDays(1).atStartOfDay();

        // #322 — total bookings
        long totalBookings = bookingRepository.count();

        // #323 — today's bookings
        long todaysBookings = bookingRepository.countTodaysBookings(startOfDay, endOfDay);

        // #324 — pending bookings
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);

        // #325 — completed bookings
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);

        // #326 — daily revenue from confirmed payments
        BigDecimal dailyRevenue = paymentRepository.sumRevenueByStatusAndPaidAtBetween(
                PaymentStatus.CONFIRMED, startOfDay, endOfDay);

        // #327 — monthly revenue from confirmed payments
        BigDecimal monthlyRevenue = paymentRepository.sumRevenueByStatusAndPaidAtBetween(
                PaymentStatus.CONFIRMED, startOfMonth, endOfMonth);

        // #328 — most requested services (top 5)
        List<ServiceStatResponse> mostRequestedServices = bookingRepository
                .findTopRequestedServices(PageRequest.of(0, TOP_SERVICES_LIMIT))
                .stream()
                .map(row -> new ServiceStatResponse((String) row[0], (Long) row[1]))
                .toList();

        return AdminDashboardResponse.builder()
                .totalBookings(totalBookings)
                .todaysBookings(todaysBookings)
                .pendingBookings(pendingBookings)
                .completedBookings(completedBookings)
                .dailyRevenue(dailyRevenue)
                .monthlyRevenue(monthlyRevenue)
                .mostRequestedServices(mostRequestedServices)
                .build();
    }

    // #320 — customer dashboard summary
    @Transactional(readOnly = true)
    public CustomerDashboardResponse getCustomerDashboard() {
        User customer = resolveCurrentUser();

        // #329 — upcoming bookings (PENDING or CONFIRMED with future appointment)
        long upcomingBookings = bookingRepository.countByCustomerIdAndStatusInAndAppointmentDateTimeAfter(
                customer.getId(),
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED),
                LocalDateTime.now()
        );

        // #330 — previous (completed) bookings
        long previousBookings = bookingRepository.countByCustomerIdAndStatus(
                customer.getId(), BookingStatus.COMPLETED);

        // #331 — registered vehicles
        long registeredVehicles = vehicleRepository.countByOwnerId(customer.getId());

        return CustomerDashboardResponse.builder()
                .upcomingBookings(upcomingBookings)
                .previousBookings(previousBookings)
                .registeredVehicles(registeredVehicles)
                .build();
    }

    // #321 — employee dashboard summary
    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getEmployeeDashboard() {
        User currentUser = resolveCurrentUser();
        Employee employee = employeeRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No employee profile found for the current user"));

        // #332 — total assigned bookings
        long assignedBookings = bookingAssignmentRepository.countByEmployeeId(employee.getId());

        // #333 — bookings in progress (assigned bookings with IN_PROGRESS status)
        long bookingsInProgress = bookingAssignmentRepository.countInProgressByEmployeeId(employee.getId());

        return EmployeeDashboardResponse.builder()
                .assignedBookings(assignedBookings)
                .bookingsInProgress(bookingsInProgress)
                .build();
    }

    @Transactional(readOnly = true)
    public List<RevenueDataPointResponse> getRevenueTimeSeries(String period, int days) {
        int units = Math.min(Math.max(1, days), 90);

        if ("monthly".equalsIgnoreCase(period)) {
            LocalDate today = LocalDate.now();
            LocalDate startDate = today.minusMonths(units - 1).withDayOfMonth(1);
            List<Payment> payments = paymentRepository.findConfirmedInRange(
                    PaymentStatus.CONFIRMED, startDate.atStartOfDay(), today.plusDays(1).atStartOfDay());
            Map<YearMonth, BigDecimal> totals = payments.stream()
                    .filter(p -> p.getPaidAt() != null)
                    .collect(Collectors.groupingBy(
                            p -> YearMonth.from(p.getPaidAt()),
                            Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
            List<RevenueDataPointResponse> result = new ArrayList<>();
            YearMonth cursor = YearMonth.from(startDate);
            YearMonth end = YearMonth.now();
            while (!cursor.isAfter(end)) {
                result.add(RevenueDataPointResponse.builder()
                        .label(cursor.atDay(1).format(fmt))
                        .revenue(totals.getOrDefault(cursor, BigDecimal.ZERO))
                        .build());
                cursor = cursor.plusMonths(1);
            }
            return result;
        }

        if ("weekly".equalsIgnoreCase(period)) {
            LocalDate today = LocalDate.now();
            LocalDate firstMonday = today.minusWeeks(units - 1)
                    .with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            List<Payment> payments = paymentRepository.findConfirmedInRange(
                    PaymentStatus.CONFIRMED, firstMonday.atStartOfDay(), today.plusDays(1).atStartOfDay());
            Map<LocalDate, BigDecimal> totals = payments.stream()
                    .filter(p -> p.getPaidAt() != null)
                    .collect(Collectors.groupingBy(
                            p -> p.getPaidAt().toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                            Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
            List<RevenueDataPointResponse> result = new ArrayList<>();
            LocalDate cursor = firstMonday;
            while (!cursor.isAfter(today)) {
                int week = cursor.get(WeekFields.ISO.weekOfWeekBasedYear());
                result.add(RevenueDataPointResponse.builder()
                        .label("Week " + week)
                        .revenue(totals.getOrDefault(cursor, BigDecimal.ZERO))
                        .build());
                cursor = cursor.plusWeeks(1);
            }
            return result;
        }

        // Default: daily
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(units - 1);
        List<Payment> payments = paymentRepository.findConfirmedInRange(
                PaymentStatus.CONFIRMED, startDate.atStartOfDay(), today.plusDays(1).atStartOfDay());
        Map<LocalDate, BigDecimal> totals = payments.stream()
                .filter(p -> p.getPaidAt() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPaidAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");
        List<RevenueDataPointResponse> result = new ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            result.add(RevenueDataPointResponse.builder()
                    .label(date.format(fmt))
                    .revenue(totals.getOrDefault(date, BigDecimal.ZERO))
                    .build());
        }
        return result;
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
