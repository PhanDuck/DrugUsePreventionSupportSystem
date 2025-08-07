package com.drugprevention.drugbe.controller;

import com.drugprevention.drugbe.dto.UserDTO;
import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.service.UserService;
import com.drugprevention.drugbe.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')") // Class-level security
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired 
    private AuthService authService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("👤 User Service is running!");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserDTO> users = userService.getAllUsersDTO();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", users,
                "message", "Users retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve users",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @authService.getCurrentUserId() == #id")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<UserDTO> userDTO = userService.getUserByIdDTO(id);
            if (userDTO.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", userDTO.get(),
                    "message", "User retrieved successfully"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve user",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/role/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> getUsersByRole(@PathVariable Long roleId) {
        try {
            List<UserDTO> users = userService.getUsersByRoleDTO(roleId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", users,
                "message", "Users by role retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve users by role",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/consultants")
    @PreAuthorize("permitAll()") // Allow public access
    public ResponseEntity<?> getAllConsultants() {
        try {
            List<UserDTO> consultants = userService.getConsultantsDTO();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", consultants,
                "message", "Consultants retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve consultants",
                "details", e.getMessage()
            ));
        }
    }



    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = authService.findByUsername(username);
            UserDTO userDTO = userService.convertToDTO(user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", userDTO,
                "message", "Current user retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve current user",
                "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @authService.getCurrentUserId() == #id")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            // Update only allowed fields (not password, role, etc. unless admin)
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setAddress(userDetails.getAddress());
            user.setBio(userDetails.getBio());
            
            User updatedUser = userService.saveUser(user);
            UserDTO userDTO = userService.convertToDTO(updatedUser);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", userDTO,
                "message", "User updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to update user",
                "details", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userService.getUserById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Soft delete by setting isActive to false
            User user = userOpt.get();
            user.setIsActive(false);
            userService.saveUser(user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User deactivated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to delete user",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<?> searchUsers(@RequestParam String keyword) {
        try {
            // This method needs to be implemented in UserService
            List<UserDTO> users = userService.getAllUsersDTO().stream()
                .filter(user -> 
                    user.getFullName().toLowerCase().contains(keyword.toLowerCase()) ||
                    user.getEmail().toLowerCase().contains(keyword.toLowerCase())
                )
                .toList();
                
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", users,
                "message", "Search completed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Search failed",
                "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/statistics/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> getTotalUserCount() {
        try {
            List<UserDTO> users = userService.getAllUsersDTO();
            long totalCount = users.size();
            long activeCount = users.stream().mapToLong(user -> 1).sum();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                    "totalUsers", totalCount,
                    "activeUsers", activeCount
                ),
                "message", "User statistics retrieved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to retrieve user statistics",
                "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF', 'USER', 'CONSULTANT')")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, Object> updateData, Authentication authentication) {
        try {
            // Get current user from authentication
            String username = authentication.getName();
            Optional<User> userOptional = userService.getUserByUsername(username);
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "User not found"
                ));
            }
            
            User user = userOptional.get();
            
            // Update fields if provided
            if (updateData.containsKey("firstName")) {
                user.setFirstName((String) updateData.get("firstName"));
            }
            if (updateData.containsKey("lastName")) {
                user.setLastName((String) updateData.get("lastName"));
            }
            if (updateData.containsKey("phone")) {
                user.setPhone((String) updateData.get("phone"));
            }
            if (updateData.containsKey("address")) {
                user.setAddress((String) updateData.get("address"));
            }
            if (updateData.containsKey("bio")) {
                user.setBio((String) updateData.get("bio"));
            }
            if (updateData.containsKey("degree")) {
                user.setDegree((String) updateData.get("degree"));
            }
            if (updateData.containsKey("expertise")) {
                user.setExpertise((String) updateData.get("expertise"));
            }
            
            // Update consultation fee (for consultants)
            if (updateData.containsKey("consultationFee")) {
                Object feeValue = updateData.get("consultationFee");
                if (feeValue instanceof Number) {
                    java.math.BigDecimal fee = java.math.BigDecimal.valueOf(((Number) feeValue).doubleValue());
                    user.setConsultationFee(fee);
                }
            }
            
            // Save updated user
            User updatedUser = userService.saveUser(user);
            UserDTO updatedUserDTO = userService.convertToDTO(updatedUser);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", updatedUserDTO,
                "message", "Profile updated successfully"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "error", "Failed to update profile",
                "details", e.getMessage()
            ));
        }
    }
} 