package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServiceStatResponse {
    private String serviceName;
    private long bookingCount;
}
