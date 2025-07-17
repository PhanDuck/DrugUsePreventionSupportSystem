package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.CourseContent;
import com.drugprevention.drugbe.entity.CourseLesson;
import com.drugprevention.drugbe.repository.CourseContentRepository;
import com.drugprevention.drugbe.repository.CourseLessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseContentService {

    @Autowired
    private CourseContentRepository courseContentRepository;

    @Autowired
    private CourseLessonRepository courseLessonRepository;

    // Create new content
    public CourseContent createContent(CourseContent content) {
        // Set content order if not provided
        if (content.getContentOrder() == null) {
            if (content.getLessonId() != null) {
                content.setContentOrder(courseContentRepository.getNextContentOrderForLesson(content.getLessonId()));
            } else {
                content.setContentOrder(courseContentRepository.getNextContentOrder(content.getCourseId()));
            }
        }

        // Set default values
        if (content.getIsPublished() == null) {
            content.setIsPublished(false);
        }
        if (content.getIsFree() == null) {
            content.setIsFree(true);
        }
        if (content.getRequiredCompletion() == null) {
            content.setRequiredCompletion(false);
        }

        content.setCreatedAt(LocalDateTime.now());
        content.setUpdatedAt(LocalDateTime.now());

        return courseContentRepository.save(content);
    }

    // Update existing content
    public CourseContent updateContent(Long contentId, CourseContent contentDetails) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + contentId));

        // Update basic fields
        content.setTitle(contentDetails.getTitle());
        content.setDescription(contentDetails.getDescription());
        content.setContentType(contentDetails.getContentType());

        // Update video fields
        content.setVideoUrl(contentDetails.getVideoUrl());
        content.setVideoDuration(contentDetails.getVideoDuration());
        content.setVideoThumbnail(contentDetails.getVideoThumbnail());

        // Update text content
        content.setTextContent(contentDetails.getTextContent());

        // Update meet link fields
        content.setMeetLink(contentDetails.getMeetLink());
        content.setMeetStartTime(contentDetails.getMeetStartTime());
        content.setMeetEndTime(contentDetails.getMeetEndTime());
        content.setMeetPassword(contentDetails.getMeetPassword());

        // Update document fields
        content.setDocumentUrl(contentDetails.getDocumentUrl());
        content.setDocumentName(contentDetails.getDocumentName());
        content.setDocumentSize(contentDetails.getDocumentSize());

        // Update settings
        content.setContentOrder(contentDetails.getContentOrder());
        content.setIsPublished(contentDetails.getIsPublished());
        content.setIsFree(contentDetails.getIsFree());
        content.setRequiredCompletion(contentDetails.getRequiredCompletion());
        content.setEstimatedDuration(contentDetails.getEstimatedDuration());

        content.setUpdatedAt(LocalDateTime.now());

        return courseContentRepository.save(content);
    }

    // Delete content
    public void deleteContent(Long contentId) {
        if (!courseContentRepository.existsById(contentId)) {
            throw new RuntimeException("Content not found with id: " + contentId);
        }
        courseContentRepository.deleteById(contentId);
    }

    // Get content by ID
    public Optional<CourseContent> getContentById(Long contentId) {
        return courseContentRepository.findById(contentId);
    }

    // Get all content for a course
    public List<CourseContent> getContentByCourse(Long courseId) {
        return courseContentRepository.findByCourseIdOrderByContentOrder(courseId);
    }

    // Get published content for a course
    public List<CourseContent> getPublishedContentByCourse(Long courseId) {
        return courseContentRepository.findByCourseIdAndIsPublishedTrueOrderByContentOrder(courseId);
    }

    // Get content for a lesson
    public List<CourseContent> getContentByLesson(Long lessonId) {
        return courseContentRepository.findByLessonIdOrderByContentOrder(lessonId);
    }

    // Get published content for a lesson
    public List<CourseContent> getPublishedContentByLesson(Long lessonId) {
        return courseContentRepository.findByLessonIdAndIsPublishedTrueOrderByContentOrder(lessonId);
    }

    // Get content by type
    public List<CourseContent> getContentByType(Long courseId, String contentType) {
        return courseContentRepository.findByCourseIdAndContentTypeOrderByContentOrder(courseId, contentType);
    }

    // Get video content
    public List<CourseContent> getVideoContent(Long courseId) {
        return courseContentRepository.findVideoByCourseId(courseId);
    }

    // Get meet links
    public List<CourseContent> getMeetLinks(Long courseId) {
        return courseContentRepository.findMeetLinksByCourseId(courseId);
    }

    // Get text content
    public List<CourseContent> getTextContent(Long courseId) {
        return courseContentRepository.findTextContentByCourseId(courseId);
    }

    // Get upcoming meet links
    public List<CourseContent> getUpcomingMeetLinks() {
        return courseContentRepository.findUpcomingMeetLinks();
    }

    // Search content
    public List<CourseContent> searchContent(Long courseId, String keyword) {
        return courseContentRepository.searchContentInCourse(courseId, keyword);
    }

    // Publish content
    public CourseContent publishContent(Long contentId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + contentId));
        
        content.setIsPublished(true);
        content.setUpdatedAt(LocalDateTime.now());
        
        return courseContentRepository.save(content);
    }

    // Unpublish content
    public CourseContent unpublishContent(Long contentId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + contentId));
        
        content.setIsPublished(false);
        content.setUpdatedAt(LocalDateTime.now());
        
        return courseContentRepository.save(content);
    }

    // Reorder content
    public void reorderContent(Long courseId, List<Long> contentIds) {
        for (int i = 0; i < contentIds.size(); i++) {
            Long contentId = contentIds.get(i);
            CourseContent content = courseContentRepository.findById(contentId)
                    .orElseThrow(() -> new RuntimeException("Content not found with id: " + contentId));
            
            // Verify content belongs to the course
            if (!content.getCourseId().equals(courseId)) {
                throw new RuntimeException("Content does not belong to course");
            }
            
            content.setContentOrder(i + 1);
            content.setUpdatedAt(LocalDateTime.now());
            courseContentRepository.save(content);
        }
    }

    // Move content to lesson
    public CourseContent moveContentToLesson(Long contentId, Long lessonId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + contentId));

        // Verify lesson exists and belongs to the same course
        if (lessonId != null) {
            CourseLesson lesson = courseLessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
            
            if (!lesson.getCourseId().equals(content.getCourseId())) {
                throw new RuntimeException("Lesson does not belong to the same course as content");
            }
        }

        content.setLessonId(lessonId);
        content.setUpdatedAt(LocalDateTime.now());

        return courseContentRepository.save(content);
    }

    // Create video content
    public CourseContent createVideoContent(Long courseId, Long lessonId, String title, String description, 
                                          String videoUrl, Integer duration, String thumbnail, Long createdBy) {
        CourseContent content = new CourseContent(courseId, title, "VIDEO");
        content.setLessonId(lessonId);
        content.setDescription(description);
        content.setVideoUrl(videoUrl);
        content.setVideoDuration(duration);
        content.setVideoThumbnail(thumbnail);
        content.setCreatedBy(createdBy);
        
        return createContent(content);
    }

    // Create text content
    public CourseContent createTextContent(Long courseId, Long lessonId, String title, String description, 
                                         String textContent, Long createdBy) {
        CourseContent content = new CourseContent(courseId, title, "TEXT");
        content.setLessonId(lessonId);
        content.setDescription(description);
        content.setTextContent(textContent);
        content.setCreatedBy(createdBy);
        
        return createContent(content);
    }

    // Create meet link content
    public CourseContent createMeetLinkContent(Long courseId, Long lessonId, String title, String description,
                                             String meetLink, LocalDateTime startTime, LocalDateTime endTime,
                                             String password, Long createdBy) {
        CourseContent content = new CourseContent(courseId, title, "MEET_LINK");
        content.setLessonId(lessonId);
        content.setDescription(description);
        content.setMeetLink(meetLink);
        content.setMeetStartTime(startTime);
        content.setMeetEndTime(endTime);
        content.setMeetPassword(password);
        content.setCreatedBy(createdBy);
        
        return createContent(content);
    }

    // Create document content
    public CourseContent createDocumentContent(Long courseId, Long lessonId, String title, String description,
                                             String documentUrl, String documentName, Long documentSize, Long createdBy) {
        CourseContent content = new CourseContent(courseId, title, "DOCUMENT");
        content.setLessonId(lessonId);
        content.setDescription(description);
        content.setDocumentUrl(documentUrl);
        content.setDocumentName(documentName);
        content.setDocumentSize(documentSize);
        content.setCreatedBy(createdBy);
        
        return createContent(content);
    }

    // Get content statistics for course
    public ContentStatistics getContentStatistics(Long courseId) {
        List<CourseContent> allContent = getContentByCourse(courseId);
        
        ContentStatistics stats = new ContentStatistics();
        stats.totalContent = allContent.size();
        stats.publishedContent = (int) allContent.stream().filter(CourseContent::getIsPublished).count();
        stats.videoContent = (int) allContent.stream().filter(CourseContent::isVideoContent).count();
        stats.textContent = (int) allContent.stream().filter(CourseContent::isTextContent).count();
        stats.meetLinks = (int) allContent.stream().filter(CourseContent::isMeetLink).count();
        stats.documentContent = (int) allContent.stream().filter(CourseContent::isDocument).count();
        stats.freeContent = (int) allContent.stream().filter(CourseContent::getIsFree).count();
        stats.requiredContent = (int) allContent.stream().filter(CourseContent::getRequiredCompletion).count();
        
        return stats;
    }

    // Inner class for content statistics
    public static class ContentStatistics {
        public int totalContent;
        public int publishedContent;
        public int videoContent;
        public int textContent;
        public int meetLinks;
        public int documentContent;
        public int freeContent;
        public int requiredContent;
    }
} 