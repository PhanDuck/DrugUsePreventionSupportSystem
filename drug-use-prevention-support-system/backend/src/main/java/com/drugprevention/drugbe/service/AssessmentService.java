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
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 1. Get all assessments
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    // 2. Get assessments by type ID
    public List<Assessment> getAssessmentsByTypeId(Long typeId) {
        return assessmentRepository.findByAssessmentTypeId(typeId);
    }

    // 3. Get questions for an assessment
    public List<AssessmentQuestion> getQuestionsByAssessmentId(Long assessmentId) {
        return assessmentQuestionRepository.findByAssessmentIdOrderByOrderIndex(assessmentId);
    }

    // 4. Get assessment by ID
    public Optional<Assessment> getAssessmentById(Long id) {
        return assessmentRepository.findById(id);
    }

    // 5. Get assessment type by ID
    public Optional<AssessmentType> getAssessmentTypeById(Long id) {
        return assessmentTypeRepository.findById(id);
    }

    // 6. Get results by user ID (deprecated - use getUserAssessmentResults)
    public List<AssessmentResult> getResultsByUserId(Long userId) {
        return assessmentResultRepository.findByUserId(userId);
    }

    // 7. Get results by assessment ID
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
        // Validate submission
        if (submission == null) {
            throw new RuntimeException("Submission cannot be null");
        }
        
        if (submission.getAssessmentId() == null) {
            throw new RuntimeException("Assessment ID cannot be null");
        }
        
        if (submission.getUserId() == null) {
            throw new RuntimeException("User ID cannot be null");
        }
        
        if (submission.getAnswers() == null || submission.getAnswers().isEmpty()) {
            throw new RuntimeException("Answers cannot be null or empty");
        }
        
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
            throw new RuntimeException("Failed to serialize answers to JSON: " + e.getMessage());
        }
        
        // Save assessment result
        result = assessmentResultRepository.save(result);
        
        // Save individual answers
        for (AssessmentSubmissionDTO.AnswerDTO answerDTO : submission.getAnswers()) {
            if (answerDTO.getQuestionId() == null) {
                throw new RuntimeException("Question ID cannot be null in answer");
            }
            
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
        // Log English values retrieved from database to console
        for (AssessmentQuestion q : questions) {
            System.out.println("[DEBUG] Question (id=" + q.getId() + "): " + q.getQuestion());
        }
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
        // Validate inputs
        if (assessment == null) {
            throw new RuntimeException("Assessment cannot be null");
        }
        
        if (answers == null || answers.isEmpty()) {
            throw new RuntimeException("Answers cannot be null or empty");
        }
        
        // Get assessment type to determine scoring method
        AssessmentType assessmentType = assessmentTypeRepository.findById(assessment.getAssessmentTypeId())
                .orElseThrow(() -> new RuntimeException("Assessment type not found"));
        
        String typeName = assessmentType.getName() != null ? assessmentType.getName().toUpperCase() : "GENERAL";
        
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
     * 6 yes/no questions about substance use behavior
     */
    private ScoreResult calculateCRAFFTScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        System.out.println("🔍 CRAFFT Scoring Debug:");
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
        
        System.out.println("🔍 FINAL CRAFFT SCORE: " + totalScore);
        
        String riskLevel;
        String riskDescription;
        List<String> recommendations = new ArrayList<>();
        
        if (totalScore == 0) {
            riskLevel = "LOW";
            riskDescription = "Low risk of substance use. You show no signs of problematic use.";
            recommendations.add("Continue maintaining a healthy lifestyle and stay away from addictive substances");
            recommendations.add("Participate in positive activities like sports and learning");
            recommendations.add("Share with friends about the harms of addictive substances");
        } else if (totalScore == 1) {
            riskLevel = "MEDIUM";
            riskDescription = "Medium risk. You have some signs that need attention regarding substance use.";
            recommendations.add("Consider consulting a professional counselor for better assessment");
            recommendations.add("Participate in life skills and stress management courses");
            recommendations.add("Increase sports activities and healthy hobbies");
            recommendations.add("Talk to family or trusted person");
        } else { // totalScore >= 2
            riskLevel = "HIGH";
            riskDescription = "High risk of substance use. Immediate professional intervention and support required.";
            recommendations.add("URGENT: Consult a specialist doctor or substance addiction counselor immediately");
            recommendations.add("Participate in intensive counseling and treatment programs");
            recommendations.add("Notify family to receive necessary support");
            recommendations.add("Stay away from situations and environments with risk of exposure to addictive substances");
            recommendations.add("Contact 24/7 support hotline: 1900 1234 (free)");
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
            riskLevel = "LOW";
            riskDescription = "You have no history of using addictive substances. This is a positive result.";
            recommendations.add("Continue maintaining a lifestyle without using addictive substances");
            recommendations.add("Participate in activities to prevent social vices");
            recommendations.add("Share knowledge about the harms of addictive substances with family");
        } else if (totalScore <= 3 && recentUse == 0) {
            riskLevel = "LOW";
            riskDescription = "You have a history of use but haven't used in the past 3 months. Current risk is low.";
            recommendations.add("Continue maintaining abstinence from addictive substances");
            recommendations.add("Participate in positive activities to maintain a healthy lifestyle");
            recommendations.add("Be vigilant about situations that could lead to relapse");
        } else if (totalScore <= 15 || (recentUse > 0 && recentUse <= 2)) {
            riskLevel = "MEDIUM";
            riskDescription = String.format("Medium risk. You have used %d types of substances, of which %d types were used recently.", 
                substancesUsed, recentUse);
            recommendations.add("NECESSARY: Participate in intensive counseling about harms and how to stop using");
            recommendations.add("Learn coping skills for stress and pressure without using addictive substances");
            recommendations.add("Join community support groups or self-help groups");
            recommendations.add("Consider notifying family to receive support");
            recommendations.add("Stay away from environments and people who might encourage use");
        } else {
            riskLevel = "HIGH";
            riskDescription = String.format("Very high risk. You are using many types of substances (%d types) and have %d types used recently.", 
                substancesUsed, recentUse);
            recommendations.add("URGENT: Contact substance addiction treatment specialist immediately");
            recommendations.add("Need to participate in inpatient or outpatient treatment programs");
            recommendations.add("Notify family and relatives to receive maximum support");
            recommendations.add("Regular medical monitoring to check health");
            recommendations.add("Participate in long-term recovery programs");
            recommendations.add("Emergency hotline: 115 or 1900 1234");
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
            riskLevel = "LOW";
            riskDescription = "Low level alcohol use or no risk.";
            recommendations.add("Maintain current usage level or consider reducing");
            recommendations.add("Learn about the harms of alcohol to health");
        } else if (totalScore <= 15) {
            riskLevel = "MEDIUM";
            riskDescription = "Risky alcohol use, short-term intervention needed.";
            recommendations.add("Need to significantly reduce alcohol consumption");
            recommendations.add("Participate in counseling about alcohol harms");
            recommendations.add("Learn alternative skills to drinking");
        } else if (totalScore <= 19) {
            riskLevel = "HIGH";
            riskDescription = "Harmful alcohol use, professional intervention needed.";
            recommendations.add("Need medical intervention and intensive counseling");
            recommendations.add("Consider participating in alcohol cessation programs");
            recommendations.add("Regular medical monitoring");
        } else {
            riskLevel = "VERY HIGH";
            riskDescription = "Signs of alcohol addiction, immediate treatment required.";
            recommendations.add("NECESSARY: Professional alcohol addiction treatment immediately");
            recommendations.add("Participate in inpatient alcohol cessation programs");
            recommendations.add("Comprehensive medical and psychological support");
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
        
        if (totalScore <= 1) {
            riskLevel = "LOW";
            riskDescription = "Low risk of drug abuse.";
            recommendations.add("Continue monitoring and maintain healthy lifestyle");
            recommendations.add("Learn about drug abuse prevention");
        } else if (totalScore <= 3) {
            riskLevel = "MEDIUM";
            riskDescription = "Moderate risk of drug abuse.";
            recommendations.add("Consider professional assessment");
            recommendations.add("Participate in drug abuse prevention programs");
            recommendations.add("Learn coping skills");
        } else if (totalScore <= 5) {
            riskLevel = "HIGH";
            riskDescription = "High risk of drug abuse.";
            recommendations.add("Immediate professional intervention required");
            recommendations.add("Participate in intensive treatment programs");
            recommendations.add("Regular medical monitoring");
        } else {
            riskLevel = "VERY HIGH";
            riskDescription = "Very high risk of drug abuse.";
            recommendations.add("URGENT: Immediate professional treatment required");
            recommendations.add("Inpatient treatment program recommended");
            recommendations.add("Comprehensive medical and psychological support");
        }
        
        return new ScoreResult(totalScore, riskLevel, riskDescription, recommendations);
    }

    private ScoreResult calculateGeneralScore(List<AssessmentSubmissionDTO.AnswerDTO> answers) {
        int totalScore = answers.stream()
                .mapToInt(answer -> answer.getAnswerValue() != null ? answer.getAnswerValue() : 0)
                .sum();
        
        return new ScoreResult(totalScore, "TOTAL", "General assessment of mental health status", 
                List.of("Consult a specialist for specific advice"));
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
                                "Detailed description of risk level";
        
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
    
    // ===== CONSULTANT ACCESS =====
    
    /**
     * Get assessment results for a client that consultant has appointments with
     */
    public List<AssessmentResultDTO> getClientAssessmentResultsForConsultant(Long consultantId, Long clientId) {
        // First check if consultant has any appointments with this client
        boolean hasAppointments = appointmentRepository
                .findByConsultantIdOrderByAppointmentDateDesc(consultantId)
                .stream()
                .anyMatch(appointment -> appointment.getClientId().equals(clientId));
                
        if (!hasAppointments) {
            throw new RuntimeException("You do not have permission to view this client's assessment results");
        }
        
        // Get all assessment results for this client
        return getUserAssessmentResults(clientId);
    }
    
    /**
     * Get latest assessment result for a client (for consultant view)
     */
    public Optional<AssessmentResultDTO> getLatestClientAssessmentForConsultant(Long consultantId, Long clientId) {
        // First check if consultant has any appointments with this client
        boolean hasAppointments = appointmentRepository
                .findByConsultantIdOrderByAppointmentDateDesc(consultantId)
                .stream()
                .anyMatch(appointment -> appointment.getClientId().equals(clientId));
                
        if (!hasAppointments) {
            throw new RuntimeException("You do not have permission to view this client's assessment results");
        }
        
        // Get latest assessment result
        List<AssessmentResult> results = assessmentResultRepository.findByUserId(clientId);
        if (results.isEmpty()) {
            return Optional.empty();
        }
        
        // Sort by completed date and get the latest
        AssessmentResult latestResult = results.stream()
                .sorted((r1, r2) -> r2.getCompletedAt().compareTo(r1.getCompletedAt()))
                .findFirst()
                .orElse(null);
                
        if (latestResult == null) {
            return Optional.empty();
        }
        
        Assessment assessment = assessmentRepository.findById(latestResult.getAssessmentId()).orElse(null);
        return Optional.of(convertToResultDTO(latestResult, assessment, null));
    }
} 