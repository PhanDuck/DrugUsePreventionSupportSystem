package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.UserService;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.AppointmentService;
import com.drugprevention.drugbe.service.AssessmentResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')") // Class-level security for admin endpoints
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private AssessmentResultService assessmentResultService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("👨‍💼 Admin Service is running!");
    }

    // Dashboard statistics - Re-enabled and improved
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // User statistics
            List<com.drugprevention.drugbe.dto.UserDTO> allUsers = userService.getAllUsersDTO();
            List<com.drugprevention.drugbe.dto.UserDTO> consultants = userService.getConsultantsDTO();
            
            long totalUsers = allUsers.size();
            long totalConsultants = consultants.size();
            long totalRegularUsers = allUsers.stream()
                .filter(user -> "USER".equals(user.getRole().getName()))
                .count();
            
            stats.put("userStats", Map.of(
                "totalUsers", totalUsers,
                "totalConsultants", totalConsultants,
                "totalRegularUsers", totalRegularUsers,
                "activeUsers", allUsers.stream().count() // All users since we're using DTOs of active users
            ));
            
            // Course statistics
            try {
                List<com.drugprevention.drugbe.entity.Course> allCourses = courseService.getAllCourses();
                List<com.drugprevention.drugbe.entity.Course> activeCourses = courseService.getActiveCourses();
                
                stats.put("courseStats", Map.of(
                    "totalCourses", allCourses.size(),
                    "activeCourses", activeCourses.size(),
                    "inactiveCourses", allCourses.size() - activeCourses.size(),
                    "averageParticipants", activeCourses.stream()
                        .mapToInt(course -> course.getCurrentParticipants() != null ? course.getCurrentParticipants() : 0)
                        .average()
                        .orElse(0.0)
                ));
            } catch (Exception e) {
                stats.put("courseStats", Map.of(
                    "error", "Unable to fetch course statistics",
                    "totalCourses", 0,
                    "activeCourses", 0
                ));
            }
            
            // Appointment statistics
            try {
                List<com.drugprevention.drugbe.dto.AppointmentDTO> allAppointments = appointmentService.getAllAppointments();
                long completedAppointments = allAppointments.stream()
                    .filter(apt -> "COMPLETED".equals(apt.getStatus()))
                    .count();
                long pendingAppointments = allAppointments.stream()
                    .filter(apt -> "PENDING".equals(apt.getStatus()))
                    .count();
                
                stats.put("appointmentStats", Map.of(
                    "totalAppointments", allAppointments.size(),
                    "completedAppointments", completedAppointments,
                    "pendingAppointments", pendingAppointments,
                    "cancelledAppointments", allAppointments.stream()
                        .filter(apt -> "CANCELLED".equals(apt.getStatus()))
                        .count()
                ));
            } catch (Exception e) {
                stats.put("appointmentStats", Map.of(
                    "error", "Unable to fetch appointment statistics",
                    "totalAppointments", 0
                ));
            }
            
            // Assessment statistics
            try {
                List<com.drugprevention.drugbe.dto.AssessmentResultDTO> allResults = assessmentResultService.getAllResults();
                stats.put("assessmentStats", Map.of(
                    "totalAssessments", allResults.size(),
                    "completedToday", 0, // Would need date filtering
                    "averageScore", allResults.stream()
                        .mapToDouble(result -> result.getTotalScore() != null ? result.getTotalScore().doubleValue() : 0.0)
                        .average()
                        .orElse(0.0)
                ));
            } catch (Exception e) {
                stats.put("assessmentStats", Map.of(
                    "error", "Unable to fetch assessment statistics",
                    "totalAssessments", 0
                ));
            }
            
            // System health
            stats.put("systemHealth", Map.of(
                "status", "healthy",
                "uptime", "Unknown", // Would need application start time tracking
                "lastUpdate", java.time.LocalDateTime.now()
            ));
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats,
                "message", "Dashboard statistics retrieved successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve dashboard statistics",
                "details", e.getMessage()
            ));
        }
    }

    // User management endpoints
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Note: UserService doesn't have pagination yet, using simple approach
            List<com.drugprevention.drugbe.dto.UserDTO> allUsers = userService.getAllUsersDTO();
            
            // Manual pagination (should be moved to service layer for better performance)
            int start = page * size;
            int end = Math.min(start + size, allUsers.size());
            List<com.drugprevention.drugbe.dto.UserDTO> paginatedUsers = 
                start < allUsers.size() ? allUsers.subList(start, end) : List.of();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                    "content", paginatedUsers,
                    "totalElements", allUsers.size(),
                    "totalPages", (int) Math.ceil((double) allUsers.size() / size),
                    "currentPage", page,
                    "size", size
                ),
                "message", "Users retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve users",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            var userDTO = userService.getUserByIdDTO(id);
            if (userDTO.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", userDTO.get(),
                    "message", "User retrieved successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve user",
                "details", e.getMessage()
            ));
        }
    }

    // Advanced statistics endpoints
    @GetMapping("/statistics/users/by-role")
    public ResponseEntity<?> getUserStatsByRole() {
        try {
            List<com.drugprevention.drugbe.dto.UserDTO> allUsers = userService.getAllUsersDTO();
            Map<String, Long> roleStats = new HashMap<>();
            
            allUsers.forEach(user -> {
                String roleName = user.getRole() != null ? user.getRole().getName() : "UNKNOWN";
                roleStats.merge(roleName, 1L, Long::sum);
            });
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", roleStats,
                "message", "User statistics by role retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve user statistics by role",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/statistics/courses/performance")
    public ResponseEntity<?> getCoursePerformanceStats() {
        try {
            List<com.drugprevention.drugbe.entity.Course> courses = courseService.getAllCourses();
            
            // Calculate various course metrics
            Map<String, Object> performanceStats = new HashMap<>();
            performanceStats.put("totalCourses", courses.size());
            performanceStats.put("averageParticipants", courses.stream()
                .filter(course -> course.getCurrentParticipants() != null)
                .mapToInt(com.drugprevention.drugbe.entity.Course::getCurrentParticipants)
                .average()
                .orElse(0.0));
            performanceStats.put("highestEnrollment", courses.stream()
                .filter(course -> course.getCurrentParticipants() != null)
                .mapToInt(com.drugprevention.drugbe.entity.Course::getCurrentParticipants)
                .max()
                .orElse(0));
            // Full courses count - UPDATED: Always 0 since unlimited enrollment
            int fullCoursesCount = 0; // No longer tracking full courses
            /* OLD LOGIC:
            int fullCoursesCount = (int) courses.stream()
                .filter(course -> course.getCurrentParticipants() != null &&
                        course.getMaxParticipants() != null &&
                        course.getCurrentParticipants().equals(course.getMaxParticipants()))
                .count();
            */
            performanceStats.put("coursesWithFullCapacity", fullCoursesCount);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", performanceStats,
                "message", "Course performance statistics retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve course performance statistics",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/statistics/appointments/status")
    public ResponseEntity<?> getAppointmentStatusStats() {
        try {
            List<com.drugprevention.drugbe.dto.AppointmentDTO> appointments = appointmentService.getAllAppointments();
            Map<String, Long> statusStats = new HashMap<>();
            
            appointments.forEach(appointment -> {
                String status = appointment.getStatus() != null ? appointment.getStatus() : "UNKNOWN";
                statusStats.merge(status, 1L, Long::sum);
            });
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", statusStats,
                "message", "Appointment status statistics retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve appointment status statistics",
                "details", e.getMessage()
            ));
        }
    }
} 