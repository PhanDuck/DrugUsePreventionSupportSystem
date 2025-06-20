package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.*;
import com.drugprevention.drugbe.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-data")
@Tag(name = "Test Data", description = "API để tạo dữ liệu test")
@CrossOrigin(origins = "*")
public class TestDataController {

    @Autowired
    private AssessmentTypeRepository assessmentTypeRepository;
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    
    @Autowired
    private AssessmentQuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/init")
    @Operation(summary = "Khởi tạo dữ liệu test cho database")
    public ResponseEntity<String> initTestData() {
        try {
            // 1. Tạo Roles
            if (roleRepository.count() == 0) {
                Role userRole = new Role();
                userRole.setRoleName("USER");
                roleRepository.save(userRole);
                
                Role adminRole = new Role();
                adminRole.setRoleName("ADMIN");
                roleRepository.save(adminRole);
            }

            // 2. Tạo Assessment Types
            if (assessmentTypeRepository.count() == 0) {
                AssessmentType type1 = new AssessmentType();
                type1.setTypeName("Đánh giá rủi ro sử dụng ma túy");
                type1.setDescription("Khảo sát đánh giá mức độ rủi ro sử dụng chất gây nghiện");
                assessmentTypeRepository.save(type1);
                
                AssessmentType type2 = new AssessmentType();
                type2.setTypeName("Kiến thức về tác hại ma túy");
                type2.setDescription("Khảo sát kiến thức về tác hại của các chất gây nghiện");
                assessmentTypeRepository.save(type2);
            }

            // 3. Tạo Test Users
            if (userRepository.count() == 0) {
                Role userRole = roleRepository.findByRoleName("USER").orElse(null);
                
                User testUser1 = new User();
                testUser1.setUserName("testuser1");
                testUser1.setEmail("test1@example.com");
                testUser1.setPassword("password123");
                testUser1.setFullName("Test User 1");
                testUser1.setPhone("0123456789");
                testUser1.setStatus("ACTIVE");
                testUser1.setRole(userRole);
                userRepository.save(testUser1);
                
                User testUser2 = new User();
                testUser2.setUserName("testuser2");
                testUser2.setEmail("test2@example.com");
                testUser2.setPassword("password123");
                testUser2.setFullName("Test User 2");
                testUser2.setPhone("0987654321");
                testUser2.setStatus("ACTIVE");
                testUser2.setRole(userRole);
                userRepository.save(testUser2);
            }

            // 4. Tạo Assessments
            if (assessmentRepository.count() == 0) {
                AssessmentType type1 = assessmentTypeRepository.findAll().get(0);
                
                Assessment assessment1 = new Assessment();
                assessment1.setAssessmentName("Khảo sát rủi ro sử dụng ma túy cơ bản");
                assessment1.setDescription("Đánh giá mức độ rủi ro và nhận thức về việc sử dụng chất gây nghiện");
                assessment1.setType(type1);
                assessment1 = assessmentRepository.save(assessment1);

                // 5. Tạo Questions cho Assessment
                createQuestionsForAssessment(assessment1);
            }

            return ResponseEntity.ok("✅ Dữ liệu test đã được tạo thành công!");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi khi tạo dữ liệu test: " + e.getMessage());
        }
    }

    private void createQuestionsForAssessment(Assessment assessment) {
        // Câu hỏi 1
        AssessmentQuestion q1 = new AssessmentQuestion();
        q1.setAssessment(assessment);
        q1.setQuestionText("Bạn có từng sử dụng thuốc lá không?");
        q1.setScoreWeight(3);
        questionRepository.save(q1);

        // Câu hỏi 2
        AssessmentQuestion q2 = new AssessmentQuestion();
        q2.setAssessment(assessment);
        q2.setQuestionText("Bạn có từng sử dụng rượu bia không?");
        q2.setScoreWeight(2);
        questionRepository.save(q2);

        // Câu hỏi 3
        AssessmentQuestion q3 = new AssessmentQuestion();
        q3.setAssessment(assessment);
        q3.setQuestionText("Bạn có bao giờ cảm thấy khó kiểm soát việc sử dụng chất kích thích không?");
        q3.setScoreWeight(3);
        questionRepository.save(q3);

        // Câu hỏi 4
        AssessmentQuestion q4 = new AssessmentQuestion();
        q4.setAssessment(assessment);
        q4.setQuestionText("Bạn có biết về tác hại của ma túy không?");
        q4.setScoreWeight(1);
        questionRepository.save(q4);

        // Câu hỏi 5
        AssessmentQuestion q5 = new AssessmentQuestion();
        q5.setAssessment(assessment);
        q5.setQuestionText("Bạn có từng được ai rủ rê sử dụng chất kích thích không?");
        q5.setScoreWeight(2);
        questionRepository.save(q5);
    }

    @GetMapping("/status")
    @Operation(summary = "Kiểm tra trạng thái dữ liệu trong database")
    public ResponseEntity<String> checkDataStatus() {
        StringBuilder status = new StringBuilder();
        status.append("📊 TRẠNG THÁI DỮ LIỆU:\n\n");
        status.append("👥 Users: ").append(userRepository.count()).append("\n");
        status.append("🏷️ Roles: ").append(roleRepository.count()).append("\n");
        status.append("📋 Assessment Types: ").append(assessmentTypeRepository.count()).append("\n");
        status.append("📝 Assessments: ").append(assessmentRepository.count()).append("\n");
        status.append("❓ Questions: ").append(questionRepository.count()).append("\n");
        
        return ResponseEntity.ok(status.toString());
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Xóa tất cả dữ liệu test")
    public ResponseEntity<String> clearTestData() {
        try {
            questionRepository.deleteAll();
            assessmentRepository.deleteAll();
            assessmentTypeRepository.deleteAll();
            userRepository.deleteAll();
            roleRepository.deleteAll();
            
            return ResponseEntity.ok("🗑️ Đã xóa tất cả dữ liệu test!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Lỗi khi xóa dữ liệu: " + e.getMessage());
        }
    }
} 