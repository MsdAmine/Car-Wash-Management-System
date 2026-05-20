package com.carwash.car_wash_api.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "operating_hours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatingHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String dayOfWeek;

    private LocalTime openTime;
    private LocalTime closeTime;

    @Builder.Default
    @Column(name = "is_open", nullable = false)
    private boolean open = true;
}
