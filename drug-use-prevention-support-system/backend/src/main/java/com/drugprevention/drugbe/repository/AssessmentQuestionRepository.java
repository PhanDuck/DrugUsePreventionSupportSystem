package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentQuestion;
import com.drugprevention.drugbe.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentQuestionRepository extends JpaRepository<AssessmentQuestion, Integer> {
    
    // Tìm questions theo Assessment
    List<AssessmentQuestion> findByAssessment(Assessment assessment);
    List<AssessmentQuestion> findByAssessment_AssessmentID(Integer assessmentId);
    
    // Tìm questions theo từ khóa
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.questionText LIKE %:keyword%")
    List<AssessmentQuestion> findByKeyword(@Param("keyword") String keyword);
    
    // Đếm số questions theo assessment
    long countByAssessment(Assessment assessment);
    long countByAssessment_AssessmentID(Integer assessmentId);
    
    // Lấy questions theo score weight
    List<AssessmentQuestion> findByScoreWeight(Integer scoreWeight);
    List<AssessmentQuestion> findByScoreWeightGreaterThan(Integer scoreWeight);
    
    // Lấy questions có score weight cao nhất
    @Query("SELECT aq FROM AssessmentQuestion aq WHERE aq.assessment.assessmentID = :assessmentId ORDER BY aq.scoreWeight DESC")
    List<AssessmentQuestion> findByAssessmentOrderByScoreWeightDesc(@Param("assessmentId") Integer assessmentId);
    
    // Thống kê score weight theo assessment
    @Query("SELECT a.assessmentName, AVG(aq.scoreWeight) FROM AssessmentQuestion aq JOIN aq.assessment a GROUP BY a.assessmentName")
    List<Object[]> averageScoreWeightByAssessment();
} 