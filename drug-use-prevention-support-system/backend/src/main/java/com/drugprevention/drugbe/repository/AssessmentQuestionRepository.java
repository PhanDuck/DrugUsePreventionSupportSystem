package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Long> {
    
    // Find questions by assessment ID
    List<AssessmentQuestion> findByAssessmentId(Long assessmentId);
    
    // Find questions by assessment ID and order by order index
    List<AssessmentQuestion> findByAssessmentIdOrderByOrderIndex(Long assessmentId);
    
    // Find active questions
    List<AssessmentQuestion> findByIsActiveTrue();
    
    // Find questions by type
    List<AssessmentQuestion> findByQuestionType(String questionType);
    
    // Find required questions
    List<AssessmentQuestion> findByIsRequiredTrue();
    
    // Find questions by keyword
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.question LIKE %:keyword%")
    List<AssessmentQuestion> findByKeyword(@Param("keyword") String keyword);
    
    // Count questions by assessment
    @Query("SELECT COUNT(aq) FROM AssessmentQuestion aq WHERE aq.assessmentId = :assessmentId")
    Long countByAssessmentId(@Param("assessmentId") Long assessmentId);
    
    // Get next question in assessment
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.assessmentId = :assessmentId AND aq.orderIndex > :currentOrder ORDER BY aq.orderIndex ASC LIMIT 1")
    Optional<AssessmentQuestion> findNextQuestion(@Param("assessmentId") Long assessmentId, @Param("currentOrder") Integer currentOrder);
} 