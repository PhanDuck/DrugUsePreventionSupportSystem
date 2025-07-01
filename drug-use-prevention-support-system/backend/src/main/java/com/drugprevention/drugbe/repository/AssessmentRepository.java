package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    // Tìm assessment theo type ID
    List<Assessment> findByAssessmentTypeId(Long assessmentTypeId);
    
    // Tìm assessment active
    List<Assessment> findByIsActiveTrue();
    
    // Tìm assessment theo title
    List<Assessment> findByTitleContaining(String title);
    
    // Tìm assessment theo title hoặc description
    @Query("SELECT a FROM Assessment a WHERE a.title LIKE %:keyword% OR a.description LIKE %:keyword%")
    List<Assessment> findByKeyword(@Param("keyword") String keyword);
    
    // Đếm số assessment theo type
    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.assessmentTypeId = :typeId")
    Long countByAssessmentTypeId(@Param("typeId") Long typeId);
}