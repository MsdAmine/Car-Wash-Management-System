package com.carwash.car_wash_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UploadAvatarRequest {

    @NotBlank(message = "Avatar data is required")
    private String avatarDataUrl;
}
