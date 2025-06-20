package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.User;
import com.drugprevention.drugbe.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Tìm kiếm cơ bản
    Optional<User> findByUserName(String userName);
    Optional<User> findByEmail(String email);
    Optional<User> findByFirebaseToken(String firebaseToken);
    
    // Kiểm tra tồn tại
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    boolean existsByFirebaseToken(String firebaseToken);
    
    // Tìm theo Role
    List<User> findByRole(Role role);
    List<User> findByRole_RoleName(String roleName);
    
    // Tìm theo Status
    List<User> findByStatus(String status);
    
    // Tìm chuyên gia (experts) theo expertise
    @Query("SELECT u FROM User u WHERE u.expertise LIKE %:expertise% AND u.role.roleName = 'EXPERT'")
    List<User> findExpertsByExpertise(@Param("expertise") String expertise);
    
    // Tìm user theo từ khóa trong fullName, email, expertise
    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:keyword% OR u.email LIKE %:keyword% OR u.expertise LIKE %:keyword%")
    List<User> findByKeyword(@Param("keyword") String keyword);
    
    // Đếm user theo role
    @Query("SELECT r.roleName, COUNT(u) FROM User u JOIN u.role r GROUP BY r.roleName")
    List<Object[]> countUsersByRole();
    
    // Lấy tất cả chuyên gia có expertise và bio
    @Query("SELECT u FROM User u WHERE u.role.roleName = 'EXPERT' AND u.expertise IS NOT NULL AND u.bio IS NOT NULL")
    List<User> findActiveExperts();
} 