package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    // Find answers by assessment result ID
    List<Answer> findByAssessmentResultId(Long assessmentResultId);
    
    // Find answers by assessment question ID
    List<Answer> findByAssessmentQuestionId(Long assessmentQuestionId);
    
    // Find answer by assessment result and question
    @Query("SELECT a FROM Answer a WHERE a.assessmentResultId = :resultId AND a.assessmentQuestionId = :questionId")
    Optional<Answer> findByAssessmentResultAndQuestion(@Param("resultId") Long resultId, @Param("questionId") Long questionId);
    
    // Find answers by answer value
    List<Answer> findByAnswerValue(Integer answerValue);
    
    // Find answers by answer text containing keyword
    List<Answer> findByAnswerTextContaining(String keyword);
    
    // Count answers by assessment result
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.assessmentResultId = :resultId")
    Long countByAssessmentResultId(@Param("resultId") Long resultId);
    
    // Calculate total score by assessment result
    @Query("SELECT SUM(a.answerValue) FROM Answer a WHERE a.assessmentResultId = :resultId")
    Integer sumAnswerValueByAssessmentResultId(@Param("resultId") Long resultId);
} 