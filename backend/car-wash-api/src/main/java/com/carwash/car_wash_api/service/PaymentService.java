package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.PaymentRequest;
import com.carwash.car_wash_api.dto.request.UpdatePaymentStatusRequest;
import com.carwash.car_wash_api.dto.response.PaymentResponse;
import com.carwash.car_wash_api.exception.AccessDeniedException;
import com.carwash.car_wash_api.exception.DuplicateResourceException;
import com.carwash.car_wash_api.exception.InvalidPaymentException;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.mapper.PaymentMapper;
import com.carwash.car_wash_api.model.entity.Booking;
import com.carwash.car_wash_api.model.entity.Payment;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.PaymentStatus;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.BookingRepository;
import com.carwash.car_wash_api.repository.PaymentRepository;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentMapper paymentMapper;

    // #252 — create a payment record linked to a booking
    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        // #254 — validate booking exists before creating payment
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with ID: " + request.getBookingId()));

        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new DuplicateResourceException(
                    "A payment record already exists for booking ID: " + booking.getId());
        }

        // #255 — validate payment amount matches the booking total price
        if (request.getAmount().compareTo(booking.getTotalPrice()) != 0) {
            throw new InvalidPaymentException(
                    "Payment amount " + request.getAmount()
                            + " does not match the booking total price " + booking.getTotalPrice());
        }

        // #253 — link payment to booking
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .method(request.getMethod())
                .notes(request.getNotes())
                .build();

        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    // #256 — get payment for a specific booking; customers can only access their own
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        User currentUser = resolveCurrentUser();
        if (!isAdmin(currentUser) && !booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to view payment for this booking");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No payment found for booking ID: " + bookingId));

        return paymentMapper.toResponse(payment);
    }

    // #257 — return all payments in the system (admin only)
    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // #258 — return the authenticated customer's payment history
    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPaymentHistory() {
        User customer = resolveCurrentUser();
        return paymentRepository.findByBooking_Customer_Id(customer.getId())
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
    }

    // #259 — manually confirm a payment (sets status to CONFIRMED and records paidAt timestamp)
    @Transactional
    public PaymentResponse confirmPayment(UUID id) {
        Payment payment = findPaymentOrThrow(id);
        if (payment.getStatus() == PaymentStatus.CONFIRMED) {
            throw new InvalidPaymentException("Payment is already confirmed");
        }
        payment.setStatus(PaymentStatus.CONFIRMED);
        payment.setPaidAt(LocalDateTime.now());
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    // #260 — update payment status to any value (admin only)
    @Transactional
    public PaymentResponse updatePaymentStatus(UUID id, UpdatePaymentStatusRequest request) {
        Payment payment = findPaymentOrThrow(id);
        payment.setStatus(request.getStatus());
        if (request.getStatus() == PaymentStatus.CONFIRMED && payment.getPaidAt() == null) {
            payment.setPaidAt(LocalDateTime.now());
        }
        return paymentMapper.toResponse(paymentRepository.save(payment));
    }

    private Payment findPaymentOrThrow(UUID id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + id));
    }

    private User resolveCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }
}
