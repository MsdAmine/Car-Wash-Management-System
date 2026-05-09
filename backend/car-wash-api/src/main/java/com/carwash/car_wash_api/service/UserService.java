package com.carwash.car_wash_api.service;

import com.carwash.car_wash_api.dto.response.UserProfileResponse;
import com.carwash.car_wash_api.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    public UserProfileResponse getCurrentUserProfile() {
        // Retrieve the authenticated User object from the SecurityContext
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return UserProfileResponse.builder()
                .id(currentUser.getId())
                .email(currentUser.getEmail())
                .firstName(currentUser.getFirstName())
                .lastName(currentUser.getLastName())
                .phone(currentUser.getPhone())
                .role(currentUser.getRole())
                .build();
    }
}