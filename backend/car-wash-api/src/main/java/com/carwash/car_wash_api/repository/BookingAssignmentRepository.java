package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.BookingAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookingAssignmentRepository extends JpaRepository<BookingAssignment, UUID> {

    List<BookingAssignment> findByBookingId(UUID bookingId);

    List<BookingAssignment> findByEmployeeId(UUID employeeId);

    boolean existsByBookingIdAndEmployeeId(UUID bookingId, UUID employeeId);

    Optional<BookingAssignment> findByBookingIdAndEmployeeId(UUID bookingId, UUID employeeId);

    @Query("""
            SELECT ba FROM BookingAssignment ba
            JOIN FETCH ba.booking b
            WHERE ba.employee.id = :employeeId
              AND b.appointmentDateTime >= :startOfDay
              AND b.appointmentDateTime < :endOfDay
            """)
    List<BookingAssignment> findTodaysAssignmentsByEmployeeId(
            @Param("employeeId") UUID employeeId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    // #332 — total assignments for an employee
    long countByEmployeeId(UUID employeeId);

    // #333 — assignments where the booking is currently in progress
    @Query("SELECT COUNT(ba) FROM BookingAssignment ba WHERE ba.employee.id = :employeeId AND ba.booking.status = com.carwash.car_wash_api.model.enums.BookingStatus.IN_PROGRESS")
    long countInProgressByEmployeeId(@Param("employeeId") UUID employeeId);
}
