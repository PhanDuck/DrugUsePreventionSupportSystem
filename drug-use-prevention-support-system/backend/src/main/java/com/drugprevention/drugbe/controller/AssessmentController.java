package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.AssessmentSubmitRequest;
import com.drugprevention.drugbe.entity.*;
import com.drugprevention.drugbe.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {
    @Autowired
    private AssessmentService assessmentService;

    // 1. Lấy danh sách khảo sát
    @GetMapping
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    // 2. Lấy danh sách câu hỏi của 1 khảo sát
    @GetMapping("/{assessmentId}/questions")
    public List<AssessmentQuestion> getQuestionsByAssessmentId(@PathVariable Integer assessmentId) {
        return assessmentService.getQuestionsByAssessmentId(assessmentId);
    }

    // 3. User submit kết quả khảo sát
    @PostMapping("/{assessmentId}/submit")
    public AssessmentResult submitAssessment(@PathVariable Integer assessmentId, @RequestBody AssessmentSubmitRequest request) {
        return assessmentService.submitAssessment(assessmentId, request);
    }

    // 4. (Tùy chọn) Lấy kết quả đã làm của user
    @GetMapping("/results/user/{userId}")
    public List<AssessmentResult> getResultsByUserId(@PathVariable Integer userId) {
        return assessmentService.getResultsByUserId(userId);
    }
} 