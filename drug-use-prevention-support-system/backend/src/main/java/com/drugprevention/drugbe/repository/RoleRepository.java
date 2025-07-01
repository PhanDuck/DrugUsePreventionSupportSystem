package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    // Tìm Role theo tên
    Optional<Role> findByName(String name);
    
    // Kiểm tra Role có tồn tại không
    boolean existsByName(String name);
} 