package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "instructor_id")
    private Long instructorId;

    @ManyToOne
    @JoinColumn(name = "instructor_id", insertable = false, updatable = false)
    private User instructor;

    @Column(name = "category_id")
    private Long categoryId;

    @ManyToOne
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private Category category;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private String duration; // e.g., "6 weeks", "2 days"

    @Column(name = "image_url")
    private String imageUrl;

    private String status; // open, closed, completed, cancelled

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // New fields for enhanced course features
    @Column(name = "price")
    private BigDecimal price; // Course price, 0.0 for free courses

    @Column(name = "difficulty_level")
    private String difficultyLevel; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(name = "language")
    private String language; // vi, en

    @Column(name = "total_lessons")
    private Integer totalLessons;

    @Column(name = "total_duration_minutes")
    private Integer totalDurationMinutes;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "preview_video_url")
    private String previewVideoUrl; // Course trailer/preview

    @Column(name = "certificate_enabled")
    private Boolean certificateEnabled;

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites; // What students need before taking this course

    @Column(name = "learning_outcomes", columnDefinition = "TEXT")
    private String learningOutcomes; // What students will achieve

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // Comma-separated tags for searching

    @Column(name = "average_rating")
    private BigDecimal averageRating;

    @Column(name = "total_reviews")
    private Integer totalReviews;

    @Column(name = "enrollment_deadline")
    private LocalDateTime enrollmentDeadline;

    // Relationships
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Prevent lazy loading issue during JSON serialization
    private List<CourseLesson> lessons;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Prevent lazy loading issue during JSON serialization
    private List<CourseRegistration> registrations;

    // Constructors
    public Course() {}

    public Course(String title, String description, Long instructorId, Long categoryId, Integer maxParticipants) {
        this.title = title;
        this.description = description;
        this.instructorId = instructorId;
        this.categoryId = categoryId;
        this.maxParticipants = maxParticipants;
        this.currentParticipants = 0;
        this.status = "open";
        this.isFeatured = false;
        this.isActive = true;
        this.price = BigDecimal.ZERO; // Default to free
        this.difficultyLevel = "BEGINNER";
        this.language = "vi";
        this.totalLessons = 0;
        this.totalDurationMinutes = 0;
        this.certificateEnabled = false;
        this.averageRating = BigDecimal.ZERO;
        this.totalReviews = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }
    
    public User getInstructor() { return instructor; }
    public void setInstructor(User instructor) { this.instructor = instructor; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    
    public Integer getCurrentParticipants() { return currentParticipants; }
    public void setCurrentParticipants(Integer currentParticipants) { this.currentParticipants = currentParticipants; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // New getters and setters
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Integer getTotalLessons() { return totalLessons; }
    public void setTotalLessons(Integer totalLessons) { this.totalLessons = totalLessons; }

    public Integer getTotalDurationMinutes() { return totalDurationMinutes; }
    public void setTotalDurationMinutes(Integer totalDurationMinutes) { this.totalDurationMinutes = totalDurationMinutes; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getPreviewVideoUrl() { return previewVideoUrl; }
    public void setPreviewVideoUrl(String previewVideoUrl) { this.previewVideoUrl = previewVideoUrl; }

    public Boolean getCertificateEnabled() { return certificateEnabled; }
    public void setCertificateEnabled(Boolean certificateEnabled) { this.certificateEnabled = certificateEnabled; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public String getLearningOutcomes() { return learningOutcomes; }
    public void setLearningOutcomes(String learningOutcomes) { this.learningOutcomes = learningOutcomes; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public LocalDateTime getEnrollmentDeadline() { return enrollmentDeadline; }
    public void setEnrollmentDeadline(LocalDateTime enrollmentDeadline) { this.enrollmentDeadline = enrollmentDeadline; }

    public List<CourseLesson> getLessons() { return lessons; }
    public void setLessons(List<CourseLesson> lessons) { this.lessons = lessons; }

    public List<CourseRegistration> getRegistrations() { return registrations; }
    public void setRegistrations(List<CourseRegistration> registrations) { this.registrations = registrations; }

    // Utility methods
    public boolean isFree() {
        return price == null || price.compareTo(BigDecimal.ZERO) == 0;
    }

    public boolean hasEnrollmentDeadlinePassed() {
        return enrollmentDeadline != null && LocalDateTime.now().isAfter(enrollmentDeadline);
    }

    public boolean isEnrollmentOpen() {
        return "open".equals(status) && !hasEnrollmentDeadlinePassed() && 
               currentParticipants < maxParticipants;
    }

    public int getAvailableSlots() {
        return maxParticipants - currentParticipants;
    }

    public double getEnrollmentRate() {
        if (maxParticipants == 0) return 0.0;
        return (double) currentParticipants / maxParticipants * 100;
    }

    public String getFormattedDuration() {
        if (totalDurationMinutes == null || totalDurationMinutes == 0) {
            return "Chưa xác định";
        }
        
        if (totalDurationMinutes < 60) {
            return totalDurationMinutes + " phút";
        } else {
            int hours = totalDurationMinutes / 60;
            int minutes = totalDurationMinutes % 60;
            if (minutes == 0) {
                return hours + " giờ";
            } else {
                return hours + " giờ " + minutes + " phút";
            }
        }
    }
} 