package com.carwash.car_wash_api.config;

import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.firstName}")
    private String adminFirstName;

    @Value("${app.admin.lastName}")
    private String adminLastName;

    private static final String DEFAULT_ADMIN_EMAIL = "admin@carwash.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail.equals(DEFAULT_ADMIN_EMAIL) || adminPassword.equals(DEFAULT_ADMIN_PASSWORD)) {
            log.warn("*** SECURITY WARNING: Default admin credentials are in use. " +
                     "Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before deploying to production. ***");
        }

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin account already exists for '{}'. Skipping seed.", adminEmail);
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .firstName(adminFirstName)
                .lastName(adminLastName)
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);
        log.info("Default admin account created for '{}'.", adminEmail);
    }
}
