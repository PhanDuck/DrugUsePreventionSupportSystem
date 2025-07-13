package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.ReviewDTO;
import com.drugprevention.drugbe.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review Controller", description = "APIs for appointment reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ===== HEALTH CHECK =====

    @GetMapping("/health")
    @Operation(summary = "Health check for review service")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("⭐ Review Service is running! Ready for appointment feedback.");
    }

    // ===== CREATE REVIEW =====

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Create review", description = "Submit a review for a completed appointment")
    public ResponseEntity<?> createReview(@RequestParam Long appointmentId,
                                        @RequestParam Long clientId,
                                        @RequestParam Integer rating,
                                        @RequestParam(required = false) String comment) {
        try {
            ReviewDTO review = reviewService.createReview(appointmentId, clientId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi tạo đánh giá: " + e.getMessage()));
        }
    }

    // ===== GET REVIEWS =====

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get review by appointment", description = "Get review for a specific appointment")
    public ResponseEntity<?> getReviewByAppointmentId(@PathVariable Long appointmentId) {
        try {
            ReviewDTO review = reviewService.getReviewByAppointmentId(appointmentId);
            if (review == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy đánh giá: " + e.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get reviews by consultant", description = "Get all reviews for a consultant")
    public ResponseEntity<?> getReviewsByConsultantId(@PathVariable Long consultantId) {
        try {
            List<ReviewDTO> reviews = reviewService.getReviewsByConsultantId(consultantId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách đánh giá: " + e.getMessage()));
        }
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get reviews by client", description = "Get all reviews submitted by a client")
    public ResponseEntity<?> getReviewsByClientId(@PathVariable Long clientId) {
        try {
            List<ReviewDTO> reviews = reviewService.getReviewsByClientId(clientId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy danh sách đánh giá: " + e.getMessage()));
        }
    }

    // ===== REVIEW STATISTICS =====

    @GetMapping("/consultant/{consultantId}/statistics")
    @PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Get consultant review statistics", description = "Get average rating and total reviews for consultant")
    public ResponseEntity<?> getConsultantReviewStatistics(@PathVariable Long consultantId) {
        try {
            ReviewService.ReviewStatistics statistics = reviewService.getConsultantReviewStatistics(consultantId);
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy thống kê đánh giá: " + e.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}/average-rating")
    @Operation(summary = "Get consultant average rating", description = "Get average rating for consultant")
    public ResponseEntity<?> getConsultantAverageRating(@PathVariable Long consultantId) {
        try {
            Double averageRating = reviewService.getConsultantAverageRating(consultantId);
            return ResponseEntity.ok(Map.of("averageRating", averageRating != null ? averageRating : 0.0));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy điểm trung bình: " + e.getMessage()));
        }
    }

    @GetMapping("/consultant/{consultantId}/recent")
    @Operation(summary = "Get recent reviews", description = "Get recent reviews for consultant")
    public ResponseEntity<?> getRecentReviewsByConsultantId(@PathVariable Long consultantId,
                                                          @RequestParam(defaultValue = "5") int limit) {
        try {
            List<ReviewDTO> reviews = reviewService.getRecentReviewsByConsultantId(consultantId, limit);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi lấy đánh giá gần đây: " + e.getMessage()));
        }
    }

    // ===== UPDATE REVIEW =====

    @PutMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Update review", description = "Update an existing review")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId,
                                        @RequestParam(required = false) Integer rating,
                                        @RequestParam(required = false) String comment) {
        try {
            ReviewDTO review = reviewService.updateReview(reviewId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi cập nhật đánh giá: " + e.getMessage()));
        }
    }

    // ===== DELETE REVIEW =====

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    @Operation(summary = "Delete review", description = "Delete a review")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(Map.of("message", "Đánh giá đã được xóa thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi xóa đánh giá: " + e.getMessage()));
        }
    }
} 