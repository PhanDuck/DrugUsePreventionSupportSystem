package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer assessmentID;

    @Column(length = 100, nullable = false)
    private String assessmentName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "typeID")
    private AssessmentType type;

    @OneToMany(mappedBy = "assessment")
    private List<AssessmentQuestion> questions;

    public Integer getAssessmentID() { return assessmentID; }
    public void setAssessmentID(Integer assessmentID) { this.assessmentID = assessmentID; }
    public String getAssessmentName() { return assessmentName; }
    public void setAssessmentName(String assessmentName) { this.assessmentName = assessmentName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public AssessmentType getType() { return type; }
    public void setType(AssessmentType type) { this.type = type; }
    public List<AssessmentQuestion> getQuestions() { return questions; }
    public void setQuestions(List<AssessmentQuestion> questions) { this.questions = questions; }
} 