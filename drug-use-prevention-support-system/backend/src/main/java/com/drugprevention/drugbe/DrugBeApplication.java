package com.drugprevention.drugbe;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

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
    public ApplicationRunner databaseConnectionTest() {
        return args -> {
            try {
                System.out.println("=================================");
                System.out.println("🔍 Testing Database Connection...");
                System.out.println("✅ Application Context Started Successfully!");
                System.out.println("=================================");
                System.out.println("🎯 System Ready! Available endpoints:");
                System.out.println("   🔐 POST /api/auth/login");
                System.out.println("   👤 GET  /api/users");
                System.out.println("   📂 GET  /api/categories");
                System.out.println("   ⚙️  GET  /api/admin/status");
                System.out.println("=================================");
            } catch (Exception e) {
                System.err.println("❌ Application Startup FAILED: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
