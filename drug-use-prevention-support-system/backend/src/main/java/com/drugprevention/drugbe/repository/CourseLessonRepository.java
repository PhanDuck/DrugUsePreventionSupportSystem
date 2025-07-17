package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {
    
    // Find lessons by course ID
    List<CourseLesson> findByCourseIdOrderByLessonOrder(Long courseId);
    
    // Find published lessons by course
    List<CourseLesson> findByCourseIdAndIsPublishedTrueOrderByLessonOrder(Long courseId);
    
    // Find free lessons by course
    List<CourseLesson> findByCourseIdAndIsFreeTrue(Long courseId);
    
    // Find required lessons by course
    List<CourseLesson> findByCourseIdAndRequiredCompletionTrue(Long courseId);
    
    // Find lessons created by specific user
    List<CourseLesson> findByCreatedByOrderByCreatedAtDesc(Long createdBy);
    
    // Count lessons by course
    long countByCourseId(Long courseId);
    
    // Count published lessons by course
    long countByCourseIdAndIsPublishedTrue(Long courseId);
    
    // Get next lesson order for course
    @Query("SELECT COALESCE(MAX(l.lessonOrder), 0) + 1 FROM CourseLesson l WHERE l.courseId = :courseId")
    Integer getNextLessonOrder(@Param("courseId") Long courseId);
    
    // Search lessons by title or description
    @Query("SELECT l FROM CourseLesson l WHERE l.courseId = :courseId AND (l.title LIKE %:keyword% OR l.description LIKE %:keyword%) ORDER BY l.lessonOrder")
    List<CourseLesson> searchLessonsInCourse(@Param("courseId") Long courseId, @Param("keyword") String keyword);
    
    // Find lessons with content count
    @Query("SELECT l, COUNT(c) as contentCount FROM CourseLesson l LEFT JOIN CourseContent c ON l.id = c.lessonId WHERE l.courseId = :courseId GROUP BY l ORDER BY l.lessonOrder")
    List<Object[]> findLessonsWithContentCount(@Param("courseId") Long courseId);
    
    // Check if lesson exists in course with title
    boolean existsByCourseIdAndTitle(Long courseId, String title);
    
    // Find first lesson in course
    @Query("SELECT l FROM CourseLesson l WHERE l.courseId = :courseId ORDER BY l.lessonOrder LIMIT 1")
    CourseLesson findFirstLessonInCourse(@Param("courseId") Long courseId);
    
    // Find last lesson in course
    @Query("SELECT l FROM CourseLesson l WHERE l.courseId = :courseId ORDER BY l.lessonOrder DESC LIMIT 1")
    CourseLesson findLastLessonInCourse(@Param("courseId") Long courseId);
    
    // Find next lesson after given order
    @Query("SELECT l FROM CourseLesson l WHERE l.courseId = :courseId AND l.lessonOrder > :currentOrder ORDER BY l.lessonOrder LIMIT 1")
    CourseLesson findNextLesson(@Param("courseId") Long courseId, @Param("currentOrder") Integer currentOrder);
    
    // Find previous lesson before given order
    @Query("SELECT l FROM CourseLesson l WHERE l.courseId = :courseId AND l.lessonOrder < :currentOrder ORDER BY l.lessonOrder DESC LIMIT 1")
    CourseLesson findPreviousLesson(@Param("courseId") Long courseId, @Param("currentOrder") Integer currentOrder);
} 