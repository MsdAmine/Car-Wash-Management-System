package com.carwash.car_wash_api.dto.request;

import com.carwash.car_wash_api.model.enums.EmployeePosition;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmployeeRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Position is required")
    private EmployeePosition position;

    @NotNull(message = "Hire date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;
}
