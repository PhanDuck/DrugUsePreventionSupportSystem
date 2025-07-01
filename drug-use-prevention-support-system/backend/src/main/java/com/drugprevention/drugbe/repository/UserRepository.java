package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Tìm User theo username
    Optional<User> findByUsername(String username);
    
    // Tìm User theo email
    Optional<User> findByEmail(String email);
    
    // Kiểm tra User có tồn tại không theo username
    boolean existsByUsername(String username);
    
    // Kiểm tra User có tồn tại không theo email
    boolean existsByEmail(String email);
    
    // Tìm User theo role
    List<User> findByRoleId(Long roleId);
    
    // Tìm User theo active status
    List<User> findByIsActive(Boolean isActive);
    
    // Tìm User theo role name
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    // Tìm tất cả Consultants
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = 'CONSULTANT'")
    List<User> findConsultants();
    
    // Tìm User theo tên (first name hoặc last name)
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByName(@Param("name") String name);
    
    // Tìm User theo expertise
    List<User> findByExpertiseContaining(String expertise);
    
    // Tìm user theo từ khóa trong firstName, lastName, email
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:keyword% OR u.lastName LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> findByKeyword(@Param("keyword") String keyword);
    
    // Tìm user theo firstName/lastName hoặc email chứa keyword
    @Query("SELECT u FROM User u WHERE (u.firstName LIKE %:name% OR u.lastName LIKE %:name%) OR u.email LIKE %:email%")
    List<User> findByNameContainingOrEmailContaining(@Param("name") String name, @Param("email") String email);
    
    // Đếm user theo role
    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.role r GROUP BY r.name")
    List<Object[]> countUsersByRole();
    
    // Lấy tất cả chuyên gia active
    @Query("SELECT u FROM User u WHERE u.role.name = 'EXPERT' AND u.expertise IS NOT NULL AND u.isActive = true")
    List<User> findActiveExperts();
    
    // Count by role name and active status
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = :roleName AND u.isActive = :isActive")
    long countByRole_NameAndIsActive(@Param("roleName") String roleName, @Param("isActive") Boolean isActive);
    
    // Count by role name
    @Query("SELECT COUNT(u) FROM User u JOIN u.role r WHERE r.name = :roleName")
    long countByRole_Name(@Param("roleName") String roleName);
} 