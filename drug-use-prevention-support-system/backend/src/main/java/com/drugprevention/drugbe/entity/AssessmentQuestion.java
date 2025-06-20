package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "AssessmentQuestion")
public class AssessmentQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer questionID;

    @ManyToOne
    @JoinColumn(name = "assessmentID")
    private Assessment assessment;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    private Integer scoreWeight;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Answer> answers;

    // Constructors
    public AssessmentQuestion() {}

    // Getters and Setters
    public Integer getQuestionID() {
        return questionID;
    }

    public void setQuestionID(Integer questionID) {
        this.questionID = questionID;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public void setAssessment(Assessment assessment) {
        this.assessment = assessment;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Integer getScoreWeight() {
        return scoreWeight;
    }

    public void setScoreWeight(Integer scoreWeight) {
        this.scoreWeight = scoreWeight;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
} 