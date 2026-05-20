package com.carwash.car_wash_api.config;

import com.carwash.car_wash_api.model.entity.BusinessSettings;
import com.carwash.car_wash_api.model.entity.OperatingHours;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.BusinessSettingsRepository;
import com.carwash.car_wash_api.repository.OperatingHoursRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.List;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final BusinessSettingsRepository businessSettingsRepository;
    private final OperatingHoursRepository operatingHoursRepository;

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

        seedAdminIfAbsent();
        seedBusinessSettingsIfAbsent();
        seedOperatingHoursIfAbsent();
    }

    private void seedAdminIfAbsent() {
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

    private void seedBusinessSettingsIfAbsent() {
        if (businessSettingsRepository.count() > 0) {
            return;
        }

        businessSettingsRepository.save(BusinessSettings.builder()
                .businessName("WashFlow")
                .phone("")
                .address("")
                .city("")
                .cancellationHours(24)
                .build());

        log.info("Default business settings created.");
    }

    private void seedOperatingHoursIfAbsent() {
        if (operatingHoursRepository.count() > 0) {
            return;
        }

        LocalTime weekdayOpen  = LocalTime.of(8, 0);
        LocalTime weekdayClose = LocalTime.of(18, 0);
        LocalTime satOpen      = LocalTime.of(9, 0);
        LocalTime satClose     = LocalTime.of(17, 0);

        List<OperatingHours> days = List.of(
                OperatingHours.builder().dayOfWeek("MONDAY")    .openTime(weekdayOpen).closeTime(weekdayClose).open(true).build(),
                OperatingHours.builder().dayOfWeek("TUESDAY")   .openTime(weekdayOpen).closeTime(weekdayClose).open(true).build(),
                OperatingHours.builder().dayOfWeek("WEDNESDAY") .openTime(weekdayOpen).closeTime(weekdayClose).open(true).build(),
                OperatingHours.builder().dayOfWeek("THURSDAY")  .openTime(weekdayOpen).closeTime(weekdayClose).open(true).build(),
                OperatingHours.builder().dayOfWeek("FRIDAY")    .openTime(weekdayOpen).closeTime(weekdayClose).open(true).build(),
                OperatingHours.builder().dayOfWeek("SATURDAY")  .openTime(satOpen)    .closeTime(satClose)    .open(true).build(),
                OperatingHours.builder().dayOfWeek("SUNDAY")    .openTime(weekdayOpen).closeTime(weekdayClose).open(false).build()
        );

        operatingHoursRepository.saveAll(days);
        log.info("Default operating hours created for 7 days.");
    }
}
