package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.CourseRegistrationService;
import com.drugprevention.drugbe.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
@Tag(name = "Course Controller", description = "APIs for course management and registration")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseRegistrationService courseRegistrationService;

    @Autowired
    private AuthService authService;

    // ===== HEALTH CHECK =====

    @GetMapping("/health")
    @Operation(summary = "Health check for course service")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("📚 Course Service is running! Ready for educational content.");
    }

    // ===== GET COURSES =====

    @GetMapping
    @Operation(summary = "Get all courses", description = "Retrieve all available courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID", description = "Retrieve a specific course by its ID")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseService.getCourseById(id);
            if (courseOpt.isPresent()) {
                return ResponseEntity.ok(courseOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get courses by category", description = "Retrieve all courses in a specific category")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategory(categoryId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // ===== COURSE REGISTRATION =====

    @PostMapping("/{courseId}/register")
    @Operation(summary = "Register for a course", description = "Register the current user for a specific course")
    public ResponseEntity<?> registerForCourse(@PathVariable Long courseId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            CourseRegistration registration = courseRegistrationService.registerForCourse(user.getId(), courseId);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error registering for course: " + e.getMessage()));
        }
    }

    @GetMapping("/registrations/user/{userId}")
    @Operation(summary = "Get user registrations", description = "Get all course registrations for a specific user")
    public ResponseEntity<List<CourseRegistration>> getUserRegistrations(@PathVariable Long userId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getUserRegistrations(userId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/registrations/course/{courseId}")
    @Operation(summary = "Get course registrations", description = "Get all registrations for a specific course")
    public ResponseEntity<List<CourseRegistration>> getCourseRegistrations(@PathVariable Long courseId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getCourseRegistrations(courseId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // ===== ADMIN ENDPOINTS =====

    @PostMapping
    @Operation(summary = "Create new course", description = "Create a new course (Admin only)")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        try {
            Course createdCourse = courseService.createCourse(course);
            return ResponseEntity.ok(createdCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating course: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update course", description = "Update an existing course (Admin only)")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        try {
            course.setId(id);
            Course updatedCourse = courseService.updateCourse(id, course);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error updating course: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete course", description = "Delete a course (Admin only)")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error deleting course: " + e.getMessage()));
        }
    }
} 