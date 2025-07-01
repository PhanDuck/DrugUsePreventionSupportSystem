package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    // Tìm answers theo assessment result ID
    List<Answer> findByAssessmentResultId(Long assessmentResultId);
    
    // Tìm answers theo assessment question ID
    List<Answer> findByAssessmentQuestionId(Long assessmentQuestionId);
    
    // Tìm answer theo assessment result và question
    @Query("SELECT a FROM Answer a WHERE a.assessmentResultId = :resultId AND a.assessmentQuestionId = :questionId")
    Answer findByAssessmentResultIdAndAssessmentQuestionId(@Param("resultId") Long resultId, @Param("questionId") Long questionId);
    
    // Tìm answers theo answer value
    List<Answer> findByAnswerValue(Integer answerValue);
    
    // Tìm answers theo answer text chứa keyword
    @Query("SELECT a FROM Answer a WHERE a.answerText LIKE %:keyword%")
    List<Answer> findByAnswerTextContaining(@Param("keyword") String keyword);
    
    // Đếm answers theo assessment result
    @Query("SELECT COUNT(a) FROM Answer a WHERE a.assessmentResultId = :resultId")
    Long countByAssessmentResultId(@Param("resultId") Long resultId);
    
    // Tính tổng score theo assessment result
    @Query("SELECT SUM(a.answerValue) FROM Answer a WHERE a.assessmentResultId = :resultId")
    Integer sumAnswerValueByAssessmentResultId(@Param("resultId") Long resultId);
} 