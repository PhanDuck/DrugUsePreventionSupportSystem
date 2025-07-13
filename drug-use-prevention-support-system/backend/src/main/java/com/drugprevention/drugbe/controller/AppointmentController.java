package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AppointmentDTO;
import com.drugprevention.drugbe.dto.CreateAppointmentRequest;
import com.drugprevention.drugbe.dto.RescheduleRequest;
import com.drugprevention.drugbe.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.AuthService;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointment Controller", description = "APIs for appointment management")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AuthService authService;

    // ===== HEALTH CHECK =====

    @GetMapping("/health")
    @Operation(summary = "Health check for appointment service")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("🏥 Appointment Service is running! Ready for consultation booking.");
    }

    // ===== CREATE APPOINTMENT =====

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Create new appointment", description = "Book a new consultation appointment")
    public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        try {
            // Validate request
            if (request == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request cannot be null"));
            }
            
            if (request.getClientId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Client ID cannot be null"));
            }
            
            if (request.getConsultantId() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Consultant ID cannot be null"));
            }
            
            if (request.getAppointmentDate() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Appointment date cannot be null"));
            }
            
            if (request.getDurationMinutes() == null || request.getDurationMinutes() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Duration must be greater than 0"));
            }
            
            AppointmentDTO appointment = appointmentService.createAppointment(request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error creating appointment: " + e.getMessage()));
        }
    }

    // ===== GET APPOINTMENTS =====

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get current user appointments", description = "Get all appointments for the current authenticated user")
    public ResponseEntity<?> getCurrentUserAppointments(Authentication authentication) {
        try {
            // Validate authentication
            if (authentication == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
            }
            
            String username = authentication.getName();
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username cannot be null or empty"));
            }
            
            // Get current user ID from authentication
            User currentUser = authService.findByUsername(username);
            if (currentUser == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(currentUser.getId());
            return ResponseEntity.ok(appointments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting user appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get appointments by client", description = "Get all appointments for a specific client")
    public ResponseEntity<?> getAppointmentsByClient(@PathVariable Long clientId) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(clientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointment list: " + e.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get appointments by consultant", description = "Get all appointments for a specific consultant")
    public ResponseEntity<?> getAppointmentsByConsultant(@PathVariable Long consultantId) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByConsultant(consultantId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointment list: " + e.getMessage()));
        }
    }

    @GetMapping("/client/{clientId}/upcoming")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get upcoming appointments by client", description = "Get upcoming appointments for a client")
    public ResponseEntity<?> getUpcomingAppointmentsByClient(@PathVariable Long clientId) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getUpcomingAppointmentsByClient(clientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting upcoming appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}/upcoming")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get upcoming appointments by consultant", description = "Get upcoming appointments for a consultant")
    public ResponseEntity<?> getUpcomingAppointmentsByConsultant(@PathVariable Long consultantId) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getUpcomingAppointmentsByConsultant(consultantId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting upcoming appointments: " + e.getMessage()));
        }
    }

    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get appointment by ID", description = "Get specific appointment details")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long appointmentId) {
        try {
            AppointmentDTO appointment = appointmentService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointment information: " + e.getMessage()));
        }
    }

    // ===== UPDATE APPOINTMENT STATUS =====

    @PutMapping("/{appointmentId}/confirm")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    @Operation(summary = "Confirm appointment", description = "Consultant confirms a pending appointment")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long appointmentId, @RequestParam Long consultantId) {
        try {
            AppointmentDTO appointment = appointmentService.confirmAppointment(appointmentId, consultantId);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error confirming appointment: " + e.getMessage()));
        }
    }

    @PutMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Cancel appointment", description = "Cancel an appointment with reason")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId, 
                                             @RequestParam Long userId, 
                                             @RequestParam String reason) {
        try {
            AppointmentDTO appointment = appointmentService.cancelAppointment(appointmentId, userId, reason);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error cancelling appointment: " + e.getMessage()));
        }
    }

    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    @Operation(summary = "Complete appointment", description = "Mark appointment as completed with notes")
    public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId, 
                                                @RequestParam Long consultantId, 
                                                @RequestParam(required = false) String notes) {
        try {
            AppointmentDTO appointment = appointmentService.completeAppointment(appointmentId, consultantId, notes);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error completing appointment: " + e.getMessage()));
        }
    }

    @PutMapping("/{appointmentId}/meeting-link")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
    @Operation(summary = "Add meeting link", description = "Add online meeting link to appointment")
    public ResponseEntity<?> addMeetingLink(@PathVariable Long appointmentId, 
                                           @RequestParam Long consultantId, 
                                           @RequestParam String meetingLink) {
        try {
            AppointmentDTO appointment = appointmentService.addMeetingLink(appointmentId, consultantId, meetingLink);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error adding meeting link: " + e.getMessage()));
        }
    }

    // ===== ADMIN ENDPOINTS =====

    @GetMapping("/admin/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get all appointments (Admin)", description = "Get all appointments in system")
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAllAppointments();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointment list: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Get appointments by status (Admin)", description = "Get appointments filtered by status")
    public ResponseEntity<?> getAppointmentsByStatus(@PathVariable String status) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByStatus(status);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointments by status: " + e.getMessage()));
        }
    }

    // ===== STATISTICS =====

    @GetMapping("/consultant/{consultantId}/stats/count")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'MANAGER')")
    @Operation(summary = "Get consultant appointment count", description = "Get completed appointments count for consultant")
    public ResponseEntity<?> getCompletedAppointmentsCount(@PathVariable Long consultantId,
                                                         @RequestParam String startDate,
                                                         @RequestParam String endDate) {
        try {
            // Parse dates and get statistics
            // Implementation would parse startDate and endDate strings to LocalDateTime
            return ResponseEntity.ok(Map.of("message", "Statistics endpoint - implement date parsing"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting statistics: " + e.getMessage()));
        }
    }
    
    // ===== AVAILABLE TIME SLOTS =====
    
    @GetMapping("/consultant/{consultantId}/available-slots")
    @Operation(summary = "Get available time slots", description = "Get available time slots for a consultant on a specific date")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long consultantId,
                                                   @RequestParam String date) {
        try {
            // Parse date string to LocalDateTime
            LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
            List<String> availableSlots = appointmentService.getAvailableTimeSlots(consultantId, dateTime);
            
            return ResponseEntity.ok(Map.of(
                "consultantId", consultantId,
                "date", date,
                "availableSlots", availableSlots,
                "totalSlots", availableSlots.size()
            ));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use format: YYYY-MM-DD"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting available slots: " + e.getMessage()));
        }
    }

    // ===== RESCHEDULE APPOINTMENT =====

    @PutMapping("/{appointmentId}/reschedule")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Reschedule appointment", description = "Reschedule an appointment to a new date/time")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long appointmentId,
                                                 @Valid @RequestBody RescheduleRequest request) {
        try {
            AppointmentDTO appointment = appointmentService.rescheduleAppointment(appointmentId, request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error rescheduling appointment: " + e.getMessage()));
        }
    }

    // ===== APPOINTMENT STATISTICS =====

    @GetMapping("/statistics/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get appointment statistics", description = "Get appointment statistics for a user")
    public ResponseEntity<?> getAppointmentStatistics(@PathVariable Long userId,
                                                    @RequestParam(defaultValue = "month") String period) {
        try {
            AppointmentService.AppointmentStatistics statistics = appointmentService.getAppointmentStatistics(userId, period);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting appointment statistics: " + e.getMessage()));
        }
    }

    // ===== AUTO COMPLETE PAST APPOINTMENTS =====

    @PostMapping("/admin/auto-complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Auto complete past appointments", description = "Automatically complete past appointments")
    public ResponseEntity<?> autoCompletePastAppointments() {
        try {
            appointmentService.autoCompletePastAppointments();
            return ResponseEntity.ok(Map.of("message", "Automatically completed overdue appointments"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error auto-completing: " + e.getMessage()));
        }
    }

    // ===== SEND REMINDERS =====

    @PostMapping("/admin/send-reminders")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Send appointment reminders", description = "Send reminders for upcoming appointments")
    public ResponseEntity<?> sendAppointmentReminders() {
        try {
            appointmentService.sendAppointmentReminders();
            return ResponseEntity.ok(Map.of("message", "Appointment reminders sent"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error sending reminders: " + e.getMessage()));
        }
    }
} 