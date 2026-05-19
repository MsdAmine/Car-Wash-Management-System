package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.AssignEmployeeRequest;
import com.carwash.car_wash_api.dto.response.BookingAssignmentResponse;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.InvalidEmployeeOperationException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.BookingAssignment;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingAssignmentService {

    private final BookingAssignmentRepository assignmentRepository;
    private final BookingRepository bookingRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingAssignmentResponse assignEmployee(UUID bookingId, AssignEmployeeRequest request) {
        Booking booking = findBookingOrThrow(bookingId);

        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidEmployeeOperationException(
                    "Cannot assign an employee to a " + booking.getStatus() + " booking");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with ID: " + request.getEmployeeId()));

        if (!employee.isActive()) {
            throw new InvalidEmployeeOperationException(
                    "Cannot assign an employee with status " + employee.getStatus() + " to a booking");
        }

        if (assignmentRepository.existsByBookingIdAndEmployeeId(bookingId, employee.getId())) {
            throw new DuplicateResourceException(
                    "Employee is already assigned to this booking");
        }

        User assignedBy = resolveCurrentUser();

        BookingAssignment assignment = BookingAssignment.builder()
                .booking(booking)
                .employee(employee)
                .assignedBy(assignedBy)
                .build();

        return toResponse(assignmentRepository.save(assignment));
    }

    @Transactional
    public void removeEmployee(UUID bookingId, UUID employeeId) {
        findBookingOrThrow(bookingId);

        BookingAssignment assignment = assignmentRepository
                .findByBookingIdAndEmployeeId(bookingId, employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No assignment found for employee ID " + employeeId + " on booking ID " + bookingId));

        assignmentRepository.delete(assignment);
    }

    @Transactional(readOnly = true)
    public List<BookingAssignmentResponse> getAssignmentsForBooking(UUID bookingId) {
        findBookingOrThrow(bookingId);
        return assignmentRepository.findByBookingId(bookingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingAssignmentResponse> getAssignedBookingsForEmployee(UUID employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with ID: " + employeeId);
        }
        return assignmentRepository.findByEmployeeId(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingAssignmentResponse> getMyTodaysAssignedBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee profile found for the current user"));

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        return assignmentRepository
                .findTodaysAssignmentsByEmployeeId(employee.getId(), startOfDay, endOfDay)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public boolean isEmployeeAssignedToBooking(UUID bookingId, UUID employeeId) {
        return assignmentRepository.existsByBookingIdAndEmployeeId(bookingId, employeeId);
    }

    private Booking findBookingOrThrow(UUID bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private BookingAssignmentResponse toResponse(BookingAssignment assignment) {
        Employee emp = assignment.getEmployee();
        User assignedBy = assignment.getAssignedBy();
        return BookingAssignmentResponse.builder()
                .id(assignment.getId())
                .bookingId(assignment.getBooking().getId())
                .employeeId(emp.getId())
                .employeeFirstName(emp.getUser() != null ? emp.getUser().getFirstName() : null)
                .employeeLastName(emp.getUser() != null ? emp.getUser().getLastName() : null)
                .employeePosition(emp.getPosition())
                .assignedByUserId(assignedBy != null ? assignedBy.getId() : null)
                .assignedByEmail(assignedBy != null ? assignedBy.getEmail() : null)
                .assignedAt(assignment.getAssignedAt())
                .build();
    }
}
