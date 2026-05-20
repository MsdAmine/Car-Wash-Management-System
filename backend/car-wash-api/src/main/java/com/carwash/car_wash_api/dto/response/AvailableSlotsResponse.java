package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotsResponse {
    private String date;
    private String serviceId;
    private String serviceName;
    private Integer durationMinutes;
    private List<TimeSlotResponse> slots;
}
