package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Find courses by instructor ID
    List<Course> findByInstructorId(Long instructorId);
    
    // Find courses by category ID
    List<Course> findByCategoryId(Long categoryId);
    
    // Find courses by status
    List<Course> findByStatus(String status);
    
    // Find active courses
    List<Course> findByIsActiveTrue();
    
    // Find featured courses
    List<Course> findByIsFeaturedTrue();
    
    // Find open courses
    List<Course> findByStatusAndIsActiveTrue(String status);
    
    // Find courses by title
    List<Course> findByTitleContaining(String title);
    
    // Find courses by keyword in title or description
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> findByKeyword(@Param("keyword") String keyword);
    
    // Find courses by time
    List<Course> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Course> findByStartDateAfter(LocalDateTime startDate);
    
    // Find courses with available spots
    @Query("SELECT c FROM Course c WHERE c.currentParticipants < c.maxParticipants AND c.status = 'open'")
    List<Course> findAvailableCourses();
    
    // Get latest courses
    List<Course> findTop10ByStatusOrderByCreatedAtDesc(String status);
    
    // Get popular courses
    List<Course> findTop10ByStatusOrderByCurrentParticipantsDesc(String status);
    
    // Page courses with filter
    Page<Course> findByStatusAndIsActiveTrue(String status, Pageable pageable);
    Page<Course> findByCategoryIdAndStatusAndIsActiveTrue(Long categoryId, String status, Pageable pageable);
    
    // Count courses by category
    @Query("SELECT COUNT(c) FROM Course c WHERE c.categoryId = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
    
    // Count courses by instructor
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructorId = :instructorId")
    Long countByInstructorId(@Param("instructorId") Long instructorId);
    
    // Get courses by instructor and status
    List<Course> findByInstructorIdAndStatus(Long instructorId, String status);
} 