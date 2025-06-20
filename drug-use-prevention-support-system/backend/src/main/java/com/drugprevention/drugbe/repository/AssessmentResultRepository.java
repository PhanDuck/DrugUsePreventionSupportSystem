package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Integer> {
    
    // Tìm kiếm cơ bản
    List<AssessmentResult> findByAssessment_AssessmentID(Integer assessmentId);
    List<AssessmentResult> findByUser_UserID(Integer userId);
    List<AssessmentResult> findByUser(User user);
    List<AssessmentResult> findByAssessment(Assessment assessment);
    
    // Tìm theo thời gian
    List<AssessmentResult> findByUser_UserIDAndCompletedAtBetween(Integer userId, LocalDateTime startDate, LocalDateTime endDate);
    List<AssessmentResult> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<AssessmentResult> findByTakeTimeBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Tìm theo risk level
    List<AssessmentResult> findByRiskLevel(String riskLevel);
    List<AssessmentResult> findByUser_UserIDAndRiskLevel(Integer userId, String riskLevel);
    
    // Thống kê theo risk level
    @Query("SELECT ar.riskLevel, COUNT(ar) FROM AssessmentResult ar GROUP BY ar.riskLevel")
    List<Object[]> countByRiskLevel();
    
    // Thống kê theo assessment
    @Query("SELECT a.assessmentName, COUNT(ar) FROM AssessmentResult ar JOIN ar.assessment a GROUP BY a.assessmentName")
    List<Object[]> countByAssessment();
    
    // Điểm trung bình theo assessment
    @Query("SELECT a.assessmentName, AVG(ar.totalScore) FROM AssessmentResult ar JOIN ar.assessment a GROUP BY a.assessmentName")
    List<Object[]> averageScoreByAssessment();
    
    // Điểm trung bình theo risk level
    @Query("SELECT ar.riskLevel, AVG(ar.totalScore) FROM AssessmentResult ar GROUP BY ar.riskLevel")
    List<Object[]> averageScoreByRiskLevel();
    
    // Lấy kết quả mới nhất của user cho assessment cụ thể
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.user.userID = :userId AND ar.assessment.assessmentID = :assessmentId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUserAndAssessment(@Param("userId") Integer userId, @Param("assessmentId") Integer assessmentId);
    
    // Lấy kết quả mới nhất của user
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.user.userID = :userId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUser(@Param("userId") Integer userId);
    
    // Đếm số lần làm assessment của user
    @Query("SELECT COUNT(ar) FROM AssessmentResult ar WHERE ar.user.userID = :userId")
    Long countByUserId(@Param("userId") Integer userId);
    
    // Thống kê theo ngày
    @Query("SELECT DATE(ar.completedAt), COUNT(ar), AVG(ar.totalScore) FROM AssessmentResult ar WHERE ar.completedAt BETWEEN :startDate AND :endDate GROUP BY DATE(ar.completedAt) ORDER BY DATE(ar.completedAt)")
    List<Object[]> getDailyStatistics(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Lấy top users có điểm cao nhất
    @Query("SELECT ar.user, AVG(ar.totalScore) as avgScore FROM AssessmentResult ar GROUP BY ar.user ORDER BY avgScore DESC")
    List<Object[]> findTopUsersByAverageScore();
}