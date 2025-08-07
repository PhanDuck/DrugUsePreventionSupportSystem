package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.CourseLesson;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.AuthService;
import com.drugprevention.drugbe.repository.CourseLessonRepository;
import com.drugprevention.drugbe.entity.CourseContent;
import com.drugprevention.drugbe.service.CourseContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staff/courses")
@CrossOrigin(origins = "*")
@Tag(name = "Staff Course Management SIMPLE", description = "Simplified APIs for staff to manage courses and lessons")
public class StaffCourseControllerSimple {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseLessonRepository courseLessonRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private CourseContentService courseContentService;

    // Test endpoint
    @GetMapping("/test")
    @Operation(summary = "Test staff course API")
    public ResponseEntity<Map<String, String>> testStaffCourseAPI() {
        return ResponseEntity.ok(Map.of(
            "message", "Staff Course API SIMPLE is working!",
            "timestamp", LocalDateTime.now().toString(),
            "endpoint", "/api/staff/courses/test"
        ));
    }
    
    // Test database endpoint
    @GetMapping("/test/db")
    @Operation(summary = "Test database connectivity")
    public ResponseEntity<Map<String, Object>> testDatabaseConnectivity() {
        try {
            // Test lessons table
            long totalLessons = courseLessonRepository.count();
            
            // Test courses table  
            List<Course> courses = courseService.getAllCourses();
            
            return ResponseEntity.ok(Map.of(
                "message", "Database test successful!",
                "totalLessons", totalLessons,
                "totalCourses", courses.size(),
                "timestamp", LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "message", "Database test failed!",
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now().toString()
            ));
        }
    }

    // Get all courses
    @GetMapping
    @Operation(summary = "Get all courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // ===== NEW COURSE CRUD ENDPOINTS =====

    // Create new course
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Create new course", description = "Create a new course (Staff/Admin only)")
    public ResponseEntity<?> createCourse(@RequestBody Course course, Authentication authentication) {
        try {
            System.out.println("=== CREATE COURSE DEBUG ===");
            System.out.println("Received course data: " + course);
            System.out.println("Course title: " + course.getTitle());
            System.out.println("Course price: " + course.getPrice());
            System.out.println("Authentication: " + (authentication != null ? authentication.getName() : "NULL"));
            
            if (authentication != null) {
                String username = authentication.getName();
                User currentUser = authService.findByUsername(username);
                
                // Set instructor as current user if not specified
                if (course.getInstructorId() == null && currentUser != null) {
                    course.setInstructorId(currentUser.getId());
                    System.out.println("Set instructor ID to: " + currentUser.getId());
                }
            }
            
            Course createdCourse = courseService.createCourse(course);
            System.out.println("Course created successfully with ID: " + createdCourse.getId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", createdCourse,
                "message", "Course created successfully"
            ));
        } catch (RuntimeException e) {
            System.out.println("RuntimeException in createCourse: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            System.out.println("Exception in createCourse: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to create course",
                "details", e.getMessage()
            ));
        }
    }

    // Get course by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get course by ID", description = "Retrieve a specific course by its ID")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            Optional<Course> courseOpt = courseService.getCourseById(id);
            if (courseOpt.isPresent()) {
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

    // Update course
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Update course", description = "Update an existing course (Staff/Admin only)")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course course, Authentication authentication) {
        try {
            System.out.println("=== UPDATE COURSE DEBUG ===");
            System.out.println("Course ID: " + id);
            System.out.println("Received course data: " + course);
            
            course.setId(id);
            Course updatedCourse = courseService.updateCourse(id, course);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updatedCourse,
                "message", "Course updated successfully"
            ));
        } catch (RuntimeException e) {
            System.out.println("RuntimeException in updateCourse: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            System.out.println("Exception in updateCourse: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to update course",
                "details", e.getMessage()
            ));
        }
    }

    // Delete course
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete course", description = "Delete a course (Admin/Manager only)")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Course deleted successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Error deleting course: " + e.getMessage()
            ));
        }
    }

    // Get lessons for a course - SIMPLIFIED URL
    @GetMapping("/lessons/{courseId}")
    @Operation(summary = "Get all lessons in a course - SIMPLIFIED")
    public ResponseEntity<?> getAllCourseLessons(@PathVariable Long courseId) {
        System.out.println("🔍 ENDPOINT HIT: getAllCourseLessons for courseId: " + courseId);
        try {
            System.out.println("🔍 About to call repository...");
            List<CourseLesson> lessons = courseLessonRepository.findByCourseIdOrderByLessonOrder(courseId);
            System.out.println("🔍 Repository call successful! Found " + lessons.size() + " lessons");
            
            // Convert to simple data to avoid JSON serialization issues
            List<Map<String, Object>> simpleData = lessons.stream().map(lesson -> {
                Map<String, Object> data = new HashMap<>();
                data.put("id", lesson.getId());
                data.put("title", lesson.getTitle());
                data.put("description", lesson.getDescription());
                data.put("lessonOrder", lesson.getLessonOrder());
                data.put("estimatedDuration", lesson.getEstimatedDuration());
                data.put("isPublished", lesson.getIsPublished());
                data.put("isFree", lesson.getIsFree());
                data.put("courseId", lesson.getCourseId());
                return data;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", simpleData,
                "count", simpleData.size(),
                "message", "Lessons loaded successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ EXCEPTION in getAllCourseLessons:");
            System.err.println("❌ Exception type: " + e.getClass().getSimpleName());
            System.err.println("❌ Exception message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "errorType", e.getClass().getSimpleName(),
                "data", new ArrayList<>()
            ));
        }
    }

    // Create lesson
    @PostMapping("/{courseId}/lessons")
    @Operation(summary = "Create new lesson")
    public ResponseEntity<?> createLesson(@PathVariable Long courseId, @RequestBody CourseLesson lesson) {
        try {
            lesson.setCourseId(courseId);
            
            // Set lesson order if not provided
            if (lesson.getLessonOrder() == null) {
                lesson.setLessonOrder(courseLessonRepository.getNextLessonOrder(courseId));
            }
            
            lesson.setCreatedAt(LocalDateTime.now());
            lesson.setUpdatedAt(LocalDateTime.now());
            
            CourseLesson createdLesson = courseLessonRepository.save(lesson);
            return ResponseEntity.ok(createdLesson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating lesson: " + e.getMessage()));
        }
    }

    // Update lesson
    @PutMapping("/{courseId}/lessons/{lessonId}")
    @Operation(summary = "Update lesson")
    public ResponseEntity<?> updateLesson(@PathVariable Long courseId, @PathVariable Long lessonId, @RequestBody CourseLesson lessonDetails) {
        try {
            CourseLesson lesson = courseLessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            
            if (!lesson.getCourseId().equals(courseId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Lesson does not belong to this course"));
            }
            
            lesson.setTitle(lessonDetails.getTitle());
            lesson.setDescription(lessonDetails.getDescription());
            lesson.setLessonOrder(lessonDetails.getLessonOrder());
            // lesson.setDurationMinutes(lessonDetails.getDurationMinutes()); // Field may not exist
            lesson.setUpdatedAt(LocalDateTime.now());
            
            CourseLesson updatedLesson = courseLessonRepository.save(lesson);
            return ResponseEntity.ok(updatedLesson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating lesson: " + e.getMessage()));
        }
    }

    // Delete lesson
    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    @Operation(summary = "Delete lesson")
    public ResponseEntity<?> deleteLesson(@PathVariable Long courseId, @PathVariable Long lessonId) {
        try {
            CourseLesson lesson = courseLessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            
            if (!lesson.getCourseId().equals(courseId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Lesson does not belong to this course"));
            }
            
            courseLessonRepository.delete(lesson);
            return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting lesson: " + e.getMessage()));
        }
    }

    // ========== LESSON CONTENT ENDPOINTS ==========
    
    // Get lesson content
    @GetMapping("/lessons/{lessonId}/content")
    @Operation(summary = "Get all content for a lesson")
    public ResponseEntity<?> getLessonContent(@PathVariable Long lessonId) {
        System.out.println("🔍 ENDPOINT HIT: getLessonContent for lessonId: " + lessonId);
        try {
            List<CourseContent> contents = courseContentService.getContentByLesson(lessonId);
            System.out.println("🔍 Found " + contents.size() + " content items for lesson " + lessonId);
            
            // Convert to simple data to avoid JSON serialization issues
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
                
                // Also include specific fields that frontend might expect
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
                "message", "Lesson content loaded successfully"
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
    
    // Create lesson content
    @PostMapping("/lessons/{lessonId}/content")
    @Operation(summary = "Create new content for a lesson")
    public ResponseEntity<?> createLessonContent(@PathVariable Long lessonId, @RequestBody CourseContent content) {
        System.out.println("🔍 ENDPOINT HIT: createLessonContent for lessonId: " + lessonId);
        System.out.println("🔍 Content data: " + content.toString());
        try {
            // Set lesson ID
            content.setLessonId(lessonId);
            
            // Create the content
            CourseContent savedContent = courseContentService.createContent(content);
            System.out.println("🔍 Content created successfully with ID: " + savedContent.getId());
            
            // Return simple data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", savedContent.getId());
            responseData.put("title", savedContent.getTitle());
            responseData.put("contentType", savedContent.getContentType());
            
            // Get content value based on type
            String contentValue = "";
            if ("VIDEO".equals(savedContent.getContentType())) {
                contentValue = savedContent.getVideoUrl();
            } else if ("TEXT".equals(savedContent.getContentType())) {
                contentValue = savedContent.getTextContent();
            } else if ("MEET_LINK".equals(savedContent.getContentType())) {
                contentValue = savedContent.getMeetLink();
            } else if ("DOCUMENT".equals(savedContent.getContentType())) {
                contentValue = savedContent.getDocumentUrl();
            }
            responseData.put("contentValue", contentValue);
            
            // Also include specific fields that frontend might expect
            responseData.put("textContent", savedContent.getTextContent());
            responseData.put("videoUrl", savedContent.getVideoUrl());
            responseData.put("meetLink", savedContent.getMeetLink());
            responseData.put("documentUrl", savedContent.getDocumentUrl());
            
            responseData.put("description", savedContent.getDescription());
            responseData.put("contentOrder", savedContent.getContentOrder());
            responseData.put("estimatedDuration", savedContent.getEstimatedDuration());
            responseData.put("isPublished", savedContent.getIsPublished());
            responseData.put("isFree", savedContent.getIsFree());
            responseData.put("lessonId", savedContent.getLessonId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responseData,
                "message", "Lesson content created successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ EXCEPTION in createLessonContent:");
            System.err.println("❌ Exception message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Update lesson content
    @PutMapping("/lessons/{lessonId}/content/{contentId}")
    @Operation(summary = "Update lesson content")
    public ResponseEntity<?> updateLessonContent(@PathVariable Long lessonId, @PathVariable Long contentId, @RequestBody CourseContent content) {
        System.out.println("🔍 ENDPOINT HIT: updateLessonContent for contentId: " + contentId);
        try {
            content.setLessonId(lessonId);
            
            // Fix: Pass both contentId and content to updateContent method
            CourseContent updatedContent = courseContentService.updateContent(contentId, content);
            System.out.println("🔍 Content updated successfully");
            
            // Return simple data
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("id", updatedContent.getId());
            responseData.put("title", updatedContent.getTitle());
            responseData.put("contentType", updatedContent.getContentType());
            
            // Get content value based on type
            String contentValue = "";
            if ("VIDEO".equals(updatedContent.getContentType())) {
                contentValue = updatedContent.getVideoUrl();
            } else if ("TEXT".equals(updatedContent.getContentType())) {
                contentValue = updatedContent.getTextContent();
            } else if ("MEET_LINK".equals(updatedContent.getContentType())) {
                contentValue = updatedContent.getMeetLink();
            } else if ("DOCUMENT".equals(updatedContent.getContentType())) {
                contentValue = updatedContent.getDocumentUrl();
            }
            responseData.put("contentValue", contentValue);
            
            // Also include specific fields that frontend might expect
            responseData.put("textContent", updatedContent.getTextContent());
            responseData.put("videoUrl", updatedContent.getVideoUrl());
            responseData.put("meetLink", updatedContent.getMeetLink());
            responseData.put("documentUrl", updatedContent.getDocumentUrl());
            
            responseData.put("description", updatedContent.getDescription());
            responseData.put("contentOrder", updatedContent.getContentOrder());
            responseData.put("estimatedDuration", updatedContent.getEstimatedDuration());
            responseData.put("isPublished", updatedContent.getIsPublished());
            responseData.put("isFree", updatedContent.getIsFree());
            responseData.put("lessonId", updatedContent.getLessonId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", responseData,
                "message", "Lesson content updated successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ EXCEPTION in updateLessonContent:");
            System.err.println("❌ Exception message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Delete lesson content
    @DeleteMapping("/lessons/{lessonId}/content/{contentId}")
    @Operation(summary = "Delete lesson content")
    public ResponseEntity<?> deleteLessonContent(@PathVariable Long lessonId, @PathVariable Long contentId) {
        System.out.println("🔍 ENDPOINT HIT: deleteLessonContent for contentId: " + contentId);
        try {
            courseContentService.deleteContent(contentId);
            System.out.println("🔍 Content deleted successfully");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Lesson content deleted successfully"
            ));
        } catch (Exception e) {
            System.err.println("❌ EXCEPTION in deleteLessonContent:");
            System.err.println("❌ Exception message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

} 