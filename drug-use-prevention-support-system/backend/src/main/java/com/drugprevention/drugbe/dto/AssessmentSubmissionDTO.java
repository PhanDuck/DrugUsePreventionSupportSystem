package com.drugprevention.drugbe.dto;

import java.util.List;

public class AssessmentSubmissionDTO {
    private Long assessmentId;
    private Long userId;
    private List<AnswerDTO> answers;

    // Constructors
    public AssessmentSubmissionDTO() {}

    public AssessmentSubmissionDTO(Long assessmentId, Long userId, List<AnswerDTO> answers) {
        this.assessmentId = assessmentId;
        this.userId = userId;
        this.answers = answers;
    }

    // Getters and Setters
    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<AnswerDTO> getAnswers() { return answers; }
    public void setAnswers(List<AnswerDTO> answers) { this.answers = answers; }

    // Inner class for individual answers
    public static class AnswerDTO {
        private Long questionId;
        private Integer answerValue;
        private String answerText;

        public AnswerDTO() {}

        public AnswerDTO(Long questionId, Integer answerValue, String answerText) {
            this.questionId = questionId;
            this.answerValue = answerValue;
            this.answerText = answerText;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }

        public Integer getAnswerValue() { return answerValue; }
        public void setAnswerValue(Integer answerValue) { this.answerValue = answerValue; }

        public String getAnswerText() { return answerText; }
        public void setAnswerText(String answerText) { this.answerText = answerText; }
    }
} 