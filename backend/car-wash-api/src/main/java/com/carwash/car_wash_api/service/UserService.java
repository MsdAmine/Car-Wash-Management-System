package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.request.ChangePasswordRequest;
import com.carwash.car_wash_api.dto.request.NotificationPreferencesRequest;
import com.carwash.car_wash_api.dto.request.UpdateProfileRequest;
import com.carwash.car_wash_api.dto.response.NotificationPreferencesResponse;
import com.carwash.car_wash_api.dto.response.UserProfileResponse;
import com.carwash.car_wash_api.exception.ResourceNotFoundException;
import com.carwash.car_wash_api.model.entity.User;
import com.carwash.car_wash_api.model.enums.Role;
import com.carwash.car_wash_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getCurrentUserProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return toResponse(currentUser);
    }

    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount() {
        User user = currentUser();
        user.setEnabled(false);
        userRepository.save(user);
    }

    public NotificationPreferencesResponse getNotificationPreferences() {
        return toNotifications(currentUser());
    }

    @Transactional
    public NotificationPreferencesResponse updateNotificationPreferences(NotificationPreferencesRequest request) {
        User user = currentUser();
        user.setNotifBookingConfirmed(request.isBookingConfirmed());
        user.setNotifWashInProgress(request.isWashInProgress());
        user.setNotifWashCompleted(request.isWashCompleted());
        user.setNotifBookingReminders(request.isBookingReminders());
        user.setNotifPromotions(request.isPromotions());
        return toNotifications(userRepository.save(user));
    }

    @Transactional
    public UserProfileResponse uploadAvatar(String avatarDataUrl) {
        User user = currentUser();
        user.setAvatarUrl(avatarDataUrl);
        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllCustomers() {
        return userRepository.findAllByRole(Role.CUSTOMER)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserProfileResponse toResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    private NotificationPreferencesResponse toNotifications(User user) {
        return NotificationPreferencesResponse.builder()
                .bookingConfirmed(!Boolean.FALSE.equals(user.getNotifBookingConfirmed()))
                .washInProgress(!Boolean.FALSE.equals(user.getNotifWashInProgress()))
                .washCompleted(!Boolean.FALSE.equals(user.getNotifWashCompleted()))
                .bookingReminders(!Boolean.FALSE.equals(user.getNotifBookingReminders()))
                .promotions(Boolean.TRUE.equals(user.getNotifPromotions()))
                .build();
    }
}
