package com.carwash.car_wash_api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeDashboardResponse {
    private long assignedBookings;
    private long bookingsInProgress;
}
