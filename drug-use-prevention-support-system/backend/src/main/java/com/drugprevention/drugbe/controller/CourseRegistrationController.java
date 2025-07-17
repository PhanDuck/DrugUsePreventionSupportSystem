package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.CourseRegistration;
import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.service.CourseRegistrationService;
import com.drugprevention.drugbe.service.CourseService;
import com.drugprevention.drugbe.service.AuthService;
import com.drugprevention.drugbe.entity.User;
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
@RequestMapping("/api/course-registrations")
@CrossOrigin(origins = "*")
@Tag(name = "Course Registration", description = "APIs for course registration management")
public class CourseRegistrationController {
    
    @Autowired
    private CourseRegistrationService courseRegistrationService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private AuthService authService;

    @GetMapping("/health")
    @Operation(summary = "Health check for course registration service")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("📝 Course Registration Service is running!");
    }

    // ===== USER REGISTRATION ENDPOINTS =====

    @PostMapping("/register/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Register for a course", description = "Register the current user for a specific course")
    public ResponseEntity<?> registerForCourse(@PathVariable Long courseId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            // Get course details
            Optional<Course> courseOpt = courseService.getCourseById(courseId);
            if (courseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course not found"));
            }
            
            Course course = courseOpt.get();
            
            // Check if course is active and open
            if (!course.getIsActive() || !"open".equals(course.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course is not available for registration"));
            }
            
            // Check if user already registered
            if (courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId)) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is already registered for this course"));
            }
            
            // Check course capacity
            if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course is full"));
            }
            
            // Handle paid courses vs free courses
            if (course.getPrice() != null && course.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
                // PAID COURSE - Need VNPay payment (placeholder for now)
                Map<String, Object> response = Map.of(
                    "requiresPayment", true,
                    "courseId", courseId,
                    "courseName", course.getTitle(),
                    "price", course.getPrice(),
                    "currency", "VND",
                    "message", "This course requires payment. VNPay integration will be implemented.",
                    // TODO: Add VNPay payment URL when ready
                    "nextStep", "PAYMENT_REQUIRED"
                );
                return ResponseEntity.ok(response);
            } else {
                // FREE COURSE - Direct registration
                CourseRegistration registration = courseRegistrationService.registerForCourse(user.getId(), courseId);
                
                Map<String, Object> response = Map.of(
                    "success", true,
                    "registration", registration,
                    "message", "Successfully registered for free course",
                    "nextStep", "ACCESS_GRANTED"
                );
                return ResponseEntity.ok(response);
            }
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error registering for course: " + e.getMessage()));
        }
    }

    @PostMapping("/confirm-payment/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Confirm payment and complete registration", description = "Complete course registration after successful payment")
    public ResponseEntity<?> confirmPaymentAndRegister(@PathVariable Long courseId, 
                                                      @RequestBody Map<String, String> paymentData,
                                                      Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            // TODO: Verify VNPay payment status when VNPay integration is ready
            String paymentStatus = paymentData.get("paymentStatus");
            String transactionId = paymentData.get("transactionId");
            
            if (!"SUCCESS".equals(paymentStatus)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Payment not successful"));
            }
            
            // Create registration after successful payment
            CourseRegistration registration = courseRegistrationService.registerForCourse(user.getId(), courseId);
            
            // TODO: Create payment record in database
            Map<String, Object> response = Map.of(
                "success", true,
                "registration", registration,
                "transactionId", transactionId,
                "message", "Payment successful! Course access granted.",
                "nextStep", "ACCESS_GRANTED"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error confirming payment: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER') or @authService.getCurrentUserId() == #userId")
    @Operation(summary = "Get user registrations", description = "Get all course registrations for a specific user")
    public ResponseEntity<List<CourseRegistration>> getUserRegistrations(@PathVariable Long userId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getUserRegistrations(userId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Get course registrations", description = "Get all registrations for a specific course (staff only)")
    public ResponseEntity<List<CourseRegistration>> getCourseRegistrations(@PathVariable Long courseId) {
        try {
            List<CourseRegistration> registrations = courseRegistrationService.getCourseRegistrations(courseId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @DeleteMapping("/cancel/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Cancel course registration", description = "Cancel the current user's registration for a specific course")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long courseId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            courseRegistrationService.cancelCourseRegistration(user.getId(), courseId);
            return ResponseEntity.ok(Map.of("message", "Registration cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error cancelling registration: " + e.getMessage()));
        }
    }

    // ===== STAFF/ADMIN ENDPOINTS =====

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Get registration statistics", description = "Get overall registration statistics (staff only)")
    public ResponseEntity<?> getRegistrationStatistics() {
        try {
            // TODO: Implement statistics calculation
            Map<String, Object> stats = Map.of(
                "totalRegistrations", 0,
                "activeRegistrations", 0,
                "cancelledRegistrations", 0
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching statistics: " + e.getMessage()));
        }
    }

    @PutMapping("/{registrationId}/approve")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Approve registration", description = "Approve a course registration (staff only)")
    public ResponseEntity<?> approveRegistration(@PathVariable Long registrationId) {
        try {
            // TODO: Implement registration approval logic
            return ResponseEntity.ok(Map.of("message", "Registration approved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error approving registration: " + e.getMessage()));
        }
    }

    @PutMapping("/{registrationId}/reject")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Reject registration", description = "Reject a course registration (staff only)")
    public ResponseEntity<?> rejectRegistration(@PathVariable Long registrationId) {
        try {
            // TODO: Implement registration rejection logic
            return ResponseEntity.ok(Map.of("message", "Registration rejected successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error rejecting registration: " + e.getMessage()));
        }
    }
} 