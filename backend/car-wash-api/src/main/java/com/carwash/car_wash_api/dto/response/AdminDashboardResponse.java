package com.carwash.car_wash_api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalBookings;
    private long todaysBookings;
    private long pendingBookings;
    private long completedBookings;
    private BigDecimal dailyRevenue;
    private BigDecimal monthlyRevenue;
    private List<ServiceStatResponse> mostRequestedServices;
}
