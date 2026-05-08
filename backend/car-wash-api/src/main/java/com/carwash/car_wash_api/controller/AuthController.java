package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.request.RegisterRequest;
import com.carwash.car_wash_api.dto.response.AuthResponse;
import com.carwash.car_wash_api.dto.response.ApiResponse;
import com.carwash.car_wash_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);

        // Use the static helper method instead of the 'new' keyword
        return new ResponseEntity<>(
                ApiResponse.success(response, "User registered successfully"),
                HttpStatus.CREATED);
    }
}