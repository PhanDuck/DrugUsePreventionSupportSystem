package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    
    // Find registrations by user ID
    List<CourseRegistration> findByUserId(Long userId);
    
    // Find registrations by course ID
    List<CourseRegistration> findByCourseId(Long courseId);
    
    // Find registration by user and course
    Optional<CourseRegistration> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Find registrations by status
    List<CourseRegistration> findByStatus(String status);
    
    // Find active registrations
    List<CourseRegistration> findByIsActiveTrue();
    
    // Find registrations by user and status
    List<CourseRegistration> findByUserIdAndStatus(Long userId, String status);
    
    // Find registrations by course and status
    List<CourseRegistration> findByCourseIdAndStatus(Long courseId, String status);
    
    // Find registrations by registration date
    List<CourseRegistration> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find completed registrations
    List<CourseRegistration> findByStatusAndCompletionDateIsNotNull(String status);
    
    // Count registrations by course
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.courseId = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
    
    // Count registrations by user
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Count active registrations by course
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.courseId = :courseId AND cr.status = 'registered' AND cr.isActive = true")
    Long countActiveByCourseId(@Param("courseId") Long courseId);
    
    // Get latest registrations
    List<CourseRegistration> findTop10ByOrderByRegistrationDateDesc();
    
    // Check if user is already registered for course
    boolean existsByUserIdAndCourseIdAndIsActiveTrue(Long userId, Long courseId);
    
    // Check if user is registered for course (any status)
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
} 