package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    
    // Tìm kiếm cơ bản
    List<AssessmentResult> findByAssessmentId(Long assessmentId);
    List<AssessmentResult> findByUserId(Long userId);
    
    // Tìm theo thời gian
    List<AssessmentResult> findByUserIdAndCompletedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<AssessmentResult> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Lấy kết quả mới nhất của user cho assessment cụ thể
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.userId = :userId AND ar.assessmentId = :assessmentId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUserAndAssessment(@Param("userId") Long userId, @Param("assessmentId") Long assessmentId);
    
    // Lấy kết quả mới nhất của user
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.userId = :userId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUser(@Param("userId") Long userId);
    
    // Đếm số lần làm assessment của user
    @Query("SELECT COUNT(ar) FROM AssessmentResult ar WHERE ar.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Thống kê theo ngày
    @Query("SELECT CAST(ar.completedAt AS DATE), COUNT(ar), AVG(ar.totalScore) FROM AssessmentResult ar WHERE ar.completedAt BETWEEN :startDate AND :endDate GROUP BY CAST(ar.completedAt AS DATE) ORDER BY CAST(ar.completedAt AS DATE)")
    List<Object[]> getDailyStatistics(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Lấy kết quả mới nhất
    List<AssessmentResult> findTop5ByOrderByCompletedAtDesc();
    List<AssessmentResult> findTop10ByOrderByCreatedAtDesc();
    
    // Tìm theo risk level
    List<AssessmentResult> findByRiskLevelIn(List<String> riskLevels, Pageable pageable);
    List<AssessmentResult> findByRiskLevel(String riskLevel);
    
    // Tìm theo assessment và user
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.userId = :userId AND ar.assessmentId = :assessmentId")
    List<AssessmentResult> findByUserIdAndAssessmentId(@Param("userId") Long userId, @Param("assessmentId") Long assessmentId);
}