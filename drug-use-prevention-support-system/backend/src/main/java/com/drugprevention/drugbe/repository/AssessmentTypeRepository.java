package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentTypeRepository extends JpaRepository<AssessmentType, Integer> {
    
    // Tìm AssessmentType theo tên
    Optional<AssessmentType> findByTypeName(String typeName);
    
    // Kiểm tra AssessmentType có tồn tại không
    boolean existsByTypeName(String typeName);
    
    // Lấy tất cả AssessmentType có Assessment
    @Query("SELECT DISTINCT at FROM AssessmentType at WHERE SIZE(at.assessments) > 0")
    List<AssessmentType> findTypesWithAssessments();
    
    // Tìm AssessmentType theo từ khóa trong tên hoặc mô tả
    @Query("SELECT at FROM AssessmentType at WHERE at.typeName LIKE %:keyword% OR at.description LIKE %:keyword%")
    List<AssessmentType> findByKeyword(String keyword);
} 