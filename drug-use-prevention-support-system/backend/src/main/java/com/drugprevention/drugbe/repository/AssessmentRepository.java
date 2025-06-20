package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Assessment;
import com.drugprevention.drugbe.entity.AssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
    
    // Tìm assessment theo tên
    Optional<Assessment> findByAssessmentName(String assessmentName);
    
    // Tìm assessments theo AssessmentType
    List<Assessment> findByType(AssessmentType type);
    List<Assessment> findByType_TypeID(Integer typeId);
    
    // Kiểm tra assessment có tồn tại không
    boolean existsByAssessmentName(String assessmentName);
    
    // Tìm theo từ khóa trong tên hoặc mô tả
    @Query("SELECT a FROM Assessment a WHERE a.assessmentName LIKE %:keyword% OR a.description LIKE %:keyword%")
    List<Assessment> findByKeyword(@Param("keyword") String keyword);
    
    // Lấy assessments có questions
    @Query("SELECT DISTINCT a FROM Assessment a WHERE SIZE(a.questions) > 0")
    List<Assessment> findAssessmentsWithQuestions();
    
    // Đếm số questions theo assessment
    @Query("SELECT a.assessmentName, SIZE(a.questions) FROM Assessment a")
    List<Object[]> countQuestionsByAssessment();
    
    // Thống kê assessment theo type
    @Query("SELECT at.typeName, COUNT(a) FROM Assessment a JOIN a.type at GROUP BY at.typeName")
    List<Object[]> countAssessmentsByType();
    
    // Lấy assessments phổ biến (nhiều results nhất)
    @Query("SELECT a, COUNT(ar) as resultCount FROM Assessment a LEFT JOIN AssessmentResult ar ON a = ar.assessment GROUP BY a ORDER BY resultCount DESC")
    List<Object[]> findPopularAssessments();
}