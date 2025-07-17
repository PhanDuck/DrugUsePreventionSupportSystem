package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {
    
    // Find progress by user and course
    List<CourseProgress> findByUserIdAndCourseIdOrderByCreatedAtDesc(Long userId, Long courseId);
    
    // Find progress by user, course and lesson
    List<CourseProgress> findByUserIdAndCourseIdAndLessonIdOrderByCreatedAtDesc(Long userId, Long courseId, Long lessonId);
    
    // Find progress by user, course, lesson and content
    Optional<CourseProgress> findByUserIdAndCourseIdAndLessonIdAndContentId(Long userId, Long courseId, Long lessonId, Long contentId);
    
    // Find all progress for a user
    List<CourseProgress> findByUserIdOrderByLastAccessedAtDesc(Long userId);
    
    // Find completed progress by user and course
    List<CourseProgress> findByUserIdAndCourseIdAndIsCompletedTrueOrderByCompletedAtDesc(Long userId, Long courseId);
    
    // Find in-progress items by user and course
    List<CourseProgress> findByUserIdAndCourseIdAndIsCompletedFalseOrderByLastAccessedAtDesc(Long userId, Long courseId);
    
    // Check if user completed specific content
    boolean existsByUserIdAndContentIdAndIsCompletedTrue(Long userId, Long contentId);
    
    // Check if user completed specific lesson
    @Query("SELECT COUNT(p) > 0 FROM CourseProgress p WHERE p.userId = :userId AND p.lessonId = :lessonId AND p.progressType = 'LESSON_COMPLETED'")
    boolean hasCompletedLesson(@Param("userId") Long userId, @Param("lessonId") Long lessonId);
    
    // Check if user completed specific course
    @Query("SELECT COUNT(p) > 0 FROM CourseProgress p WHERE p.userId = :userId AND p.courseId = :courseId AND p.progressType = 'COURSE_COMPLETED'")
    boolean hasCompletedCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    // Get course completion percentage for user
    @Query("SELECT " +
           "CASE WHEN COUNT(required_content) = 0 THEN 100.0 " +
           "ELSE (COUNT(CASE WHEN p.isCompleted = true THEN 1 END) * 100.0 / COUNT(required_content)) END " +
           "FROM CourseContent required_content " +
           "LEFT JOIN CourseProgress p ON p.contentId = required_content.id AND p.userId = :userId " +
           "WHERE required_content.courseId = :courseId AND required_content.requiredCompletion = true")
    Double getCourseCompletionPercentage(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    // Get lesson completion percentage for user
    @Query("SELECT " +
           "CASE WHEN COUNT(content) = 0 THEN 100.0 " +
           "ELSE (COUNT(CASE WHEN p.isCompleted = true THEN 1 END) * 100.0 / COUNT(content)) END " +
           "FROM CourseContent content " +
           "LEFT JOIN CourseProgress p ON p.contentId = content.id AND p.userId = :userId " +
           "WHERE content.lessonId = :lessonId")
    Double getLessonCompletionPercentage(@Param("userId") Long userId, @Param("lessonId") Long lessonId);
    
    // Get total time spent by user on course
    @Query("SELECT COALESCE(SUM(p.timeSpent), 0) FROM CourseProgress p WHERE p.userId = :userId AND p.courseId = :courseId")
    Integer getTotalTimeSpentOnCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    // Get total time spent by user on lesson
    @Query("SELECT COALESCE(SUM(p.timeSpent), 0) FROM CourseProgress p WHERE p.userId = :userId AND p.lessonId = :lessonId")
    Integer getTotalTimeSpentOnLesson(@Param("userId") Long userId, @Param("lessonId") Long lessonId);
    
    // Find users who completed a course
    @Query("SELECT DISTINCT p.userId FROM CourseProgress p WHERE p.courseId = :courseId AND p.progressType = 'COURSE_COMPLETED'")
    List<Long> findUsersWhoCompletedCourse(@Param("courseId") Long courseId);
    
    // Find users currently taking a course
    @Query("SELECT DISTINCT p.userId FROM CourseProgress p WHERE p.courseId = :courseId AND p.progressType != 'COURSE_COMPLETED'")
    List<Long> findUsersCurrentlyTakingCourse(@Param("courseId") Long courseId);
    
    // Get course statistics
    @Query("SELECT " +
           "COUNT(DISTINCT p.userId) as totalStudents, " +
           "COUNT(CASE WHEN p.progressType = 'COURSE_COMPLETED' THEN 1 END) as completedStudents, " +
           "AVG(p.timeSpent) as averageTimeSpent " +
           "FROM CourseProgress p WHERE p.courseId = :courseId")
    Object[] getCourseStatistics(@Param("courseId") Long courseId);
    
    // Find progress by type
    List<CourseProgress> findByUserIdAndCourseIdAndProgressType(Long userId, Long courseId, String progressType);
    
    // Get recent activity for user
    @Query("SELECT p FROM CourseProgress p WHERE p.userId = :userId ORDER BY p.lastAccessedAt DESC")
    List<CourseProgress> findRecentActivityByUser(@Param("userId") Long userId);
    
    // Find content that user accessed but didn't complete
    @Query("SELECT p FROM CourseProgress p WHERE p.userId = :userId AND p.courseId = :courseId AND p.isCompleted = false AND p.contentId IS NOT NULL ORDER BY p.lastAccessedAt DESC")
    List<CourseProgress> findIncompleteContentProgress(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    // Get next content for user to complete
    @Query("SELECT c FROM CourseContent c " +
           "LEFT JOIN CourseProgress p ON c.id = p.contentId AND p.userId = :userId " +
           "WHERE c.courseId = :courseId AND c.isPublished = true " +
           "AND (p.id IS NULL OR p.isCompleted = false) " +
           "ORDER BY c.contentOrder LIMIT 1")
    Optional<CourseProgress> findNextContentToComplete(@Param("userId") Long userId, @Param("courseId") Long courseId);
} 