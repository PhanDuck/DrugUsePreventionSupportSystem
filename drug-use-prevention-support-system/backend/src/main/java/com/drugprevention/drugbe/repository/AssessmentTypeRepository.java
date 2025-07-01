package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentTypeRepository extends JpaRepository<AssessmentType, Long> {
    
    // Tìm assessment type theo name
    Optional<AssessmentType> findByName(String name);
    
    // Kiểm tra tồn tại theo name
    boolean existsByName(String name);
    
    // Tìm assessment types active
    List<AssessmentType> findByIsActiveTrue();
    
    // Tìm theo target age group
    List<AssessmentType> findByTargetAgeGroup(String targetAgeGroup);
    
    // Tìm theo keyword trong name hoặc description
    @Query("SELECT at FROM AssessmentType at WHERE at.name LIKE %:keyword% OR at.description LIKE %:keyword%")
    List<AssessmentType> findByKeyword(@Param("keyword") String keyword);
    
    // Đếm assessments theo type
    @Query("SELECT at.name, COUNT(a) FROM AssessmentType at LEFT JOIN Assessment a ON at.id = a.assessmentTypeId GROUP BY at.name")
    List<Object[]> countAssessmentsByType();
} 