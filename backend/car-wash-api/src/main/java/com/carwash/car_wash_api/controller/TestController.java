package com.carwash.car_wash_api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/secret")
    public String getSecretMessage() {
        return "If you can see this, your JWT token is working!";
    }
}