package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "AssessmentType")
public class AssessmentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer typeID;

    @Column(length = 100, nullable = false)
    private String typeName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Assessment> assessments;

    // Constructors
    public AssessmentType() {}

    // Getters and Setters
    public Integer getTypeID() {
        return typeID;
    }

    public void setTypeID(Integer typeID) {
        this.typeID = typeID;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Assessment> getAssessments() {
        return assessments;
    }

    public void setAssessments(List<Assessment> assessments) {
        this.assessments = assessments;
    }
} 