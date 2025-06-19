package com.drugprevention.drugbe.dto;

import java.util.List;

public class AssessmentSubmitRequest {
    private Integer userId;
    private List<AnswerDTO> answers;

    public static class AnswerDTO {
        private Integer questionId;
        private String userAnswer;
        private Integer score;

        public AnswerDTO() {}
        public AnswerDTO(Integer questionId, String userAnswer, Integer score) {
            this.questionId = questionId;
            this.userAnswer = userAnswer;
            this.score = score;
        }
        public Integer getQuestionId() { return questionId; }
        public void setQuestionId(Integer questionId) { this.questionId = questionId; }
        public String getUserAnswer() { return userAnswer; }
        public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
    }

    public AssessmentSubmitRequest() {}
    public AssessmentSubmitRequest(Integer userId, List<AnswerDTO> answers) {
        this.userId = userId;
        this.answers = answers;
    }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public List<AnswerDTO> getAnswers() { return answers; }
    public void setAnswers(List<AnswerDTO> answers) { this.answers = answers; }
} 