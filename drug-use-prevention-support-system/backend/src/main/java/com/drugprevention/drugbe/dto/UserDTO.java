package com.drugprevention.drugbe.dto;

import com.drugprevention.drugbe.entity.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class UserDTO {
    private Long userID;
    private String userName;
    private String email;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String status;
    private String degree;
    private String expertise;
    private String bio;
    private LocalDateTime createdAt;
    private Role role;

    // Constructors
    public UserDTO() {}

    // Getters and Setters
    public Long getUserID() { return userID; }
    public void setUserID(Long userID) { this.userID = userID; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
} 