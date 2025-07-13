package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    // Find recommendations by user ID
    List<Recommendation> findByUserId(Long userId);
    
    // Find recommendations by assessment result ID
    List<Recommendation> findByAssessmentResultId(Long assessmentResultId);
    
    // Find recommendations by type
    List<Recommendation> findByRecommendationType(String recommendationType);
    
    // Find recommendations by risk level
    List<Recommendation> findByRiskLevel(String riskLevel);
    
    // Find recommendations by status
    List<Recommendation> findByStatus(String status);
    
    // Find active recommendations
    List<Recommendation> findByIsActiveTrue();
    
    // Find recommendations by user and status
    List<Recommendation> findByUserIdAndStatus(Long userId, String status);
    
    // Find recommendations by user and type
    List<Recommendation> findByUserIdAndRecommendationType(Long userId, String recommendationType);
    
    // Find recommendations by priority
    List<Recommendation> findByPriority(Integer priority);
    
    // Find high priority recommendations
    @Query("SELECT r FROM Recommendation r WHERE r.priority = 1 AND r.isActive = true")
    List<Recommendation> findHighPriorityRecommendations();
    
    // Find recommendations by user and priority
    List<Recommendation> findByUserIdAndPriority(Long userId, Integer priority);
    
    // Find pending recommendations for user
    @Query("SELECT r FROM Recommendation r WHERE r.userId = :userId AND r.status = 'pending' AND r.isActive = true")
    List<Recommendation> findPendingByUserId(@Param("userId") Long userId);
    
    // Count recommendations by user
    @Query("SELECT COUNT(r) FROM Recommendation r WHERE r.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Count pending recommendations by user
    @Query("SELECT COUNT(r) FROM Recommendation r WHERE r.userId = :userId AND r.status = 'pending' AND r.isActive = true")
    Long countPendingByUserId(@Param("userId") Long userId);
    
    // Get recent recommendations
    List<Recommendation> findTop10ByOrderByCreatedAtDesc();
    
    // Find recommendations by target ID
    List<Recommendation> findByTargetId(Long targetId);
} 