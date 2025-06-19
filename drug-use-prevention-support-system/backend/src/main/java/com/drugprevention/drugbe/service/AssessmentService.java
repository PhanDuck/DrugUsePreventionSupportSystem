package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.*;
import com.drugprevention.drugbe.repository.*;
import com.drugprevention.drugbe.dto.AssessmentSubmitRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
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

    // 1. Lấy danh sách khảo sát
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    // 2. Lấy danh sách câu hỏi của 1 khảo sát
    public List<AssessmentQuestion> getQuestionsByAssessmentId(Integer assessmentId) {
        return assessmentQuestionRepository.findAll().stream()
            .filter(q -> q.getAssessment() != null && q.getAssessment().getAssessmentID().equals(assessmentId))
            .collect(Collectors.toList());
    }

    // 3. User submit kết quả khảo sát
    public AssessmentResult submitAssessment(Integer assessmentId, AssessmentSubmitRequest request) {
        // Validate dữ liệu
        List<AssessmentQuestion> questions = getQuestionsByAssessmentId(assessmentId);
        int totalScore = 0;
        AssessmentResult result = new AssessmentResult();
        result.setAssessment(assessmentRepository.findById(assessmentId).orElse(null));
        result.setUserID(request.getUserId());
        result.setTakeTime(LocalDateTime.now());
        result.setResultName("Kết quả khảo sát");
        // Tính điểm tổng
        for (AssessmentSubmitRequest.AnswerDTO answerDTO : request.getAnswers()) {
            AssessmentQuestion question = questions.stream()
                .filter(q -> q.getQuestionID().equals(answerDTO.getQuestionId()))
                .findFirst().orElse(null);
            if (question != null) {
                totalScore += (answerDTO.getScore() != null ? answerDTO.getScore() : 0);
            }
        }
        result.setScore(totalScore);
        // Lưu kết quả
        AssessmentResult savedResult = assessmentResultRepository.save(result);
        // Lưu từng answer
        for (AssessmentSubmitRequest.AnswerDTO answerDTO : request.getAnswers()) {
            Answer answer = new Answer();
            answer.setResult(savedResult);
            answer.setQuestion(assessmentQuestionRepository.findById(answerDTO.getQuestionId()).orElse(null));
            answer.setUserAnswer(answerDTO.getUserAnswer());
            answer.setScore(answerDTO.getScore());
            answerRepository.save(answer);
        }
        return savedResult;
    }

    // 4. (Tùy chọn) Lấy kết quả đã làm của user
    public List<AssessmentResult> getResultsByUserId(Integer userId) {
        return assessmentResultRepository.findAll().stream()
            .filter(r -> r.getUserID() != null && r.getUserID().equals(userId))
            .collect(Collectors.toList());
    }
} 