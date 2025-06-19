package com.drugprevention.drugbe.repository;

import com.drugprevention.drugbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
} 