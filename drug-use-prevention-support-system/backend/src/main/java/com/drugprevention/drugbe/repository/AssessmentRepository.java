package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRepository extends JpaRepository<Assessment, Integer> {
}