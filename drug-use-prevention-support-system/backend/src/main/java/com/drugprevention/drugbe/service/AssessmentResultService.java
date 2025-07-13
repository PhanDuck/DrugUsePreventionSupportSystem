package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.AssessmentResultDTO;
import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.repository.AssessmentResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssessmentResultService {
    
    @Autowired
    private AssessmentResultRepository assessmentResultRepository;

    @Transactional
    public AssessmentResult saveResult(AssessmentResult result) {
        result.setCreatedAt(LocalDateTime.now());
        if (result.getCompletedAt() == null) {
            result.setCompletedAt(LocalDateTime.now());
        }
        return assessmentResultRepository.save(result);
    }

    // ===== ENTITY METHODS (for internal use) =====
    
    public Optional<AssessmentResult> getResultEntityById(Long id) {
        return assessmentResultRepository.findById(id);
    }

    public List<AssessmentResult> getResultEntitiesByAssessmentId(Long assessmentId) {
        return assessmentResultRepository.findByAssessmentId(assessmentId);
    }

    public List<AssessmentResult> getResultEntitiesByUserId(Long userId) {
        return assessmentResultRepository.findByUserId(userId);
    }

    public List<AssessmentResult> getAllResultEntities() {
        return assessmentResultRepository.findAll();
    }

    @Transactional
    public AssessmentResult updateResult(Long id, AssessmentResult resultDetails) {
        AssessmentResult result = assessmentResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment result not found with id: " + id));
        
        result.setTotalScore(resultDetails.getTotalScore());
        result.setRiskLevel(resultDetails.getRiskLevel());
        result.setRecommendations(resultDetails.getRecommendations());
        result.setAnswersJson(resultDetails.getAnswersJson());
        
        return assessmentResultRepository.save(result);
    }

    @Transactional
    public void deleteResult(Long id) {
        if (!assessmentResultRepository.existsById(id)) {
            throw new RuntimeException("Assessment result not found with id: " + id);
        }
        assessmentResultRepository.deleteById(id);
    }

    // Calculate risk level based on total score
    public String calculateRiskLevel(Integer totalScore) {
        if (totalScore == null || totalScore == 0) {
            return "LOW";
        } else if (totalScore <= 5) {
            return "LOW";
        } else if (totalScore <= 15) {
            return "MEDIUM";
        } else {
            return "HIGH";
        }
    }

    // Get statistics
    public long getTotalResultCount() {
        return assessmentResultRepository.count();
    }

    public List<AssessmentResult> getRecentResults(int limit) {
        return assessmentResultRepository.findTop10ByOrderByCreatedAtDesc();
    }

    // ===== DTO METHODS (for API responses) =====

    /**
     * Convert AssessmentResult entity to DTO
     */
    private AssessmentResultDTO convertToDTO(AssessmentResult result) {
        AssessmentResultDTO dto = new AssessmentResultDTO();
        dto.setId(result.getId());
        dto.setAssessmentId(result.getAssessmentId());
        dto.setUserId(result.getUserId());
        dto.setTotalScore(result.getTotalScore());
        dto.setRiskLevel(result.getRiskLevel());
        
        // Convert recommendations string to list
        if (result.getRecommendations() != null && !result.getRecommendations().isEmpty()) {
            dto.setRecommendations(Arrays.asList(result.getRecommendations().split("\\n")));
        } else {
            dto.setRecommendations(Arrays.asList("No recommendations available"));
        }
        
        dto.setCreatedAt(result.getCreatedAt());
        dto.setCompletedAt(result.getCompletedAt());
        
        // Set assessment title if available
        if (result.getAssessment() != null) {
            dto.setAssessmentTitle(result.getAssessment().getTitle());
            dto.setAssessmentType(result.getAssessment().getAssessmentType() != null ? 
                result.getAssessment().getAssessmentType().getName() : null);
        }
        
        // Set risk description
        switch (result.getRiskLevel()) {
            case "HIGH":
                dto.setRiskDescription("High risk level - Immediate intervention required");
                break;
            case "MEDIUM":
                dto.setRiskDescription("Medium risk level - Monitoring and support needed");
                break;
            case "LOW":
                dto.setRiskDescription("Low risk level - Maintain current status");
                break;
            default:
                dto.setRiskDescription("Not yet assessed");
        }
        
        return dto;
    }

    /**
     * Get user assessment results as DTOs
     */
    public List<AssessmentResultDTO> getResultsByUserId(Long userId) {
        List<AssessmentResult> results = assessmentResultRepository.findByUserId(userId);
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get assessment result by ID as DTO
     */
    public Optional<AssessmentResultDTO> getResultById(Long id) {
        return assessmentResultRepository.findById(id)
                .map(this::convertToDTO);
    }

    /**
     * Get all assessment results as DTOs
     */
    public List<AssessmentResultDTO> getAllResults() {
        List<AssessmentResult> results = assessmentResultRepository.findAll();
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Count assessment results by user ID
     */
    public long countByUserId(Long userId) {
        return assessmentResultRepository.countByUserId(userId);
    }

    /**
     * Get latest assessment result by user ID
     */
    public Optional<AssessmentResultDTO> getLatestResultByUserId(Long userId) {
        List<AssessmentResult> results = assessmentResultRepository.findLatestByUser(userId);
        return results.isEmpty() ? Optional.empty() : Optional.of(convertToDTO(results.get(0)));
    }

    /**
     * Get results by date range
     */
    public List<AssessmentResultDTO> getResultsByDateRange(Date startDate, Date endDate) {
        // Convert Date to LocalDateTime
        LocalDateTime start = ((java.sql.Date) startDate).toLocalDate().atStartOfDay();
        LocalDateTime end = ((java.sql.Date) endDate).toLocalDate().atTime(23, 59, 59);
        
        List<AssessmentResult> results = assessmentResultRepository.findByCompletedAtBetween(start, end);
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get results by risk level
     */
    public List<AssessmentResultDTO> getResultsByRiskLevel(String riskLevel) {
        List<AssessmentResult> results = assessmentResultRepository.findByRiskLevel(riskLevel);
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}