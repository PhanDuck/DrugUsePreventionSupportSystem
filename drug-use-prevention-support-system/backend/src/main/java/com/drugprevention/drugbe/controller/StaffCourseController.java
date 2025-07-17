package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.CourseContent;
import com.drugprevention.drugbe.entity.CourseLesson;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.AuthService;
import com.drugprevention.drugbe.service.CourseContentService;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.repository.CourseLessonRepository;
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

@RestController
@RequestMapping("/api/staff/courses")
@CrossOrigin(origins = "*")
@Tag(name = "Staff Course Management", description = "APIs for staff to manage courses, lessons, and content")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
public class StaffCourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseContentService courseContentService;

    @Autowired
    private CourseLessonRepository courseLessonRepository;

    @Autowired
    private AuthService authService;

    // ===== COURSE MANAGEMENT =====

    @GetMapping
    @Operation(summary = "Get all courses for management", description = "Get all courses with full details for staff management")
    public ResponseEntity<List<Course>> getAllCoursesForManagement() {
        try {
            List<Course> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Get course details for management")
    public ResponseEntity<Course> getCourseForManagement(@PathVariable Long courseId) {
        try {
            Optional<Course> courseOpt = courseService.getCourseById(courseId);
            return courseOpt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping
    @Operation(summary = "Create new course", description = "Create a new course with basic information")
    public ResponseEntity<?> createCourse(@RequestBody Course course, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            // Set instructor as current user if not specified
            if (course.getInstructorId() == null) {
                course.setInstructorId(currentUser.getId());
            }
            
            Course createdCourse = courseService.createCourse(course);
            return ResponseEntity.ok(createdCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating course: " + e.getMessage()));
        }
    }

    @PutMapping("/{courseId}")
    @Operation(summary = "Update course", description = "Update course information")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(courseId, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating course: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Delete course", description = "Delete a course and all its content")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting course: " + e.getMessage()));
        }
    }

    // ===== LESSON MANAGEMENT =====

    @GetMapping("/{courseId}/lessons")
    @Operation(summary = "Get all lessons in a course")
    public ResponseEntity<List<CourseLesson>> getCourseLessons(@PathVariable Long courseId) {
        try {
            List<CourseLesson> lessons = courseLessonRepository.findByCourseIdOrderByLessonOrder(courseId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{courseId}/lessons/{lessonId}")
    @Operation(summary = "Get lesson details")
    public ResponseEntity<CourseLesson> getLessonDetails(@PathVariable Long courseId, @PathVariable Long lessonId) {
        try {
            Optional<CourseLesson> lessonOpt = courseLessonRepository.findById(lessonId);
            if (lessonOpt.isPresent() && lessonOpt.get().getCourseId().equals(courseId)) {
                return ResponseEntity.ok(lessonOpt.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/{courseId}/lessons")
    @Operation(summary = "Create new lesson", description = "Create a new lesson in the course")
    public ResponseEntity<?> createLesson(@PathVariable Long courseId, @RequestBody CourseLesson lesson, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            lesson.setCourseId(courseId);
            lesson.setCreatedBy(currentUser.getId());
            
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
            lesson.setEstimatedDuration(lessonDetails.getEstimatedDuration());
            lesson.setIsPublished(lessonDetails.getIsPublished());
            lesson.setIsFree(lessonDetails.getIsFree());
            lesson.setRequiredCompletion(lessonDetails.getRequiredCompletion());
            lesson.setThumbnailUrl(lessonDetails.getThumbnailUrl());
            lesson.setLearningObjectives(lessonDetails.getLearningObjectives());
            lesson.setPrerequisites(lessonDetails.getPrerequisites());
            lesson.setUpdatedAt(LocalDateTime.now());
            
            CourseLesson updatedLesson = courseLessonRepository.save(lesson);
            return ResponseEntity.ok(updatedLesson);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating lesson: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{courseId}/lessons/{lessonId}")
    @Operation(summary = "Delete lesson")
    public ResponseEntity<?> deleteLesson(@PathVariable Long courseId, @PathVariable Long lessonId) {
        try {
            CourseLesson lesson = courseLessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));
            
            if (!lesson.getCourseId().equals(courseId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Lesson does not belong to this course"));
            }
            
            courseLessonRepository.deleteById(lessonId);
            return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting lesson: " + e.getMessage()));
        }
    }

    // ===== CONTENT MANAGEMENT =====

    @GetMapping("/{courseId}/content")
    @Operation(summary = "Get all content in a course")
    public ResponseEntity<List<CourseContent>> getCourseContent(@PathVariable Long courseId) {
        try {
            List<CourseContent> content = courseContentService.getContentByCourse(courseId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{courseId}/lessons/{lessonId}/content")
    @Operation(summary = "Get all content in a lesson")
    public ResponseEntity<List<CourseContent>> getLessonContent(@PathVariable Long courseId, @PathVariable Long lessonId) {
        try {
            List<CourseContent> content = courseContentService.getContentByLesson(lessonId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{courseId}/content/{contentId}")
    @Operation(summary = "Get content details")
    public ResponseEntity<CourseContent> getContentDetails(@PathVariable Long courseId, @PathVariable Long contentId) {
        try {
            Optional<CourseContent> contentOpt = courseContentService.getContentById(contentId);
            if (contentOpt.isPresent() && contentOpt.get().getCourseId().equals(courseId)) {
                return ResponseEntity.ok(contentOpt.get());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/{courseId}/content")
    @Operation(summary = "Create new content", description = "Create new content (video, text, meet link, or document)")
    public ResponseEntity<?> createContent(@PathVariable Long courseId, @RequestBody CourseContent content, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            content.setCourseId(courseId);
            content.setCreatedBy(currentUser.getId());
            
            CourseContent createdContent = courseContentService.createContent(content);
            return ResponseEntity.ok(createdContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating content: " + e.getMessage()));
        }
    }

    @PutMapping("/{courseId}/content/{contentId}")
    @Operation(summary = "Update content")
    public ResponseEntity<?> updateContent(@PathVariable Long courseId, @PathVariable Long contentId, @RequestBody CourseContent contentDetails) {
        try {
            CourseContent updatedContent = courseContentService.updateContent(contentId, contentDetails);
            return ResponseEntity.ok(updatedContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating content: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{courseId}/content/{contentId}")
    @Operation(summary = "Delete content")
    public ResponseEntity<?> deleteContent(@PathVariable Long courseId, @PathVariable Long contentId) {
        try {
            courseContentService.deleteContent(contentId);
            return ResponseEntity.ok(Map.of("message", "Content deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting content: " + e.getMessage()));
        }
    }

    // ===== CONTENT TYPE SPECIFIC ENDPOINTS =====

    @PostMapping("/{courseId}/content/video")
    @Operation(summary = "Create video content")
    public ResponseEntity<?> createVideoContent(@PathVariable Long courseId, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            CourseContent content = courseContentService.createVideoContent(
                courseId,
                (Long) request.get("lessonId"),
                (String) request.get("title"),
                (String) request.get("description"),
                (String) request.get("videoUrl"),
                (Integer) request.get("duration"),
                (String) request.get("thumbnail"),
                currentUser.getId()
            );
            
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating video content: " + e.getMessage()));
        }
    }

    @PostMapping("/{courseId}/content/text")
    @Operation(summary = "Create text content")
    public ResponseEntity<?> createTextContent(@PathVariable Long courseId, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            CourseContent content = courseContentService.createTextContent(
                courseId,
                (Long) request.get("lessonId"),
                (String) request.get("title"),
                (String) request.get("description"),
                (String) request.get("textContent"),
                currentUser.getId()
            );
            
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating text content: " + e.getMessage()));
        }
    }

    @PostMapping("/{courseId}/content/meet")
    @Operation(summary = "Create meet link content")
    public ResponseEntity<?> createMeetLinkContent(@PathVariable Long courseId, @RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            
            CourseContent content = courseContentService.createMeetLinkContent(
                courseId,
                (Long) request.get("lessonId"),
                (String) request.get("title"),
                (String) request.get("description"),
                (String) request.get("meetLink"),
                LocalDateTime.parse((String) request.get("startTime")),
                LocalDateTime.parse((String) request.get("endTime")),
                (String) request.get("password"),
                currentUser.getId()
            );
            
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error creating meet link content: " + e.getMessage()));
        }
    }

    // ===== CONTENT ACTIONS =====

    @PutMapping("/{courseId}/content/{contentId}/publish")
    @Operation(summary = "Publish content")
    public ResponseEntity<?> publishContent(@PathVariable Long courseId, @PathVariable Long contentId) {
        try {
            CourseContent content = courseContentService.publishContent(contentId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error publishing content: " + e.getMessage()));
        }
    }

    @PutMapping("/{courseId}/content/{contentId}/unpublish")
    @Operation(summary = "Unpublish content")
    public ResponseEntity<?> unpublishContent(@PathVariable Long courseId, @PathVariable Long contentId) {
        try {
            CourseContent content = courseContentService.unpublishContent(contentId);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error unpublishing content: " + e.getMessage()));
        }
    }

    @PutMapping("/{courseId}/content/reorder")
    @Operation(summary = "Reorder content")
    public ResponseEntity<?> reorderContent(@PathVariable Long courseId, @RequestBody List<Long> contentIds) {
        try {
            courseContentService.reorderContent(courseId, contentIds);
            return ResponseEntity.ok(Map.of("message", "Content reordered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error reordering content: " + e.getMessage()));
        }
    }

    // ===== STATISTICS =====

    @GetMapping("/{courseId}/statistics")
    @Operation(summary = "Get course content statistics")
    public ResponseEntity<?> getCourseStatistics(@PathVariable Long courseId) {
        try {
            CourseContentService.ContentStatistics stats = courseContentService.getContentStatistics(courseId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error getting statistics: " + e.getMessage()));
        }
    }

    // ===== MEET LINKS =====

    @GetMapping("/meet-links/upcoming")
    @Operation(summary = "Get upcoming meet links", description = "Get all upcoming meet links across all courses")
    public ResponseEntity<List<CourseContent>> getUpcomingMeetLinks() {
        try {
            List<CourseContent> meetLinks = courseContentService.getUpcomingMeetLinks();
            return ResponseEntity.ok(meetLinks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{courseId}/meet-links")
    @Operation(summary = "Get meet links for course")
    public ResponseEntity<List<CourseContent>> getCourseMeetLinks(@PathVariable Long courseId) {
        try {
            List<CourseContent> meetLinks = courseContentService.getMeetLinks(courseId);
            return ResponseEntity.ok(meetLinks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }
} 