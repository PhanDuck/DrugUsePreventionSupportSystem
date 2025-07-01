package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    
    // Tìm questions theo assessment ID
    List<AssessmentQuestion> findByAssessmentId(Long assessmentId);
    
    // Tìm questions theo assessment ID và sắp xếp theo order
    List<AssessmentQuestion> findByAssessmentIdOrderByOrderIndex(Long assessmentId);
    
    // Tìm questions active
    List<AssessmentQuestion> findByIsActiveTrue();
    
    // Tìm questions theo type
    List<AssessmentQuestion> findByQuestionType(String questionType);
    
    // Tìm questions required
    List<AssessmentQuestion> findByIsRequiredTrue();
    
    // Tìm questions theo keyword
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.question LIKE %:keyword%")
    List<AssessmentQuestion> findByQuestionContaining(@Param("keyword") String keyword);
    
    // Đếm questions theo assessment
    @Query("SELECT COUNT(aq) FROM AssessmentQuestion aq WHERE aq.assessmentId = :assessmentId")
    Long countByAssessmentId(@Param("assessmentId") Long assessmentId);
    
    // Lấy question tiếp theo trong assessment
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.assessmentId = :assessmentId AND aq.orderIndex > :currentOrder ORDER BY aq.orderIndex ASC LIMIT 1")
    AssessmentQuestion findNextQuestion(@Param("assessmentId") Long assessmentId, @Param("currentOrder") Integer currentOrder);
} 