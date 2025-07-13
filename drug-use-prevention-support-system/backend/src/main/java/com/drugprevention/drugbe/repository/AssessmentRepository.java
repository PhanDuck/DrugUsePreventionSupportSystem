package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    // Find assessment by type ID
    List<Assessment> findByAssessmentTypeId(Long assessmentTypeId);
    
    // Find active assessment
    List<Assessment> findByIsActiveTrue();
    
    // Find assessment by title
    List<Assessment> findByTitleContaining(String title);
    
    // Find assessment by title or description
    @Query("SELECT a FROM Assessment a WHERE a.title LIKE %:keyword% OR a.description LIKE %:keyword%")
    List<Assessment> findByKeyword(@Param("keyword") String keyword);
    
    // Find assessment by type and active status
    List<Assessment> findByAssessmentTypeIdAndIsActiveTrue(Long assessmentTypeId);
    
    // Count assessments by type
    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.assessmentTypeId = :typeId")
    Long countByAssessmentTypeId(@Param("typeId") Long typeId);
}