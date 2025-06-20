package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    // Tìm Category theo tên
    Optional<Category> findByName(String name);
    
    // Kiểm tra Category có tồn tại không
    boolean existsByName(String name);
    
    // Lấy tất cả Category có Course
    @Query("SELECT DISTINCT c FROM Category c WHERE SIZE(c.courses) > 0")
    List<Category> findCategoriesWithCourses();
    
    // Tìm Category theo từ khóa trong tên hoặc mô tả
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Category> findByKeyword(String keyword);
    
    // Đếm số Course trong mỗi Category
    @Query("SELECT c.categoryID, c.name, SIZE(c.courses) FROM Category c")
    List<Object[]> countCoursesPerCategory();
} 