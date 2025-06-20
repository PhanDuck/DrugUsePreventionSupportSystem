package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
    
    // Tìm kiếm cơ bản
    List<Course> findByStatus(String status);
    List<Course> findByCategory(Category category);
    List<Course> findByCategory_CategoryID(Integer categoryId);
    
    // Tìm theo thời gian
    List<Course> findByStatusAndEndDateAfter(String status, LocalDateTime date);
    List<Course> findByStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Course> findByEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Khóa học đang diễn ra
    @Query("SELECT c FROM Course c WHERE c.status = 'ACTIVE' AND c.startDate <= :now AND c.endDate >= :now")
    List<Course> findOngoingCourses(@Param("now") LocalDateTime now);
    
    // Khóa học sắp diễn ra
    @Query("SELECT c FROM Course c WHERE c.status = 'ACTIVE' AND c.startDate > :now")
    List<Course> findUpcomingCourses(@Param("now") LocalDateTime now);
    
    // Khóa học đã kết thúc
    @Query("SELECT c FROM Course c WHERE c.endDate < :now")
    List<Course> findCompletedCourses(@Param("now") LocalDateTime now);
    
    // Khóa học có slot trống (capacity > số registration)
    @Query("SELECT c FROM Course c WHERE c.capacity > SIZE(c.registrations) AND c.status = 'ACTIVE'")
    List<Course> findAvailableCourses();
    
    // Tìm theo từ khóa trong title hoặc description
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> findByKeyword(@Param("keyword") String keyword);
    
    // Khóa học phổ biến (nhiều registration nhất)
    @Query("SELECT c, SIZE(c.registrations) as regCount FROM Course c WHERE c.status = 'ACTIVE' ORDER BY regCount DESC")
    List<Object[]> findPopularCourses();
    
    // Đếm số registration theo course
    @Query("SELECT c.courseID, c.title, SIZE(c.registrations) FROM Course c")
    List<Object[]> countRegistrationsPerCourse();
    
    // Thống kê khóa học theo category
    @Query("SELECT cat.name, COUNT(c) FROM Course c JOIN c.category cat GROUP BY cat.name")
    List<Object[]> countCoursesByCategory();
    
    // Lấy khóa học theo status và category
    List<Course> findByStatusAndCategory_CategoryID(String status, Integer categoryId);
    
    // Kiểm tra khóa học có đủ slot không
    @Query("SELECT CASE WHEN c.capacity > SIZE(c.registrations) THEN true ELSE false END FROM Course c WHERE c.courseID = :courseId")
    Boolean hasAvailableSlots(@Param("courseId") Integer courseId);
    
    // Lấy số slot còn lại
    @Query("SELECT (c.capacity - SIZE(c.registrations)) FROM Course c WHERE c.courseID = :courseId")
    Integer getAvailableSlots(@Param("courseId") Integer courseId);
} 