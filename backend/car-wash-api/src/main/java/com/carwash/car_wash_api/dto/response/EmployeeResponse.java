package com.carwash.car_wash_api.dto.response;

import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private UUID id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private EmployeePosition position;
    private LocalDate hireDate;
    private EmployeeStatus status;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
