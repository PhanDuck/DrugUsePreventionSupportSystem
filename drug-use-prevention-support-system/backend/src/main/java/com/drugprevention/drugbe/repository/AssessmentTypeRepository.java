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
    
    // Find assessment type by name
    Optional<AssessmentType> findByName(String name);
    
    // Check if assessment type exists by name
    boolean existsByName(String name);
    
    // Find assessment types by active status
    List<AssessmentType> findByIsActiveTrue();
    
    // Find by target age group
    List<AssessmentType> findByTargetAgeGroup(String targetAgeGroup);
    
    // Find by keyword in name or description
    @Query("SELECT at FROM AssessmentType at WHERE at.name LIKE %:keyword% OR at.description LIKE %:keyword%")
    List<AssessmentType> findByKeyword(@Param("keyword") String keyword);
    
    // Count assessments by type
    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.assessmentType.id = :typeId")
    Long countAssessmentsByType(@Param("typeId") Long typeId);
} 