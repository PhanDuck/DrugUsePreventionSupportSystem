package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    // Find Role by name
    Optional<Role> findByName(String name);
    
    // Check if Role exists
    boolean existsByName(String name);
} 