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
            System.out.println("=== COURSE REGISTRATION DEBUG ===");
            System.out.println("Course ID: " + courseId);
            System.out.println("Authentication: " + (authentication != null ? authentication.getName() : "NULL"));
            
            if (authentication == null) {
                System.out.println("ERROR: Authentication is null");
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            System.out.println("Username: " + username);
            User user = authService.findByUsername(username);
            System.out.println("User found: " + (user != null ? "YES, ID: " + user.getId() : "NO"));
            
            // Get course details
            Optional<Course> courseOpt = courseService.getCourseById(courseId);
            if (courseOpt.isEmpty()) {
                System.out.println("ERROR: Course not found");
                return ResponseEntity.badRequest().body(Map.of("error", "Course not found"));
            }
            
            Course course = courseOpt.get();
            System.out.println("Course found: " + course.getTitle());
            System.out.println("Course status: " + course.getStatus());
            System.out.println("Course isActive: " + course.getIsActive());
            System.out.println("Course price: " + course.getPrice());
            System.out.println("Course currentParticipants: " + course.getCurrentParticipants());
            System.out.println("Course maxParticipants: " + course.getMaxParticipants());
            
            // Check if course is active and open
            if (!course.getIsActive() || !"open".equals(course.getStatus())) {
                System.out.println("ERROR: Course is not available - isActive: " + course.getIsActive() + ", status: " + course.getStatus());
                return ResponseEntity.badRequest().body(Map.of("error", "Course is not available for registration"));
            }
            
            // Check if user already registered
            boolean alreadyRegistered = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
            System.out.println("User already registered: " + alreadyRegistered);
            if (alreadyRegistered) {
                System.out.println("ERROR: User already registered");
                return ResponseEntity.badRequest().body(Map.of("error", "User is already registered for this course"));
            }
            
            // Handle paid courses vs free courses
            if (course.getPrice() != null && course.getPrice().compareTo(java.math.BigDecimal.ZERO) > 0) {
                // PAID COURSE - Return payment required status, frontend will handle VNPay
                System.out.println("PAID COURSE - Returning payment required");
                Map<String, Object> response = Map.of(
                    "requiresPayment", true,
                    "courseId", courseId,
                    "courseName", course.getTitle(),
                    "price", course.getPrice(),
                    "currency", "VND",
                    "message", "This course requires payment. Please proceed with payment.",
                    "nextStep", "PAYMENT_REQUIRED"
                );
                return ResponseEntity.ok(response);
            } else {
                // FREE COURSE - Direct registration
                System.out.println("FREE COURSE - Direct registration");
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
            System.out.println("RUNTIME EXCEPTION: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.out.println("GENERAL EXCEPTION: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error registering for course: " + e.getMessage()));
        }
    }

    @PostMapping("/complete-enrollment/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Complete enrollment after payment", description = "Complete course enrollment after successful VNPay payment")
    public ResponseEntity<?> completeEnrollmentAfterPayment(@PathVariable Long courseId, 
                                                           @RequestBody Map<String, String> paymentData,
                                                           Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            // Verify payment was successful (basic validation)
            String transactionId = paymentData.get("transactionId");
            if (transactionId == null || transactionId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid transaction ID"));
            }
            
            // Check if user already enrolled
            if (courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId)) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "User is already enrolled in this course",
                    "alreadyEnrolled", true
                ));
            }
            
            // Complete enrollment
            CourseRegistration registration = courseRegistrationService.registerForCourse(user.getId(), courseId);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "registration", registration,
                "transactionId", transactionId,
                "message", "Payment successful! Course access granted.",
                "nextStep", "ACCESS_GRANTED"
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error completing enrollment: " + e.getMessage()));
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

    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'STAFF', 'ADMIN')")
    @Operation(summary = "Check if user is enrolled", description = "Check if the current user is enrolled in a specific course")
    public ResponseEntity<?> checkEnrollment(@PathVariable Long courseId, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.ok(Map.of("isRegistered", false));
            }

            String username = authentication.getName();
            User user = authService.findByUsername(username);
            
            boolean isRegistered = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
            return ResponseEntity.ok(Map.of("isRegistered", isRegistered));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("isRegistered", false));
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