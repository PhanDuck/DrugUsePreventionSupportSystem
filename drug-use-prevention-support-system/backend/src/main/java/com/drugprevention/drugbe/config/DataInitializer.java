package com.drugprevention.drugbe.config;

import com.drugprevention.drugbe.entity.Role;
import com.drugprevention.drugbe.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing basic data...");
        createRolesIfNotExist();
        logger.info("Data initialization completed.");
    }
    
    private void createRolesIfNotExist() {
        String[] roleNames = {"ADMIN", "USER", "CONSULTANT", "MANAGER", "STAFF", "GUEST"};
        
        for (String roleName : roleNames) {
            if (!roleRepository.findByName(roleName).isPresent()) {
                Role role = new Role();
                role.setName(roleName);
                roleRepository.save(role);
                logger.info("Created role: {}", roleName);
            } else {
                logger.debug("Role already exists: {}", roleName);
            }
        }
    }
} 