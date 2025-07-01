package com.drugprevention.drugbe.service;

import com.drugprevention.drugbe.dto.SignupRequest;
import com.drugprevention.drugbe.entity.Role;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.repository.RoleRepository;
import com.drugprevention.drugbe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        // Check if username already exists
        if (userRepository.findByUsername(request.getUserName()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Find role by name (default to USER if not specified)
        String roleName = request.getRoleName() != null ? request.getRoleName() : "USER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // Create new user
        User user = new User();
        user.setUsername(request.getUserName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        // Parse full name into first and last name
        String fullName = request.getFullName() != null ? request.getFullName() : "";
        String[] nameParts = fullName.split(" ", 2);
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
} 