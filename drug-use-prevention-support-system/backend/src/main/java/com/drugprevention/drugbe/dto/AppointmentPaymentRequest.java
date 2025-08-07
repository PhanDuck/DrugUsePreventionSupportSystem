package com.drugprevention.drugbe.dto;

import java.math.BigDecimal;

public class AppointmentPaymentRequest {
    private Long appointmentId;
    private BigDecimal amount;
    private String description;
    private String paymentMethod;
    private String returnUrl;

    // Constructors
    public AppointmentPaymentRequest() {}

    public AppointmentPaymentRequest(Long appointmentId, BigDecimal amount, String description, String paymentMethod, String returnUrl) {
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.description = description;
        this.paymentMethod = paymentMethod;
        this.returnUrl = returnUrl;
    }

    // Getters and Setters
    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public void setReturnUrl(String returnUrl) {
        this.returnUrl = returnUrl;
    }
} 