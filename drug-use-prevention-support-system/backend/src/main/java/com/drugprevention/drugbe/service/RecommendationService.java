package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Recommendation;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.AssessmentResult;
import com.drugprevention.drugbe.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {
    
    @Autowired
    private RecommendationRepository recommendationRepository;

    // 1. Lấy tất cả recommendations
    public List<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    // 2. Lấy recommendation theo ID
    public Optional<Recommendation> getRecommendationById(Long id) {
        return recommendationRepository.findById(id);
    }

    // 3. Tạo recommendation mới
    @Transactional
    public Recommendation createRecommendation(Recommendation recommendation) {
        recommendation.setStatus("pending");
        recommendation.setIsActive(true);
        recommendation.setCreatedAt(LocalDateTime.now());
        recommendation.setUpdatedAt(LocalDateTime.now());
        return recommendationRepository.save(recommendation);
    }

    // 4. Update recommendation
    @Transactional
    public Recommendation updateRecommendation(Long id, Recommendation recommendationDetails) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found with id: " + id));
        
        recommendation.setTitle(recommendationDetails.getTitle());
        recommendation.setDescription(recommendationDetails.getDescription());
        recommendation.setRecommendationType(recommendationDetails.getRecommendationType());
        recommendation.setTargetId(recommendationDetails.getTargetId());
        recommendation.setRiskLevel(recommendationDetails.getRiskLevel());
        recommendation.setPriority(recommendationDetails.getPriority());
        recommendation.setStatus(recommendationDetails.getStatus());
        recommendation.setIsActive(recommendationDetails.getIsActive());
        recommendation.setUpdatedAt(LocalDateTime.now());
        
        return recommendationRepository.save(recommendation);
    }

    // 5. Delete recommendation
    @Transactional
    public void deleteRecommendation(Long id) {
        if (!recommendationRepository.existsById(id)) {
            throw new RuntimeException("Recommendation not found with id: " + id);
        }
        recommendationRepository.deleteById(id);
    }

    // 6. Lấy recommendations theo user
    public List<Recommendation> getRecommendationsByUser(Long userId) {
        return recommendationRepository.findByUserId(userId);
    }

    // 7. Lấy pending recommendations cho user
    public List<Recommendation> getPendingRecommendationsByUser(Long userId) {
        return recommendationRepository.findPendingByUserId(userId);
    }

    // 8. Lấy recommendations theo type
    public List<Recommendation> getRecommendationsByType(String recommendationType) {
        return recommendationRepository.findByRecommendationType(recommendationType);
    }

    // 9. Lấy recommendations theo risk level
    public List<Recommendation> getRecommendationsByRiskLevel(String riskLevel) {
        return recommendationRepository.findByRiskLevel(riskLevel);
    }

    // 10. Lấy high priority recommendations
    public List<Recommendation> getHighPriorityRecommendations() {
        return recommendationRepository.findHighPriorityRecommendations();
    }

    // 11. Mark as viewed
    @Transactional
    public Recommendation markAsViewed(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found with id: " + id));
        recommendation.setStatus("viewed");
        recommendation.setUpdatedAt(LocalDateTime.now());
        return recommendationRepository.save(recommendation);
    }

    // 12. Mark as accepted
    @Transactional
    public Recommendation markAsAccepted(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found with id: " + id));
        recommendation.setStatus("accepted");
        recommendation.setUpdatedAt(LocalDateTime.now());
        return recommendationRepository.save(recommendation);
    }

    // 13. Mark as dismissed
    @Transactional
    public Recommendation markAsDismissed(Long id) {
        Recommendation recommendation = recommendationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation not found with id: " + id));
        recommendation.setStatus("dismissed");
        recommendation.setUpdatedAt(LocalDateTime.now());
        return recommendationRepository.save(recommendation);
    }

    // 14. Đếm recommendations theo user
    public Long countRecommendationsByUser(Long userId) {
        return recommendationRepository.countByUserId(userId);
    }

    // 15. Đếm pending recommendations theo user
    public Long countPendingRecommendationsByUser(Long userId) {
        return recommendationRepository.countPendingByUserId(userId);
    }

    // 16. Lấy recommendations mới nhất
    public List<Recommendation> getRecentRecommendations() {
        return recommendationRepository.findTop10ByOrderByCreatedAtDesc();
    }

    // 17. Tạo recommendation từ assessment result
    @Transactional
    public Recommendation createRecommendationFromAssessment(Long userId, Long assessmentResultId, String riskLevel) {
        Recommendation recommendation = new Recommendation();
        recommendation.setUserId(userId);
        recommendation.setAssessmentResultId(assessmentResultId);
        recommendation.setRiskLevel(riskLevel);
        
        // Set recommendation based on risk level
        if ("HIGH_RISK".equals(riskLevel)) {
            recommendation.setRecommendationType("consultation");
            recommendation.setTitle("Khuyến nghị tư vấn khẩn cấp");
            recommendation.setDescription("Dựa trên kết quả đánh giá, bạn cần được tư vấn chuyên môn.");
            recommendation.setPriority(1);
        } else if ("MEDIUM_RISK".equals(riskLevel)) {
            recommendation.setRecommendationType("course");
            recommendation.setTitle("Khuyến nghị tham gia khóa học");
            recommendation.setDescription("Tham gia các khóa học để tăng cường kiến thức và kỹ năng.");
            recommendation.setPriority(2);
        } else {
            recommendation.setRecommendationType("blog");
            recommendation.setTitle("Đọc thêm tài liệu");
            recommendation.setDescription("Đọc các bài viết để nâng cao nhận thức.");
            recommendation.setPriority(3);
        }
        
        return createRecommendation(recommendation);
    }
} 