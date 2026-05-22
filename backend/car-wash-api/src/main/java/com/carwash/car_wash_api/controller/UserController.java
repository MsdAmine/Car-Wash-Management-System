package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.ChangePasswordRequest;
import com.carwash.car_wash_api.dto.request.NotificationPreferencesRequest;
import com.carwash.car_wash_api.dto.request.UpdateProfileRequest;
import com.carwash.car_wash_api.dto.request.UploadAvatarRequest;
import com.carwash.car_wash_api.dto.response.NotificationPreferencesResponse;
import com.carwash.car_wash_api.dto.response.UserProfileResponse;
import com.carwash.car_wash_api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount() {
        userService.deleteAccount();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notifications")
    public ResponseEntity<NotificationPreferencesResponse> getNotifications() {
        return ResponseEntity.ok(userService.getNotificationPreferences());
    }

    @PutMapping("/notifications")
    public ResponseEntity<NotificationPreferencesResponse> updateNotifications(
            @RequestBody NotificationPreferencesRequest request) {
        return ResponseEntity.ok(userService.updateNotificationPreferences(request));
    }

    @PatchMapping("/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(@Valid @RequestBody UploadAvatarRequest request) {
        return ResponseEntity.ok(userService.uploadAvatar(request.getAvatarDataUrl()));
    }
}
