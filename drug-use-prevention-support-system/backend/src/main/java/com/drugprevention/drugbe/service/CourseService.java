package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import com.drugprevention.drugbe.entity.CourseRegistration;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;

    // 1. Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 2. Get course by ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // 3. Create new course
    @Transactional
    public Course createCourse(Course course) {
        course.setIsActive(true);
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    // 4. Update course
    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setInstructorId(courseDetails.getInstructorId());
        course.setCategoryId(courseDetails.getCategoryId());
        course.setDuration(courseDetails.getDuration());
        course.setMaxParticipants(courseDetails.getMaxParticipants());
        course.setStatus(courseDetails.getStatus());
        course.setIsActive(courseDetails.getIsActive());
        course.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(course);
    }

    // 5. Delete course
    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    // 6. Get courses by instructor
    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    // 7. Get courses by category
    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }

    // 8. Get active courses
    public List<Course> getActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }

    // 9. Get open courses
    public List<Course> getOpenCourses() {
        return courseRepository.findByStatusAndIsActiveTrue("open");
    }

    // 10. Get featured courses
    public List<Course> getFeaturedCourses() {
        return courseRepository.findByIsFeaturedTrue();
    }

    // 11. Get available courses (with available spots)
    public List<Course> getAvailableCourses() {
        return courseRepository.findAvailableCourses();
    }

    // 12. Search courses by keyword
    public List<Course> searchCourses(String keyword) {
        return courseRepository.findByKeyword(keyword);
    }

    // 13. Get courses with pagination
    public Page<Course> getCoursesWithPagination(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }

    // 14. Increment participants count
    @Transactional
    public void incrementParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setCurrentParticipants(course.getCurrentParticipants() + 1);
        courseRepository.save(course);
    }

    // 15. Decrement participants count
    @Transactional
    public void decrementParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (course.getCurrentParticipants() > 0) {
            course.setCurrentParticipants(course.getCurrentParticipants() - 1);
            courseRepository.save(course);
        }
    }

    // 16. Get latest courses
    public List<Course> getLatestCourses() {
        return courseRepository.findTop10ByStatusOrderByCreatedAtDesc("open");
    }

    // 17. Get popular courses
    public List<Course> getPopularCourses() {
        return courseRepository.findTop10ByStatusOrderByCurrentParticipantsDesc("open");
    }

    // 18. Course Registration methods
    public CourseRegistration registerForCourse(Long userId, Long courseId) {
        // This method should be implemented in CourseRegistrationService
        // For now, return null to avoid compilation error
        throw new RuntimeException("Course registration not implemented yet");
    }

    public List<CourseRegistration> getUserRegistrations(Long userId) {
        // This method should be implemented in CourseRegistrationService
        // For now, return empty list to avoid compilation error
        return new ArrayList<>();
    }

    public List<CourseRegistration> getCourseRegistrations(Long courseId) {
        // This method should be implemented in CourseRegistrationService
        // For now, return empty list to avoid compilation error
        return new ArrayList<>();
    }
} 