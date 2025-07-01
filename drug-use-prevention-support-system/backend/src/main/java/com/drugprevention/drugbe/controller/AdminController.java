package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.service.BlogService;
import com.drugprevention.drugbe.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CourseService courseService; // Use services instead of repositories directly
    
    @Autowired
    private BlogService blogService;

    // // Dashboard statistics - Temporarily disabled due to refactoring
    // @GetMapping("/dashboard")
    // public ResponseEntity<?> getDashboardStats() {
    //     Map<String, Object> stats = new HashMap<>();
        
    //     // User statistics
    //     stats.put("totalUsers", userRepository.count());
    //     stats.put("totalConsultants", userRepository.findByRole_RoleName("CONSULTANT").size());
    //     stats.put("totalRegularUsers", userRepository.findByRole_RoleName("USER").size());
        
    //     // stats.put("totalCourses", courseRepository.count());
    //     // stats.put("activeCourses", courseRepository.countByIsActive(1));
        
    //     // stats.put("totalBlogs", blogRepository.count());
    //     // stats.put("publishedBlogs", blogRepository.countByIsPublished(1));
        
    //     return ResponseEntity.ok(stats);
    // }

    // User management
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 