package com.drugprevention.drugbe.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RescheduleRequest {
    
    @NotNull(message = "New date time cannot be empty")
    private LocalDateTime newDateTime;
    
    private String reason;

    // Constructors
    public RescheduleRequest() {}

    public RescheduleRequest(LocalDateTime newDateTime, String reason) {
        this.newDateTime = newDateTime;
        this.reason = reason;
    }

    // Getters and Setters
    public LocalDateTime getNewDateTime() {
        return newDateTime;
    }

    public void setNewDateTime(LocalDateTime newDateTime) {
        this.newDateTime = newDateTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
} 