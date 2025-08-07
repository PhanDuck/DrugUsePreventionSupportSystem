package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.repository.CourseRepository;
import com.drugprevention.drugbe.entity.CourseLesson;
import com.drugprevention.drugbe.repository.CourseLessonRepository;
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
import com.drugprevention.drugbe.repository.CourseRegistrationRepository;
import com.drugprevention.drugbe.entity.CourseProgress;
import com.drugprevention.drugbe.repository.CourseProgressRepository;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseLessonRepository courseLessonRepository;

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    @Autowired
    private CourseProgressRepository courseProgressRepository;

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
        // Set default values for new course
        course.setIsActive(true);
        course.setCurrentParticipants(0); // Initialize to 0
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        
        // Set other default values if not provided
        if (course.getStatus() == null) {
            course.setStatus("open");
        }
        if (course.getIsFeatured() == null) {
            course.setIsFeatured(false);
        }
        if (course.getTotalReviews() == null) {
            course.setTotalReviews(0);
        }
        
        // Set default values for enhanced fields
        if (course.getPrice() == null) {
            course.setPrice(java.math.BigDecimal.ZERO); // Default to free course
        }
        if (course.getDifficultyLevel() == null) {
            course.setDifficultyLevel("BEGINNER");
        }
        if (course.getLanguage() == null) {
            course.setLanguage("vi"); // Default Vietnamese
        }
        if (course.getTotalLessons() == null) {
            course.setTotalLessons(0);
        }
        if (course.getTotalDurationMinutes() == null) {
            course.setTotalDurationMinutes(0);
        }
        if (course.getCertificateEnabled() == null) {
            course.setCertificateEnabled(false);
        }
        if (course.getAverageRating() == null) {
            course.setAverageRating(java.math.BigDecimal.ZERO);
        }
        
        System.out.println("Creating course with price: " + course.getPrice());
        System.out.println("Course details: " + course.getTitle() + " - " + course.getDescription());
        
        return courseRepository.save(course);
    }

    // 4. Update course
    @Transactional
    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        // Update basic fields
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setInstructorId(courseDetails.getInstructorId());
        course.setCategoryId(courseDetails.getCategoryId());
        course.setDuration(courseDetails.getDuration());
        course.setMaxParticipants(courseDetails.getMaxParticipants());
        course.setStatus(courseDetails.getStatus());
        course.setIsActive(courseDetails.getIsActive());
        course.setIsFeatured(courseDetails.getIsFeatured());
        
        // Update course dates if provided
        if (courseDetails.getStartDate() != null) {
            course.setStartDate(courseDetails.getStartDate());
        }
        if (courseDetails.getEndDate() != null) {
            course.setEndDate(courseDetails.getEndDate());
        }
        
        // Update enhanced fields (including price)
        if (courseDetails.getPrice() != null) {
            course.setPrice(courseDetails.getPrice());
        }
        if (courseDetails.getDifficultyLevel() != null) {
            course.setDifficultyLevel(courseDetails.getDifficultyLevel());
        }
        if (courseDetails.getLanguage() != null) {
            course.setLanguage(courseDetails.getLanguage());
        }
        if (courseDetails.getTotalLessons() != null) {
            course.setTotalLessons(courseDetails.getTotalLessons());
        }
        if (courseDetails.getTotalDurationMinutes() != null) {
            course.setTotalDurationMinutes(courseDetails.getTotalDurationMinutes());
        }
        if (courseDetails.getImageUrl() != null) {
            course.setImageUrl(courseDetails.getImageUrl());
        }
        if (courseDetails.getThumbnailUrl() != null) {
            course.setThumbnailUrl(courseDetails.getThumbnailUrl());
        }
        if (courseDetails.getPreviewVideoUrl() != null) {
            course.setPreviewVideoUrl(courseDetails.getPreviewVideoUrl());
        }
        if (courseDetails.getCertificateEnabled() != null) {
            course.setCertificateEnabled(courseDetails.getCertificateEnabled());
        }
        if (courseDetails.getPrerequisites() != null) {
            course.setPrerequisites(courseDetails.getPrerequisites());
        }
        if (courseDetails.getLearningOutcomes() != null) {
            course.setLearningOutcomes(courseDetails.getLearningOutcomes());
        }
        if (courseDetails.getTags() != null) {
            course.setTags(courseDetails.getTags());
        }
        
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

    // 14. Increment participants count (for statistics only - no enrollment limits)
    @Transactional
    public void incrementParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        // Keep tracking for statistics, but no longer enforce limits
        course.setCurrentParticipants(course.getCurrentParticipants() + 1);
        courseRepository.save(course);
    }

    // 15. Decrement participants count (for statistics only - no enrollment limits)
    @Transactional
    public void decrementParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        // Keep tracking for statistics, but no longer enforce limits
        if (course.getCurrentParticipants() > 0) {
            course.setCurrentParticipants(course.getCurrentParticipants() - 1);
            courseRepository.save(course);
        }
    }

    // Increment course participants (for statistics only - no enrollment limits)
    @Transactional
    public void incrementCourseParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        // Keep tracking for statistics, but no longer enforce limits
        course.setCurrentParticipants(course.getCurrentParticipants() + 1);
        courseRepository.save(course);
    }

    // Decrement course participants (for statistics only - no enrollment limits)  
    @Transactional
    public void decrementCourseParticipants(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        // Keep tracking for statistics, but no longer enforce limits
        if (course.getCurrentParticipants() > 0) {
            course.setCurrentParticipants(course.getCurrentParticipants() - 1);
        }
        courseRepository.save(course);
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
        return courseRegistrationRepository.findByCourseId(courseId);
    }

    // Get course lessons
    public List<CourseLesson> getCourseLessons(Long courseId) {
        return courseLessonRepository.findByCourseIdOrderByLessonOrder(courseId);
    }

    // Check if course is completed by user
    public boolean isCourseCompletedByUser(Long userId, Long courseId) {
        return courseProgressRepository.hasCompletedCourse(userId, courseId);
    }

    // Complete course for user
    @Transactional
    public void completeCourseForUser(Long userId, Long courseId) {
        // Create course progress record for completion
        CourseProgress progress = new CourseProgress();
        progress.setUserId(userId);
        progress.setCourseId(courseId);
        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        progress.setCompletionPercentage(100);
        progress.setProgressType("COURSE_COMPLETED");
        progress.setLastAccessedAt(LocalDateTime.now());
        progress.setFirstAccessedAt(LocalDateTime.now());
        
        courseProgressRepository.save(progress);
    }
} 