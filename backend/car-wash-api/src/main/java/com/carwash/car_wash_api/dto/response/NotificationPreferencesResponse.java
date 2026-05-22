package com.carwash.car_wash_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPreferencesResponse {
    private boolean bookingConfirmed;
    private boolean washInProgress;
    private boolean washCompleted;
    private boolean bookingReminders;
    private boolean promotions;
}
