package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessment_results")
public class AssessmentResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "assessment_id")
    private Long assessmentId;

    @ManyToOne
    @JoinColumn(name = "assessment_id", insertable = false, updatable = false)
    private Assessment assessment;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "answers_json", columnDefinition = "TEXT")
    private String answersJson;

    private String recommendations;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public AssessmentResult() {}

    public AssessmentResult(Long userId, Long assessmentId, Integer totalScore, String riskLevel, String recommendations) {
        this.userId = userId;
        this.assessmentId = assessmentId;
        this.totalScore = totalScore;
        this.riskLevel = riskLevel;
        this.recommendations = recommendations;
        this.completedAt = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }
    
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    
    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }
    
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    
    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }
    
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 