package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.UserProfileResponse;
import com.carwash.car_wash_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}