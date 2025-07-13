package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.*;
import com.drugprevention.drugbe.entity.*;
import com.drugprevention.drugbe.service.AssessmentService;
import com.drugprevention.drugbe.repository.UserRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
@Tag(name = "Assessment Controller", description = "APIs for assessment management")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private UserRepository userRepository;

    // ===== PUBLIC ENDPOINTS - Assessment Discovery =====

    @GetMapping
    public ResponseEntity<List<Assessment>> getAllAssessments() {
        List<Assessment> assessments = assessmentService.getActiveAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/types")
    public ResponseEntity<List<AssessmentType>> getAssessmentTypes() {
        List<AssessmentType> types = assessmentService.getActiveAssessmentTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assessment> getAssessmentById(@PathVariable Long id) {
        Optional<Assessment> assessment = assessmentService.getAssessmentById(id);
        return assessment.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    // ===== ASSESSMENT QUESTIONS =====

    @GetMapping("/{id}/questions")
    public ResponseEntity<List<AssessmentQuestionDTO>> getAssessmentQuestions(@PathVariable Long id) {
        try {
            List<AssessmentQuestionDTO> questions = assessmentService.getAssessmentQuestionsDTO(id);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ===== ASSESSMENT SUBMISSION =====

    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> submitAssessment(@RequestBody AssessmentSubmissionDTO submission) {
        try {
            // Validate submission
            if (submission == null) {
                return ResponseEntity.badRequest().body("Submission cannot be null");
            }
            
            if (submission.getAssessmentId() == null) {
                return ResponseEntity.badRequest().body("Assessment ID cannot be null");
            }
            
            if (submission.getUserId() == null) {
                return ResponseEntity.badRequest().body("User ID cannot be null");
            }
            
            if (submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
                return ResponseEntity.badRequest().body("Answers cannot be null or empty");
            }
            
            AssessmentResultDTO result = assessmentService.submitAssessment(submission);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing assessment: " + e.getMessage());
        }
    }

    // ===== ANONYMOUS ASSESSMENT (No authentication required) =====

    @PostMapping("/calculate")
    public ResponseEntity<?> calculateAssessment(@RequestBody AssessmentSubmissionDTO submission) {
        try {
            // Validate submission
            if (submission == null) {
                return ResponseEntity.badRequest().body("Submission cannot be null");
            }
            
            if (submission.getAssessmentId() == null) {
                return ResponseEntity.badRequest().body("Assessment ID cannot be null");
            }
            
            if (submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
                return ResponseEntity.badRequest().body("Answers cannot be null or empty");
            }
            
            // Set userId to null for anonymous assessment
            submission.setUserId(null);
            AssessmentResultDTO result = assessmentService.calculateAssessmentResult(submission);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error calculating assessment: " + e.getMessage());
        }
    }

    // ===== ASSESSMENT RESULTS =====

    @GetMapping("/results/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT') or authentication.name == userRepository.findById(#userId).orElse(null)?.username")
    public ResponseEntity<List<AssessmentResultDTO>> getUserResults(@PathVariable Long userId) {
        try {
            List<AssessmentResultDTO> results = assessmentService.getUserAssessmentResults(userId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/results/{resultId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT', 'USER')")
    public ResponseEntity<AssessmentResultDTO> getAssessmentResult(@PathVariable Long resultId) {
        Optional<AssessmentResultDTO> result = assessmentService.getAssessmentResultById(resultId);
        return result.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    // ===== STATISTICS & ANALYTICS =====

    @GetMapping("/statistics/total")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<Long> getTotalAssessments() {
        List<Assessment> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok((long) assessments.size());
    }

    @GetMapping("/statistics/completed")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CONSULTANT')")
    public ResponseEntity<Long> getTotalCompletedAssessments() {
        // This would require additional service method for counting completed assessments
        return ResponseEntity.ok(0L); // Placeholder
    }

    // ===== ADMIN ONLY - Assessment Management =====

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> createAssessment(@RequestBody Assessment assessment) {
        try {
            Assessment createdAssessment = assessmentService.createAssessment(assessment);
            return ResponseEntity.ok(createdAssessment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating assessment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @RequestBody Assessment assessmentDetails) {
        try {
            Assessment updatedAssessment = assessmentService.updateAssessment(id, assessmentDetails);
            return ResponseEntity.ok(updatedAssessment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating assessment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
        try {
            assessmentService.deleteAssessment(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting assessment: " + e.getMessage());
        }
    }

    // ===== HEALTH CHECK =====

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("🎯 Assessment Service is running! Ready for CRAFFT & ASSIST assessments.");
    }

    // ===== CREATE ASSESSMENT QUESTION =====

    @PostMapping("/{assessmentId}/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AssessmentQuestion> createQuestion(
            @PathVariable Long assessmentId,
            @RequestBody AssessmentQuestion question) {
        question.setAssessmentId(assessmentId);
        AssessmentQuestion created = assessmentService.createQuestion(question);
        return ResponseEntity.ok(created);
    }
    
    // ===== CONSULTANT ACCESS TO CLIENT RESULTS =====
    
    @GetMapping("/consultant/client/{clientId}/results")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> getClientAssessmentResultsForConsultant(
            @PathVariable Long clientId,
            Authentication authentication) {
        try {
            // Get consultant username from authentication
            String consultantUsername = authentication.getName();
            
            // Get consultant ID from username
            User consultant = userRepository.findByUsername(consultantUsername)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));
            
            List<AssessmentResultDTO> results = assessmentService
                    .getClientAssessmentResultsForConsultant(consultant.getId(), clientId);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error getting assessment results: " + e.getMessage()));
        }
    }
    
    @GetMapping("/consultant/client/{clientId}/latest-result")
    @PreAuthorize("hasRole('CONSULTANT')")
    public ResponseEntity<?> getLatestClientAssessmentForConsultant(
            @PathVariable Long clientId,
            Authentication authentication) {
        try {
            // Get consultant username from authentication
            String consultantUsername = authentication.getName();
            
            // Get consultant ID from username
            User consultant = userRepository.findByUsername(consultantUsername)
                    .orElseThrow(() -> new RuntimeException("Consultant not found"));
            
            Optional<AssessmentResultDTO> result = assessmentService
                    .getLatestClientAssessmentForConsultant(consultant.getId(), clientId);
                    
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.ok(Map.of(
                    "message", "Client has no assessment results yet",
                    "clientId", clientId
                ));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error getting assessment results: " + e.getMessage()));
        }
    }
} 