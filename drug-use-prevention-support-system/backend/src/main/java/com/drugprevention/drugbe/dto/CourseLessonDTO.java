package com.drugprevention.drugbe.dto;

public class CourseLessonDTO {
    private Long id;
    private String title;
    private String description;
    private Integer orderIndex;
    private Integer estimatedDuration; // in minutes
    private Boolean isActive;
    private Boolean isCompleted; // for current user
    
    // Constructors
    public CourseLessonDTO() {}

    public CourseLessonDTO(Long id, String title, String description, Integer orderIndex, 
                          Integer estimatedDuration, Boolean isActive) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.estimatedDuration = estimatedDuration;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }
} 