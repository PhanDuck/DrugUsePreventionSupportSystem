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
    
    // Find blogs by author ID
    List<Blog> findByAuthorId(Long authorId);
    
    // Find blogs by category ID
    List<Blog> findByCategoryId(Long categoryId);
    
    // Find blogs by status
    List<Blog> findByStatus(String status);
    
    // Find active blogs
    List<Blog> findByIsActiveTrue();
    
    // Find featured blogs
    List<Blog> findByIsFeaturedTrue();
    
    // Find published blogs
    List<Blog> findByStatusAndIsActiveTrue(String status);
    
    // Find blogs by title
    List<Blog> findByTitleContaining(String title);
    
    // Find blogs by keyword in title or content
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    List<Blog> findByKeyword(@Param("keyword") String keyword);
    
    // Find blogs by tags
    List<Blog> findByTagsContaining(String tags);
    
    // Find blogs by published time
    List<Blog> findByPublishedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Get latest blogs
    List<Blog> findTop10ByStatusOrderByPublishedAtDesc(String status);
    
    // Get popular blogs (high view count)
    @Query("SELECT b FROM Blog b WHERE b.isActive = true ORDER BY b.viewCount DESC")
    List<Blog> findPopularBlogs();
    
    // Page blogs with filter
    Page<Blog> findByStatusAndIsActiveTrue(String status, Pageable pageable);
    Page<Blog> findByCategoryIdAndStatusAndIsActiveTrue(Long categoryId, String status, Pageable pageable);
    
    // Count blogs by category
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.categoryId = :categoryId")
    Long countByCategoryId(@Param("categoryId") Long categoryId);
    
    // Count blogs by author
    @Query("SELECT COUNT(b) FROM Blog b WHERE b.authorId = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
} 