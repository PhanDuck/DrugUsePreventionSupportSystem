package com.drugprevention.drugbe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import com.drugprevention.drugbe.repository.UserRepository;
import com.drugprevention.drugbe.repository.RoleRepository;
import com.drugprevention.drugbe.repository.CategoryRepository;

@SpringBootApplication
@ComponentScan(basePackages = "com.drugprevention.drugbe")
@EntityScan("com.drugprevention.drugbe.entity")
@EnableJpaRepositories("com.drugprevention.drugbe.repository")
public class DrugBeApplication {

    public static void main(String[] args) {
        System.out.println("🚀 Starting Drug Prevention Support System Backend...");
        SpringApplication.run(DrugBeApplication.class, args);
    }

    @Bean
    public ApplicationRunner databaseConnectionTest(
            @Autowired UserRepository userRepository,
            @Autowired RoleRepository roleRepository,
            @Autowired CategoryRepository categoryRepository) {
        return args -> {
            try {
                System.out.println("=================================");
                System.out.println("🔍 Testing Database Connection...");
                
                // Test basic repositories
                long userCount = userRepository.count();
                long roleCount = roleRepository.count();
                long categoryCount = categoryRepository.count();
                
                System.out.println("✅ Database Connection SUCCESS!");
                System.out.println("📊 Database Statistics:");
                System.out.println("   👥 Users: " + userCount);
                System.out.println("   🏷️  Roles: " + roleCount);
                System.out.println("   📂 Categories: " + categoryCount);
                System.out.println("=================================");
                System.out.println("🎯 System Ready! Available endpoints:");
                System.out.println("   🔐 POST /api/auth/login");
                System.out.println("   👤 GET  /api/users");
                System.out.println("   📂 GET  /api/categories");
                System.out.println("   ⚙️  GET  /api/admin/status");
                System.out.println("=================================");
            } catch (Exception e) {
                System.err.println("❌ Database Connection FAILED: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
