package com.drugprevention.drugbe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        dataSource.setUrl("jdbc:sqlserver://localhost:1433;databaseName=DrugPreventionDB;encrypt=true;trustServerCertificate=true;characterEncoding=UTF-8;useUnicode=true;sendStringParametersAsUnicode=false");
        dataSource.setUsername("sa");
        dataSource.setPassword("123123");
        
        // Set additional properties for Unicode support
        Properties props = new Properties();
        props.setProperty("characterEncoding", "UTF-8");
        props.setProperty("useUnicode", "true");
        props.setProperty("sendStringParametersAsUnicode", "false");
        props.setProperty("serverTimezone", "Asia/Ho_Chi_Minh");
        dataSource.setConnectionProperties(props);
        
        return dataSource;
    }
} 