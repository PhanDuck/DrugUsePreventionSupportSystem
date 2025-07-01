package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "assessment_result_id")
    private Long assessmentResultId;

    @ManyToOne
    @JoinColumn(name = "assessment_result_id", insertable = false, updatable = false)
    private AssessmentResult assessmentResult;

    @Column(name = "recommendation_type")
    private String recommendationType; // course, blog, consultation

    @Column(name = "target_id")
    private Long targetId; // ID of recommended course/blog/consultant

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "risk_level")
    private String riskLevel;

    private Integer priority; // 1-5, 1 being highest priority

    private String status; // pending, viewed, accepted, dismissed

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Recommendation() {}

    public Recommendation(Long userId, String recommendationType, Long targetId, String title, String description, String riskLevel, Integer priority) {
        this.userId = userId;
        this.recommendationType = recommendationType;
        this.targetId = targetId;
        this.title = title;
        this.description = description;
        this.riskLevel = riskLevel;
        this.priority = priority;
        this.status = "pending";
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Long getAssessmentResultId() { return assessmentResultId; }
    public void setAssessmentResultId(Long assessmentResultId) { this.assessmentResultId = assessmentResultId; }
    
    public AssessmentResult getAssessmentResult() { return assessmentResult; }
    public void setAssessmentResult(AssessmentResult assessmentResult) { this.assessmentResult = assessmentResult; }
    
    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
    
    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 