package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import com.drugprevention.drugbe.entity.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find User by username
    Optional<User> findByUsername(String username);
    
    // Find User by email
    Optional<User> findByEmail(String email);
    
    // Find User by phone
    Optional<User> findByPhone(String phone);
    
    // Find User by username or email
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    // Find User by role
    List<User> findByRole(Role role);
    
    // Find User by active status
    List<User> findByIsActiveTrue();
    
    // Find User by role name
    List<User> findByRoleName(String roleName);
    
    // Find all Consultants
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = 'CONSULTANT' AND u.isActive = true")
    List<User> findAllConsultants();
    
    // Find User by name (first name or last name)
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
    
    // Find User by expertise
    List<User> findByExpertiseContainingIgnoreCase(String expertise);
    
    // Find user by keyword in firstName, lastName, email
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> findByKeyword(@Param("keyword") String keyword);
    
    // Find user by firstName/lastName or email containing keyword
    @Query("SELECT u FROM User u WHERE (u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword%) OR u.email LIKE %:keyword%")
    List<User> findByFirstNameOrLastNameOrEmailContaining(@Param("keyword") String keyword);
    
    // Count user by role
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = :roleName")
    Long countByRoleName(@Param("roleName") String roleName);
    
    // Get all active experts
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = 'CONSULTANT' AND u.isActive = true")
    List<User> findAllActiveConsultants();
    
    // Find users by role ID
    List<User> findByRoleId(Long roleId);
    
    // Find consultants (alias for findAllConsultants)
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = 'CONSULTANT' AND u.isActive = true")
    List<User> findConsultants();
    
    // Find users by name or email containing keyword
    @Query("SELECT u FROM User u WHERE (u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword%) OR u.email LIKE %:keyword%")
    List<User> findByNameContainingOrEmailContaining(@Param("keyword") String keyword, @Param("keyword") String keyword2);
    
    // Count users by role
    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.role r GROUP BY r.name")
    List<Object[]> countUsersByRole();
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
} 