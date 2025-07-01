package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.*;
import com.drugprevention.drugbe.entity.*;
import com.drugprevention.drugbe.repository.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {
    
    @Autowired
    private AssessmentRepository assessmentRepository;
    @Autowired
    private AssessmentQuestionRepository assessmentQuestionRepository;
    @Autowired
    private AssessmentResultRepository assessmentResultRepository;
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AssessmentTypeRepository assessmentTypeRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 1. Lấy danh sách khảo sát
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    // 2. Lấy danh sách khảo sát theo type ID
    public List<Assessment> getAssessmentsByTypeId(Long typeId) {
        return assessmentRepository.findByAssessmentTypeId(typeId);
    }

    // 3. Lấy danh sách câu hỏi của 1 khảo sát
    public List<AssessmentQuestion> getQuestionsByAssessmentId(Long assessmentId) {
        return assessmentQuestionRepository.findByAssessmentIdOrderByOrderIndex(assessmentId);
    }

    // 4. Lấy assessment theo ID
    public Optional<Assessment> getAssessmentById(Long id) {
        return assessmentRepository.findById(id);
    }

    // 5. Lấy assessment type theo ID
    public Optional<AssessmentType> getAssessmentTypeById(Long id) {
        return assessmentTypeRepository.findById(id);
    }

    // 6. Lấy results theo user ID (deprecated - use getUserAssessmentResults)
    public List<AssessmentResult> getResultsByUserId(Long userId) {
        return assessmentResultRepository.findByUserId(userId);
    }

    // 7. Lấy results theo assessment ID
    public List<AssessmentResult> getResultsByAssessmentId(Long assessmentId) {
        return assessmentResultRepository.findByAssessmentId(assessmentId);
    }

    // 9. Create new assessment
    @Transactional
    public Assessment createAssessment(Assessment assessment) {
        assessment.setIsActive(true);
        assessment.setCreatedAt(LocalDateTime.now());
        assessment.setUpdatedAt(LocalDateTime.now());
        return assessmentRepository.save(assessment);
    }

    // 10. Update assessment
    @Transactional
    public Assessment updateAssessment(Long id, Assessment assessmentDetails) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
        
        assessment.setTitle(assessmentDetails.getTitle());
        assessment.setDescription(assessmentDetails.getDescription());
        assessment.setAssessmentTypeId(assessmentDetails.getAssessmentTypeId());
        assessment.setIsActive(assessmentDetails.getIsActive());
        assessment.setUpdatedAt(LocalDateTime.now());
        
        return assessmentRepository.save(assessment);
    }

    // 11. Delete assessment
    @Transactional
    public void deleteAssessment(Long id) {
        if (!assessmentRepository.existsById(id)) {
            throw new RuntimeException("Assessment not found with id: " + id);
        }
        assessmentRepository.deleteById(id);
    }

    // 12. Create assessment question
    @Transactional
    public AssessmentQuestion createQuestion(AssessmentQuestion question) {
        question.setIsRequired(true);
        question.setIsActive(true);
        question.setCreatedAt(LocalDateTime.now());
        question.setUpdatedAt(LocalDateTime.now());
        return assessmentQuestionRepository.save(question);
    }

    // 13. Submit assessment result
    @Transactional
    public AssessmentResultDTO submitAssessment(AssessmentSubmissionDTO submission) {
        // Validate assessment exists
        Assessment assessment = assessmentRepository.findById(submission.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));
        
        // Validate user exists
        User user = userRepository.findById(submission.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate score and determine risk level
        ScoreResult scoreResult = calculateAssessmentScore(assessment, submission.getAnswers());
        
        // Create assessment result
        AssessmentResult result = new AssessmentResult();
        result.setUserId(submission.getUserId());
        result.setAssessmentId(submission.getAssessmentId());
        result.setTotalScore(scoreResult.getTotalScore());
        result.setRiskLevel(scoreResult.getRiskLevel());
        result.setRecommendations(String.join(";", scoreResult.getRecommendations()));
        result.setCompletedAt(LocalDateTime.now());
        result.setCreatedAt(LocalDateTime.now());
        
        // Save answers as JSON
        try {
            String answersJson = objectMapper.writeValueAsString(submission.getAnswers());
            result.setAnswersJson(answersJson);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Save assessment result
        result = assessmentResultRepository.save(result);
        
        // Save individual answers
        for (AssessmentSubmissionDTO.AnswerDTO answerDTO : submission.getAnswers()) {
            Answer answer = new Answer();
            answer.setAssessmentResultId(result.getId());
            answer.setAssessmentQuestionId(answerDTO.getQuestionId());
            answer.setAnswerValue(answerDTO.getAnswerValue());
            answer.setAnswerText(answerDTO.getAnswerText());
            answer.setCreatedAt(LocalDateTime.now());
            answerRepository.save(answer);
        }
        
        // Convert to DTO and return
        return convertToResultDTO(result, assessment, scoreResult);
    }

    // 14. Get active assessments
    public List<Assessment> getActiveAssessments() {
        return assessmentRepository.findByIsActiveTrue();
    }

    // 15. Get assessment types
    public List<AssessmentType> getAllAssessmentTypes() {
        return assessmentTypeRepository.findAll();
    }

    // 16. Get active assessment types
    public List<AssessmentType> getActiveAssessmentTypes() {
        return assessmentTypeRepository.findByIsActiveTrue();
    }

    // ===== ASSESSMENT QUESTIONS WITH DTO CONVERSION =====
    
    public List<AssessmentQuestionDTO> getAssessmentQuestionsDTO(Long assessmentId) {
        List<AssessmentQuestion> questions = assessmentQuestionRepository
                .findByAssessmentIdOrderByOrderIndex(assessmentId);
        
        return questions.stream()
                .map(this::convertToQuestionDTO)
                .collect(Collectors.toList());
    }

    private AssessmentQuestionDTO convertToQuestionDTO(AssessmentQuestion question) {
        List<AssessmentQuestionDTO.OptionDTO> options = parseOptionsFromJson(question.getOptionsJson());
        
        return new AssessmentQuestionDTO(
                question.getId(),
                question.getQuestion(),
                question.getQuestionType(),
                options,
                question.getOrderIndex(),
                question.getIsRequired()
        );
    }

    private List<AssessmentQuestionDTO.OptionDTO> parseOptionsFromJson(String optionsJson) {
        try {
            if (optionsJson == null || optionsJson.trim().isEmpty()) {
                return new ArrayList<>();
            }
            
            List<Map<String, Object>> optionMaps = objectMapper.readValue(
                    optionsJson, new TypeReference<List<Map<String, Object>>>() {}
            );
            
            return optionMaps.stream()
                    .map(map -> new AssessmentQuestionDTO.OptionDTO(
                            (Integer) map.get("value"),
                            (String) map.get("text")
                    ))
                    .collect(Collectors.toList());
                    
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // ===== SCORING LOGIC =====
    
    private ScoreResult calculateAssessmentScore(Assessment assessment, List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        // Get assessment type to determine scoring method
        AssessmentType assessmentType = assessmentTypeRepository.findById(assessment.getAssessmentTypeId())
                .orElseThrow(() -> new RuntimeException("Assessment type not found"));
        
        String typeName = assessmentType.getName().toUpperCase();
        
        switch (typeName) {
            case "CRAFFT":
                return calculateCRAFFTScore(answers);
            case "ASSIST":
                return calculateASSISTScore(answers);
            case "AUDIT":
                return calculateAUDITScore(answers);
            case "DAST-10":
                return calculateDAST10Score(answers);
            default:
                return calculateGeneralScore(answers);
        }
    }

    /**
     * CRAFFT Scoring: Car, Relax, Alone, Forget, Friends, Trouble
     * Each "Yes" answer = 1 point
     * Score 0: Low risk
     * Score 1: Medium risk  
     * Score 2+: High risk
     */
    private ScoreResult calculateCRAFFTScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        System.out.println("🔍 CRAFFT Scoring Debug:");
        System.out.println("🔍 Number of answers received: " + answers.size());
        
        int totalScore = 0;
        
        // CRAFFT: Each "Yes" (value = 1) counts as 1 point
        for (AssessmentSubmissionDTO.AnswerDTO answer : answers) {
            System.out.println("🔍 Processing answer - QuestionID: " + answer.getQuestionId() + 
                             ", Value: " + answer.getAnswerValue() + 
                             ", Text: " + answer.getAnswerText());
            
            if (answer.getAnswerValue() != null && answer.getAnswerValue() == 1) {
                totalScore += 1;
                System.out.println("🔍 ✅ Added 1 point (answer = 1). Total score now: " + totalScore);
            } else {
                System.out.println("🔍 ❌ No point added (answer = " + answer.getAnswerValue() + ")");
            }
        }
        
        System.out.println("🔍 FINAL CRAFFT SCORE: " + totalScore);
        
        String riskLevel;
        String riskDescription;
        List<String> recommendations = new ArrayList<>();
        
        if (totalScore == 0) {
            riskLevel = "THẤP";
            riskDescription = "Nguy cơ thấp về việc sử dụng chất gây nghiện. Bạn không có dấu hiệu sử dụng có vấn đề.";
            recommendations.add("Tiếp tục duy trì lối sống lành mạnh và tránh xa các chất gây nghiện");
            recommendations.add("Tham gia các hoạt động tích cực như thể thao, học tập");
            recommendations.add("Chia sẻ với bạn bè về tác hại của chất gây nghiện");
        } else if (totalScore == 1) {
            riskLevel = "TRUNG BÌNH";
            riskDescription = "Nguy cơ trung bình. Bạn có một số dấu hiệu cần lưu ý về việc sử dụng chất gây nghiện.";
            recommendations.add("Cần tham khảo ý kiến chuyên gia tư vấn để đánh giá kỹ hơn");
            recommendations.add("Tham gia các khóa học về kỹ năng sống và quản lý stress");
            recommendations.add("Tăng cường hoạt động thể thao và sở thích lành mạnh");
            recommendations.add("Nói chuyện với gia đình hoặc người tin tưởng");
        } else { // totalScore >= 2
            riskLevel = "CAO";
            riskDescription = "Nguy cơ cao về việc sử dụng chất gây nghiện. Cần can thiệp và hỗ trợ chuyên môn ngay lập tức.";
            recommendations.add("KHẨN CẤP: Tham khảo ý kiến bác sĩ chuyên khoa hoặc chuyên gia tư vấn nghiện chất ngay");
            recommendations.add("Tham gia chương trình tư vấn và điều trị chuyên sâu");
            recommendations.add("Thông báo cho gia đình để nhận được sự hỗ trợ cần thiết");
            recommendations.add("Tránh xa những tình huống và môi trường có nguy cơ tiếp xúc với chất gây nghiện");
            recommendations.add("Liên hệ hotline hỗ trợ 24/7: 1900 1234 (miễn phí)");
        }
        
        System.out.println("🔍 Risk Level: " + riskLevel);
        return new ScoreResult(totalScore, riskLevel, riskDescription, recommendations);
    }

    /**
     * ASSIST Scoring: Alcohol, Smoking, and Substance Involvement Screening Test
     * Current implementation: Simplified version with only lifetime use questions
     * Values: 0 = Never, 2 = Yes but not in past 3 months, 3 = Yes in past 3 months
     */
    private ScoreResult calculateASSISTScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        System.out.println("🔍 ASSIST Scoring Debug:");
        System.out.println("🔍 Number of answers received: " + answers.size());
        
        // ASSIST questions correspond to different substances:
        // Q1: Tobacco, Q2: Alcohol, Q3: Cannabis, Q4: Cocaine, Q5: Stimulants, Q6: Depressants, Q7: Hallucinogens, Q8: Opioids
        
        int totalScore = 0;
        int substancesUsed = 0;
        int recentUse = 0; // Value 3 = used in past 3 months
        
        for (AssessmentSubmissionDTO.AnswerDTO answer : answers) {
            System.out.println("🔍 Processing answer - QuestionID: " + answer.getQuestionId() + 
                             ", Value: " + answer.getAnswerValue() + 
                             ", Text: " + answer.getAnswerText());
                             
            Integer value = answer.getAnswerValue();
            if (value != null) {
                totalScore += value;
                System.out.println("🔍 Added " + value + " points. Total score now: " + totalScore);
                
                if (value > 0) {
                    substancesUsed++;
                    System.out.println("🔍 Substance used count: " + substancesUsed);
                }
                if (value == 3) {
                    recentUse++;
                    System.out.println("🔍 Recent use count: " + recentUse);
                }
            } else {
                System.out.println("🔍 ❌ Answer value is null, skipping");
            }
        }
        
        System.out.println("🔍 FINAL ASSIST STATS:");
        System.out.println("🔍 Total Score: " + totalScore);
        System.out.println("🔍 Substances Used: " + substancesUsed);
        System.out.println("🔍 Recent Use Count: " + recentUse);
        
        String riskLevel;
        String riskDescription;
        List<String> recommendations = new ArrayList<>();
        
        // ASSIST Scoring Logic:
        // 0-3: Low risk
        // 4-26: Moderate risk  
        // 27+: High risk
        // But also consider number of substances and recent use
        
        if (totalScore == 0) {
            riskLevel = "THẤP";
            riskDescription = "Bạn không có lịch sử sử dụng các chất gây nghiện. Đây là kết quả tích cực.";
            recommendations.add("Tiếp tục duy trì lối sống không sử dụng chất gây nghiện");
            recommendations.add("Tham gia các hoạt động tuyên truyền phòng chống tệ nạn xã hội");
            recommendations.add("Chia sẻ kiến thức về tác hại của chất gây nghiện với người thân");
        } else if (totalScore <= 3 && recentUse == 0) {
            riskLevel = "THẤP";
            riskDescription = "Bạn có lịch sử sử dụng nhưng không sử dụng trong 3 tháng gần đây. Nguy cơ hiện tại thấp.";
            recommendations.add("Tiếp tục duy trì việc không sử dụng các chất gây nghiện");
            recommendations.add("Tham gia các hoạt động tích cực để duy trì lối sống lành mạnh");
            recommendations.add("Cảnh giác với các tình huống có thể dẫn đến tái sử dụng");
        } else if (totalScore <= 15 || (recentUse > 0 && recentUse <= 2)) {
            riskLevel = "TRUNG BÌNH";
            riskDescription = String.format("Nguy cơ trung bình. Bạn đã sử dụng %d loại chất, trong đó %d loại sử dụng gần đây.", 
                substancesUsed, recentUse);
            recommendations.add("CẦN THIẾT: Tham gia tư vấn chuyên sâu về tác hại và cách ngừng sử dụng");
            recommendations.add("Học các kỹ năng đối phó với căng thẳng và áp lực không qua chất gây nghiện");
            recommendations.add("Tham gia nhóm hỗ trợ cộng đồng hoặc nhóm tự giúp");
            recommendations.add("Cân nhắc thông báo cho gia đình để nhận hỗ trợ");
            recommendations.add("Tránh xa môi trường và những người có thể khuyến khích sử dụng");
        } else {
            riskLevel = "CAO";
            riskDescription = String.format("Nguy cơ rất cao. Bạn đang sử dụng nhiều loại chất (%d loại) và có %d loại sử dụng gần đây.", 
                substancesUsed, recentUse);
            recommendations.add("KHẨN CẤP: Liên hệ ngay với chuyên gia điều trị nghiện chất");
            recommendations.add("Cần tham gia chương trình điều trị nội trú hoặc ngoại trú");
            recommendations.add("Thông báo cho gia đình và người thân để nhận hỗ trợ tối đa");
            recommendations.add("Theo dõi y tế định kỳ để kiểm tra sức khỏe");
            recommendations.add("Tham gia chương trình phục hồi dài hạn");
            recommendations.add("Hotline khẩn cấp: 115 hoặc 1900 1234");
        }
        
        return new ScoreResult(totalScore, riskLevel, riskDescription, recommendations);
    }

    /**
     * AUDIT Scoring: Alcohol Use Disorders Identification Test
     * 10 questions about alcohol use patterns
     */
    private ScoreResult calculateAUDITScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        System.out.println("🔍 AUDIT Scoring Debug:");
        System.out.println("🔍 Number of answers received: " + answers.size());
        
        int totalScore = 0;
        
        for (AssessmentSubmissionDTO.AnswerDTO answer : answers) {
            System.out.println("🔍 Processing answer - QuestionID: " + answer.getQuestionId() + 
                             ", Value: " + answer.getAnswerValue() + 
                             ", Text: " + answer.getAnswerText());
            
            Integer value = answer.getAnswerValue();
            if (value != null) {
                totalScore += value;
                System.out.println("🔍 Added " + value + " points. Total score now: " + totalScore);
            } else {
                System.out.println("🔍 ❌ Answer value is null, skipping");
            }
        }
        
        System.out.println("🔍 FINAL AUDIT SCORE: " + totalScore);
        
        String riskLevel;
        String riskDescription;
        List<String> recommendations = new ArrayList<>();
        
        if (totalScore <= 7) {
            riskLevel = "THẤP";
            riskDescription = "Sử dụng rượu ở mức độ thấp hoặc không có nguy cơ.";
            recommendations.add("Duy trì mức sử dụng hiện tại hoặc cân nhắc giảm bớt");
            recommendations.add("Tìm hiểu về tác hại của rượu đối với sức khỏe");
        } else if (totalScore <= 15) {
            riskLevel = "TRUNG BÌNH";
            riskDescription = "Sử dụng rượu có nguy cơ, cần can thiệp ngắn hạn.";
            recommendations.add("Cần giảm đáng kể lượng rượu sử dụng");
            recommendations.add("Tham gia tư vấn về tác hại của rượu");
            recommendations.add("Học các kỹ năng thay thế cho việc uống rượu");
        } else if (totalScore <= 19) {
            riskLevel = "CAO";
            riskDescription = "Sử dụng rượu có hại, cần can thiệp chuyên môn.";
            recommendations.add("Cần can thiệp y tế và tư vấn chuyên sâu");
            recommendations.add("Cân nhắc tham gia chương trình cai rượu");
            recommendations.add("Theo dõi y tế định kỳ");
        } else {
            riskLevel = "RẤT CAO";
            riskDescription = "Có dấu hiệu nghiện rượu, cần điều trị ngay lập tức.";
            recommendations.add("CẦN THIẾT: Điều trị nghiện rượu chuyên môn ngay");
            recommendations.add("Tham gia chương trình cai rượu nội trú");
            recommendations.add("Hỗ trợ y tế và tâm lý toàn diện");
        }
        
        return new ScoreResult(totalScore, riskLevel, riskDescription, recommendations);
    }

    /**
     * DAST-10 Scoring: Drug Abuse Screening Test
     * 10 yes/no questions about drug use
     */
    private ScoreResult calculateDAST10Score(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        System.out.println("🔍 DAST-10 Scoring Debug:");
        System.out.println("🔍 Number of answers received: " + answers.size());
        
        int totalScore = 0;
        
        for (AssessmentSubmissionDTO.AnswerDTO answer : answers) {
            System.out.println("🔍 Processing answer - QuestionID: " + answer.getQuestionId() + 
                             ", Value: " + answer.getAnswerValue() + 
                             ", Text: " + answer.getAnswerText());
            
            Integer value = answer.getAnswerValue();
            if (value != null) {
                totalScore += value;
                System.out.println("🔍 Added " + value + " points. Total score now: " + totalScore);
            } else {
                System.out.println("🔍 ❌ Answer value is null, skipping");
            }
        }
        
        System.out.println("🔍 FINAL DAST-10 SCORE: " + totalScore);
        
        String riskLevel;
        String riskDescription;
        List<String> recommendations = new ArrayList<>();
        
        if (totalScore <= 2) {
            riskLevel = "THẤP";
            riskDescription = "Nguy cơ lạm dụng chất gây nghiện thấp.";
            recommendations.add("Duy trì lối sống lành mạnh");
            recommendations.add("Tiếp tục tránh xa các chất gây nghiện");
        } else if (totalScore <= 5) {
            riskLevel = "TRUNG BÌNH";
            riskDescription = "Nguy cơ lạm dụng chất gây nghiện trung bình.";
            recommendations.add("Cần tư vấn và đánh giá thêm");
            recommendations.add("Học kỹ năng phòng ngừa và đối phó");
        } else if (totalScore <= 8) {
            riskLevel = "CAO";
            riskDescription = "Nguy cơ lạm dụng chất gây nghiện cao.";
            recommendations.add("Cần can thiệp chuyên môn ngay");
            recommendations.add("Tham gia chương trình điều trị");
        } else {
            riskLevel = "RẤT CAO";
            riskDescription = "Nguy cơ lạm dụng chất gây nghiện rất cao.";
            recommendations.add("CẦN THIẾT: Điều trị chuyên môn khẩn cấp");
            recommendations.add("Chương trình điều trị toàn diện");
        }
        
        return new ScoreResult(totalScore, riskLevel, riskDescription, recommendations);
    }

    private ScoreResult calculateGeneralScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        int totalScore = answers.stream()
                .mapToInt(answer -> answer.getAnswerValue() != null ? answer.getAnswerValue() : 0)
                .sum();
        
        return new ScoreResult(totalScore, "TỔNG QUÁT", "Đánh giá tổng quát về tình trạng sức khỏe tâm lý", 
                List.of("Tham khảo ý kiến chuyên gia để có lời khuyên cụ thể"));
    }

    // ===== RESULT RETRIEVAL =====
    
    public List<AssessmentResultDTO> getUserAssessmentResults(Long userId) {
        List<AssessmentResult> results = assessmentResultRepository.findByUserId(userId);
        
        return results.stream()
                .map(result -> {
                    Assessment assessment = assessmentRepository.findById(result.getAssessmentId()).orElse(null);
                    return convertToResultDTO(result, assessment, null);
                })
                .collect(Collectors.toList());
    }

    public Optional<AssessmentResultDTO> getAssessmentResultById(Long resultId) {
        Optional<AssessmentResult> resultOpt = assessmentResultRepository.findById(resultId);
        
        if (resultOpt.isPresent()) {
            AssessmentResult result = resultOpt.get();
            Assessment assessment = assessmentRepository.findById(result.getAssessmentId()).orElse(null);
            return Optional.of(convertToResultDTO(result, assessment, null));
        }
        
        return Optional.empty();
    }

    // ===== HELPER METHODS =====
    
    private AssessmentResultDTO convertToResultDTO(AssessmentResult result, Assessment assessment, ScoreResult scoreResult) {
        List<String> recommendations = new ArrayList<>();
        
        if (result.getRecommendations() != null && !result.getRecommendations().trim().isEmpty()) {
            recommendations = Arrays.asList(result.getRecommendations().split(";"));
        } else if (scoreResult != null) {
            recommendations = scoreResult.getRecommendations();
        }
        
        String riskDescription = scoreResult != null ? scoreResult.getRiskDescription() : 
                                "Mô tả chi tiết về mức độ nguy cơ";
        
        return new AssessmentResultDTO(
                result.getId(),
                result.getUserId(),
                result.getAssessmentId(),
                assessment != null ? assessment.getTitle() : "Unknown Assessment",
                assessment != null ? getAssessmentTypeName(assessment.getAssessmentTypeId()) : "Unknown Type",
                result.getTotalScore(),
                result.getRiskLevel(),
                riskDescription,
                recommendations,
                result.getCompletedAt(),
                result.getCreatedAt()
        );
    }

    private String getAssessmentTypeName(Long assessmentTypeId) {
        return assessmentTypeRepository.findById(assessmentTypeId)
                .map(AssessmentType::getName)
                .orElse("Unknown Type");
    }

    // ===== ANONYMOUS ASSESSMENT CALCULATION (No database save) =====
    
    public AssessmentResultDTO calculateAssessmentResult(AssessmentSubmissionDTO submission) {
        // Validate assessment exists
        Assessment assessment = assessmentRepository.findById(submission.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        // Calculate score and determine risk level
        ScoreResult scoreResult = calculateAssessmentScore(assessment, submission.getAnswers());
        
        // Create temporary result for response (not saved to database)
        AssessmentResultDTO result = new AssessmentResultDTO();
        result.setId(null); // No ID since not saved
        result.setUserId(null); // Anonymous user
        result.setAssessmentId(submission.getAssessmentId());
        result.setAssessmentTitle(assessment.getTitle());
        result.setAssessmentType(getAssessmentTypeName(assessment.getAssessmentTypeId()));
        result.setTotalScore(scoreResult.getTotalScore());
        result.setRiskLevel(scoreResult.getRiskLevel());
        result.setRiskDescription(scoreResult.getRiskDescription());
        result.setRecommendations(scoreResult.getRecommendations());
        result.setCompletedAt(LocalDateTime.now());
        result.setCreatedAt(LocalDateTime.now());
        
        return result;
    }

    // ===== INNER CLASSES =====
    
    private static class ScoreResult {
        private final int totalScore;
        private final String riskLevel;
        private final String riskDescription;
        private final List<String> recommendations;

        public ScoreResult(int totalScore, String riskLevel, String riskDescription, List<String> recommendations) {
            this.totalScore = totalScore;
            this.riskLevel = riskLevel;
            this.riskDescription = riskDescription;
            this.recommendations = recommendations;
        }

        public int getTotalScore() { return totalScore; }
        public String getRiskLevel() { return riskLevel; }
        public String getRiskDescription() { return riskDescription; }
        public List<String> getRecommendations() { return recommendations; }
    }
} 