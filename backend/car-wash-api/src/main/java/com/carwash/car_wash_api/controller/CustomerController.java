package com.carwash.car_wash_api.controller;

import com.carwash.car_wash_api.dto.response.UserProfileResponse;
import com.carwash.car_wash_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAllCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }
}
