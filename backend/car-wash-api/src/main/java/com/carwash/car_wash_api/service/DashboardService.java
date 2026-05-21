package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.response.AdminDashboardResponse;
import com.carwash.car_wash_api.dto.response.CustomerDashboardResponse;
import com.carwash.car_wash_api.dto.response.EmployeeDashboardResponse;
import com.carwash.car_wash_api.dto.response.HeatmapResponse;
import com.carwash.car_wash_api.dto.response.RevenueDataPointResponse;
import com.carwash.car_wash_api.dto.response.ServiceBookingStatResponse;
import com.carwash.car_wash_api.dto.response.ServiceStatResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.Booking;
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
    public List<RevenueDataPointResponse> getRevenueTimeSeries(String period, int days, LocalDate from, LocalDate to) {
        int units = Math.min(Math.max(1, days), 90);
        LocalDate rangeEnd = to != null ? to : LocalDate.now();

        if ("monthly".equalsIgnoreCase(period)) {
            LocalDate rangeStart = from != null ? from.withDayOfMonth(1) : rangeEnd.minusMonths(units - 1).withDayOfMonth(1);
            List<Payment> payments = paymentRepository.findConfirmedInRange(
                    PaymentStatus.CONFIRMED, rangeStart.atStartOfDay(), rangeEnd.plusDays(1).atStartOfDay());
            Map<YearMonth, BigDecimal> totals = payments.stream()
                    .filter(p -> p.getPaidAt() != null)
                    .collect(Collectors.groupingBy(
                            p -> YearMonth.from(p.getPaidAt()),
                            Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
            List<RevenueDataPointResponse> result = new ArrayList<>();
            YearMonth cursor = YearMonth.from(rangeStart);
            YearMonth end = YearMonth.from(rangeEnd);
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
            LocalDate rangeStart = from != null
                    ? from.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                    : rangeEnd.minusWeeks(units - 1).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            List<Payment> payments = paymentRepository.findConfirmedInRange(
                    PaymentStatus.CONFIRMED, rangeStart.atStartOfDay(), rangeEnd.plusDays(1).atStartOfDay());
            Map<LocalDate, BigDecimal> totals = payments.stream()
                    .filter(p -> p.getPaidAt() != null)
                    .collect(Collectors.groupingBy(
                            p -> p.getPaidAt().toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)),
                            Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
            List<RevenueDataPointResponse> result = new ArrayList<>();
            LocalDate cursor = rangeStart;
            while (!cursor.isAfter(rangeEnd)) {
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
        LocalDate rangeStart = from != null ? from : rangeEnd.minusDays(units - 1);
        List<Payment> payments = paymentRepository.findConfirmedInRange(
                PaymentStatus.CONFIRMED, rangeStart.atStartOfDay(), rangeEnd.plusDays(1).atStartOfDay());
        Map<LocalDate, BigDecimal> totals = payments.stream()
                .filter(p -> p.getPaidAt() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPaidAt().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, Payment::getAmount, BigDecimal::add)));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");
        List<RevenueDataPointResponse> result = new ArrayList<>();
        for (LocalDate date = rangeStart; !date.isAfter(rangeEnd); date = date.plusDays(1)) {
            result.add(RevenueDataPointResponse.builder()
                    .label(date.format(fmt))
                    .revenue(totals.getOrDefault(date, BigDecimal.ZERO))
                    .build());
        }
        return result;
    }

    // analytics: booking counts per service, optionally filtered by date range
    @Transactional(readOnly = true)
    public List<ServiceBookingStatResponse> getBookingsByService(LocalDate from, LocalDate to) {
        List<Object[]> rows;
        if (from != null || to != null) {
            LocalDateTime start = from != null ? from.atStartOfDay() : LocalDate.of(2000, 1, 1).atStartOfDay();
            LocalDateTime end   = to   != null ? to.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(1).atStartOfDay();
            rows = bookingRepository.countGroupedByServiceInRange(start, end);
        } else {
            rows = bookingRepository.countGroupedByService();
        }
        long total = rows.stream().mapToLong(r -> (Long) r[2]).sum();
        return rows.stream()
                .map(r -> {
                    long count = (Long) r[2];
                    double pct = total == 0 ? 0.0 : Math.round((double) count / total * 1000.0) / 10.0;
                    return ServiceBookingStatResponse.builder()
                            .serviceId(r[0].toString())
                            .serviceName((String) r[1])
                            .bookingCount(count)
                            .percentage(pct)
                            .build();
                })
                .toList();
    }

    // analytics: 10×7 booking heatmap, optionally filtered by date range (defaults to last 90 days)
    @Transactional(readOnly = true)
    public HeatmapResponse getActivityHeatmap(LocalDate from, LocalDate to) {
        LocalDateTime start = from != null ? from.atStartOfDay() : LocalDateTime.now().minusDays(90);
        LocalDateTime end   = to   != null ? to.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(1).atStartOfDay();
        List<BookingStatus> statuses = List.of(
                BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED);
        List<Booking> bookings = bookingRepository.findInRangeByStatusIn(start, end, statuses);

        List<String> days = List.of("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        List<String> slots = List.of(
                "08:00", "09:00", "10:00", "11:00", "12:00",
                "13:00", "14:00", "15:00", "16:00", "17:00");

        int[][] matrix = new int[10][7];
        for (var booking : bookings) {
            LocalDateTime dt = booking.getAppointmentDateTime();
            if (dt == null) continue;
            int hour = dt.getHour();
            if (hour < 8 || hour > 17) continue;
            int slotIndex = hour - 8;
            int dayIndex = dt.getDayOfWeek().getValue() - 1; // Mon=0 … Sun=6
            matrix[slotIndex][dayIndex]++;
        }

        List<List<Integer>> data = new ArrayList<>();
        for (int[] row : matrix) {
            List<Integer> rowList = new ArrayList<>();
            for (int val : row) rowList.add(val);
            data.add(rowList);
        }

        return HeatmapResponse.builder()
                .days(days)
                .slots(slots)
                .data(data)
                .build();
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
