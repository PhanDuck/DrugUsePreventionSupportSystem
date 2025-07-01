package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.repository.CourseRegistrationRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseRegistrationService {
    
    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private CourseService courseService;

    // 1. Đăng ký course
    @Transactional
    public CourseRegistration registerCourse(Long userId, Long courseId) {
        // Kiểm tra đã đăng ký chưa
        if (courseRegistrationRepository.existsByUserIdAndCourseIdAndIsActiveTrue(userId, courseId)) {
            throw new RuntimeException("User already registered for this course");
        }
        
        // Tạo registration
        CourseRegistration registration = new CourseRegistration(userId, courseId);
        CourseRegistration savedRegistration = courseRegistrationRepository.save(registration);
        
        // Tăng số participants
        courseService.incrementParticipants(courseId);
        
        return savedRegistration;
    }

    // 2. Hủy đăng ký course
    @Transactional
    public void cancelRegistration(Long userId, Long courseId) {
        CourseRegistration registration = courseRegistrationRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registration.setStatus("cancelled");
        registration.setIsActive(false);
        registration.setUpdatedAt(LocalDateTime.now());
        courseRegistrationRepository.save(registration);
        
        // Giảm số participants
        courseService.decrementParticipants(courseId);
    }

    // 3. Lấy registrations theo user
    public List<CourseRegistration> getRegistrationsByUser(Long userId) {
        return courseRegistrationRepository.findByUserId(userId);
    }

    // 4. Lấy registrations theo course
    public List<CourseRegistration> getRegistrationsByCourse(Long courseId) {
        return courseRegistrationRepository.findByCourseId(courseId);
    }

    // 5. Lấy registration theo ID
    public Optional<CourseRegistration> getRegistrationById(Long id) {
        return courseRegistrationRepository.findById(id);
    }

    // 6. Update registration status
    @Transactional
    public CourseRegistration updateRegistrationStatus(Long id, String status) {
        CourseRegistration registration = courseRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        
        registration.setStatus(status);
        registration.setUpdatedAt(LocalDateTime.now());
        
        if ("completed".equals(status)) {
            registration.setCompletionDate(LocalDateTime.now());
        }
        
        return courseRegistrationRepository.save(registration);
    }

    // 7. Lấy active registrations cho user
    public List<CourseRegistration> getActiveRegistrationsByUser(Long userId) {
        return courseRegistrationRepository.findByUserIdAndStatus(userId, "registered");
    }

    // 8. Lấy completed registrations cho user
    public List<CourseRegistration> getCompletedRegistrationsByUser(Long userId) {
        return courseRegistrationRepository.findByUserIdAndStatus(userId, "completed");
    }

    // 9. Kiểm tra user đã đăng ký course chưa
    public boolean isUserRegisteredForCourse(Long userId, Long courseId) {
        return courseRegistrationRepository.existsByUserIdAndCourseIdAndIsActiveTrue(userId, courseId);
    }

    // 10. Đếm registrations theo course
    public Long countRegistrationsByCourse(Long courseId) {
        return courseRegistrationRepository.countByCourseId(courseId);
    }

    // 11. Đếm registrations theo user
    public Long countRegistrationsByUser(Long userId) {
        return courseRegistrationRepository.countByUserId(userId);
    }

    // 12. Lấy recent registrations
    public List<CourseRegistration> getRecentRegistrations() {
        return courseRegistrationRepository.findTop10ByOrderByRegistrationDateDesc();
    }

    // 13. Mark as attended
    @Transactional
    public CourseRegistration markAsAttended(Long id) {
        return updateRegistrationStatus(id, "attended");
    }

    // 14. Mark as completed
    @Transactional
    public CourseRegistration markAsCompleted(Long id) {
        return updateRegistrationStatus(id, "completed");
    }

    // 15. Delete registration
    @Transactional
    public void deleteRegistration(Long id) {
        CourseRegistration registration = courseRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        
        // Giảm số participants nếu registration đang active
        if (registration.getIsActive() && "registered".equals(registration.getStatus())) {
            courseService.decrementParticipants(registration.getCourseId());
        }
        
        courseRegistrationRepository.deleteById(id);
    }
} 