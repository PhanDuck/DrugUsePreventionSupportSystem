package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentResultDTO;
import com.drugprevention.drugbe.service.AssessmentResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assessment-results")
@CrossOrigin(origins = "*")
public class AssessmentResultController {

    @Autowired
    private AssessmentResultService assessmentResultService;

    // ===== GET USER'S ASSESSMENT RESULTS =====
    
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or #userId == authentication.principal.id")
    public ResponseEntity<List<AssessmentResultDTO>> getUserAssessmentResults(@PathVariable Long userId) {
        try {
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByUserId(userId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT', 'USER')")
    public ResponseEntity<AssessmentResultDTO> getAssessmentResultById(@PathVariable Long resultId) {
        try {
            Optional<AssessmentResultDTO> result = assessmentResultService.getResultById(resultId);
            return result.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== STATISTICS =====
    
    @GetMapping("/statistics/count/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or #userId == authentication.principal.id")
    public ResponseEntity<Long> getUserAssessmentCount(@PathVariable Long userId) {
        try {
            long count = assessmentResultService.countByUserId(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistics/latest/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or #userId == authentication.principal.id")
    public ResponseEntity<AssessmentResultDTO> getLatestUserResult(@PathVariable Long userId) {
        try {
            Optional<AssessmentResultDTO> result = assessmentResultService.getLatestResultByUserId(userId);
            return result.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== ADMIN/CONSULTANT ENDPOINTS =====
    
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<List<AssessmentResultDTO>> getAllAssessmentResults() {
        try {
            List<AssessmentResultDTO> results = assessmentResultService.getAllResults();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<List<AssessmentResultDTO>> getResultsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        try {
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByDateRange(startDate, endDate);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/risk-level/{riskLevel}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<List<AssessmentResultDTO>> getResultsByRiskLevel(@PathVariable String riskLevel) {
        try {
            List<AssessmentResultDTO> results = assessmentResultService.getResultsByRiskLevel(riskLevel);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== HEALTH CHECK =====
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("✅ AssessmentResult Service is running!");
    }
} 