package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.SignupRequest;
import com.drugprevention.drugbe.entity.Role;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.RoleRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.util.NameConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User signup(SignupRequest request) {
        // Validate request
        if (request == null) {
            throw new RuntimeException("Request cannot be null");
        }
        
        if (request.getUserName() == null || request.getUserName().trim().isEmpty()) {
            throw new RuntimeException("Username cannot be null or empty");
        }
        
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be null or empty");
        }
        
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }
        
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new RuntimeException("Full name cannot be null or empty");
        }
        
        // Check if username already exists
        if (userRepository.findByUsername(request.getUserName().trim()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail().trim()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Validate and convert name to English format
        String fullName = request.getFullName().trim();
        String validationMessage = NameConverter.getNameValidationMessage(fullName);
        if (validationMessage != null) {
            throw new RuntimeException(validationMessage);
        }

        // Convert Vietnamese name to English if needed
        String englishName = NameConverter.convertToEnglish(fullName);
        if (englishName.isEmpty()) {
            throw new RuntimeException("Name cannot be empty after conversion");
        }

        // Find role by name (default to USER if not specified)
        String roleName = request.getRoleName() != null ? request.getRoleName() : "USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Create new user
        User user = new User();
        user.setUsername(request.getUserName().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail().trim());
        
        // Parse English name into first and last name
        String[] nameParts = englishName.split(" ", 2);
        user.setFirstName(nameParts.length > 0 ? nameParts[0] : "");
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        user.setRoleId(role.getId());
        user.setIsActive(true);  // Set user as active by default
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save Firebase token if provided
        if (request.getFirebaseToken() != null) {
            user.setFirebaseToken(request.getFirebaseToken());
        }

        return userRepository.save(user);
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String username = authentication.getName();
        if (username == null) {
            return null;
        }
        
        try {
            User user = findByUsername(username);
            return user.getId();
        } catch (RuntimeException e) {
            return null;
        }
    }
} 