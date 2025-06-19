package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentResultDTO;
import com.drugprevention.drugbe.dto.AssessmentStatisticsDTO;
import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.service.AssessmentResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/assessment-results")
@RequiredArgsConstructor
public class AssessmentResultController {
    private final AssessmentResultService assessmentResultService;

    @PostMapping
    public ResponseEntity<AssessmentResult> createResult(@RequestBody AssessmentResult result) {
        return ResponseEntity.ok(assessmentResultService.saveResult(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResult> getResult(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentResultService.getResultById(id));
    }

    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<List<AssessmentResult>> getResultsByAssessment(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(assessmentResultService.getResultsByAssessmentId(assessmentId));
    }

    @PostMapping("/validate")
    public ResponseEntity<AssessmentResult> validateResult(@RequestBody AssessmentResultDTO resultDTO) {
        return ResponseEntity.ok(assessmentResultService.validateAndCalculateResult(resultDTO));
    }

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<AssessmentResult>> getUserAssessmentHistory(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(assessmentResultService.getUserAssessmentHistory(userId, startDate, endDate));
    }

    @GetMapping("/statistics")
    public ResponseEntity<AssessmentStatisticsDTO> getAssessmentStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(assessmentResultService.getStatistics(startDate, endDate));
    }
} 