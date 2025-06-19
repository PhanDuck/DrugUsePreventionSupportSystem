package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;

@Entity
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer recommendationID;

    @Column
    private Integer courseID; // Nếu có entity Course thì dùng @ManyToOne

    @Column
    private Integer blogID; // Nếu có entity Blog thì dùng @ManyToOne

    public Recommendation() {}

    public Recommendation(Integer recommendationID, Integer courseID, Integer blogID) {
        this.recommendationID = recommendationID;
        this.courseID = courseID;
        this.blogID = blogID;
    }

    public Integer getRecommendationID() { return recommendationID; }
    public void setRecommendationID(Integer recommendationID) { this.recommendationID = recommendationID; }
    public Integer getCourseID() { return courseID; }
    public void setCourseID(Integer courseID) { this.courseID = courseID; }
    public Integer getBlogID() { return blogID; }
    public void setBlogID(Integer blogID) { this.blogID = blogID; }
} 