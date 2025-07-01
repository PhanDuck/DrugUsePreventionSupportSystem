package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    
    // Tìm recommendations theo user ID
    List<Recommendation> findByUserId(Long userId);
    
    // Tìm recommendations theo assessment result ID
    List<Recommendation> findByAssessmentResultId(Long assessmentResultId);
    
    // Tìm recommendations theo type
    List<Recommendation> findByRecommendationType(String recommendationType);
    
    // Tìm recommendations theo risk level
    List<Recommendation> findByRiskLevel(String riskLevel);
    
    // Tìm recommendations theo status
    List<Recommendation> findByStatus(String status);
    
    // Tìm active recommendations
    List<Recommendation> findByIsActiveTrue();
    
    // Tìm recommendations theo user và status
    List<Recommendation> findByUserIdAndStatus(Long userId, String status);
    
    // Tìm recommendations theo user và type
    List<Recommendation> findByUserIdAndRecommendationType(Long userId, String recommendationType);
    
    // Tìm recommendations theo priority
    List<Recommendation> findByPriority(Integer priority);
    
    // Tìm high priority recommendations
    @Query("SELECT r FROM Recommendation r WHERE r.priority <= 2 ORDER BY r.priority ASC")
    List<Recommendation> findHighPriorityRecommendations();
    
    // Tìm recommendations theo user và priority
    @Query("SELECT r FROM Recommendation r WHERE r.userId = :userId ORDER BY r.priority ASC, r.createdAt DESC")
    List<Recommendation> findByUserIdOrderByPriority(@Param("userId") Long userId);
    
    // Tìm pending recommendations cho user
    @Query("SELECT r FROM Recommendation r WHERE r.userId = :userId AND r.status = 'pending' AND r.isActive = true ORDER BY r.priority ASC")
    List<Recommendation> findPendingByUserId(@Param("userId") Long userId);
    
    // Đếm recommendations theo user
    @Query("SELECT COUNT(r) FROM Recommendation r WHERE r.userId = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Đếm pending recommendations theo user
    @Query("SELECT COUNT(r) FROM Recommendation r WHERE r.userId = :userId AND r.status = 'pending' AND r.isActive = true")
    Long countPendingByUserId(@Param("userId") Long userId);
    
    // Lấy recommendations mới nhất
    List<Recommendation> findTop10ByOrderByCreatedAtDesc();
    
    // Tìm recommendations theo target ID
    List<Recommendation> findByTargetId(Long targetId);
} 