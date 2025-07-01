package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.entity.Category;
import com.drugprevention.drugbe.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        category.setCreatedAt(LocalDateTime.now());
        category.setIsActive(true);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIcon(categoryDetails.getIcon());
        category.setIsActive(categoryDetails.getIsActive());
        
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    public List<Category> getCategoriesByName(String name) {
        return categoryRepository.findByNameContaining(name);
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }
} 