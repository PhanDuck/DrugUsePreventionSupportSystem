package com.drugprevention.drugbe.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String shortDescription;
    private String thumbnailUrl;
    private BigDecimal price;
    private String currency;
    private String difficultyLevel;
    private Integer estimatedDuration; // in minutes
    private Boolean isActive;
    private String categoryName;
    private Long categoryId;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Course statistics
    private Integer totalLessons;
    private Integer totalStudents;
    private Integer totalDuration; // total duration of all lessons
    private Double averageRating;
    private Integer totalReviews;
    
    // Current user's progress (if authenticated)
    private Boolean isEnrolled;
    private Integer completedLessons;
    private Double progressPercentage;
    
    // Lessons preview (for course detail)
    private List<CourseLessonDTO> lessons;
    
    // Constructors
    public CourseDTO() {}

    public CourseDTO(Long id, String title, String description, String shortDescription, 
                    String thumbnailUrl, BigDecimal price, String currency, String difficultyLevel,
                    Integer estimatedDuration, Boolean isActive, String categoryName, Long categoryId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.shortDescription = shortDescription;
        this.thumbnailUrl = thumbnailUrl;
        this.price = price;
        this.currency = currency;
        this.difficultyLevel = difficultyLevel;
        this.estimatedDuration = estimatedDuration;
        this.isActive = isActive;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getTotalLessons() { return totalLessons; }
    public void setTotalLessons(Integer totalLessons) { this.totalLessons = totalLessons; }

    public Integer getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Integer totalStudents) { this.totalStudents = totalStudents; }

    public Integer getTotalDuration() { return totalDuration; }
    public void setTotalDuration(Integer totalDuration) { this.totalDuration = totalDuration; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public Boolean getIsEnrolled() { return isEnrolled; }
    public void setIsEnrolled(Boolean isEnrolled) { this.isEnrolled = isEnrolled; }

    public Integer getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(Integer completedLessons) { this.completedLessons = completedLessons; }

    public Double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Double progressPercentage) { this.progressPercentage = progressPercentage; }

    public List<CourseLessonDTO> getLessons() { return lessons; }
    public void setLessons(List<CourseLessonDTO> lessons) { this.lessons = lessons; }

    // Helper methods
    public boolean isFree() {
        return price == null || price.compareTo(BigDecimal.ZERO) == 0;
    }

    public String getFormattedPrice() {
        if (isFree()) {
            return "Miễn phí";
        }
        return String.format("%,.0f %s", price, currency != null ? currency : "VND");
    }

    @Override
    public String toString() {
        return "CourseDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", price=" + price +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                ", isActive=" + isActive +
                '}';
    }
} 