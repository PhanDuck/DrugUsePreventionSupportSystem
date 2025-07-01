package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assessment_result_id")
    private Long assessmentResultId;

    @ManyToOne
    @JoinColumn(name = "assessment_result_id", insertable = false, updatable = false)
    private AssessmentResult assessmentResult;

    @Column(name = "assessment_question_id")
    private Long assessmentQuestionId;

    @ManyToOne
    @JoinColumn(name = "assessment_question_id", insertable = false, updatable = false)
    private AssessmentQuestion assessmentQuestion;

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "answer_value")
    private Integer answerValue; // For numerical scoring

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Answer() {}

    public Answer(Long assessmentResultId, Long assessmentQuestionId, String answerText, Integer answerValue) {
        this.assessmentResultId = assessmentResultId;
        this.assessmentQuestionId = assessmentQuestionId;
        this.answerText = answerText;
        this.answerValue = answerValue;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getAssessmentResultId() { return assessmentResultId; }
    public void setAssessmentResultId(Long assessmentResultId) { this.assessmentResultId = assessmentResultId; }
    
    public AssessmentResult getAssessmentResult() { return assessmentResult; }
    public void setAssessmentResult(AssessmentResult assessmentResult) { this.assessmentResult = assessmentResult; }
    
    public Long getAssessmentQuestionId() { return assessmentQuestionId; }
    public void setAssessmentQuestionId(Long assessmentQuestionId) { this.assessmentQuestionId = assessmentQuestionId; }
    
    public AssessmentQuestion getAssessmentQuestion() { return assessmentQuestion; }
    public void setAssessmentQuestion(AssessmentQuestion assessmentQuestion) { this.assessmentQuestion = assessmentQuestion; }
    
    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
    
    public Integer getAnswerValue() { return answerValue; }
    public void setAnswerValue(Integer answerValue) { this.answerValue = answerValue; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 