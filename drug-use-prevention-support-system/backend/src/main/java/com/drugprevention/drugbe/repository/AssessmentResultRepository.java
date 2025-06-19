package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    List<AssessmentResult> findByAssessmentId(Long assessmentId);
    List<AssessmentResult> findByUserIdAndCompletedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<AssessmentResult> findByCompletedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}