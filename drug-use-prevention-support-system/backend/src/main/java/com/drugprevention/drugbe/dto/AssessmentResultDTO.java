package com.drugprevention.drugbe.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentResultDTO {
    private Long id;
    private Long userId;
    private Long assessmentId;
    private String assessmentTitle;
    private String assessmentType;
    private Integer totalScore;
    private String riskLevel;
    private String riskDescription;
    private List<String> recommendations;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;

    // Constructors
    public AssessmentResultDTO() {}

    public AssessmentResultDTO(Long id, Long userId, Long assessmentId, String assessmentTitle, 
                              String assessmentType, Integer totalScore, String riskLevel, 
                              String riskDescription, List<String> recommendations, 
                              LocalDateTime completedAt, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.assessmentId = assessmentId;
        this.assessmentTitle = assessmentTitle;
        this.assessmentType = assessmentType;
        this.totalScore = totalScore;
        this.riskLevel = riskLevel;
        this.riskDescription = riskDescription;
        this.recommendations = recommendations;
        this.completedAt = completedAt;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public String getAssessmentTitle() { return assessmentTitle; }
    public void setAssessmentTitle(String assessmentTitle) { this.assessmentTitle = assessmentTitle; }

    public String getAssessmentType() { return assessmentType; }
    public void setAssessmentType(String assessmentType) { this.assessmentType = assessmentType; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRiskDescription() { return riskDescription; }
    public void setRiskDescription(String riskDescription) { this.riskDescription = riskDescription; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 