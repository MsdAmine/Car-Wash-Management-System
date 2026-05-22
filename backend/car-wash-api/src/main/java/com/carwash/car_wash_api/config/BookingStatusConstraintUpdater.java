package com.carwash.car_wash_api.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class BookingStatusConstraintUpdater implements ApplicationRunner {

    static final String CONSTRAINT_NAME = "bookings_status_check";

    private static final String FIND_CONSTRAINT_SQL = """
            SELECT pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE t.relname = 'bookings'
              AND n.nspname = current_schema()
              AND c.conname = 'bookings_status_check'
            """;

    private static final String DROP_CONSTRAINT_SQL =
            "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS " + CONSTRAINT_NAME;

    private static final String CREATE_CONSTRAINT_SQL = """
            ALTER TABLE bookings
            ADD CONSTRAINT bookings_status_check
            CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
            """;

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        List<String> definitions = jdbcTemplate.queryForList(FIND_CONSTRAINT_SQL, String.class);
        if (definitions.isEmpty()) {
            return;
        }

        String definition = definitions.get(0);
        if (definition != null && definition.contains("'IN_PROGRESS'")) {
            return;
        }

        log.info("Updating {} to include IN_PROGRESS", CONSTRAINT_NAME);
        jdbcTemplate.execute(DROP_CONSTRAINT_SQL);
        jdbcTemplate.execute(CREATE_CONSTRAINT_SQL);
    }
}
