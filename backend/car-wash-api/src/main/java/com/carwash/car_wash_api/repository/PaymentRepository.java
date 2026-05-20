package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Payment;
import com.carwash.car_wash_api.model.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByBookingId(UUID bookingId);

    boolean existsByBookingId(UUID bookingId);

    List<Payment> findByBooking_Customer_Id(Long customerId);

    // #326 / #327 — sum confirmed revenue within a time range
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status AND p.paidAt >= :start AND p.paidAt < :end")
    BigDecimal sumRevenueByStatusAndPaidAtBetween(
            @Param("status") PaymentStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.paidAt >= :start AND p.paidAt < :end")
    List<Payment> findConfirmedInRange(
            @Param("status") PaymentStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
