package com.carwash.car_wash_api.model.entity;

import com.carwash.car_wash_api.model.enums.EmployeePosition;
import com.carwash.car_wash_api.model.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeePosition position;

    @Column
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    @Column
    private EmployeeStatus status;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        syncLegacyActiveFlag();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        syncLegacyActiveFlag();
        updatedAt = LocalDateTime.now();
    }

    public EmployeeStatus getStatus() {
        if (status != null) {
            return status;
        }
        return active ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE;
    }

    public void setStatus(EmployeeStatus status) {
        this.status = status;
        if (status != null) {
            this.active = status == EmployeeStatus.ACTIVE;
        }
    }

    public boolean isActive() {
        return getStatus() == EmployeeStatus.ACTIVE;
    }

    public void setActive(boolean active) {
        this.active = active;
        this.status = active ? EmployeeStatus.ACTIVE : EmployeeStatus.INACTIVE;
    }

    private void syncLegacyActiveFlag() {
        if (status != null) {
            active = status == EmployeeStatus.ACTIVE;
        }
    }
}
