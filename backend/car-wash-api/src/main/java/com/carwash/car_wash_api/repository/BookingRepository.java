package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.enums.BookingStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByCustomerId(Long customerId);

    @Query("SELECT b FROM Booking b WHERE b.appointmentDateTime >= :startOfDay AND b.appointmentDateTime < :endOfDay ORDER BY b.appointmentDateTime ASC")
    List<Booking> findTodaysBookings(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    List<Booking> findByVehicleId(UUID vehicleId);

    List<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus status);

    boolean existsByVehicleIdAndAppointmentDateTimeAndStatusIn(
            UUID vehicleId,
            LocalDateTime appointmentDateTime,
            Collection<BookingStatus> statuses
    );

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.vehicle.id = :vehicleId " +
           "AND b.status IN :statuses " +
           "AND b.appointmentDateTime < :endDateTime " +
           "AND b.endDateTime > :appointmentDateTime")
    boolean existsOverlappingBooking(
            @Param("vehicleId") UUID vehicleId,
            @Param("appointmentDateTime") LocalDateTime appointmentDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("statuses") Collection<BookingStatus> statuses
    );

    // #322 — total bookings by status
    long countByStatus(BookingStatus status);

    // #323 — today's booking count
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.appointmentDateTime >= :startOfDay AND b.appointmentDateTime < :endOfDay")
    long countTodaysBookings(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    // #329 — customer upcoming bookings (PENDING or CONFIRMED, appointment in the future)
    long countByCustomerIdAndStatusInAndAppointmentDateTimeAfter(
            Long customerId,
            Collection<BookingStatus> statuses,
            LocalDateTime after
    );

    // #330 — customer previous completed bookings
    long countByCustomerIdAndStatus(Long customerId, BookingStatus status);

    // #328 — most requested services: returns [serviceName, count] pairs ordered by count desc
    @Query("SELECT b.washService.name, COUNT(b) FROM Booking b GROUP BY b.washService.name ORDER BY COUNT(b) DESC")
    List<Object[]> findTopRequestedServices(Pageable pageable);
}
