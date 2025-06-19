package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer blogID;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private Integer authorID; // Nếu có entity User thì dùng @ManyToOne

    @Temporal(TemporalType.DATE)
    private Date publishDate;

    @Column(length = 20)
    private String status;

    public Blog() {}

    public Blog(Integer blogID, String title, String content, Integer authorID, Date publishDate, String status) {
        this.blogID = blogID;
        this.title = title;
        this.content = content;
        this.authorID = authorID;
        this.publishDate = publishDate;
        this.status = status;
    }

    public Integer getBlogID() { return blogID; }
    public void setBlogID(Integer blogID) { this.blogID = blogID; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getAuthorID() { return authorID; }
    public void setAuthorID(Integer authorID) { this.authorID = authorID; }
    public Date getPublishDate() { return publishDate; }
    public void setPublishDate(Date publishDate) { this.publishDate = publishDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 