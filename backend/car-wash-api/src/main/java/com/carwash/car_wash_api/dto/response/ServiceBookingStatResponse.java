package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceBookingStatResponse {
    private String serviceId;
    private String serviceName;
    private Long bookingCount;
    private Double percentage;
}
