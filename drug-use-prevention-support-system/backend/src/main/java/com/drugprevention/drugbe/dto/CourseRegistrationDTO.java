package com.drugprevention.drugbe.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CourseRegistrationDTO {
    private Long id;
    private Long courseId;
    private String courseName;
    private Long userId;
    private String userName;
    private LocalDateTime registrationDate;
    private String status; // ACTIVE, COMPLETED, CANCELLED
    private Double progressPercentage;
    private Integer completedLessons;
    private Integer totalLessons;
    private LocalDateTime lastAccessDate;
    
    // Payment related fields
    private BigDecimal paidAmount;
    private String paymentStatus; // PENDING, PAID, REFUNDED
    private String paymentMethod;
    private LocalDateTime paymentDate;
    
    // Course info for responses
    private String courseDescription;
    private String courseThumbnailUrl;
    private String courseDifficultyLevel;
    private BigDecimal coursePrice;
    private String courseCurrency;
    
    // Response metadata
    private Boolean requiresPayment;
    private String message;

    // Constructors
    public CourseRegistrationDTO() {}

    public CourseRegistrationDTO(Long id, Long courseId, String courseName, Long userId, 
                               LocalDateTime registrationDate, String status) {
        this.id = id;
        this.courseId = courseId;
        this.courseName = courseName;
        this.userId = userId;
        this.registrationDate = registrationDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public Integer getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(Integer completedLessons) { this.completedLessons = completedLessons; }

    public Integer getTotalLessons() { return totalLessons; }
    public void setTotalLessons(Integer totalLessons) { this.totalLessons = totalLessons; }

    public LocalDateTime getLastAccessDate() { return lastAccessDate; }
    public void setLastAccessDate(LocalDateTime lastAccessDate) { this.lastAccessDate = lastAccessDate; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public String getCourseDescription() { return courseDescription; }
    public void setCourseDescription(String courseDescription) { this.courseDescription = courseDescription; }

    public String getCourseThumbnailUrl() { return courseThumbnailUrl; }
    public void setCourseThumbnailUrl(String courseThumbnailUrl) { this.courseThumbnailUrl = courseThumbnailUrl; }

    public String getCourseDifficultyLevel() { return courseDifficultyLevel; }
    public void setCourseDifficultyLevel(String courseDifficultyLevel) { this.courseDifficultyLevel = courseDifficultyLevel; }

    public BigDecimal getCoursePrice() { return coursePrice; }
    public void setCoursePrice(BigDecimal coursePrice) { this.coursePrice = coursePrice; }

    public String getCourseCurrency() { return courseCurrency; }
    public void setCourseCurrency(String courseCurrency) { this.courseCurrency = courseCurrency; }

    public Boolean getRequiresPayment() { return requiresPayment; }
    public void setRequiresPayment(Boolean requiresPayment) { this.requiresPayment = requiresPayment; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    // Helper methods
    public boolean isActive() {
        return "ACTIVE".equals(status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }

    public boolean isPaid() {
        return "PAID".equals(paymentStatus);
    }

    public String getFormattedProgress() {
        if (progressPercentage == null) return "0%";
        return String.format("%.1f%%", progressPercentage);
    }

    @Override
    public String toString() {
        return "CourseRegistrationDTO{" +
                "id=" + id +
                ", courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", userId=" + userId +
                ", status='" + status + '\'' +
                ", progressPercentage=" + progressPercentage +
                '}';
    }
} 