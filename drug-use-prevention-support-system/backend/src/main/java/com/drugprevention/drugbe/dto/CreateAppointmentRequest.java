package com.drugprevention.drugbe.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateAppointmentRequest {
    
    @NotNull(message = "Client ID không được để trống")
    private Long clientId;
    
    @NotNull(message = "Consultant ID không được để trống")
    private Long consultantId;
    
    @NotNull(message = "Ngày hẹn không được để trống")
    @Future(message = "Ngày hẹn phải trong tương lai")
    private LocalDateTime appointmentDate;
    
    @Min(value = 15, message = "Thời lượng phải ít nhất 15 phút")
    private Integer durationMinutes = 60;
    
    private String appointmentType = "ONLINE"; // ONLINE or IN_PERSON
    
    private String clientNotes;
    
    @DecimalMin(value = "0.0", message = "Phí tư vấn không được âm")
    private BigDecimal fee = BigDecimal.valueOf(100.0);

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

    // Validation helpers
    public boolean isValidAppointmentType() {
        return "ONLINE".equals(appointmentType) || "IN_PERSON".equals(appointmentType);
    }
} 