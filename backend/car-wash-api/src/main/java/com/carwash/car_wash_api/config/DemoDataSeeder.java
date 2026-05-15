package com.carwash.car_wash_api.config;

import com.carwash.car_wash_api.model.entity.*;
import com.carwash.car_wash_api.model.enums.*;
import com.carwash.car_wash_api.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.demo.seed-on-startup", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private final WashServiceRepository       washServiceRepository;
    private final UserRepository              userRepository;
    private final EmployeeRepository          employeeRepository;
    private final VehicleRepository           vehicleRepository;
    private final BookingRepository           bookingRepository;
    private final BookingAssignmentRepository bookingAssignmentRepository;
    private final PaymentRepository           paymentRepository;
    private final PasswordEncoder             passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("--- Demo data seeder running ---");
        List<WashService> services  = seedWashServices();
        List<User>        customers = seedCustomers();
        List<User>        empUsers  = seedEmployeeUsers();
        List<Employee>    employees = seedEmployeeRecords(empUsers);
        List<Vehicle>     vehicles  = seedVehicles(customers);
        User admin = userRepository.findByEmail("admin@carwash.com")
                .orElseThrow(() -> new IllegalStateException("Admin not found — DataInitializer must run first"));
        List<Booking> bookings = seedBookings(customers, vehicles, services);
        seedBookingAssignments(bookings, employees, admin);
        seedPayments(bookings);
        log.info("--- Demo data seeder complete ---");
    }

    private List<WashService> seedWashServices() {
        return List.of(
            saveIfAbsent(WashService.builder()
                .name("Basic Exterior Wash").description("Quick exterior rinse and dry")
                .price(new BigDecimal("5.99")).durationMinutes(15).build()),
            saveIfAbsent(WashService.builder()
                .name("Interior Vacuum").description("Full interior vacuum and wipe-down")
                .price(new BigDecimal("9.99")).durationMinutes(20).build()),
            saveIfAbsent(WashService.builder()
                .name("Full Service Wash").description("Exterior wash plus interior cleaning")
                .price(new BigDecimal("19.99")).durationMinutes(45).build()),
            saveIfAbsent(WashService.builder()
                .name("Premium Detail").description("Full detail with hand wax and leather conditioning")
                .price(new BigDecimal("49.99")).durationMinutes(90).build()),
            saveIfAbsent(WashService.builder()
                .name("Deluxe Ceramic Coat").description("Professional ceramic coating with full prep")
                .price(new BigDecimal("79.99")).durationMinutes(120).build()),
            saveIfAbsent(WashService.builder()
                .name("Express Foam Wash").description("Fast foam wash with air dry")
                .price(new BigDecimal("12.99")).durationMinutes(20).build())
        );
    }

    private List<User> seedCustomers() {
        String pw = passwordEncoder.encode("Customer@123");
        return List.of(
            saveIfAbsent(User.builder().email("alice.martin@example.com").password(pw)
                .firstName("Alice").lastName("Martin").phone("+1-555-0101").role(Role.CUSTOMER).build()),
            saveIfAbsent(User.builder().email("bob.nguyen@example.com").password(pw)
                .firstName("Bob").lastName("Nguyen").phone("+1-555-0102").role(Role.CUSTOMER).build()),
            saveIfAbsent(User.builder().email("carol.smith@example.com").password(pw)
                .firstName("Carol").lastName("Smith").phone("+1-555-0103").role(Role.CUSTOMER).build())
        );
    }

    private List<User> seedEmployeeUsers() {
        String pw = passwordEncoder.encode("Employee@123");
        return List.of(
            saveIfAbsent(User.builder().email("john.doe@carwash.com").password(pw)
                .firstName("John").lastName("Doe").role(Role.EMPLOYEE).build()),
            saveIfAbsent(User.builder().email("sarah.wilson@carwash.com").password(pw)
                .firstName("Sarah").lastName("Wilson").role(Role.EMPLOYEE).build()),
            saveIfAbsent(User.builder().email("marcus.lee@carwash.com").password(pw)
                .firstName("Marcus").lastName("Lee").role(Role.EMPLOYEE).build()),
            saveIfAbsent(User.builder().email("diana.chen@carwash.com").password(pw)
                .firstName("Diana").lastName("Chen").role(Role.EMPLOYEE).build())
        );
    }

    private List<Employee> seedEmployeeRecords(List<User> empUsers) {
        return List.of(
            saveIfAbsent(Employee.builder().user(empUsers.get(0))
                .position(EmployeePosition.MANAGER).hireDate(LocalDate.of(2022, 1, 15)).build()),
            saveIfAbsent(Employee.builder().user(empUsers.get(1))
                .position(EmployeePosition.SUPERVISOR).hireDate(LocalDate.of(2022, 6, 1)).build()),
            saveIfAbsent(Employee.builder().user(empUsers.get(2))
                .position(EmployeePosition.WASHER).hireDate(LocalDate.of(2023, 3, 10)).build()),
            saveIfAbsent(Employee.builder().user(empUsers.get(3))
                .position(EmployeePosition.CASHIER).hireDate(LocalDate.of(2023, 7, 20)).build())
        );
    }

    private List<Vehicle> seedVehicles(List<User> customers) {
        User alice = customers.get(0);
        User bob   = customers.get(1);
        User carol = customers.get(2);
        return List.of(
            saveIfAbsent(Vehicle.builder().brand("Toyota").model("Camry")
                .licensePlate("ABC-1234").type(VehicleType.SEDAN).owner(alice).build()),
            saveIfAbsent(Vehicle.builder().brand("Honda").model("CR-V")
                .licensePlate("ABC-5678").type(VehicleType.SUV).owner(alice).build()),
            saveIfAbsent(Vehicle.builder().brand("Ford").model("F-150")
                .licensePlate("XYZ-9900").type(VehicleType.TRUCK).owner(bob).build()),
            saveIfAbsent(Vehicle.builder().brand("Chevrolet").model("Spark")
                .licensePlate("XYZ-1122").type(VehicleType.SEDAN).owner(bob).build()),
            saveIfAbsent(Vehicle.builder().brand("Harley-Davidson").model("Sportster")
                .licensePlate("MOT-7777").type(VehicleType.MOTORCYCLE).owner(carol).build()),
            saveIfAbsent(Vehicle.builder().brand("Chrysler").model("Pacifica")
                .licensePlate("VAN-3344").type(VehicleType.VAN).owner(carol).build())
        );
    }

    private List<Booking> seedBookings(List<User> customers, List<Vehicle> vehicles, List<WashService> services) {
        User alice = customers.get(0);
        User bob   = customers.get(1);
        User carol = customers.get(2);

        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime now   = LocalDateTime.now();

        // vehicles: 0=alice/Camry, 1=alice/CR-V, 2=bob/F-150, 3=bob/Spark, 4=carol/Sportster, 5=carol/Pacifica
        // services: 0=Basic($5.99/15m), 1=Vacuum($9.99/20m), 2=FullService($19.99/45m),
        //           3=Premium($49.99/90m), 4=Deluxe($79.99/120m), 5=Express($12.99/20m)

        List<Booking> bookings = new ArrayList<>();

        // [0] Today CONFIRMED — alice/Camry/Basic
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(alice).vehicle(vehicles.get(0)).washService(services.get(0))
            .status(BookingStatus.CONFIRMED)
            .appointmentDateTime(today.plusHours(9))
            .endDateTime(today.plusHours(9).plusMinutes(15))
            .totalPrice(new BigDecimal("5.99")).build()));

        // [1] Today PENDING — bob/F-150/FullService
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(bob).vehicle(vehicles.get(2)).washService(services.get(2))
            .status(BookingStatus.PENDING)
            .appointmentDateTime(today.plusHours(11))
            .endDateTime(today.plusHours(11).plusMinutes(45))
            .totalPrice(new BigDecimal("19.99")).build()));

        // [2] Today CONFIRMED — carol/Pacifica/Express
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(carol).vehicle(vehicles.get(5)).washService(services.get(5))
            .status(BookingStatus.CONFIRMED)
            .appointmentDateTime(today.plusHours(14))
            .endDateTime(today.plusHours(14).plusMinutes(20))
            .totalPrice(new BigDecimal("12.99")).build()));

        // [3] 6 days ago COMPLETED — alice/CR-V/Premium
        LocalDateTime appt3 = now.minusDays(6).withHour(10).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(alice).vehicle(vehicles.get(1)).washService(services.get(3))
            .status(BookingStatus.COMPLETED)
            .appointmentDateTime(appt3)
            .endDateTime(appt3.plusMinutes(90))
            .totalPrice(new BigDecimal("49.99")).build()));

        // [4] 5 days ago COMPLETED — bob/Spark/Vacuum
        LocalDateTime appt4 = now.minusDays(5).withHour(13).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(bob).vehicle(vehicles.get(3)).washService(services.get(1))
            .status(BookingStatus.COMPLETED)
            .appointmentDateTime(appt4)
            .endDateTime(appt4.plusMinutes(20))
            .totalPrice(new BigDecimal("9.99")).build()));

        // [5] 4 days ago COMPLETED — carol/Sportster/Basic
        LocalDateTime appt5 = now.minusDays(4).withHour(9).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(carol).vehicle(vehicles.get(4)).washService(services.get(0))
            .status(BookingStatus.COMPLETED)
            .appointmentDateTime(appt5)
            .endDateTime(appt5.plusMinutes(15))
            .totalPrice(new BigDecimal("5.99")).build()));

        // [6] 2 days ago COMPLETED — alice/Camry/FullService
        LocalDateTime appt6 = now.minusDays(2).withHour(15).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(alice).vehicle(vehicles.get(0)).washService(services.get(2))
            .status(BookingStatus.COMPLETED)
            .appointmentDateTime(appt6)
            .endDateTime(appt6.plusMinutes(45))
            .totalPrice(new BigDecimal("19.99")).build()));

        // [7] Yesterday COMPLETED — bob/F-150/Deluxe
        LocalDateTime appt7 = now.minusDays(1).withHour(8).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(bob).vehicle(vehicles.get(2)).washService(services.get(4))
            .status(BookingStatus.COMPLETED)
            .appointmentDateTime(appt7)
            .endDateTime(appt7.plusMinutes(120))
            .totalPrice(new BigDecimal("79.99")).build()));

        // [8] +2 days CONFIRMED — carol/Pacifica/Premium
        LocalDateTime appt8 = now.plusDays(2).withHour(10).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(carol).vehicle(vehicles.get(5)).washService(services.get(3))
            .status(BookingStatus.CONFIRMED)
            .appointmentDateTime(appt8)
            .endDateTime(appt8.plusMinutes(90))
            .totalPrice(new BigDecimal("49.99")).build()));

        // [9] +3 days PENDING — alice/CR-V/FullService
        LocalDateTime appt9 = now.plusDays(3).withHour(14).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(alice).vehicle(vehicles.get(1)).washService(services.get(2))
            .status(BookingStatus.PENDING)
            .appointmentDateTime(appt9)
            .endDateTime(appt9.plusMinutes(45))
            .totalPrice(new BigDecimal("19.99")).build()));

        // [10] +5 days PENDING — bob/Spark/Express
        LocalDateTime appt10 = now.plusDays(5).withHour(11).withMinute(0).withSecond(0).withNano(0);
        bookings.add(saveBookingIfAbsent(Booking.builder()
            .customer(bob).vehicle(vehicles.get(3)).washService(services.get(5))
            .status(BookingStatus.PENDING)
            .appointmentDateTime(appt10)
            .endDateTime(appt10.plusMinutes(20))
            .totalPrice(new BigDecimal("12.99")).build()));

        return bookings;
    }

    private void seedBookingAssignments(List<Booking> bookings, List<Employee> employees, User admin) {
        // employees: 0=john/MANAGER, 1=sarah/SUPERVISOR, 2=marcus/WASHER, 3=diana/CASHIER
        // Bookings 0,3,4,6 → marcus(2); Bookings 2,5,7,8 → sarah(1)
        int[][] pairs = {{0, 2}, {2, 1}, {3, 2}, {4, 2}, {5, 1}, {6, 2}, {7, 1}, {8, 1}};
        for (int[] pair : pairs) {
            Booking booking = bookings.get(pair[0]);
            if (booking == null) continue;
            saveAssignmentIfAbsent(BookingAssignment.builder()
                .booking(booking)
                .employee(employees.get(pair[1]))
                .assignedBy(admin)
                .build());
        }
    }

    private void seedPayments(List<Booking> bookings) {
        // COMPLETED bookings (indices 3-7) → CONFIRMED cash payments
        for (int idx : new int[]{3, 4, 5, 6, 7}) {
            Booking booking = bookings.get(idx);
            if (booking == null) continue;
            savePaymentIfAbsent(Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .method(PaymentMethod.CASH)
                .status(PaymentStatus.CONFIRMED)
                .paidAt(booking.getEndDateTime())
                .build());
        }
        // CONFIRMED bookings (indices 0, 2, 8) → PENDING card payments
        for (int idx : new int[]{0, 2, 8}) {
            Booking booking = bookings.get(idx);
            if (booking == null) continue;
            savePaymentIfAbsent(Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .method(PaymentMethod.CARD)
                .build());
        }
    }

    // --- idempotent save helpers ---

    private WashService saveIfAbsent(WashService ws) {
        if (washServiceRepository.existsByName(ws.getName())) {
            return washServiceRepository.findByName(ws.getName()).orElseThrow();
        }
        return washServiceRepository.save(ws);
    }

    private User saveIfAbsent(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return userRepository.findByEmail(user.getEmail()).orElseThrow();
        }
        return userRepository.save(user);
    }

    private Employee saveIfAbsent(Employee emp) {
        if (employeeRepository.existsByUserId(emp.getUser().getId())) {
            return employeeRepository.findByUserId(emp.getUser().getId()).orElseThrow();
        }
        return employeeRepository.save(emp);
    }

    private Vehicle saveIfAbsent(Vehicle v) {
        if (vehicleRepository.existsByLicensePlate(v.getLicensePlate())) {
            return vehicleRepository.findByLicensePlate(v.getLicensePlate()).orElseThrow();
        }
        return vehicleRepository.save(v);
    }

    private Booking saveBookingIfAbsent(Booking b) {
        if (bookingRepository.existsByVehicleIdAndAppointmentDateTimeAndStatusIn(
                b.getVehicle().getId(),
                b.getAppointmentDateTime(),
                Arrays.asList(BookingStatus.values()))) {
            return null;
        }
        return bookingRepository.save(b);
    }

    private void saveAssignmentIfAbsent(BookingAssignment ba) {
        if (!bookingAssignmentRepository.existsByBookingIdAndEmployeeId(
                ba.getBooking().getId(), ba.getEmployee().getId())) {
            bookingAssignmentRepository.save(ba);
        }
    }

    private void savePaymentIfAbsent(Payment p) {
        if (!paymentRepository.existsByBookingId(p.getBooking().getId())) {
            paymentRepository.save(p);
        }
    }
}
