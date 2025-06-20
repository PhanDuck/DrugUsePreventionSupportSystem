package com.drugprevention.drugbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.drugprevention.drugbe")
@EntityScan("com.drugprevention.drugbe.entity")
@EnableJpaRepositories("com.drugprevention.drugbe.repository")
public class DrugBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrugBeApplication.class, args);
    }

}
