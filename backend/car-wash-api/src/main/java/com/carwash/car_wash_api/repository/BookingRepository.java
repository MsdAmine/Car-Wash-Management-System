package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.enums.BookingStatus;
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
}
