package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_progress")
public class CourseProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "course_id")
    private Long courseId;

    @ManyToOne
    @JoinColumn(name = "course_id", insertable = false, updatable = false)
    private Course course;

    @Column(name = "lesson_id")
    private Long lessonId;

    @ManyToOne
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    private CourseLesson lesson;

    @Column(name = "content_id")
    private Long contentId;

    @ManyToOne
    @JoinColumn(name = "content_id", insertable = false, updatable = false)
    private CourseContent content;

    @Column(name = "progress_type")
    private String progressType; // LESSON_STARTED, LESSON_COMPLETED, CONTENT_VIEWED, CONTENT_COMPLETED, VIDEO_WATCHED, MEET_ATTENDED

    @Column(name = "completion_percentage")
    private Integer completionPercentage; // 0-100

    @Column(name = "time_spent")
    private Integer timeSpent; // Time spent in minutes

    @Column(name = "video_watch_duration")
    private Integer videoWatchDuration; // For video content, time watched in seconds

    @Column(name = "video_total_duration")
    private Integer videoTotalDuration; // Total video duration in seconds

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "first_accessed_at")
    private LocalDateTime firstAccessedAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "attempts_count")
    private Integer attemptsCount; // Number of times user accessed this content

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes; // User's personal notes

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public CourseProgress() {
        this.completionPercentage = 0;
        this.timeSpent = 0;
        this.isCompleted = false;
        this.attemptsCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.firstAccessedAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
    }

    public CourseProgress(Long userId, Long courseId, String progressType) {
        this();
        this.userId = userId;
        this.courseId = courseId;
        this.progressType = progressType;
    }

    public CourseProgress(Long userId, Long courseId, Long lessonId, String progressType) {
        this(userId, courseId, progressType);
        this.lessonId = lessonId;
    }

    public CourseProgress(Long userId, Long courseId, Long lessonId, Long contentId, String progressType) {
        this(userId, courseId, lessonId, progressType);
        this.contentId = contentId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }

    public CourseLesson getLesson() { return lesson; }
    public void setLesson(CourseLesson lesson) { this.lesson = lesson; }

    public Long getContentId() { return contentId; }
    public void setContentId(Long contentId) { this.contentId = contentId; }

    public CourseContent getContent() { return content; }
    public void setContent(CourseContent content) { this.content = content; }

    public String getProgressType() { return progressType; }
    public void setProgressType(String progressType) { this.progressType = progressType; }

    public Integer getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Integer completionPercentage) { this.completionPercentage = completionPercentage; }

    public Integer getTimeSpent() { return timeSpent; }
    public void setTimeSpent(Integer timeSpent) { this.timeSpent = timeSpent; }

    public Integer getVideoWatchDuration() { return videoWatchDuration; }
    public void setVideoWatchDuration(Integer videoWatchDuration) { this.videoWatchDuration = videoWatchDuration; }

    public Integer getVideoTotalDuration() { return videoTotalDuration; }
    public void setVideoTotalDuration(Integer videoTotalDuration) { this.videoTotalDuration = videoTotalDuration; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getFirstAccessedAt() { return firstAccessedAt; }
    public void setFirstAccessedAt(LocalDateTime firstAccessedAt) { this.firstAccessedAt = firstAccessedAt; }

    public LocalDateTime getLastAccessedAt() { return lastAccessedAt; }
    public void setLastAccessedAt(LocalDateTime lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }

    public Integer getAttemptsCount() { return attemptsCount; }
    public void setAttemptsCount(Integer attemptsCount) { this.attemptsCount = attemptsCount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (firstAccessedAt == null) {
            firstAccessedAt = LocalDateTime.now();
        }
        lastAccessedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        lastAccessedAt = LocalDateTime.now();
    }

    // Utility methods
    public void markCompleted() {
        this.isCompleted = true;
        this.completionPercentage = 100;
        this.completedAt = LocalDateTime.now();
    }

    public void incrementAttempts() {
        this.attemptsCount = (this.attemptsCount != null ? this.attemptsCount : 0) + 1;
    }

    public void updateVideoProgress(int watchedSeconds, int totalSeconds) {
        this.videoWatchDuration = watchedSeconds;
        this.videoTotalDuration = totalSeconds;
        
        if (totalSeconds > 0) {
            int percentage = (int) ((double) watchedSeconds / totalSeconds * 100);
            this.completionPercentage = Math.min(percentage, 100);
            
            // Consider video completed if watched 90% or more
            if (percentage >= 90) {
                markCompleted();
            }
        }
    }

    public boolean isVideoContent() {
        return content != null && content.isVideoContent();
    }

    public boolean isTextContent() {
        return content != null && content.isTextContent();
    }

    public boolean isMeetLink() {
        return content != null && content.isMeetLink();
    }

    public double getVideoCompletionPercentage() {
        if (videoTotalDuration == null || videoTotalDuration == 0 || videoWatchDuration == null) {
            return 0.0;
        }
        return (double) videoWatchDuration / videoTotalDuration * 100;
    }
} 