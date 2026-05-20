package com.carwash.car_wash_api.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperatingHoursDayRequest {

    private String dayOfWeek;
    private String openTime;
    private String closeTime;

    @JsonProperty("isOpen")
    private boolean isOpen;
}
