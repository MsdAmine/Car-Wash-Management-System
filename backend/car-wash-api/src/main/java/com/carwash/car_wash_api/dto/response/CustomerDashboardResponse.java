package com.carwash.car_wash_api.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerDashboardResponse {
    private long upcomingBookings;
    private long previousBookings;
    private long registeredVehicles;
}
