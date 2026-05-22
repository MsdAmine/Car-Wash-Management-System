package com.carwash.car_wash_api.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingStatusConstraintUpdaterTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private BookingStatusConstraintUpdater updater;

    @BeforeEach
    void setUp() {
        updater = new BookingStatusConstraintUpdater(jdbcTemplate);
    }

    @Test
    void run_whenConstraintDoesNotIncludeInProgress_updatesConstraint() {
        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(List.of("CHECK ((status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')))"));

        updater.run(null);

        InOrder inOrder = inOrder(jdbcTemplate);
        inOrder.verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
        inOrder.verify(jdbcTemplate)
                .execute("ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check");
        inOrder.verify(jdbcTemplate).execute("""
                ALTER TABLE bookings
                ADD CONSTRAINT bookings_status_check
                CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'))
                """);
    }

    @Test
    void run_whenConstraintAlreadyIncludesInProgress_doesNothing() {
        when(jdbcTemplate.queryForList(anyString(), eq(String.class)))
                .thenReturn(List.of("CHECK ((status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')))"));

        updater.run(null);

        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
        verifyNoMoreInteractions(jdbcTemplate);
    }

    @Test
    void run_whenConstraintIsMissing_doesNothing() {
        when(jdbcTemplate.queryForList(anyString(), eq(String.class))).thenReturn(List.of());

        updater.run(null);

        verify(jdbcTemplate).queryForList(anyString(), eq(String.class));
        verifyNoMoreInteractions(jdbcTemplate);
    }
}
