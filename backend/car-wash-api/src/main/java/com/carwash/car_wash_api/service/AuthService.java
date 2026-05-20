package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.LoginRequest; // You'll create this next
import com.carwash.car_wash_api.dto.request.RegisterRequest;
import com.carwash.car_wash_api.dto.response.AuthResponse;
import com.carwash.car_wash_api.model.entity.Employee;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.EmployeeRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // New dependency
    private final AuthenticationManager authenticationManager; // New dependency

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Role role = resolveRegistrationRole(request.getRole());

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(role)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        if (role == Role.EMPLOYEE) {
            Employee employee = Employee.builder()
                    .user(user)
                    .position(EmployeePosition.WASHER)
                    .hireDate(LocalDate.now())
                    .status(EmployeeStatus.PENDING)
                    .build();
            employeeRepository.save(employee);
        }

        // Generate token even for registration so they are logged in immediately
        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // This triggers the authentication process using the configured
        // AuthenticationProvider
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // If authentication fails, an exception is thrown. If it succeeds, find the
        // user.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    private Role resolveRegistrationRole(String role) {
        if (role == null || role.isBlank()) {
            return Role.CUSTOMER;
        }

        return switch (role.trim().toUpperCase()) {
            case "CUSTOMER", "CLIENT" -> Role.CUSTOMER;
            case "EMPLOYEE", "WASHER", "CAR_WASHER" -> Role.EMPLOYEE;
            case "ADMIN" -> throw new IllegalArgumentException("Admin accounts cannot be self-registered");
            default -> throw new IllegalArgumentException("Unsupported registration role: " + role);
        };
    }
}
