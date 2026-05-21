package com.carwash.car_wash_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationPreferencesRequest {
    private boolean bookingConfirmed;
    private boolean washInProgress;
    private boolean washCompleted;
    private boolean bookingReminders;
    private boolean promotions;
}
