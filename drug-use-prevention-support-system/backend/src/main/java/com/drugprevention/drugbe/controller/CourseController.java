package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.CourseRegistrationService;
import com.drugprevention.drugbe.service.AuthService;
import com.drugprevention.drugbe.entity.CourseContent;
import com.drugprevention.drugbe.service.CourseContentService;
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
import java.util.HashMap;
import com.drugprevention.drugbe.entity.CourseLesson;
import java.util.ArrayList;
import java.util.stream.Collectors;

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

    @Autowired
    private CourseContentService courseContentService;

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

    @GetMapping("/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get course lessons", description = "Get lessons for a specific course (enrolled users only)")
    public ResponseEntity<?> getCourseLessons(@PathVariable Long courseId, Authentication authentication) {
        try {
            System.out.println("=== GET COURSE LESSONS DEBUG ===");
            System.out.println("Course ID: " + courseId);
            
            if (authentication == null) {
                System.out.println("ERROR: Authentication is null");
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            System.out.println("Username: " + username);
            
            User user = authService.findByUsername(username);
            System.out.println("User found: " + (user != null ? "YES, ID: " + user.getId() : "NO"));
            
            if (user == null) {
                System.out.println("ERROR: User not found");
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Check if user is enrolled in the course
            System.out.println("Checking enrollment for user " + user.getId() + " in course " + courseId);
            boolean isEnrolled = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
            System.out.println("Is enrolled: " + isEnrolled);
            
            if (!isEnrolled) {
                System.out.println("ERROR: User not enrolled");
                return ResponseEntity.badRequest().body(Map.of("error", "You must be enrolled in this course to view lessons"));
            }

            // Get course lessons
            System.out.println("Getting lessons for course " + courseId);
            List<CourseLesson> lessons = courseService.getCourseLessons(courseId);
            System.out.println("Lessons found: " + (lessons != null ? lessons.size() : "NULL"));
            
            // Convert to DTO to avoid serialization issues
            List<Map<String, Object>> lessonDTOs = lessons.stream().map(lesson -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", lesson.getId());
                dto.put("courseId", lesson.getCourseId());
                dto.put("title", lesson.getTitle());
                dto.put("description", lesson.getDescription());
                dto.put("lessonOrder", lesson.getLessonOrder());
                dto.put("estimatedDuration", lesson.getEstimatedDuration());
                dto.put("isPublished", lesson.getIsPublished());
                dto.put("isFree", lesson.getIsFree());
                dto.put("requiredCompletion", lesson.getRequiredCompletion());
                dto.put("thumbnailUrl", lesson.getThumbnailUrl());
                dto.put("learningObjectives", lesson.getLearningObjectives());
                dto.put("prerequisites", lesson.getPrerequisites());
                dto.put("createdAt", lesson.getCreatedAt());
                dto.put("updatedAt", lesson.getUpdatedAt());
                dto.put("createdBy", lesson.getCreatedBy());
                return dto;
            }).toList();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", lessonDTOs,
                "message", "Course lessons retrieved successfully"
            ));
        } catch (Exception e) {
            System.out.println("EXCEPTION in getCourseLessons: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve course lessons",
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

    @PostMapping("/{courseId}/complete")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Complete course", description = "Mark a course as completed for the current user")
    public ResponseEntity<?> completeCourse(@PathVariable Long courseId, Authentication authentication) {
        try {
            System.out.println("=== COMPLETE COURSE DEBUG ===");
            System.out.println("Course ID: " + courseId);
            
            if (authentication == null) {
                System.out.println("ERROR: Authentication is null");
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            System.out.println("Username: " + username);
            
            User user = authService.findByUsername(username);
            System.out.println("User found: " + (user != null ? "YES, ID: " + user.getId() : "NO"));
            
            if (user == null) {
                System.out.println("ERROR: User not found");
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Check if user is enrolled in the course
            System.out.println("Checking enrollment for user " + user.getId() + " in course " + courseId);
            boolean isEnrolled = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
            System.out.println("Is enrolled: " + isEnrolled);
            
            if (!isEnrolled) {
                System.out.println("ERROR: User not enrolled");
                return ResponseEntity.badRequest().body(Map.of("error", "You must be enrolled in this course to complete it"));
            }

            // Check if course is already completed
            boolean isCompleted = courseService.isCourseCompletedByUser(user.getId(), courseId);
            System.out.println("Is already completed: " + isCompleted);
            
            if (isCompleted) {
                System.out.println("ERROR: Course already completed");
                return ResponseEntity.badRequest().body(Map.of("error", "Course is already completed"));
            }

            // Complete the course
            System.out.println("Completing course for user " + user.getId());
            courseService.completeCourseForUser(user.getId(), courseId);
            System.out.println("Course completed successfully");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Course completed successfully"
            ));
        } catch (Exception e) {
            System.out.println("EXCEPTION in completeCourse: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to complete course",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/{courseId}/status")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get course status", description = "Get course status for the current user (enrolled/completed)")
    public ResponseEntity<?> getCourseStatus(@PathVariable Long courseId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Check if user is enrolled
            boolean isEnrolled = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
            
            if (!isEnrolled) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", "NOT_ENROLLED",
                    "message", "User is not enrolled in this course"
                ));
            }
            
            // Check if course is completed
            boolean isCompleted = courseService.isCourseCompletedByUser(user.getId(), courseId);
            
            if (isCompleted) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", "COMPLETED",
                    "message", "Course is completed"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "status", "ENROLLED",
                    "message", "User is enrolled but course not completed"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to get course status",
                "details", e.getMessage()
            ));
        }
    }

    // ========== LESSON CONTENT ENDPOINTS FOR USERS ==========
    
    // Get published content for a lesson (enrolled users only)
    @GetMapping("/{courseId}/lessons/{lessonId}/content")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Get published content for a lesson", description = "Get published content for enrolled users")
    public ResponseEntity<?> getLessonContent(@PathVariable Long courseId, @PathVariable Long lessonId, Authentication authentication) {
        System.out.println("🔍 ENDPOINT HIT: getLessonContent for courseId: " + courseId + ", lessonId: " + lessonId);
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            System.out.println("🔍 User found: " + (user != null ? user.getUsername() + " (ID: " + user.getId() + ")" : "null"));
            System.out.println("🔍 User role: " + (user != null ? user.getRole().getName() : "null"));
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            // Check if user is enrolled in the course (except for staff/admin)
            if (!user.getRole().getName().equals("STAFF") && !user.getRole().getName().equals("ADMIN")) {
                System.out.println("🔍 Regular user - checking enrollment for user " + user.getId() + " in course " + courseId);
                boolean isEnrolled = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
                System.out.println("🔍 Enrollment status: " + isEnrolled);
                if (!isEnrolled) {
                    System.out.println("❌ User not enrolled - returning 403");
                    return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "error", "You must be enrolled in this course to view content"
                    ));
                }
                System.out.println("✅ User is enrolled - proceeding to load content");
            } else {
                System.out.println("✅ Staff/Admin user - skipping enrollment check");
            }
            
            // Get published content only for regular users
            List<CourseContent> contents = courseContentService.getPublishedContentByLesson(lessonId);
            System.out.println("🔍 Found " + contents.size() + " published content items for lesson " + lessonId);
            
            // Convert to simple data
            List<Map<String, Object>> simpleData = contents.stream().map(content -> {
                Map<String, Object> data = new HashMap<>();
                data.put("id", content.getId());
                data.put("title", content.getTitle());
                data.put("contentType", content.getContentType());
                
                // Get content value based on type
                String contentValue = "";
                if ("VIDEO".equals(content.getContentType())) {
                    contentValue = content.getVideoUrl();
                } else if ("TEXT".equals(content.getContentType())) {
                    contentValue = content.getTextContent();
                } else if ("MEET_LINK".equals(content.getContentType())) {
                    contentValue = content.getMeetLink();
                } else if ("DOCUMENT".equals(content.getContentType())) {
                    contentValue = content.getDocumentUrl();
                }
                data.put("contentValue", contentValue);
                
                // Include specific fields
                data.put("textContent", content.getTextContent());
                data.put("videoUrl", content.getVideoUrl());
                data.put("meetLink", content.getMeetLink());
                data.put("documentUrl", content.getDocumentUrl());
                
                data.put("description", content.getDescription());
                data.put("contentOrder", content.getContentOrder());
                data.put("estimatedDuration", content.getEstimatedDuration());
                data.put("isPublished", content.getIsPublished());
                data.put("isFree", content.getIsFree());
                data.put("lessonId", content.getLessonId());
                return data;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", simpleData,
                "count", simpleData.size(),
                "message", "Published lesson content loaded successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ EXCEPTION in getLessonContent:");
            System.err.println("❌ Exception message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "data", new ArrayList<>()
            ));
        }
    }

} 