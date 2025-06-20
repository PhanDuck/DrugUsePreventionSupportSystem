package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Blog;
import com.drugprevention.drugbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    
    // Tìm kiếm cơ bản
    List<Blog> findByStatus(String status);
    List<Blog> findByAuthor_UserID(Integer authorId);
    List<Blog> findByAuthor(User author);
    
    // Tìm theo thời gian
    List<Blog> findByPublishDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Blog> findByStatusAndPublishDateBetween(String status, LocalDateTime startDate, LocalDateTime endDate);
    
    // Tìm theo từ khóa trong title hoặc content
    @Query("SELECT b FROM Blog b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    List<Blog> findByKeyword(@Param("keyword") String keyword);
    
    // Tìm blog active theo từ khóa
    @Query("SELECT b FROM Blog b WHERE b.status = 'ACTIVE' AND (b.title LIKE %:keyword% OR b.content LIKE %:keyword%)")
    List<Blog> findActiveByKeyword(@Param("keyword") String keyword);
    
    // Lấy blog mới nhất
    @Query("SELECT b FROM Blog b WHERE b.status = 'ACTIVE' ORDER BY b.publishDate DESC")
    List<Blog> findRecentBlogs();
    
    // Lấy blog mới nhất theo số lượng
    @Query("SELECT b FROM Blog b WHERE b.status = 'ACTIVE' ORDER BY b.publishDate DESC LIMIT :limit")
    List<Blog> findRecentBlogs(@Param("limit") Integer limit);
    
    // Lấy blog của tác giả theo status
    List<Blog> findByAuthor_UserIDAndStatus(Integer authorId, String status);
    
    // Đếm blog theo status
    @Query("SELECT b.status, COUNT(b) FROM Blog b GROUP BY b.status")
    List<Object[]> countByStatus();
    
    // Đếm blog theo tác giả
    @Query("SELECT u.fullName, COUNT(b) FROM Blog b JOIN b.author u GROUP BY u.fullName ORDER BY COUNT(b) DESC")
    List<Object[]> countByAuthor();
    
    // Thống kê blog theo tháng
    @Query("SELECT YEAR(b.publishDate), MONTH(b.publishDate), COUNT(b) FROM Blog b WHERE b.publishDate BETWEEN :startDate AND :endDate GROUP BY YEAR(b.publishDate), MONTH(b.publishDate) ORDER BY YEAR(b.publishDate), MONTH(b.publishDate)")
    List<Object[]> getMonthlyStatistics(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Tìm blog liên quan (cùng tác giả hoặc có từ khóa tương tự)
    @Query("SELECT b FROM Blog b WHERE b.status = 'ACTIVE' AND b.blogID != :blogId AND (b.author.userID = :authorId OR b.title LIKE %:keyword% OR b.content LIKE %:keyword%) ORDER BY b.publishDate DESC")
    List<Blog> findRelatedBlogs(@Param("blogId") Integer blogId, @Param("authorId") Integer authorId, @Param("keyword") String keyword);
    
    // Lấy tác giả có nhiều blog nhất
    @Query("SELECT b.author, COUNT(b) as blogCount FROM Blog b WHERE b.status = 'ACTIVE' GROUP BY b.author ORDER BY blogCount DESC")
    List<Object[]> findTopAuthors();
} 