package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AppointmentDTO;
import com.drugprevention.drugbe.dto.CreateAppointmentRequest;
import com.drugprevention.drugbe.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointment Controller", description = "APIs for appointment management")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

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
            AppointmentDTO appointment = appointmentService.createAppointment(request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi tạo lịch hẹn: " + e.getMessage()));
        }
    }

    // ===== GET APPOINTMENTS =====

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get appointments by client", description = "Get all appointments for a specific client")
    public ResponseEntity<?> getAppointmentsByClient(@PathVariable Long clientId) {
        try {
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(clientId);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy lịch hẹn sắp tới: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy lịch hẹn sắp tới: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy thông tin lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi xác nhận lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi hủy lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi hoàn thành lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi thêm link meeting: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách lịch hẹn: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách lịch hẹn theo trạng thái: " + e.getMessage()));
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
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy thống kê: " + e.getMessage()));
        }
    }
} 