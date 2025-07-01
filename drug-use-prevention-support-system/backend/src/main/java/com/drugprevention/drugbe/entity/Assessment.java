package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "assessment_type_id")
    private Long assessmentTypeId;

    @ManyToOne
    @JoinColumn(name = "assessment_type_id", insertable = false, updatable = false)
    private AssessmentType assessmentType;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Assessment() {}

    public Assessment(String title, String description, Long assessmentTypeId) {
        this.title = title;
        this.description = description;
        this.assessmentTypeId = assessmentTypeId;
        this.isActive = true;
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
    
    public Long getAssessmentTypeId() { return assessmentTypeId; }
    public void setAssessmentTypeId(Long assessmentTypeId) { this.assessmentTypeId = assessmentTypeId; }
    
    public AssessmentType getAssessmentType() { return assessmentType; }
    public void setAssessmentType(AssessmentType assessmentType) { this.assessmentType = assessmentType; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 