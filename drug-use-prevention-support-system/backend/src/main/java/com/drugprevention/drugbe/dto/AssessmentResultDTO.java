package com.drugprevention.drugbe.dto;

import com.drugprevention.drugbe.entity.Answer;
import com.drugprevention.drugbe.entity.Assessment;
import com.drugprevention.drugbe.entity.AssessmentResult;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentResultDTO {
    private Long id;
    private Assessment assessment;
    private int totalScore;
    private String riskLevel;
    private List<Answer> answers;
    private LocalDateTime completedAt;
    
    public static AssessmentResultDTO fromEntity(AssessmentResult result) {
        AssessmentResultDTO dto = new AssessmentResultDTO();
        dto.setId(result.getId());
        dto.setAssessment(result.getAssessment());
        dto.setTotalScore(result.getTotalScore());
        dto.setRiskLevel(result.getRiskLevel());
        dto.setAnswers(result.getAnswers());
        dto.setCompletedAt(result.getCompletedAt());
        return dto;
    }
} 