package com.carwash.car_wash_api.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    // Accessible by anyone with a valid token (Customer or Admin)
    @GetMapping("/secret")
    public String getSecretMessage() {
        return "If you can see this, you are authenticated!";
    }

    // Accessible ONLY by users with the ADMIN role
    @GetMapping("/admin-only")
    public String getAdminMessage() {
        return "Welcome, Admin! You have access to this restricted area.";
    }
}