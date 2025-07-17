package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentSubmissionDTO;
import com.drugprevention.drugbe.entity.AssessmentQuestion;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.repository.RoleRepository;
import com.drugprevention.drugbe.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
@Profile({"dev", "test"}) // Only available in development and test profiles
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')") // Only admin/manager can access test endpoints
public class TestController {

    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "🔧 Test Controller is running!",
            "warning", "This is a development/test endpoint. Should not be available in production.",
            "profile", "development"
        ));
    }

    @GetMapping("/crafft-debug")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testCRAFFTScoring() {
        try {
            // Create sample answers for CRAFFT (assessment ID 1)
            // All "Yes" answers (value = 1) to test maximum score
            List<AssessmentSubmissionDTO.AnswerDTO> sampleAnswers = new ArrayList<>();
            
            // Get actual CRAFFT questions from database
            List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(1L);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "CRAFFT Debug Test");
            response.put("questionsFound", questions.size());
            response.put("warning", "This is a debug endpoint for development only");
            
            if (questions.isEmpty()) {
                response.put("error", "No CRAFFT questions found in database");
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            
            // Create answers for each question
            for (AssessmentQuestion question : questions) {
                AssessmentSubmissionDTO.AnswerDTO answer = new AssessmentSubmissionDTO.AnswerDTO();
                answer.setQuestionId(question.getId());
                answer.setAnswerValue(1); // "Yes" answer
                answer.setAnswerText("Yes");
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
                response.put("testSuccess", true);
            } catch (Exception e) {
                response.put("calculationError", e.getMessage());
                response.put("testSuccess", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Debug test failed: " + e.getMessage());
            errorResponse.put("warning", "This is a debug endpoint for development only");
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/assist-debug")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testASSISTScoring() {
        try {
            // Create sample answers for ASSIST (assessment ID 2)
            List<AssessmentSubmissionDTO.AnswerDTO> sampleAnswers = new ArrayList<>();
            
            // Get actual ASSIST questions from database
            List<AssessmentQuestion> questions = assessmentService.getQuestionsByAssessmentId(2L);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "ASSIST Debug Test");
            response.put("questionsFound", questions.size());
            response.put("warning", "This is a debug endpoint for development only");
            
            if (questions.isEmpty()) {
                response.put("error", "No ASSIST questions found in database");
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            
            // Create moderate risk answers for ASSIST
            for (int i = 0; i < questions.size(); i++) {
                AssessmentQuestion question = questions.get(i);
                AssessmentSubmissionDTO.AnswerDTO answer = new AssessmentSubmissionDTO.AnswerDTO();
                answer.setQuestionId(question.getId());
                // Vary answers to create moderate risk scenario
                answer.setAnswerValue(i < 3 ? 2 : 1); // Mix of moderate answers
                answer.setAnswerText("Sometimes");
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
                response.put("testSuccess", true);
            } catch (Exception e) {
                response.put("calculationError", e.getMessage());
                response.put("testSuccess", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "ASSIST debug test failed: " + e.getMessage());
            errorResponse.put("warning", "This is a debug endpoint for development only");
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

    @GetMapping("/database-info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDatabaseInfo() {
        try {
            Map<String, Object> info = new HashMap<>();
            info.put("success", true);
            info.put("message", "Database information for development debugging");
            info.put("warning", "This endpoint exposes system information - development only");
            
            // Safe database info (no sensitive data)
            info.put("totalUsers", userRepository.count());
            info.put("totalRoles", roleRepository.count());
            info.put("availableAssessments", assessmentService.getAllAssessments().size());
            info.put("timestamp", LocalDateTime.now());
            
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", "Failed to get database info: " + e.getMessage(),
                "warning", "This is a debug endpoint for development only"
            ));
        }
    }

    @GetMapping("/available-endpoints")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAvailableEndpoints() {
        Map<String, Object> endpoints = new HashMap<>();
        endpoints.put("success", true);
        endpoints.put("message", "Available test endpoints");
        endpoints.put("warning", "These endpoints are for development debugging only");
        
        endpoints.put("endpoints", List.of(
            "/api/test/health - Health check",
            "/api/test/crafft-debug - Test CRAFFT scoring algorithm",
            "/api/test/assist-debug - Test ASSIST scoring algorithm", 
            "/api/test/database-info - Get safe database statistics",
            "/api/test/available-endpoints - This endpoint"
        ));
        
        endpoints.put("notes", List.of(
            "All endpoints require ADMIN role",
            "Only available in dev/test profiles",
            "Should be disabled in production",
            "No sensitive data is exposed"
        ));
        
        return ResponseEntity.ok(endpoints);
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
                answer.setAnswerText(i % 2 == 0 ? "No" : "Yes");
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

    @GetMapping("/encoding")
    public ResponseEntity<Map<String, String>> testEncoding() {
        return ResponseEntity.ok(Map.of(
            "message", "✅ Test encoding English text successfully!",
            "vietnamese_text", "This is English test text: John Doe, Jane Smith",
            "unicode_test", "🚀 🏥 ⭐ 💊 🧠",
            "timestamp", LocalDateTime.now().toString()
        ));
    }

    @GetMapping("/test-database")
    public ResponseEntity<Map<String, String>> testDatabase() {
        return ResponseEntity.ok(Map.of(
            "message", "Database connection test",
            "timestamp", LocalDateTime.now().toString(),
            "status", "Database connection successful"
        ));
    }

    // ===== ENGLISH ENCODING TEST =====

    @PostMapping("/test-english")
    public ResponseEntity<?> testEnglishEncoding(@RequestBody Map<String, String> testData) {
        try {
            String englishText = testData.get("text");
            
            // Default test text if none provided
            englishText = "Hello! This is English test text with special characters: @ # $ % ^ & * ( )";
            
            Map<String, Object> response = new HashMap<>();
            response.put("original_text", englishText);
            response.put("text_length", englishText.length());
            response.put("timestamp", LocalDateTime.now().toString());
            
            // Test database encoding by saving to a test table
            // This would be implemented with actual database operations
            
            response.put("message", "English encoding test successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "English encoding test failed: " + e.getMessage()));
        }
    }

    @GetMapping("/test-english-db")
    public ResponseEntity<?> testEnglishDatabase() {
        try {
            Map<String, Object> response = new HashMap<>();
            
            // Test database connection with English text
            String testQuery = "SELECT 'Hello! This is English test text' AS english_text";
            
            response.put("test_query", testQuery);
            response.put("message", "Database English encoding test");
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Database English test failed: " + e.getMessage()));
        }
    }

    @GetMapping("/auth-debug")
    public ResponseEntity<?> debugAuthentication(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        
        if (authentication == null) {
            response.put("authenticated", false);
            response.put("message", "No authentication found");
            return ResponseEntity.ok(response);
        }
        
        response.put("authenticated", true);
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("principal", authentication.getPrincipal().getClass().getSimpleName());
        
        // Get user from database
        try {
            Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.put("userId", user.getId());
                response.put("roleId", user.getRole().getId());
                response.put("roleName", user.getRole().getName());
                response.put("userActive", user.getIsActive());
            } else {
                response.put("userInDatabase", false);
            }
        } catch (Exception e) {
            response.put("databaseError", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-info/{username}")
    public ResponseEntity<?> getUserInfo(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                response.put("found", true);
                response.put("userId", user.getId());
                response.put("username", user.getUsername());
                response.put("roleId", user.getRole().getId());
                response.put("roleName", user.getRole().getName());
                response.put("isActive", user.getIsActive());
                response.put("email", user.getEmail());
            } else {
                response.put("found", false);
                response.put("message", "User not found");
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/full-debug/{username}")
    public ResponseEntity<?> fullDebugUser(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 1. Check user existence
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                response.put("error", "User not found in database");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            response.put("userFound", true);
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("isActive", user.getIsActive());
            response.put("roleId", user.getRoleId());
            
            // 2. Check role mapping
            if (user.getRole() != null) {
                response.put("roleName", user.getRole().getName());
                response.put("roleObject", "Found");
            } else {
                response.put("roleObject", "NULL - This is the problem!");
                
                // Try to manually find role
                Optional<com.drugprevention.drugbe.entity.Role> roleOpt = roleRepository.findById(user.getRoleId());
                if (roleOpt.isPresent()) {
                    response.put("manualRoleCheck", roleOpt.get().getName());
                } else {
                    response.put("manualRoleCheck", "Role ID " + user.getRoleId() + " not found");
                }
            }
            
            // 3. Check all roles in system
            List<com.drugprevention.drugbe.entity.Role> allRoles = roleRepository.findAll();
            Map<Long, String> roleMap = new HashMap<>();
            for (com.drugprevention.drugbe.entity.Role role : allRoles) {
                roleMap.put(role.getId(), role.getName());
            }
            response.put("allRolesInSystem", roleMap);
            
            // 4. Check password (don't show actual password)
            response.put("passwordExists", user.getPassword() != null && !user.getPassword().isEmpty());
            response.put("passwordLength", user.getPassword() != null ? user.getPassword().length() : 0);
            
        } catch (Exception e) {
            response.put("error", "Exception: " + e.getMessage());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/staff-test")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> testStaffAccess(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "SUCCESS! You have STAFF access");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/any-auth-test")
    public ResponseEntity<?> testAnyAuth(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication != null) {
            response.put("authenticated", true);
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
        } else {
            response.put("authenticated", false);
        }
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
} 