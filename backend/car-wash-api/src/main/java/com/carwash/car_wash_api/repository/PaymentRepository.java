package com.carwash.car_wash_api.repository;

import com.carwash.car_wash_api.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByBookingId(UUID bookingId);

    boolean existsByBookingId(UUID bookingId);

    List<Payment> findByBooking_Customer_Id(Long customerId);
}
