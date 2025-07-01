package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    
    // Tìm blogs theo author ID
    List<Blog> findByAuthorId(Long authorId);
    
    // Tìm blogs theo category ID
    List<Blog> findByCategoryId(Long categoryId);
    
    // Tìm blogs theo status
    List<Blog> findByStatus(String status);
    
    // Tìm blogs active
    List<Blog> findByIsActiveTrue();
    
    // Tìm featured blogs
    List<Blog> findByIsFeaturedTrue();
    
    // Tìm published blogs
    List<Blog> findByStatusAndIsActiveTrue(String status);
    
    // Tìm blogs theo title
    List<Blog> findByTitleContaining(String title);
    
    // Tìm blogs theo keyword trong title hoặc content
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    List<Blog> findByKeyword(@Param("keyword") String keyword);
    
    // Tìm blogs theo tags
    @Query("SELECT b FROM Blog b WHERE b.tags LIKE %:tag%")
    List<Blog> findByTagsContaining(@Param("tag") String tag);
    
    // Tìm blogs theo thời gian published
    List<Blog> findByPublishedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Lấy blogs mới nhất
    List<Blog> findTop10ByStatusOrderByPublishedAtDesc(String status);
    
    // Lấy popular blogs (view count cao)
    List<Blog> findTop10ByStatusOrderByViewCountDesc(String status);
    
    // Page blogs với filter
    Page<Blog> findByStatusAndIsActiveTrue(String status, Pageable pageable);
    Page<Blog> findByCategoryIdAndStatusAndIsActiveTrue(Long categoryId, String status, Pageable pageable);
    
    // Đếm blogs theo category
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.categoryId = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
    
    // Đếm blogs theo author
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.authorId = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
} 