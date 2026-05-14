package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.BookingRequest;
import com.carwash.car_wash_api.dto.request.UpdateBookingStatusRequest;
import com.carwash.car_wash_api.dto.response.BookingResponse;
import com.carwash.car_wash_api.exception.AccessDeniedException;
import com.carwash.car_wash_api.exception.InvalidBookingException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.BookingMapper;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.entity.Vehicle;
import com.carwash.car_wash_api.model.entity.WashService;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import com.carwash.car_wash_api.repository.VehicleRepository;
import com.carwash.car_wash_api.repository.WashServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Set<BookingStatus> EMPLOYEE_ALLOWED_STATUSES =
            Set.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final WashServiceRepository washServiceRepository;
    private final EmployeeRepository employeeRepository;
    private final BookingAssignmentRepository bookingAssignmentRepository;
    private final BookingMapper bookingMapper;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User customer = resolveCurrentUser();

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        validateVehicleOwnership(vehicle, customer);

        WashService washService = washServiceRepository.findById(request.getWashServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Wash service not found with ID: " + request.getWashServiceId()));

        validateActiveWashService(washService);

        validateAppointmentDateTime(request.getAppointmentDateTime());

        // #220 — calculate end time from service duration
        LocalDateTime endDateTime = request.getAppointmentDateTime()
                .plusMinutes(washService.getDurationMinutes());

        validateNoConflictingBooking(vehicle, request.getAppointmentDateTime(), endDateTime);

        // #221 — snapshot the service price as the booking total
        BigDecimal totalPrice = washService.getPrice();

        Booking booking = Booking.builder()
                .customer(customer)
                .vehicle(vehicle)
                .washService(washService)
                .appointmentDateTime(request.getAppointmentDateTime())
                .endDateTime(endDateTime)
                .totalPrice(totalPrice)
                .notes(request.getNotes())
                .build();

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    // #223 — return all bookings for the authenticated customer
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        User customer = resolveCurrentUser();
        return bookingRepository.findByCustomerId(customer.getId())
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    // #224 — return a single booking; customers can only access their own
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID id) {
        Booking booking = findBookingOrThrow(id);
        User currentUser = resolveCurrentUser();
        if (!isAdmin(currentUser) && !booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view this booking");
        }
        return bookingMapper.toResponse(booking);
    }

    // #225 — return all bookings whose appointment falls on today (admin / employee)
    @Transactional(readOnly = true)
    public List<BookingResponse> getTodaysBookings() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        return bookingRepository.findTodaysBookings(startOfDay, endOfDay)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    // #226 — return every booking in the system (admin only)
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    // #227, #298, #299 — update booking status (admin / employee); employees restricted to assigned bookings and allowed statuses
    @Transactional
    public BookingResponse updateBookingStatus(UUID id, UpdateBookingStatusRequest request) {
        Booking booking = findBookingOrThrow(id);
        User currentUser = resolveCurrentUser();

        if (currentUser.getRole() == Role.EMPLOYEE) {
            Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new AccessDeniedException(
                            "No employee profile found for the current user"));

            if (!bookingAssignmentRepository.existsByBookingIdAndEmployeeId(booking.getId(), employee.getId())) {
                throw new AccessDeniedException(
                        "You can only update the status of bookings you are assigned to");
            }

            if (!EMPLOYEE_ALLOWED_STATUSES.contains(request.getStatus())) {
                throw new InvalidBookingException(
                        "Employees can only set booking status to CONFIRMED or COMPLETED");
            }
        }

        booking.setStatus(request.getStatus());
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    // #228 — allow a customer to cancel their own PENDING booking
    @Transactional
    public BookingResponse cancelBooking(UUID id) {
        Booking booking = findBookingOrThrow(id);
        User currentUser = resolveCurrentUser();
        if (!booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to cancel this booking");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingException(
                    "Only PENDING bookings can be cancelled; current status is " + booking.getStatus());
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    // #217 — validate the vehicle belongs to the authenticated customer
    private void validateVehicleOwnership(Vehicle vehicle, User customer) {
        if (!vehicle.getOwner().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You do not have permission to book with this vehicle");
        }
    }

    // #218 — validate the requested wash service is currently active
    private void validateActiveWashService(WashService washService) {
        if (!Boolean.TRUE.equals(washService.getActive())) {
            throw new InvalidBookingException(
                    "Wash service '" + washService.getName() + "' is not available for booking");
        }
    }

    // #219 — validate the appointment is at least 30 minutes in the future and within 90 days
    private void validateAppointmentDateTime(LocalDateTime appointmentDateTime) {
        LocalDateTime now = LocalDateTime.now();
        if (!appointmentDateTime.isAfter(now.plusMinutes(30))) {
            throw new InvalidBookingException(
                    "Appointment must be scheduled at least 30 minutes from now");
        }
        if (appointmentDateTime.isAfter(now.plusDays(90))) {
            throw new InvalidBookingException(
                    "Appointment cannot be scheduled more than 90 days in advance");
        }
    }

    // #220 — detect time-range overlaps instead of exact-time matches
    private void validateNoConflictingBooking(Vehicle vehicle, LocalDateTime appointmentDateTime, LocalDateTime endDateTime) {
        boolean conflict = bookingRepository.existsOverlappingBooking(
                vehicle.getId(),
                appointmentDateTime,
                endDateTime,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );
        if (conflict) {
            throw new InvalidBookingException(
                    "This vehicle already has a booking that overlaps the requested time slot");
        }
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private Booking findBookingOrThrow(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }
}
