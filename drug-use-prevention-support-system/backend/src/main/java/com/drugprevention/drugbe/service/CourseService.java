package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.repository.CourseRepository;
import com.drugprevention.drugbe.repository.CourseRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> getAvailableCourses() {
        return courseRepository.findByStatusAndEndDateAfter("ACTIVE", LocalDateTime.now());
    }

    public Course getCourseById(Integer courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public CourseRegistration registerCourse(User user, Integer courseId) {
        Course course = getCourseById(courseId);
        
        // Check if user already registered
        if (courseRegistrationRepository.findByUserAndCourse(user, course).isPresent()) {
            throw new RuntimeException("User already registered for this course");
        }

        // Check if course is full
        long currentRegistrations = courseRegistrationRepository.countByCourse(course);
        if (currentRegistrations >= course.getCapacity()) {
            throw new RuntimeException("Course is full");
        }

        // Create new registration
        CourseRegistration registration = new CourseRegistration();
        registration.setUser(user);
        registration.setCourse(course);
        registration.setRegisterTime(LocalDateTime.now());

        return courseRegistrationRepository.save(registration);
    }

    public List<Course> getUserCourses(User user) {
        return courseRegistrationRepository.findByUser(user)
            .stream()
            .map(CourseRegistration::getCourse)
            .toList();
    }

    // CRUD operations for Course management
    public Course createCourse(Course course) {
        course.setStatus("ACTIVE");
        return courseRepository.save(course);
    }

    public Course updateCourse(Integer id, Course courseDetails) {
        Course course = getCourseById(id);
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setStartDate(courseDetails.getStartDate());
        course.setEndDate(courseDetails.getEndDate());
        course.setCapacity(courseDetails.getCapacity());
        course.setCategory(courseDetails.getCategory());
        return courseRepository.save(course);
    }

    public void deleteCourse(Integer id) {
        Course course = getCourseById(id);
        course.setStatus("DELETED");
        courseRepository.save(course);
    }

    public List<Course> getCoursesByCategory(Integer categoryId) {
        return courseRepository.findByCategory_CategoryID(categoryId);
    }
} 