package com.drugprevention.drugbe.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AssessmentStatisticsDTO {
    private int totalAssessments;
    private Map<String, Integer> riskLevelDistribution;
    private double averageScore;
    private List<AssessmentTrendDTO> trends;
    
    // Constructors
    public AssessmentStatisticsDTO() {}
    
    // Getters and Setters
    public int getTotalAssessments() {
        return totalAssessments;
    }
    
    public void setTotalAssessments(int totalAssessments) {
        this.totalAssessments = totalAssessments;
    }
    
    public Map<String, Integer> getRiskLevelDistribution() {
        return riskLevelDistribution;
    }
    
    public void setRiskLevelDistribution(Map<String, Integer> riskLevelDistribution) {
        this.riskLevelDistribution = riskLevelDistribution;
    }
    
    public double getAverageScore() {
        return averageScore;
    }
    
    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }
    
    public List<AssessmentTrendDTO> getTrends() {
        return trends;
    }
    
    public void setTrends(List<AssessmentTrendDTO> trends) {
        this.trends = trends;
    }
    
    public static class AssessmentTrendDTO {
        private LocalDate date;
        private int count;
        private double averageScore;
        
        // Constructors
        public AssessmentTrendDTO() {}
        
        // Getters and Setters
        public LocalDate getDate() {
            return date;
        }
        
        public void setDate(LocalDate date) {
            this.date = date;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
        
        public double getAverageScore() {
            return averageScore;
        }
        
        public void setAverageScore(double averageScore) {
            this.averageScore = averageScore;
        }
    }
} 