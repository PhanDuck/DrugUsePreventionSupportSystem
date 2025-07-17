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
import org.springframework.security.access.prepost.PreAuthorize;
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

    // ===== PUBLIC COURSE ENDPOINTS (NO AUTH REQUIRED) =====

    @GetMapping
    @Operation(summary = "Get all courses", description = "Retrieve all available courses (public access)")
    public ResponseEntity<?> getAllCourses() {
        try {
            List<Course> courses = courseService.getActiveCourses(); // Only show active courses to public
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", courses,
                "message", "Courses retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve courses",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID", description = "Retrieve a specific course by its ID (public access)")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseService.getCourseById(id);
            if (courseOpt.isPresent() && courseOpt.get().getIsActive()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", courseOpt.get(),
                    "message", "Course retrieved successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve course",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get courses by category", description = "Retrieve all courses in a specific category (public access)")
    public ResponseEntity<?> getCoursesByCategory(@PathVariable Long categoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategory(categoryId);
            // Filter only active courses for public
            courses = courses.stream()
                    .filter(course -> course.getIsActive() && "open".equals(course.getStatus()))
                    .toList();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", courses,
                "message", "Courses by category retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve courses by category",
                "details", e.getMessage()
            ));
        }
    }

    // ===== AUTHENTICATED COURSE REGISTRATION ENDPOINTS =====
    // Note: Course registration endpoints moved to CourseRegistrationController for better separation of concerns

    @GetMapping("/registrations/user/{userId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER') or @authService.getCurrentUserId() == #userId")
    @Operation(summary = "Get user registrations", description = "Get all course registrations for a specific user")
    public ResponseEntity<?> getUserRegistrations(@PathVariable Long userId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getUserRegistrations(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", registrations,
                "message", "User registrations retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve user registrations",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/registrations/course/{courseId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Get course registrations", description = "Get all registrations for a specific course (staff only)")
    public ResponseEntity<?> getCourseRegistrations(@PathVariable Long courseId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getCourseRegistrations(courseId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", registrations,
                "message", "Course registrations retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve course registrations",
                "details", e.getMessage()
            ));
        }
    }

    // ===== ADMIN/STAFF ENDPOINTS FOR COURSE MANAGEMENT =====

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Create new course", description = "Create a new course (Staff/Admin only)")
    public ResponseEntity<?> createCourse(@RequestBody Course course, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            // Set instructor as current user if not specified
            if (course.getInstructorId() == null) {
                course.setInstructorId(currentUser.getId());
            }
            
            Course createdCourse = courseService.createCourse(course);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", createdCourse,
                "message", "Course created successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to create course",
                "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Update course", description = "Update an existing course (Staff/Admin only)")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course course, Authentication authentication) {
        try {
            course.setId(id);
            Course updatedCourse = courseService.updateCourse(id, course);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updatedCourse,
                "message", "Course updated successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to update course",
                "details", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete course", description = "Delete a course (Admin/Manager only)")
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