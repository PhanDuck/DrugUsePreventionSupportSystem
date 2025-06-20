package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Integer> {
    
    // Tìm kiếm cơ bản
    Optional<CourseRegistration> findByUserAndCourse(User user, Course course);
    List<CourseRegistration> findByUser(User user);
    List<CourseRegistration> findByCourse(Course course);
    List<CourseRegistration> findByUser_UserID(Integer userId);
    List<CourseRegistration> findByCourse_CourseID(Integer courseId);
    
    // Đếm số registration
    long countByCourse(Course course);
    long countByUser(User user);
    long countByCourse_CourseID(Integer courseId);
    long countByUser_UserID(Integer userId);
    
    // Kiểm tra user đã đăng ký course chưa
    boolean existsByUserAndCourse(User user, Course course);
    boolean existsByUser_UserIDAndCourse_CourseID(Integer userId, Integer courseId);
    
    // Tìm theo thời gian đăng ký
    List<CourseRegistration> findByRegisterTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<CourseRegistration> findByUser_UserIDAndRegisterTimeBetween(Integer userId, LocalDateTime startDate, LocalDateTime endDate);
    
    // Lấy registration mới nhất của user
    @Query("SELECT cr FROM CourseRegistration cr WHERE cr.user.userID = :userId ORDER BY cr.registerTime DESC")
    List<CourseRegistration> findLatestByUser(@Param("userId") Integer userId);
    
    // Lấy registration mới nhất của course
    @Query("SELECT cr FROM CourseRegistration cr WHERE cr.course.courseID = :courseId ORDER BY cr.registerTime DESC")
    List<CourseRegistration> findLatestByCourse(@Param("courseId") Integer courseId);
    
    // Thống kê registration theo course
    @Query("SELECT c.title, COUNT(cr) FROM CourseRegistration cr JOIN cr.course c GROUP BY c.title ORDER BY COUNT(cr) DESC")
    List<Object[]> countRegistrationsByCourse();
    
    // Thống kê registration theo user
    @Query("SELECT u.fullName, COUNT(cr) FROM CourseRegistration cr JOIN cr.user u GROUP BY u.fullName ORDER BY COUNT(cr) DESC")
    List<Object[]> countRegistrationsByUser();
    
    // Thống kê registration theo tháng
    @Query("SELECT YEAR(cr.registerTime), MONTH(cr.registerTime), COUNT(cr) FROM CourseRegistration cr WHERE cr.registerTime BETWEEN :startDate AND :endDate GROUP BY YEAR(cr.registerTime), MONTH(cr.registerTime) ORDER BY YEAR(cr.registerTime), MONTH(cr.registerTime)")
    List<Object[]> getMonthlyRegistrationStatistics(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Lấy user đăng ký nhiều course nhất
    @Query("SELECT cr.user, COUNT(cr) as regCount FROM CourseRegistration cr GROUP BY cr.user ORDER BY regCount DESC")
    List<Object[]> findMostActiveUsers();
    
    // Lấy course có nhiều registration nhất
    @Query("SELECT cr.course, COUNT(cr) as regCount FROM CourseRegistration cr GROUP BY cr.course ORDER BY regCount DESC")
    List<Object[]> findMostPopularCourses();
    
    // Tìm user cùng đăng ký course (để recommend)
    @Query("SELECT DISTINCT cr2.user FROM CourseRegistration cr1 JOIN CourseRegistration cr2 ON cr1.course = cr2.course WHERE cr1.user.userID = :userId AND cr2.user.userID != :userId")
    List<User> findUsersWithSimilarInterests(@Param("userId") Integer userId);
} 