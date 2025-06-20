package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Answer;
import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.entity.AssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Integer> {
    
    // Tìm answers theo AssessmentResult
    List<Answer> findByResult(AssessmentResult result);
    List<Answer> findByResult_ResultID(Integer resultId);
    
    // Tìm answers theo AssessmentQuestion
    List<Answer> findByQuestion(AssessmentQuestion question);
    List<Answer> findByQuestion_QuestionID(Integer questionId);
    
    // Tìm answer cụ thể của user cho question
    Optional<Answer> findByResultAndQuestion(AssessmentResult result, AssessmentQuestion question);
    
    // Tìm answers theo score
    List<Answer> findByScore(Integer score);
    List<Answer> findByScoreGreaterThan(Integer score);
    List<Answer> findByScoreLessThan(Integer score);
    List<Answer> findByScoreBetween(Integer minScore, Integer maxScore);
    
    // Tìm answers theo user answer text
    @Query("SELECT a FROM Answer a WHERE a.userAnswer LIKE %:keyword%")
    List<Answer> findByUserAnswerContaining(@Param("keyword") String keyword);
    
    // Đếm answers theo result
    long countByResult(AssessmentResult result);
    long countByResult_ResultID(Integer resultId);
    
    // Đếm answers theo question
    long countByQuestion(AssessmentQuestion question);
    long countByQuestion_QuestionID(Integer questionId);
    
    // Thống kê điểm trung bình theo question
    @Query("SELECT aq.questionText, AVG(a.score) FROM Answer a JOIN a.question aq GROUP BY aq.questionText")
    List<Object[]> averageScoreByQuestion();
    
    // Thống kê phân bố điểm số
    @Query("SELECT a.score, COUNT(a) FROM Answer a GROUP BY a.score ORDER BY a.score")
    List<Object[]> scoreDistribution();
    
    // Lấy answers có điểm cao nhất cho question
    @Query("SELECT a FROM Answer a WHERE a.question.questionID = :questionId ORDER BY a.score DESC")
    List<Answer> findTopScoresByQuestion(@Param("questionId") Integer questionId);
    
    // Lấy answers có điểm thấp nhất cho question
    @Query("SELECT a FROM Answer a WHERE a.question.questionID = :questionId ORDER BY a.score ASC")
    List<Answer> findLowestScoresByQuestion(@Param("questionId") Integer questionId);
    
    // Thống kê theo assessment result
    @Query("SELECT ar.user.fullName, ar.assessment.assessmentName, SUM(a.score) FROM Answer a JOIN a.result ar GROUP BY ar.user.fullName, ar.assessment.assessmentName")
    List<Object[]> totalScoreByUserAndAssessment();
} 