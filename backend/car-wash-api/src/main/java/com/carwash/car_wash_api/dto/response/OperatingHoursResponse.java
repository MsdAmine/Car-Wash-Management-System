package com.carwash.car_wash_api.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperatingHoursResponse {

    private Long id;
    private String dayOfWeek;
    private String openTime;
    private String closeTime;

    @JsonProperty("isOpen")
    private boolean isOpen;
}
