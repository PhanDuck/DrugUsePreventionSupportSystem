package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find Category by exact name
    Optional<Category> findByName(String name);
    
    // Find Category with name containing keyword
    List<Category> findByNameContaining(String name);
    
    // Check if Category exists by name
    boolean existsByName(String name);
    
    // Find Category by keyword in name or description
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Category> findByKeyword(@Param("keyword") String keyword);
    
    // Find active Category
    List<Category> findByIsActiveTrue();
    
    // Find Category by keyword in name or description
    @Query("SELECT c FROM Category c WHERE (c.name LIKE %:keyword% OR c.description LIKE %:keyword%) AND c.isActive = true")
    List<Category> findByKeywordAndActive(@Param("keyword") String keyword);
    
    // Find active Category by keyword
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% AND c.isActive = true")
    List<Category> findActiveByKeyword(@Param("keyword") String keyword);
} 