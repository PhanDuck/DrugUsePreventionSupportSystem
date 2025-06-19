package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer answerID;

    @ManyToOne
    @JoinColumn(name = "resultID")
    private AssessmentResult result;

    @ManyToOne
    @JoinColumn(name = "questionID")
    private AssessmentQuestion question;

    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    private Integer score;

    public Integer getAnswerID() { return answerID; }
    public void setAnswerID(Integer answerID) { this.answerID = answerID; }
    public AssessmentResult getResult() { return result; }
    public void setResult(AssessmentResult result) { this.result = result; }
    public AssessmentQuestion getQuestion() { return question; }
    public void setQuestion(AssessmentQuestion question) { this.question = question; }
    public String getUserAnswer() { return userAnswer; }
    public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
} 