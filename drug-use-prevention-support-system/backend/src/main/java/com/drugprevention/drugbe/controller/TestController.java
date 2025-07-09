package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentSubmissionDTO;
import com.drugprevention.drugbe.entity.AssessmentQuestion;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.repository.RoleRepository;
import com.drugprevention.drugbe.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("🔧 Test Controller is running!");
    }

    @GetMapping("/crafft-debug")
    public ResponseEntity<?> testCRAFFTScoring() {
        try {
            // Create sample answers for CRAFFT (assessment ID 1)
            // All "Yes" answers (value = 1) to test maximum score
            List<AssessmentSubmissionDTO.AnswerDTO> sampleAnswers = new ArrayList<>();
            
            // Get actual CRAFFT questions from database
            List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(1L);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "CRAFFT Debug Test");
            response.put("questionsFound", questions.size());
            
            if (questions.isEmpty()) {
                response.put("error", "No CRAFFT questions found in database");
                return ResponseEntity.ok(response);
            }
            
            // Create answers for each question
            for (AssessmentQuestion question : questions) {
                AssessmentSubmissionDTO.AnswerDTO answer = new AssessmentSubmissionDTO.AnswerDTO();
                answer.setQuestionId(question.getId());
                answer.setAnswerValue(1); // "Yes" answer
                answer.setAnswerText("Có");
                sampleAnswers.add(answer);
            }
            
            response.put("sampleAnswers", sampleAnswers);
            
            // Test calculation
            AssessmentSubmissionDTO submission = new AssessmentSubmissionDTO();
            submission.setAssessmentId(1L);
            submission.setUserId(null); // Anonymous test
            submission.setAnswers(sampleAnswers);
            
            try {
                var result = assessmentService.calculateAssessmentResult(submission);
                response.put("calculationResult", result);
                response.put("success", true);
            } catch (Exception e) {
                response.put("calculationError", e.getMessage());
                response.put("success", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debug test failed: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/assist-debug")
    public ResponseEntity<?> testASSISTScoring() {
        try {
            // Create sample answers for ASSIST (assessment ID 2)
            List<AssessmentSubmissionDTO.AnswerDTO> sampleAnswers = new ArrayList<>();
            
            // Get actual ASSIST questions from database
            List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(2L);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "ASSIST Debug Test");
            response.put("questionsFound", questions.size());
            
            if (questions.isEmpty()) {
                response.put("error", "No ASSIST questions found in database");
                return ResponseEntity.ok(response);
            }
            
            // Create mixed answers to test scoring
            for (int i = 0; i < questions.size(); i++) {
                AssessmentQuestion question = questions.get(i);
                AssessmentSubmissionDTO.AnswerDTO answer = new AssessmentSubmissionDTO.AnswerDTO();
                answer.setQuestionId(question.getId());
                
                // Mixed answers: some 0, some 2, some 3 to test different scenarios
                if (i % 3 == 0) {
                    answer.setAnswerValue(3); // Recent use
                    answer.setAnswerText("Có, trong 3 tháng qua");
                } else if (i % 3 == 1) {
                    answer.setAnswerValue(2); // Past use
                    answer.setAnswerText("Có, nhưng không trong 3 tháng qua");
                } else {
                    answer.setAnswerValue(0); // Never
                    answer.setAnswerText("Không bao giờ");
                }
                
                sampleAnswers.add(answer);
            }
            
            response.put("sampleAnswers", sampleAnswers);
            
            // Test calculation
            AssessmentSubmissionDTO submission = new AssessmentSubmissionDTO();
            submission.setAssessmentId(2L);
            submission.setUserId(null); // Anonymous test
            submission.setAnswers(sampleAnswers);
            
            try {
                var result = assessmentService.calculateAssessmentResult(submission);
                response.put("calculationResult", result);
                response.put("success", true);
            } catch (Exception e) {
                response.put("calculationError", e.getMessage());
                response.put("success", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debug test failed: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/question-ids")
    public ResponseEntity<?> getQuestionIds() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Get questions for all assessments
            for (long assessmentId = 1; assessmentId <= 4; assessmentId++) {
                try {
                    List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(assessmentId);
                    
                    List<Map<String, Object>> questionInfo = new ArrayList<>();
                    for (AssessmentQuestion q : questions) {
                        Map<String, Object> info = new HashMap<>();
                        info.put("id", q.getId());
                        info.put("orderIndex", q.getOrderIndex());
                        info.put("question", q.getQuestion());
                        info.put("questionType", q.getQuestionType());
                        questionInfo.add(info);
                    }
                    
                    response.put("assessment_" + assessmentId, questionInfo);
                } catch (Exception e) {
                    response.put("assessment_" + assessmentId + "_error", e.getMessage());
                }
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to get question IDs: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/audit-debug")
    public ResponseEntity<?> testAUDITScoring() {
        return createGenericDebugTest(3L, "AUDIT");
    }

    @GetMapping("/dast10-debug")
    public ResponseEntity<?> testDAST10Scoring() {
        return createGenericDebugTest(4L, "DAST-10");
    }

    @GetMapping("/database-debug")
    public ResponseEntity<?> testDatabaseConnection() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Test basic database queries
            long userCount = userRepository.count();
            long roleCount = roleRepository.count();
            
            response.put("databaseConnected", true);
            response.put("userCount", userCount);
            response.put("roleCount", roleCount);
            
            // Get first few users (without passwords)
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> userInfo = new ArrayList<>();
            
            for (User user : users) {
                Map<String, Object> info = new HashMap<>();
                info.put("id", user.getId());
                info.put("username", user.getUsername());
                info.put("email", user.getEmail());
                info.put("firstName", user.getFirstName());
                info.put("lastName", user.getLastName());
                info.put("roleId", user.getRoleId());
                info.put("roleName", user.getRole() != null ? user.getRole().getName() : "No Role");
                info.put("isActive", user.getIsActive());
                userInfo.add(info);
            }
            
            response.put("users", userInfo);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("databaseConnected", false);
            errorResponse.put("error", e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.ok(errorResponse);
        }
    }

    private ResponseEntity<?> createGenericDebugTest(Long assessmentId, String assessmentName) {
        try {
            List<AssessmentSubmissionDTO.AnswerDTO> sampleAnswers = new ArrayList<>();
            List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(assessmentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", assessmentName + " Debug Test");
            response.put("questionsFound", questions.size());
            
            if (questions.isEmpty()) {
                response.put("error", "No " + assessmentName + " questions found in database");
                return ResponseEntity.ok(response);
            }
            
            // Create moderate answers for testing
            for (int i = 0; i < questions.size(); i++) {
                AssessmentQuestion question = questions.get(i);
                AssessmentSubmissionDTO.AnswerDTO answer = new AssessmentSubmissionDTO.AnswerDTO();
                answer.setQuestionId(question.getId());
                answer.setAnswerValue(i % 2); // Alternating 0 and 1
                answer.setAnswerText(i % 2 == 0 ? "Không" : "Có");
                sampleAnswers.add(answer);
            }
            
            response.put("sampleAnswers", sampleAnswers);
            
            // Test calculation
            AssessmentSubmissionDTO submission = new AssessmentSubmissionDTO();
            submission.setAssessmentId(assessmentId);
            submission.setUserId(null);
            submission.setAnswers(sampleAnswers);
            
            try {
                var result = assessmentService.calculateAssessmentResult(submission);
                response.put("calculationResult", result);
                response.put("success", true);
            } catch (Exception e) {
                response.put("calculationError", e.getMessage());
                response.put("success", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debug test failed: " + e.getMessage());
            errorResponse.put("success", false);
            return ResponseEntity.ok(errorResponse);
        }
    }
} 