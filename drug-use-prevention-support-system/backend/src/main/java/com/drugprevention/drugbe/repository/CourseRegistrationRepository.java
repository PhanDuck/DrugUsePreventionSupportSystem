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
    
    // Tìm registrations theo user ID
    List<CourseRegistration> findByUserId(Long userId);
    
    // Tìm registrations theo course ID
    List<CourseRegistration> findByCourseId(Long courseId);
    
    // Tìm registration theo user và course
    Optional<CourseRegistration> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Tìm registrations theo status
    List<CourseRegistration> findByStatus(String status);
    
    // Tìm active registrations
    List<CourseRegistration> findByIsActiveTrue();
    
    // Tìm registrations theo user và status
    List<CourseRegistration> findByUserIdAndStatus(Long userId, String status);
    
    // Tìm registrations theo course và status
    List<CourseRegistration> findByCourseIdAndStatus(Long courseId, String status);
    
    // Tìm registrations theo thời gian đăng ký
    List<CourseRegistration> findByRegistrationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Tìm completed registrations
    List<CourseRegistration> findByStatusAndCompletionDateIsNotNull(String status);
    
    // Đếm registrations theo course
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.courseId = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
    
    // Đếm registrations theo user
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Đếm active registrations theo course
    @Query("SELECT COUNT(cr) FROM CourseRegistration cr WHERE cr.courseId = :courseId AND cr.status = 'registered' AND cr.isActive = true")
    Long countActiveByCourseId(@Param("courseId") Long courseId);
    
    // Lấy registrations mới nhất
    List<CourseRegistration> findTop10ByOrderByRegistrationDateDesc();
    
    // Check if user is already registered for course
    boolean existsByUserIdAndCourseIdAndIsActiveTrue(Long userId, Long courseId);
} 