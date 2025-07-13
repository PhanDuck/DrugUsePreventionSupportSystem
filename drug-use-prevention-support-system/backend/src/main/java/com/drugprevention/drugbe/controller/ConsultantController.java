package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/consultants")
@CrossOrigin(origins = "*")
public class ConsultantController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllConsultants() {
        return ResponseEntity.ok(userService.findAllConsultants());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchConsultants(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String specialty,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Double maxPrice) {
        return ResponseEntity.ok(userService.searchConsultants(keyword, specialty, location, minRating, maxPrice));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getConsultantById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<User>> getAvailableConsultants() {
        return ResponseEntity.ok(userService.findAvailableConsultants());
    }
} 