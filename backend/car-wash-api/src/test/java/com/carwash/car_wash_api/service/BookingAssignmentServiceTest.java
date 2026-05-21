package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.AssignEmployeeRequest;
import com.carwash.car_wash_api.dto.response.BookingAssignmentResponse;
import com.carwash.car_wash_api.mapper.BookingMapper;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.BookingAssignment;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.BookingAssignmentRepository;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingAssignmentServiceTest {

    @Mock private BookingAssignmentRepository assignmentRepository;
    @Mock private BookingRepository bookingRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private UserRepository userRepository;

    private BookingAssignmentService service;

    @BeforeEach
    void setUp() {
        service = new BookingAssignmentService(
                assignmentRepository,
                bookingRepository,
                employeeRepository,
                userRepository,
                new BookingMapper());
        SecurityContextHolder.getContext().setAuthentication(
                new TestingAuthenticationToken("admin@example.com", null));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void assignEmployee_whenBookingIsPending_confirmsBookingAndCreatesAssignment() {
        UUID bookingId = UUID.randomUUID();
        UUID employeeId = UUID.randomUUID();
        Booking booking = Booking.builder()
                .id(bookingId)
                .status(BookingStatus.PENDING)
                .build();
        User washerUser = User.builder()
                .id(2L)
                .email("washer@example.com")
                .firstName("Jane")
                .lastName("Washer")
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();
        Employee employee = Employee.builder()
                .id(employeeId)
                .user(washerUser)
                .position(EmployeePosition.WASHER)
                .status(EmployeeStatus.ACTIVE)
                .build();
        User admin = User.builder()
                .id(1L)
                .email("admin@example.com")
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(employee));
        when(assignmentRepository.findByBookingId(bookingId)).thenReturn(List.of());
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));
        when(assignmentRepository.save(any(BookingAssignment.class))).thenAnswer(invocation -> {
            BookingAssignment assignment = invocation.getArgument(0);
            assignment.setId(UUID.randomUUID());
            assignment.setAssignedAt(LocalDateTime.now());
            return assignment;
        });

        BookingAssignmentResponse response = service.assignEmployee(
                bookingId,
                AssignEmployeeRequest.builder().employeeId(employeeId).build());

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(response.getBookingId()).isEqualTo(bookingId);
        assertThat(response.getEmployeeId()).isEqualTo(employeeId);
        assertThat(response.getEmployeeFirstName()).isEqualTo("Jane");
        verify(bookingRepository).save(booking);

        ArgumentCaptor<BookingAssignment> assignmentCaptor = ArgumentCaptor.forClass(BookingAssignment.class);
        verify(assignmentRepository).save(assignmentCaptor.capture());
        assertThat(assignmentCaptor.getValue().getBooking()).isSameAs(booking);
        assertThat(assignmentCaptor.getValue().getEmployee()).isSameAs(employee);
        assertThat(assignmentCaptor.getValue().getAssignedBy()).isSameAs(admin);
    }
}
