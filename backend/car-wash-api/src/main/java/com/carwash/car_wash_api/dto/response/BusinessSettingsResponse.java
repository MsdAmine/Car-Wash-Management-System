package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSettingsResponse {

    private Long id;
    private String businessName;
    private String phone;
    private String address;
    private String city;
    private Integer cancellationHours;
    private LocalDateTime updatedAt;
}
