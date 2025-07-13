package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.CourseRegistrationRepository;
import com.drugprevention.drugbe.repository.CourseRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseRegistrationService {
    
    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Register user for a course
    public CourseRegistration registerForCourse(Long userId, Long courseId) {
        // Validate inputs
        if (userId == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        
        if (courseId == null) {
            throw new RuntimeException("Course ID cannot be null");
        }
        
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if course is active
        if (!course.getIsActive()) {
            throw new RuntimeException("Course is not active");
        }
        
        // Check if course is open for registration
        if (!"open".equals(course.getStatus())) {
            throw new RuntimeException("Course is not open for registration");
        }
        
        // Check if user is already registered (active registration)
        if (courseRegistrationRepository.existsByUserIdAndCourseIdAndIsActiveTrue(userId, courseId)) {
            throw new RuntimeException("User is already registered for this course");
        }
        
        // Check if course has available spots
        if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
            throw new RuntimeException("Course is full");
        }
        
        // Create registration
        CourseRegistration registration = new CourseRegistration();
        registration.setUserId(userId);
        registration.setCourseId(courseId);
        registration.setRegistrationDate(LocalDateTime.now());
        registration.setStatus("ACTIVE");
        registration.setIsActive(true);
        registration.setCreatedAt(LocalDateTime.now());
        registration.setUpdatedAt(LocalDateTime.now());
        
        // Save registration
        registration = courseRegistrationRepository.save(registration);
        
        // Increment course participants
        course.setCurrentParticipants(course.getCurrentParticipants() + 1);
        courseRepository.save(course);
        
        return registration;
    }

    // Get user registrations
    public List<CourseRegistration> getUserRegistrations(Long userId) {
        return courseRegistrationRepository.findByUserId(userId);
    }

    // Get course registrations
    public List<CourseRegistration> getCourseRegistrations(Long courseId) {
        return courseRegistrationRepository.findByCourseId(courseId);
    }

    // Cancel course registration
    public void cancelCourseRegistration(Long userId, Long courseId) {
        CourseRegistration registration = courseRegistrationRepository
                .findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setStatus("CANCELLED");
        registration.setIsActive(false);
        registration.setCancelledAt(LocalDateTime.now());
        registration.setUpdatedAt(LocalDateTime.now());
        courseRegistrationRepository.save(registration);
        
        // Decrement course participants
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setCurrentParticipants(course.getCurrentParticipants() - 1);
        courseRepository.save(course);
    }

    // Get registration by ID
    public Optional<CourseRegistration> getRegistrationById(Long registrationId) {
        return courseRegistrationRepository.findById(registrationId);
    }

    // Get active registrations for user
    public List<CourseRegistration> getActiveUserRegistrations(Long userId) {
        return courseRegistrationRepository.findByUserIdAndStatus(userId, "ACTIVE");
    }

    // Get active registrations for course
    public List<CourseRegistration> getActiveCourseRegistrations(Long courseId) {
        return courseRegistrationRepository.findByCourseIdAndStatus(courseId, "ACTIVE");
    }

    // Check if user is registered for course (active registration)
    public boolean isUserRegisteredForCourse(Long userId, Long courseId) {
        return courseRegistrationRepository.existsByUserIdAndCourseIdAndIsActiveTrue(userId, courseId);
    }

    // Get registration count for course
    public long getRegistrationCountForCourse(Long courseId) {
        return courseRegistrationRepository.countByCourseId(courseId);
    }

    // Get registration count for user
    public long getRegistrationCountForUser(Long userId) {
        return courseRegistrationRepository.countByUserId(userId);
    }
} 