package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_contents")
public class CourseContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "content_type")
    private String contentType; // VIDEO, TEXT, MEET_LINK, DOCUMENT

    // Video content fields
    @Column(name = "video_url")
    private String videoUrl; // YouTube URL or other video platforms

    @Column(name = "video_duration")
    private Integer videoDuration; // Duration in seconds

    @Column(name = "video_thumbnail")
    private String videoThumbnail;

    // Text content fields  
    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    // Meet link fields
    @Column(name = "meet_link")
    private String meetLink;

    @Column(name = "meet_start_time")
    private LocalDateTime meetStartTime;

    @Column(name = "meet_end_time")
    private LocalDateTime meetEndTime;

    @Column(name = "meet_password")
    private String meetPassword;

    // Document fields
    @Column(name = "document_url")
    private String documentUrl;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "document_size")
    private Long documentSize;

    // Ordering and status
    @Column(name = "content_order")
    private Integer contentOrder;

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column(name = "is_free")
    private Boolean isFree; // True if content is free to access

    @Column(name = "required_completion")
    private Boolean requiredCompletion; // True if user must complete this to proceed

    @Column(name = "estimated_duration")
    private Integer estimatedDuration; // Estimated time to complete in minutes

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy; // Staff ID who created this content

    @ManyToOne
    @JoinColumn(name = "created_by", insertable = false, updatable = false)
    private User creator;

    // Constructors
    public CourseContent() {
        this.isPublished = false;
        this.isFree = true;
        this.requiredCompletion = false;
        this.contentOrder = 1;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CourseContent(Long courseId, String title, String contentType) {
        this();
        this.courseId = courseId;
        this.title = title;
        this.contentType = contentType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }

    public CourseLesson getLesson() { return lesson; }
    public void setLesson(CourseLesson lesson) { this.lesson = lesson; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getVideoDuration() { return videoDuration; }
    public void setVideoDuration(Integer videoDuration) { this.videoDuration = videoDuration; }

    public String getVideoThumbnail() { return videoThumbnail; }
    public void setVideoThumbnail(String videoThumbnail) { this.videoThumbnail = videoThumbnail; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }

    public LocalDateTime getMeetStartTime() { return meetStartTime; }
    public void setMeetStartTime(LocalDateTime meetStartTime) { this.meetStartTime = meetStartTime; }

    public LocalDateTime getMeetEndTime() { return meetEndTime; }
    public void setMeetEndTime(LocalDateTime meetEndTime) { this.meetEndTime = meetEndTime; }

    public String getMeetPassword() { return meetPassword; }
    public void setMeetPassword(String meetPassword) { this.meetPassword = meetPassword; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public Long getDocumentSize() { return documentSize; }
    public void setDocumentSize(Long documentSize) { this.documentSize = documentSize; }

    public Integer getContentOrder() { return contentOrder; }
    public void setContentOrder(Integer contentOrder) { this.contentOrder = contentOrder; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Boolean getIsFree() { return isFree; }
    public void setIsFree(Boolean isFree) { this.isFree = isFree; }

    public Boolean getRequiredCompletion() { return requiredCompletion; }
    public void setRequiredCompletion(Boolean requiredCompletion) { this.requiredCompletion = requiredCompletion; }

    public Integer getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(Integer estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

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
    public boolean isVideoContent() {
        return "VIDEO".equals(contentType);
    }

    public boolean isTextContent() {
        return "TEXT".equals(contentType);
    }

    public boolean isMeetLink() {
        return "MEET_LINK".equals(contentType);
    }

    public boolean isDocument() {
        return "DOCUMENT".equals(contentType);
    }
} 