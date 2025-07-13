package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.ReviewDTO;
import com.drugprevention.drugbe.entity.Appointment;
import com.drugprevention.drugbe.entity.Review;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.AppointmentRepository;
import com.drugprevention.drugbe.repository.ReviewRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new review
    public ReviewDTO createReview(Long appointmentId, Long clientId, Integer rating, String comment) {
        // Check if appointment exists and is completed
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new RuntimeException("Appointment not found");
        }

        Appointment appointment = appointmentOpt.get();
        if (!"COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Can only review completed appointments");
        }

        // Check if review already exists
        if (reviewRepository.existsByAppointmentId(appointmentId)) {
            throw new RuntimeException("This appointment has already been reviewed");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be from 1 to 5 stars");
        }

        // Create review
        Review review = new Review(appointmentId, clientId, appointment.getConsultantId(), rating, comment);
        Review savedReview = reviewRepository.save(review);

        return convertToDTO(savedReview);
    }

    // Get review by appointment ID
    public ReviewDTO getReviewByAppointmentId(Long appointmentId) {
        Optional<Review> reviewOpt = reviewRepository.findByAppointmentId(appointmentId);
        if (reviewOpt.isEmpty()) {
            return null;
        }
        return convertToDTO(reviewOpt.get());
    }

    // Get all reviews by consultant ID
    public List<ReviewDTO> getReviewsByConsultantId(Long consultantId) {
        List<Review> reviews = reviewRepository.findByConsultantIdOrderByCreatedAtDesc(consultantId);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all reviews by client ID
    public List<ReviewDTO> getReviewsByClientId(Long clientId) {
        List<Review> reviews = reviewRepository.findByClientIdOrderByCreatedAtDesc(clientId);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get consultant average rating
    public Double getConsultantAverageRating(Long consultantId) {
        return reviewRepository.getAverageRatingByConsultantId(consultantId);
    }

    // Get consultant review count
    public Long getConsultantReviewCount(Long consultantId) {
        return reviewRepository.getReviewCountByConsultantId(consultantId);
    }

    // Get recent reviews for consultant
    public List<ReviewDTO> getRecentReviewsByConsultantId(Long consultantId, int limit) {
        List<Review> reviews = reviewRepository.findRecentReviewsByConsultantId(consultantId, limit);
        return reviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update review
    public ReviewDTO updateReview(Long reviewId, Integer rating, String comment) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            throw new RuntimeException("Review not found");
        }

        Review review = reviewOpt.get();
        
        // Validate rating
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new RuntimeException("Rating must be from 1 to 5 stars");
        }

        if (rating != null) {
            review.setRating(rating);
        }
        if (comment != null) {
            review.setComment(comment);
        }

        Review updatedReview = reviewRepository.save(review);
        return convertToDTO(updatedReview);
    }

    // Delete review
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
    }

    // Get consultant statistics
    public ReviewStatistics getConsultantReviewStatistics(Long consultantId) {
        Double averageRating = reviewRepository.getAverageRatingByConsultantId(consultantId);
        Long totalReviews = reviewRepository.getReviewCountByConsultantId(consultantId);
        
        return new ReviewStatistics(
            averageRating != null ? averageRating : 0.0,
            totalReviews != null ? totalReviews : 0L
        );
    }

    // Convert Review entity to DTO
    private ReviewDTO convertToDTO(Review review) {
        String clientName = "";
        String consultantName = "";

        // Get client name
        Optional<User> clientOpt = userRepository.findById(review.getClientId());
        if (clientOpt.isPresent()) {
            User client = clientOpt.get();
            clientName = client.getFirstName() + " " + client.getLastName();
        }

        // Get consultant name
        Optional<User> consultantOpt = userRepository.findById(review.getConsultantId());
        if (consultantOpt.isPresent()) {
            User consultant = consultantOpt.get();
            consultantName = consultant.getFirstName() + " " + consultant.getLastName();
        }

        return new ReviewDTO(
            review.getId(),
            review.getAppointmentId(),
            review.getClientId(),
            review.getConsultantId(),
            clientName,
            consultantName,
            review.getRating(),
            review.getComment(),
            review.getCreatedAt(),
            review.getUpdatedAt()
        );
    }

    // Inner class for review statistics
    public static class ReviewStatistics {
        private Double averageRating;
        private Long totalReviews;

        public ReviewStatistics(Double averageRating, Long totalReviews) {
            this.averageRating = averageRating;
            this.totalReviews = totalReviews;
        }

        public Double getAverageRating() {
            return averageRating;
        }

        public void setAverageRating(Double averageRating) {
            this.averageRating = averageRating;
        }

        public Long getTotalReviews() {
            return totalReviews;
        }

        public void setTotalReviews(Long totalReviews) {
            this.totalReviews = totalReviews;
        }
    }
} 