package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HeatmapResponse {
    private List<String> days;
    private List<String> slots;
    private List<List<Integer>> data;
}
