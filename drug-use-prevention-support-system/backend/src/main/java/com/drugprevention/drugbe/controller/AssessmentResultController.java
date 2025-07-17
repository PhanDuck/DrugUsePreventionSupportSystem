package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentResultDTO;
import com.drugprevention.drugbe.service.AssessmentResultService;
import com.drugprevention.drugbe.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assessment-results")
@CrossOrigin(origins = "*")
public class AssessmentResultController {

    @Autowired
    private AssessmentResultService assessmentResultService;
    
    @Autowired
    private AuthService authService;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("✅ AssessmentResult Service is running!");
    }

    // ===== GET USER'S ASSESSMENT RESULTS =====
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or @authService.getCurrentUserId() == #userId")
    public ResponseEntity<?> getUserAssessmentResults(@PathVariable Long userId, Authentication authentication) {
        try {
            // Additional ownership check for extra security
            if (authentication != null) {
                Long currentUserId = authService.getCurrentUserId();
                if (currentUserId != null && !currentUserId.equals(userId)) {
                    // Check if user has staff privileges
                    String[] authorities = authentication.getAuthorities().stream()
                        .map(auth -> auth.getAuthority())
                        .toArray(String[]::new);
                    
                    boolean hasStaffRole = false;
                    for (String authority : authorities) {
                        if (authority.equals("ROLE_ADMIN") || authority.equals("ROLE_MANAGER") || authority.equals("ROLE_CONSULTANT")) {
                            hasStaffRole = true;
                            break;
                        }
                    }
                    
                    if (!hasStaffRole) {
                        return ResponseEntity.status(403).body(Map.of(
                            "success", false,
                            "error", "Access denied: You can only access your own assessment results"
                        ));
                    }
                }
            }
            
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByUserId(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "message", "Assessment results retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment results",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT', 'USER')")
    public ResponseEntity<?> getAssessmentResultById(@PathVariable Long resultId, Authentication authentication) {
        try {
            Optional<AssessmentResultDTO> resultOpt = assessmentResultService.getResultById(resultId);
            if (resultOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            AssessmentResultDTO result = resultOpt.get();
            
            // Check ownership for regular users
            if (authentication != null) {
                Long currentUserId = authService.getCurrentUserId();
                if (currentUserId != null && !currentUserId.equals(result.getUserId())) {
                    // Check if user has staff privileges
                    String[] authorities = authentication.getAuthorities().stream()
                        .map(auth -> auth.getAuthority())
                        .toArray(String[]::new);
                    
                    boolean hasStaffRole = false;
                    for (String authority : authorities) {
                        if (authority.equals("ROLE_ADMIN") || authority.equals("ROLE_MANAGER") || authority.equals("ROLE_CONSULTANT")) {
                            hasStaffRole = true;
                            break;
                        }
                    }
                    
                    if (!hasStaffRole) {
                        return ResponseEntity.status(403).body(Map.of(
                            "success", false,
                            "error", "Access denied: You can only access your own assessment results"
                        ));
                    }
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", result,
                "message", "Assessment result retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment result",
                "details", e.getMessage()
            ));
        }
    }

    // ===== STATISTICS =====
    
    @GetMapping("/statistics/count/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or @authService.getCurrentUserId() == #userId")
    public ResponseEntity<?> getUserAssessmentCount(@PathVariable Long userId) {
        try {
            long count = assessmentResultService.countByUserId(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("count", count),
                "message", "Assessment count retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment count",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/statistics/latest/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or @authService.getCurrentUserId() == #userId")
    public ResponseEntity<?> getLatestUserResult(@PathVariable Long userId) {
        try {
            Optional<AssessmentResultDTO> result = assessmentResultService.getLatestResultByUserId(userId);
            if (result.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", result.get(),
                    "message", "Latest assessment result retrieved successfully"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", null,
                    "message", "No assessment results found for this user"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve latest assessment result",
                "details", e.getMessage()
            ));
        }
    }

    // ===== ADMIN/CONSULTANT ENDPOINTS =====
    
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<?> getAllAssessmentResults() {
        try {
            List<AssessmentResultDTO> results = assessmentResultService.getAllResults();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "message", "All assessment results retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment results",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<?> getResultsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            // Validate date range
            if (startDate.after(endDate)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Start date must be before end date"
                ));
            }
            
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByDateRange(startDate, endDate);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "message", "Assessment results by date range retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment results by date range",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/risk-level/{riskLevel}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<?> getResultsByRiskLevel(@PathVariable String riskLevel) {
        try {
            // Validate risk level
            if (riskLevel == null || riskLevel.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Risk level cannot be empty"
                ));
            }
            
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByRiskLevel(riskLevel);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "message", "Assessment results by risk level retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve assessment results by risk level",
                "details", e.getMessage()
            ));
        }
    }

    // ===== CURRENT USER ENDPOINTS =====
    
    @GetMapping("/my-results")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUserResults(Authentication authentication) {
        try {
            Long currentUserId = authService.getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Unable to identify current user"
                ));
            }
            
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByUserId(currentUserId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", results,
                "message", "Your assessment results retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve your assessment results",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/my-latest")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUserLatestResult(Authentication authentication) {
        try {
            Long currentUserId = authService.getCurrentUserId();
            if (currentUserId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Unable to identify current user"
                ));
            }
            
            Optional<AssessmentResultDTO> result = assessmentResultService.getLatestResultByUserId(currentUserId);
            if (result.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", result.get(),
                    "message", "Your latest assessment result retrieved successfully"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", null,
                    "message", "You haven't completed any assessments yet"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve your latest assessment result",
                "details", e.getMessage()
            ));
        }
    }
} 