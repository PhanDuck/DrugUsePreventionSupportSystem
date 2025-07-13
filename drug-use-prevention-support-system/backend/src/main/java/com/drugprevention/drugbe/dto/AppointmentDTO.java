package com.drugprevention.drugbe.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private Long id;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private String clientPhone;
    private Long consultantId;
    private String consultantName;
    private String consultantEmail;
    private String consultantExpertise;
    private LocalDateTime appointmentDate;
    private Integer durationMinutes;
    private String status;
    private String appointmentType;
    private String clientNotes;
    private String consultantNotes;
    private String meetingLink;
    private BigDecimal fee;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    
    // Payment related fields
    private String vnpayTxnRef;
    private String vnpayResponseCode;
    private String vnpayTransactionNo;
    private String vnpayBankCode;
    private String paymentUrl;
    private LocalDateTime paidAt;
    private String paymentMethod;

    // Constructors
    public AppointmentDTO() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public void setClientPhone(String clientPhone) {
        this.clientPhone = clientPhone;
    }

    public Long getConsultantId() {
        return consultantId;
    }

    public void setConsultantId(Long consultantId) {
        this.consultantId = consultantId;
    }

    public String getConsultantName() {
        return consultantName;
    }

    public void setConsultantName(String consultantName) {
        this.consultantName = consultantName;
    }

    public String getConsultantEmail() {
        return consultantEmail;
    }

    public void setConsultantEmail(String consultantEmail) {
        this.consultantEmail = consultantEmail;
    }

    public String getConsultantExpertise() {
        return consultantExpertise;
    }

    public void setConsultantExpertise(String consultantExpertise) {
        this.consultantExpertise = consultantExpertise;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getConsultantNotes() {
        return consultantNotes;
    }

    public void setConsultantNotes(String consultantNotes) {
        this.consultantNotes = consultantNotes;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public BigDecimal getFee() {
        return fee;
    }

    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public String getVnpayTxnRef() {
        return vnpayTxnRef;
    }

    public void setVnpayTxnRef(String vnpayTxnRef) {
        this.vnpayTxnRef = vnpayTxnRef;
    }

    public String getVnpayResponseCode() {
        return vnpayResponseCode;
    }

    public void setVnpayResponseCode(String vnpayResponseCode) {
        this.vnpayResponseCode = vnpayResponseCode;
    }

    public String getVnpayTransactionNo() {
        return vnpayTransactionNo;
    }

    public void setVnpayTransactionNo(String vnpayTransactionNo) {
        this.vnpayTransactionNo = vnpayTransactionNo;
    }

    public String getVnpayBankCode() {
        return vnpayBankCode;
    }

    public void setVnpayBankCode(String vnpayBankCode) {
        this.vnpayBankCode = vnpayBankCode;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    // Helper methods for status display
    public String getStatusDisplayText() {
        switch (status) {
            case "PENDING": return "Pending";
            case "CONFIRMED": return "Confirmed";
            case "CANCELLED": return "Cancelled";
            case "COMPLETED": return "Completed";
            default: return status;
        }
    }

    public String getPaymentStatusDisplayText() {
        switch (paymentStatus) {
            case "UNPAID": return "Unpaid";
            case "PAID": return "Paid";
            case "REFUNDED": return "Refunded";
            default: return paymentStatus;
        }
    }

    public String getAppointmentTypeDisplayText() {
        switch (appointmentType) {
            case "ONLINE": return "Online";
            case "IN_PERSON": return "In Person";
            default: return appointmentType;
        }
    }
} 