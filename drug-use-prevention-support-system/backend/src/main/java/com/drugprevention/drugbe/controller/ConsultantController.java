package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.dto.UserDTO;
import com.drugprevention.drugbe.service.UserService;
import com.drugprevention.drugbe.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "*")
@Tag(name = "Consultant Controller", description = "APIs for consultant management and appointment booking")
public class ConsultantController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping
    @Operation(summary = "Get all consultants", description = "Get list of all available consultants")
    public ResponseEntity<List<User>> getAllConsultants() {
        return ResponseEntity.ok(userService.findAllConsultants());
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search consultants", description = "Search consultants by keyword, specialty, location, rating, or price")
    public ResponseEntity<List<User>> searchConsultants(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(userService.searchConsultants(keyword, specialty, location, minRating, maxPrice));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get consultant by ID", description = "Get detailed information of a specific consultant")
    public ResponseEntity<User> getConsultantById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    @Operation(summary = "Get available consultants", description = "Get list of all available consultants")
    public ResponseEntity<List<User>> getAvailableConsultants() {
        return ResponseEntity.ok(userService.findAvailableConsultants());
    }
    
    @GetMapping("/public/list")
    @Operation(summary = "Public endpoint to get all consultants", description = "Get list of all consultants without authentication")
    public ResponseEntity<List<UserDTO>> getPublicConsultants() {
        return ResponseEntity.ok(userService.getConsultantsDTO());
    }

    // ===== NEW ENDPOINTS FOR APPOINTMENT BOOKING =====

    @GetMapping("/{consultantId}/booking-info")
    @Operation(summary = "Get consultant booking information", description = "Get consultant details for appointment booking including expertise, bio, and hourly rate")
    public ResponseEntity<?> getConsultantBookingInfo(@PathVariable Long consultantId) {
        try {
            User consultant = userService.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));

            // Check if user is actually a consultant
            if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a consultant"));
            }

            Map<String, Object> bookingInfo = new HashMap<>();
            bookingInfo.put("consultantId", consultant.getId());
            bookingInfo.put("consultantName", consultant.getFirstName() + " " + consultant.getLastName());
            bookingInfo.put("email", consultant.getEmail());
            bookingInfo.put("phone", consultant.getPhone());
            bookingInfo.put("expertise", consultant.getExpertise());
            bookingInfo.put("degree", consultant.getDegree());
            bookingInfo.put("bio", consultant.getBio());
            bookingInfo.put("hourlyRate", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() : 100000.0);
            bookingInfo.put("isActive", consultant.getIsActive());
            bookingInfo.put("consultationTypes", List.of("ONLINE", "IN_PERSON"));

            return ResponseEntity.ok(bookingInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting consultant booking info: " + e.getMessage()));
        }
    }

    @GetMapping("/{consultantId}/available-slots")
    @Operation(summary = "Get available time slots", description = "Get available time slots for a consultant on a specific date")
    public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long consultantId,
                                                   @RequestParam String date) {
        try {
            // Validate date format
            LocalDate appointmentDate;
            try {
                appointmentDate = LocalDate.parse(date);
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Use YYYY-MM-DD"));
            }

            // Check if consultant exists and is active
            User consultant = userService.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));

            if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a consultant"));
            }

            if (consultant.getIsActive() == null || !consultant.getIsActive()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Consultant is not available"));
            }

            // Get available slots from appointment service
            List<Map<String, Object>> availableSlots = appointmentService.getAvailableTimeSlotsForDate(consultantId, appointmentDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("consultantId", consultantId);
            response.put("consultantName", consultant.getFirstName() + " " + consultant.getLastName());
            response.put("date", date);
            response.put("availableSlots", availableSlots);
            response.put("totalSlots", availableSlots.size());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting available slots: " + e.getMessage()));
        }
    }

    @GetMapping("/{consultantId}/schedule")
    @Operation(summary = "Get consultant schedule", description = "Get consultant's schedule for a specific date range")
    public ResponseEntity<?> getConsultantSchedule(@PathVariable Long consultantId,
                                                  @RequestParam String startDate,
                                                  @RequestParam String endDate) {
        try {
            // Validate date format
            LocalDate start, end;
            try {
                start = LocalDate.parse(startDate);
                end = LocalDate.parse(endDate);
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Use YYYY-MM-DD"));
            }

            if (start.isAfter(end)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Start date cannot be after end date"));
            }

            // Check if consultant exists
            User consultant = userService.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));

            if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a consultant"));
            }

            // Get consultant's appointments for the date range
            List<Map<String, Object>> schedule = appointmentService.getConsultantScheduleForDateRange(consultantId, start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("consultantId", consultantId);
            response.put("consultantName", consultant.getFirstName() + " " + consultant.getLastName());
            response.put("startDate", startDate);
            response.put("endDate", endDate);
            response.put("schedule", schedule);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting consultant schedule: " + e.getMessage()));
        }
    }

    @GetMapping("/{consultantId}/pricing")
    @Operation(summary = "Get consultant pricing", description = "Get consultant's pricing information for different appointment types")
    public ResponseEntity<?> getConsultantPricing(@PathVariable Long consultantId) {
        try {
            User consultant = userService.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));

            if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a consultant"));
            }

            Map<String, Object> pricing = new HashMap<>();
            pricing.put("consultantId", consultantId);
            pricing.put("consultantName", consultant.getFirstName() + " " + consultant.getLastName());
            pricing.put("hourlyRate", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() : 100000.0);
            pricing.put("pricingOptions", Map.of(
                "30min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 0.5 : 50000.0,
                "60min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() : 100000.0,
                "90min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 1.5 : 150000.0,
                "120min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 2.0 : 200000.0
            ));
            pricing.put("currency", "VND");
            pricing.put("paymentMethods", List.of("VNPAY", "CASH", "BANK_TRANSFER"));

            return ResponseEntity.ok(pricing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting consultant pricing: " + e.getMessage()));
        }
    }

    @GetMapping("/{consultantId}/appointment-booking-info")
    @Operation(summary = "Get complete consultant booking information", description = "Get all consultant information needed for appointment booking including profile, pricing, and available slots for a specific date")
    public ResponseEntity<?> getCompleteConsultantBookingInfo(@PathVariable Long consultantId,
                                                             @RequestParam(required = false) String date) {
        try {
            User consultant = userService.findById(consultantId)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));

            if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a consultant"));
            }

            if (consultant.getIsActive() == null || !consultant.getIsActive()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Consultant is not available"));
            }

            Map<String, Object> bookingInfo = new HashMap<>();
            
            // Basic consultant information
            bookingInfo.put("consultantId", consultant.getId());
            bookingInfo.put("consultantName", consultant.getFirstName() + " " + consultant.getLastName());
            bookingInfo.put("email", consultant.getEmail());
            bookingInfo.put("phone", consultant.getPhone());
            bookingInfo.put("expertise", consultant.getExpertise());
            bookingInfo.put("degree", consultant.getDegree());
            bookingInfo.put("bio", consultant.getBio());
            bookingInfo.put("isActive", consultant.getIsActive());
            
            // Pricing information
            bookingInfo.put("hourlyRate", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() : 100000.0);
            bookingInfo.put("pricingOptions", Map.of(
                "30min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 0.5 : 50000.0,
                "60min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() : 100000.0,
                "90min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 1.5 : 150000.0,
                "120min", consultant.getConsultationFee() != null ? consultant.getConsultationFee().doubleValue() * 2.0 : 200000.0
            ));
            bookingInfo.put("currency", "VND");
            bookingInfo.put("paymentMethods", List.of("VNPAY", "CASH", "BANK_TRANSFER"));
            
            // Consultation types
            bookingInfo.put("consultationTypes", List.of("ONLINE", "IN_PERSON"));
            
            // Working hours
            bookingInfo.put("workingHours", Map.of(
                "start", "08:00",
                "end", "17:00",
                "days", List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY")
            ));
            
            // Available slots for specific date if provided
            if (date != null && !date.trim().isEmpty()) {
                try {
                    LocalDate appointmentDate = LocalDate.parse(date);
                    List<Map<String, Object>> availableSlots = appointmentService.getAvailableTimeSlotsForDate(consultantId, appointmentDate);
                    bookingInfo.put("availableSlots", availableSlots);
                    bookingInfo.put("requestedDate", date);
                    bookingInfo.put("totalAvailableSlots", availableSlots.size());
                } catch (DateTimeParseException e) {
                    bookingInfo.put("availableSlots", List.of());
                    bookingInfo.put("error", "Invalid date format. Use YYYY-MM-DD");
                }
            } else {
                bookingInfo.put("availableSlots", List.of());
                bookingInfo.put("message", "Provide date parameter to see available slots");
            }
            
            // Next 7 days availability summary
            List<Map<String, Object>> weeklyAvailability = new ArrayList<>();
            LocalDate today = LocalDate.now();
            for (int i = 0; i < 7; i++) {
                LocalDate checkDate = today.plusDays(i);
                List<Map<String, Object>> slots = appointmentService.getAvailableTimeSlotsForDate(consultantId, checkDate);
                
                Map<String, Object> dayInfo = new HashMap<>();
                dayInfo.put("date", checkDate.toString());
                dayInfo.put("dayOfWeek", checkDate.getDayOfWeek().toString());
                dayInfo.put("availableSlots", slots.size());
                dayInfo.put("isAvailable", !slots.isEmpty());
                weeklyAvailability.add(dayInfo);
            }
            bookingInfo.put("weeklyAvailability", weeklyAvailability);

            return ResponseEntity.ok(bookingInfo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error getting consultant booking info: " + e.getMessage()));
        }
    }
} 