package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.RegisterRequest;
import com.carwash.car_wash_api.dto.response.AuthResponse;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    @Test
    void register_employeeCreatesPendingWasherProfileWithHireDate() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("washer@example.com");
        request.setPassword("secret123");
        request.setFirstName("Will");
        request.setLastName("Washer");
        request.setPhone("555-0100");
        request.setRole("WASHER");

        User savedUser = User.builder()
                .id(13L)
                .email(request.getEmail())
                .password("encoded-password")
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.EMPLOYEE)
                .enabled(true)
                .build();

        LocalDate registrationDate = LocalDate.now();

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<Employee> employeeCaptor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(employeeCaptor.capture());

        Employee employee = employeeCaptor.getValue();
        assertThat(employee.getUser()).isEqualTo(savedUser);
        assertThat(employee.getPosition()).isEqualTo(EmployeePosition.WASHER);
        assertThat(employee.getStatus()).isEqualTo(EmployeeStatus.PENDING);
        assertThat(employee.getHireDate()).isEqualTo(registrationDate);
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getRole()).isEqualTo(Role.EMPLOYEE);
    }
}
