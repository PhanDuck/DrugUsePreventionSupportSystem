package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.AssessmentResultDTO;
import com.drugprevention.drugbe.dto.AssessmentStatisticsDTO;
import com.drugprevention.drugbe.entity.Answer;
import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.repository.AssessmentResultRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentResultService {
    private final AssessmentResultRepository assessmentResultRepository;

    @Transactional
    public AssessmentResult saveResult(AssessmentResult result) {
        return assessmentResultRepository.save(result);
    }

    public List<AssessmentResult> getResultsByAssessmentId(Long assessmentId) {
        return assessmentResultRepository.findByAssessmentId(assessmentId);
    }

    public AssessmentResult getResultById(Long id) {
        return assessmentResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment result not found"));
    }

    public AssessmentResult validateAndCalculateResult(AssessmentResultDTO resultDTO) {
        // Validate input
        validateInput(resultDTO);
        
        // Calculate score
        int calculatedScore = calculateScore(resultDTO.getAnswers());
        String calculatedRiskLevel = determineRiskLevel(calculatedScore);
        
        // Compare with frontend results
        if (calculatedScore != resultDTO.getTotalScore() || 
            !calculatedRiskLevel.equals(resultDTO.getRiskLevel())) {
            log.warn("Score mismatch - Frontend: {}, Backend: {}", 
                    resultDTO.getTotalScore(), calculatedScore);
        }
        
        // Create and save new result
        AssessmentResult result = new AssessmentResult();
        result.setAssessment(resultDTO.getAssessment());
        result.setTotalScore(calculatedScore);
        result.setRiskLevel(calculatedRiskLevel);
        result.setAnswers(resultDTO.getAnswers());
        result.setCompletedAt(LocalDateTime.now());
        
        return assessmentResultRepository.save(result);
    }
    
    private void validateInput(AssessmentResultDTO resultDTO) {
        if (resultDTO.getAnswers() == null || resultDTO.getAnswers().isEmpty()) {
            throw new IllegalArgumentException("Answers cannot be empty");
        }
        
        if (resultDTO.getAssessment() == null) {
            throw new IllegalArgumentException("Assessment cannot be null");
        }
        
        // Validate number of questions
        if (resultDTO.getAnswers().size() != resultDTO.getAssessment().getQuestions().size()) {
            throw new IllegalArgumentException("Number of answers does not match number of questions");
        }
        
        // Validate score for each answer
        for (Answer answer : resultDTO.getAnswers()) {
            if (answer.getScore() < 0 || answer.getScore() > 5) {
                throw new IllegalArgumentException("Invalid score for answer: " + answer.getId());
            }
        }
    }

    private int calculateScore(List<Answer> answers) {
        return answers.stream()
                .mapToInt(Answer::getScore)
                .sum();
    }

    private String determineRiskLevel(int totalScore) {
        if (totalScore >= 20) return "HIGH";
        if (totalScore >= 10) return "MODERATE";
        return "LOW";
    }

    public List<AssessmentResult> getUserAssessmentHistory(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }
        return assessmentResultRepository.findByUserIdAndCompletedAtBetween(userId, startDate, endDate);
    }

    public AssessmentStatisticsDTO getStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null) {
            startDate = LocalDateTime.now().minusMonths(1);
        }
        if (endDate == null) {
            endDate = LocalDateTime.now();
        }

        List<AssessmentResult> results = assessmentResultRepository.findByCompletedAtBetween(startDate, endDate);
        
        AssessmentStatisticsDTO statistics = new AssessmentStatisticsDTO();
        statistics.setTotalAssessments(results.size());
        
        // Calculate risk level distribution
        Map<String, Integer> riskLevelDistribution = results.stream()
                .collect(Collectors.groupingBy(
                        AssessmentResult::getRiskLevel,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        statistics.setRiskLevelDistribution(riskLevelDistribution);
        
        // Calculate average score
        double averageScore = results.stream()
                .mapToInt(AssessmentResult::getTotalScore)
                .average()
                .orElse(0.0);
        statistics.setAverageScore(averageScore);
        
        // Calculate trends
        List<AssessmentStatisticsDTO.AssessmentTrendDTO> trends = calculateTrends(results);
        statistics.setTrends(trends);
        
        return statistics;
    }

    private List<AssessmentStatisticsDTO.AssessmentTrendDTO> calculateTrends(List<AssessmentResult> results) {
        Map<LocalDate, List<AssessmentResult>> resultsByDate = results.stream()
                .collect(Collectors.groupingBy(result -> result.getCompletedAt().toLocalDate()));
        
        return resultsByDate.entrySet().stream()
                .map(entry -> {
                    AssessmentStatisticsDTO.AssessmentTrendDTO trend = new AssessmentStatisticsDTO.AssessmentTrendDTO();
                    trend.setDate(entry.getKey());
                    trend.setCount(entry.getValue().size());
                    trend.setAverageScore(entry.getValue().stream()
                            .mapToInt(AssessmentResult::getTotalScore)
                            .average()
                            .orElse(0.0));
                    return trend;
                })
                .sorted(Comparator.comparing(AssessmentStatisticsDTO.AssessmentTrendDTO::getDate))
                .collect(Collectors.toList());
    }
} 