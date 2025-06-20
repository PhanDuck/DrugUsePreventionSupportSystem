package com.drugprevention.drugbe.dto;

import com.drugprevention.drugbe.entity.Answer;
import com.drugprevention.drugbe.entity.Assessment;
import com.drugprevention.drugbe.entity.AssessmentResult;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentResultDTO {
    private Integer resultID;
    private Assessment assessment;
    private Integer totalScore;
    private String riskLevel;
    private List<Answer> answers;
    private LocalDateTime completedAt;
    
    // Constructors
    public AssessmentResultDTO() {}
    
    // Getters and Setters
    public Integer getResultID() {
        return resultID;
    }
    
    public void setResultID(Integer resultID) {
        this.resultID = resultID;
    }
    
    public Assessment getAssessment() {
        return assessment;
    }
    
    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }
    
    public Integer getTotalScore() {
        return totalScore;
    }
    
    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }
    
    public String getRiskLevel() {
        return riskLevel;
    }
    
    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
    
    public List<Answer> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public static AssessmentResultDTO fromEntity(AssessmentResult result) {
        AssessmentResultDTO dto = new AssessmentResultDTO();
        dto.setResultID(result.getResultID());
        dto.setAssessment(result.getAssessment());
        dto.setTotalScore(result.getTotalScore());
        dto.setRiskLevel(result.getRiskLevel());
        dto.setAnswers(result.getAnswers());
        dto.setCompletedAt(result.getCompletedAt());
        return dto;
    }
} 