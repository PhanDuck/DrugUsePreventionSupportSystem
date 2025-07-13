package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find review by appointment ID
    Optional<Review> findByAppointmentId(Long appointmentId);

    // Find all reviews by consultant ID
    List<Review> findByConsultantIdOrderByCreatedAtDesc(Long consultantId);

    // Find all reviews by client ID
    List<Review> findByClientIdOrderByCreatedAtDesc(Long clientId);

    // Check if review exists for appointment
    boolean existsByAppointmentId(Long appointmentId);

    // Get average rating for consultant
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.consultantId = :consultantId")
    Double getAverageRatingByConsultantId(@Param("consultantId") Long consultantId);

    // Get total reviews count for consultant
    @Query("SELECT COUNT(r) FROM Review r WHERE r.consultantId = :consultantId")
    Long getReviewCountByConsultantId(@Param("consultantId") Long consultantId);

    // Get reviews with rating filter
    List<Review> findByConsultantIdAndRatingGreaterThanEqualOrderByCreatedAtDesc(Long consultantId, Integer minRating);

    // Get recent reviews
    @Query("SELECT r FROM Review r WHERE r.consultantId = :consultantId ORDER BY r.createdAt DESC LIMIT :limit")
    List<Review> findRecentReviewsByConsultantId(@Param("consultantId") Long consultantId, @Param("limit") int limit);
} 