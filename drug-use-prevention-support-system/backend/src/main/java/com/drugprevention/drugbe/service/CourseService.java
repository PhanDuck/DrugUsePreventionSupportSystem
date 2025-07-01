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

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;

    // 1. Lấy tất cả courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 2. Lấy course theo ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // 3. Tạo course mới
    @Transactional
    public Course createCourse(Course course) {
        course.setCurrentParticipants(0);
        course.setStatus("open");
        course.setIsFeatured(false);
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
        course.setMaxParticipants(courseDetails.getMaxParticipants());
        course.setStartDate(courseDetails.getStartDate());
        course.setEndDate(courseDetails.getEndDate());
        course.setDuration(courseDetails.getDuration());
        course.setImageUrl(courseDetails.getImageUrl());
        course.setStatus(courseDetails.getStatus());
        course.setIsFeatured(courseDetails.getIsFeatured());
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

    // 6. Lấy courses theo instructor
    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }

    // 7. Lấy courses theo category
    public List<Course> getCoursesByCategory(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }

    // 8. Lấy active courses
    public List<Course> getActiveCourses() {
        return courseRepository.findByIsActiveTrue();
    }

    // 9. Lấy open courses
    public List<Course> getOpenCourses() {
        return courseRepository.findByStatusAndIsActiveTrue("open");
    }

    // 10. Lấy featured courses
    public List<Course> getFeaturedCourses() {
        return courseRepository.findByIsFeaturedTrue();
    }

    // 11. Lấy available courses (có chỗ trống)
    public List<Course> getAvailableCourses() {
        return courseRepository.findAvailableCourses();
    }

    // 12. Search courses
    public List<Course> searchCourses(String keyword) {
        return courseRepository.findByKeyword(keyword);
    }

    // 13. Lấy courses với pagination
    public Page<Course> getOpenCoursesWithPagination(Pageable pageable) {
        return courseRepository.findByStatusAndIsActiveTrue("open", pageable);
    }

    // 14. Increment participants
    @Transactional
    public Course incrementParticipants(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
            throw new RuntimeException("Course is full");
        }
        
        course.setCurrentParticipants(course.getCurrentParticipants() + 1);
        
        // Close course if full
        if (course.getCurrentParticipants().equals(course.getMaxParticipants())) {
            course.setStatus("closed");
        }
        
        return courseRepository.save(course);
    }

    // 15. Decrement participants
    @Transactional
    public Course decrementParticipants(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (course.getCurrentParticipants() > 0) {
            course.setCurrentParticipants(course.getCurrentParticipants() - 1);
            
            // Reopen course if was closed due to being full
            if ("closed".equals(course.getStatus()) && course.getCurrentParticipants() < course.getMaxParticipants()) {
                course.setStatus("open");
            }
        }
        
        return courseRepository.save(course);
    }

    // 16. Lấy latest courses
    public List<Course> getLatestCourses() {
        return courseRepository.findTop10ByStatusOrderByCreatedAtDesc("open");
    }

    // 17. Lấy popular courses
    public List<Course> getPopularCourses() {
        return courseRepository.findTop10ByStatusOrderByCurrentParticipantsDesc("open");
    }
} 