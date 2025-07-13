package com.drugprevention.drugbe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateAppointmentRequest {
    
    @NotNull(message = "Client ID cannot be empty")
    private Long clientId;
    
    @NotNull(message = "Consultant ID cannot be empty")
    private Long consultantId;
    
    @NotNull(message = "Appointment date cannot be empty")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;
    
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer durationMinutes = 60;
    
    @Pattern(regexp = "^(ONLINE|IN_PERSON)$", message = "Appointment type must be ONLINE or IN_PERSON")
    private String appointmentType = "ONLINE"; // ONLINE or IN_PERSON
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String clientNotes;
    
    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    private BigDecimal fee = BigDecimal.valueOf(100.0);
    
    private String paymentMethod = "CASH"; // CASH, VNPAY, BANK_TRANSFER

    // Constructors
    public CreateAppointmentRequest() {}

    public CreateAppointmentRequest(Long clientId, Long consultantId, LocalDateTime appointmentDate) {
        this.clientId = clientId;
        this.consultantId = consultantId;
        this.appointmentDate = appointmentDate;
    }

    // Getters and Setters
    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getConsultantId() {
        return consultantId;
    }

    public void setConsultantId(Long consultantId) {
        this.consultantId = consultantId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(String appointmentType) {
        this.appointmentType = appointmentType;
    }

    public String getClientNotes() {
        return clientNotes;
    }

    public void setClientNotes(String clientNotes) {
        this.clientNotes = clientNotes;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Validation helpers
    public boolean isValidAppointmentType() {
        return "ONLINE".equals(appointmentType) || "IN_PERSON".equals(appointmentType);
    }
} 