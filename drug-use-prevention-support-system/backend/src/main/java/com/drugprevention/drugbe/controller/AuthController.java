package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.SignupRequest;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.AuthService;
import com.drugprevention.drugbe.service.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            User user = authService.signup(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("userName");
            if (username == null) {
                username = loginRequest.get("username");
            }
            String password = loginRequest.get("password");
            
            logger.debug("Login attempt for username: {}", username);
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            logger.debug("Authentication successful for user: {}", username);
            
            User user = authService.findByUsername(username);
            logger.debug("User found: id={}, username={}, roleId={}", user.getId(), user.getUsername(), user.getRoleId());
            
            if (user.getRole() != null) {
                logger.debug("User role: id={}, name={}", user.getRole().getId(), user.getRole().getName());
            } else {
                logger.error("User role is NULL for user: {}", username);
            }
            
            String token = jwtService.generateToken(username, user.getRole().getName());
            logger.debug("JWT token generated successfully for user: {}", username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);
            response.put("role", user.getRole().getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user: {} - Error: {}", loginRequest.get("username"), e.getMessage(), e);
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    // Note: Password encoding endpoint removed for security reasons
    // Use direct service methods in development if needed
} 