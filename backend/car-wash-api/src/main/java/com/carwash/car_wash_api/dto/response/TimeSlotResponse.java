package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {
    private String time;
    private boolean available;
    private String reason;
}
