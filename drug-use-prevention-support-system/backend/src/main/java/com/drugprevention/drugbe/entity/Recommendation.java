package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Recommendation")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recommendationID;

    @ManyToOne
    @JoinColumn(name = "courseID")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "blogID")
    private Blog blog;

    // Constructors
    public Recommendation() {}

    // Getters and Setters
    public Integer getRecommendationID() {
        return recommendationID;
    }

    public void setRecommendationID(Integer recommendationID) {
        this.recommendationID = recommendationID;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Blog getBlog() {
        return blog;
    }

    public void setBlog(Blog blog) {
        this.blog = blog;
    }
} 