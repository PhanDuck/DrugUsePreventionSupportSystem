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
    
    // Basic search
    List<AssessmentResult> findByUserId(Long userId);
    List<AssessmentResult> findByAssessmentId(Long assessmentId);
    List<AssessmentResult> findByRiskLevel(String riskLevel);
    
    // Find by time
    List<AssessmentResult> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<AssessmentResult> findByCompletedAtAfter(LocalDateTime startDate);
    
    // Get latest result of user for specific assessment
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.userId = :userId AND ar.assessmentId = :assessmentId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUserAndAssessment(@Param("userId") Long userId, @Param("assessmentId") Long assessmentId);
    
    // Get latest result of user
    @Query("SELECT ar FROM AssessmentResult ar WHERE ar.userId = :userId ORDER BY ar.completedAt DESC")
    List<AssessmentResult> findLatestByUser(@Param("userId") Long userId);
    
    // Count number of times user took assessment
    @Query("SELECT COUNT(ar) FROM AssessmentResult ar WHERE ar.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(ar) FROM AssessmentResult ar WHERE ar.assessmentId = :assessmentId")
    Long countByAssessmentId(@Param("assessmentId") Long assessmentId);
    
    // Get latest results
    List<AssessmentResult> findTop10ByOrderByCompletedAtDesc();
    
    // Find by risk level
    List<AssessmentResult> findByRiskLevelOrderByCompletedAtDesc(String riskLevel);
    
    // Find by assessment and user
    List<AssessmentResult> findByAssessmentIdAndUserId(Long assessmentId, Long userId);
    
    // Find top 10 by order by created at desc (alias for findTop10ByOrderByCompletedAtDesc)
    @Query("SELECT ar FROM AssessmentResult ar ORDER BY ar.createdAt DESC LIMIT 10")
    List<AssessmentResult> findTop10ByOrderByCreatedAtDesc();
}