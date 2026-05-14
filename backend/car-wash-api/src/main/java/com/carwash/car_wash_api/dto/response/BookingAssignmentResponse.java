package com.carwash.car_wash_api.dto.response;

import com.carwash.car_wash_api.model.enums.EmployeePosition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAssignmentResponse {

    private UUID id;
    private UUID bookingId;
    private UUID employeeId;
    private String employeeFirstName;
    private String employeeLastName;
    private EmployeePosition employeePosition;
    private Long assignedByUserId;
    private String assignedByEmail;
    private LocalDateTime assignedAt;
}
