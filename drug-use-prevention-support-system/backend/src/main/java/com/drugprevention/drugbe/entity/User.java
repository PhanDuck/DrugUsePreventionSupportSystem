package com.drugprevention.drugbe.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userID;

    @Column(length = 50, nullable = false)
    private String userName;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 100)
    private String fullName;

    @Temporal(TemporalType.DATE)
    private Date dateOfBirth;

    @Column(length = 20)
    private String phone;

    @Column(length = 20)
    private String status;

    @Column(length = 100)
    private String degree;

    @Column(columnDefinition = "TEXT")
    private String expertise;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column
    private Integer roleID; // Nếu có entity Role thì dùng @ManyToOne

    public User() {}

    public User(Integer userID, String userName, String password, String email, String fullName, Date dateOfBirth, String phone, String status, String degree, String expertise, String bio, Integer roleID) {
        this.userID = userID;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.status = status;
        this.degree = degree;
        this.expertise = expertise;
        this.bio = bio;
        this.roleID = roleID;
    }

    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Date getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Integer getRoleID() { return roleID; }
    public void setRoleID(Integer roleID) { this.roleID = roleID; }
} 