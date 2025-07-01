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
    
    // Tìm courses theo instructor ID
    List<Course> findByInstructorId(Long instructorId);
    
    // Tìm courses theo category ID
    List<Course> findByCategoryId(Long categoryId);
    
    // Tìm courses theo status
    List<Course> findByStatus(String status);
    
    // Tìm courses active
    List<Course> findByIsActiveTrue();
    
    // Tìm featured courses
    List<Course> findByIsFeaturedTrue();
    
    // Tìm open courses
    List<Course> findByStatusAndIsActiveTrue(String status);
    
    // Tìm courses theo title
    List<Course> findByTitleContaining(String title);
    
    // Tìm courses theo keyword trong title hoặc description
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> findByKeyword(@Param("keyword") String keyword);
    
    // Tìm courses theo thời gian
    List<Course> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Course> findByStartDateAfter(LocalDateTime startDate);
    
    // Tìm courses có chỗ trống
    @Query("SELECT c FROM Course c WHERE c.currentParticipants < c.maxParticipants AND c.status = 'open'")
    List<Course> findAvailableCourses();
    
    // Lấy courses mới nhất
    List<Course> findTop10ByStatusOrderByCreatedAtDesc(String status);
    
    // Lấy popular courses
    List<Course> findTop10ByStatusOrderByCurrentParticipantsDesc(String status);
    
    // Page courses với filter
    Page<Course> findByStatusAndIsActiveTrue(String status, Pageable pageable);
    Page<Course> findByCategoryIdAndStatusAndIsActiveTrue(Long categoryId, String status, Pageable pageable);
    
    // Đếm courses theo category
    @Query("SELECT COUNT(c) FROM Course c WHERE c.categoryId = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
    
    // Đếm courses theo instructor
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructorId = :instructorId")
    Long countByInstructorId(@Param("instructorId") Long instructorId);
    
    // Lấy courses theo instructor và status
    List<Course> findByInstructorIdAndStatus(Long instructorId, String status);
} 