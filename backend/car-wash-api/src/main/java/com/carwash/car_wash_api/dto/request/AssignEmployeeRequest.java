package com.carwash.car_wash_api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignEmployeeRequest {

    @NotNull(message = "Employee ID is required")
    private UUID employeeId;
}
