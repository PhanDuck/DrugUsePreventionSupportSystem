package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {
    
    // Find content by course ID
    List<CourseContent> findByCourseIdOrderByContentOrder(Long courseId);
    
    // Find content by lesson ID
    List<CourseContent> findByLessonIdOrderByContentOrder(Long lessonId);
    
    // Find content by course and lesson
    List<CourseContent> findByCourseIdAndLessonIdOrderByContentOrder(Long courseId, Long lessonId);
    
    // Find published content by course
    List<CourseContent> findByCourseIdAndIsPublishedTrueOrderByContentOrder(Long courseId);
    
    // Find published content by lesson
    List<CourseContent> findByLessonIdAndIsPublishedTrueOrderByContentOrder(Long lessonId);
    
    // Find content by type
    List<CourseContent> findByCourseIdAndContentTypeOrderByContentOrder(Long courseId, String contentType);
    
    // Find free content
    List<CourseContent> findByCourseIdAndIsFreeTrue(Long courseId);
    
    // Find required content
    List<CourseContent> findByCourseIdAndRequiredCompletionTrue(Long courseId);
    
    // Find content created by specific user
    List<CourseContent> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    
    // Count content by course
    long countByCourseId(Long courseId);
    
    // Count content by lesson
    long countByLessonId(Long lessonId);
    
    // Count published content by course
    long countByCourseIdAndIsPublishedTrue(Long courseId);
    
    // Find video content
    @Query("SELECT c FROM CourseContent c WHERE c.courseId = :courseId AND c.contentType = 'VIDEO' ORDER BY c.contentOrder")
    List<CourseContent> findVideoByCourseId(@Param("courseId") Long courseId);
    
    // Find meet links
    @Query("SELECT c FROM CourseContent c WHERE c.courseId = :courseId AND c.contentType = 'MEET_LINK' ORDER BY c.contentOrder")
    List<CourseContent> findMeetLinksByCourseId(@Param("courseId") Long courseId);
    
    // Find text content
    @Query("SELECT c FROM CourseContent c WHERE c.courseId = :courseId AND c.contentType = 'TEXT' ORDER BY c.contentOrder")
    List<CourseContent> findTextContentByCourseId(@Param("courseId") Long courseId);
    
    // Get next content order for course
    @Query("SELECT COALESCE(MAX(c.contentOrder), 0) + 1 FROM CourseContent c WHERE c.courseId = :courseId")
    Integer getNextContentOrder(@Param("courseId") Long courseId);
    
    // Get next content order for lesson
    @Query("SELECT COALESCE(MAX(c.contentOrder), 0) + 1 FROM CourseContent c WHERE c.lessonId = :lessonId")
    Integer getNextContentOrderForLesson(@Param("lessonId") Long lessonId);
    
    // Search content by title or description
    @Query("SELECT c FROM CourseContent c WHERE c.courseId = :courseId AND (c.title LIKE %:keyword% OR c.description LIKE %:keyword%) ORDER BY c.contentOrder")
    List<CourseContent> searchContentInCourse(@Param("courseId") Long courseId, @Param("keyword") String keyword);
    
    // Find content with upcoming meet times
    @Query("SELECT c FROM CourseContent c WHERE c.contentType = 'MEET_LINK' AND c.meetStartTime > CURRENT_TIMESTAMP ORDER BY c.meetStartTime")
    List<CourseContent> findUpcomingMeetLinks();
    
    // Find content by course and content types
    @Query("SELECT c FROM CourseContent c WHERE c.courseId = :courseId AND c.contentType IN :contentTypes ORDER BY c.contentOrder")
    List<CourseContent> findByCourseIdAndContentTypes(@Param("courseId") Long courseId, @Param("contentTypes") List<String> contentTypes);
    
    // Check if content exists in lesson
    boolean existsByLessonIdAndTitle(Long lessonId, String title);
    
    // Check if content exists in course
    boolean existsByCourseIdAndTitle(Long courseId, String title);
} 