package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Recommendation;
import com.drugprevention.drugbe.entity.Course;
import com.drugprevention.drugbe.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Integer> {
    
    // Tìm Recommendation theo Course
    List<Recommendation> findByCourse(Course course);
    
    // Tìm Recommendation theo Blog
    List<Recommendation> findByBlog(Blog blog);
    
    // Tìm Recommendation theo CourseID
    List<Recommendation> findByCourse_CourseID(Integer courseID);
    
    // Tìm Recommendation theo BlogID
    List<Recommendation> findByBlog_BlogID(Integer blogID);
    
    // Lấy tất cả Course được recommend
    @Query("SELECT DISTINCT r.course FROM Recommendation r WHERE r.course IS NOT NULL")
    List<Course> findRecommendedCourses();
    
    // Lấy tất cả Blog được recommend
    @Query("SELECT DISTINCT r.blog FROM Recommendation r WHERE r.blog IS NOT NULL")
    List<Blog> findRecommendedBlogs();
    
    // Tìm Recommendation theo risk level (có thể mở rộng để thêm trường riskLevel)
    @Query("SELECT r FROM Recommendation r WHERE " +
           "(r.course IS NOT NULL AND r.course.title LIKE %:keyword%) OR " +
           "(r.blog IS NOT NULL AND r.blog.title LIKE %:keyword%)")
    List<Recommendation> findByKeyword(@Param("keyword") String keyword);
    
    // Kiểm tra Course đã được recommend chưa
    boolean existsByCourse(Course course);
    
    // Kiểm tra Blog đã được recommend chưa
    boolean existsByBlog(Blog blog);
} 