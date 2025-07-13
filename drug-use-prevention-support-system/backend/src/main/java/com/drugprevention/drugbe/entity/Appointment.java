package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "consultant_id", nullable = false)
    private Long consultantId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60;

    @Column(name = "status", length = 20)
    private String status = "PENDING";

    @Column(name = "appointment_type", length = 50)
    private String appointmentType = "ONLINE";

    @Column(name = "client_notes", columnDefinition = "NVARCHAR(MAX)")
    private String clientNotes;

    @Column(name = "consultant_notes", columnDefinition = "NVARCHAR(MAX)")
    private String consultantNotes;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(name = "fee", precision = 10, scale = 2)
    private BigDecimal fee = BigDecimal.valueOf(100.0);

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "UNPAID";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancelled_by")
    private Long cancelledBy;

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    // Payment related fields for VNPay integration
    @Column(name = "vnpay_txn_ref", length = 100)
    private String vnpayTxnRef; // VNPay transaction reference
    
    @Column(name = "vnpay_response_code", length = 10)
    private String vnpayResponseCode; // VNPay response code
    
    @Column(name = "vnpay_transaction_no", length = 100)
    private String vnpayTransactionNo; // VNPay transaction number
    
    @Column(name = "vnpay_bank_code", length = 20)
    private String vnpayBankCode; // Bank code used for payment
    
    @Column(name = "payment_url", length = 1000)
    private String paymentUrl; // VNPay payment URL
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt; // When payment was completed
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // VNPAY, CASH, BANK_TRANSFER, etc.

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id", insertable = false, updatable = false)
    private User consultant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by", insertable = false, updatable = false)
    private User cancelledByUser;

    // Constructors
    public Appointment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Appointment(Long clientId, Long consultantId, LocalDateTime appointmentDate) {
        this();
        this.clientId = clientId;
        this.consultantId = consultantId;
        this.appointmentDate = appointmentDate;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
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

    public Long getCancelledBy() {
        return cancelledBy;
    }

    public void setCancelledBy(Long cancelledBy) {
        this.cancelledBy = cancelledBy;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public User getConsultant() {
        return consultant;
    }

    public void setConsultant(User consultant) {
        this.consultant = consultant;
    }

    public User getCancelledByUser() {
        return cancelledByUser;
    }

    public void setCancelledByUser(User cancelledByUser) {
        this.cancelledByUser = cancelledByUser;
    }

    // Utility methods
    public boolean isPending() {
        return "PENDING".equals(this.status);
    }

    public boolean isConfirmed() {
        return "CONFIRMED".equals(this.status);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(this.status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(this.status);
    }

    public boolean isPaid() {
        return "PAID".equals(this.paymentStatus);
    }

    public void cancel(Long cancelledBy, String reason) {
        this.status = "CANCELLED";
        this.cancelledAt = LocalDateTime.now();
        this.cancelledBy = cancelledBy;
        this.cancellationReason = reason;
        this.updatedAt = LocalDateTime.now();
    }

    // Payment related getters and setters
    public String getVnpayTxnRef() { return vnpayTxnRef; }
    public void setVnpayTxnRef(String vnpayTxnRef) { this.vnpayTxnRef = vnpayTxnRef; }
    
    public String getVnpayResponseCode() { return vnpayResponseCode; }
    public void setVnpayResponseCode(String vnpayResponseCode) { this.vnpayResponseCode = vnpayResponseCode; }
    
    public String getVnpayTransactionNo() { return vnpayTransactionNo; }
    public void setVnpayTransactionNo(String vnpayTransactionNo) { this.vnpayTransactionNo = vnpayTransactionNo; }
    
    public String getVnpayBankCode() { return vnpayBankCode; }
    public void setVnpayBankCode(String vnpayBankCode) { this.vnpayBankCode = vnpayBankCode; }
    
    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }
    
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
} 