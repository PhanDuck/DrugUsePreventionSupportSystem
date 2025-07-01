package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Tìm Category theo tên chính xác
    Optional<Category> findByName(String name);
    
    // Tìm Category có tên chứa từ khóa
    List<Category> findByNameContaining(String name);
    
    // Kiểm tra Category có tồn tại không
    boolean existsByName(String name);
    
    // Tìm Category theo từ khóa trong tên hoặc mô tả
    List<Category> findByNameContainingOrDescriptionContaining(String name, String description);
    
    // Tìm Category đang active
    List<Category> findByIsActiveTrue();
    
    // Tìm Category theo từ khóa trong tên hoặc mô tả
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Category> findByKeyword(String keyword);
    
    // Tìm Category active theo từ khóa
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND (c.name LIKE %:keyword% OR c.description LIKE %:keyword%)")
    List<Category> findActiveByKeyword(String keyword);
} 