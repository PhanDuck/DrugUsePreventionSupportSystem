package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "course_lessons")
public class CourseLesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    @JsonIgnore
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "lesson_order")
    private Integer lessonOrder;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration; // Total estimated duration in minutes

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column(name = "is_free")
    private Boolean isFree;

    @Column(name = "required_completion")
    private Boolean requiredCompletion; // Must complete this lesson to proceed

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "learning_objectives", columnDefinition = "TEXT")
    private String learningObjectives; // What students will learn

    @Column(name = "prerequisites", columnDefinition = "TEXT")
    private String prerequisites; // What students need to know before

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @ManyToOne
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    @JsonIgnore
    private User creator;

    // One lesson can have multiple content items
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CourseContent> contents;

    // Constructors
    public CourseLesson() {
        this.isPublished = false;
        this.isFree = true;
        this.requiredCompletion = false;
        this.lessonOrder = 1;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CourseLesson(Long courseId, String title) {
        this();
        this.courseId = courseId;
        this.title = title;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getLessonOrder() { return lessonOrder; }
    public void setLessonOrder(Integer lessonOrder) { this.lessonOrder = lessonOrder; }

    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }

    public Boolean getRequiredCompletion() { return requiredCompletion; }
    public void setRequiredCompletion(Boolean requiredCompletion) { this.requiredCompletion = requiredCompletion; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getLearningObjectives() { return learningObjectives; }
    public void setLearningObjectives(String learningObjectives) { this.learningObjectives = learningObjectives; }

    public String getPrerequisites() { return prerequisites; }
    public void setPrerequisites(String prerequisites) { this.prerequisites = prerequisites; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

    public List<CourseContent> getContents() { return contents; }
    public void setContents(List<CourseContent> contents) { this.contents = contents; }

    // Helper methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Utility methods
    public int getContentCount() {
        return contents != null ? contents.size() : 0;
    }

    public int getVideoCount() {
        if (contents == null) return 0;
        return (int) contents.stream().filter(CourseContent::isVideoContent).count();
    }

    public int getTextCount() {
        if (contents == null) return 0;
        return (int) contents.stream().filter(CourseContent::isTextContent).count();
    }

    public int getMeetLinkCount() {
        if (contents == null) return 0;
        return (int) contents.stream().filter(CourseContent::isMeetLink).count();
    }
} 