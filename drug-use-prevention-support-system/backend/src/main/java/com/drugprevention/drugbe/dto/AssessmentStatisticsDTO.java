package com.drugprevention.drugbe.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
public class AssessmentStatisticsDTO {
    private int totalAssessments;
    private Map<String, Integer> riskLevelDistribution;
    private double averageScore;
    private List<AssessmentTrendDTO> trends;
    
    @Data
    public static class AssessmentTrendDTO {
        private LocalDate date;
        private int count;
        private double averageScore;
    }
} 