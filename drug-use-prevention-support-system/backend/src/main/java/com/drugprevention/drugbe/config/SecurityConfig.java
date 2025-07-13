package com.drugprevention.drugbe.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // ===== PUBLIC ENDPOINTS FIRST - NO AUTHENTICATION REQUIRED =====
                .requestMatchers("/api/auth/**").permitAll()  // Authentication endpoints
                .requestMatchers("/api/health/**").permitAll()  // Health check endpoints  
                .requestMatchers("/api/public/**").permitAll()  // Public API endpoints
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()  // Swagger
                .requestMatchers("/api/test-data/**").permitAll()  // Test data endpoints for development
                .requestMatchers("/api/test/**").permitAll()  // Debug endpoints for development
                
                // Public read-only endpoints  
                .requestMatchers("/api/categories").permitAll()  // Public can view categories
                .requestMatchers("/api/courses").permitAll()  // Public can view courses  
                .requestMatchers("/api/blogs").permitAll()  // Public can view blogs
                
                // Public assessment endpoints
                .requestMatchers("/api/assessments/health").permitAll()  // Assessment health check
                .requestMatchers("/api/assessments").permitAll()  // View available assessments
                .requestMatchers("/api/assessments/types").permitAll()  // View assessment types
                .requestMatchers("/api/assessments/*/questions").permitAll()  // View assessment questions
                .requestMatchers("/api/assessments/calculate").permitAll()  // Anonymous assessment calculation
                
                // Public appointment endpoints
                .requestMatchers("/api/appointments/health").permitAll()  // Appointment health check
                
                // ===== ROLE-BASED ENDPOINTS =====
                // Appointment endpoints - allow all authenticated users to access
                .requestMatchers("/api/appointments/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF")
                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "MANAGER")  // User management
                
                // Manager & Admin endpoints
                .requestMatchers("/api/categories/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")  // Category management
                
                // Consultant & Admin endpoints
                .requestMatchers("/api/consultant/**").hasAnyRole("CONSULTANT", "ADMIN")
                .requestMatchers("/api/recommendations/**").hasAnyRole("CONSULTANT", "ADMIN", "USER")  // Recommendations
                
                // Staff, Manager, Admin endpoints  
                .requestMatchers("/api/course-registrations/statistics").hasAnyRole("STAFF", "MANAGER", "ADMIN")
                
                // Authenticated user endpoints
                .requestMatchers("/api/assessments/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF")
                .requestMatchers("/api/assessment-results/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF")
                .requestMatchers("/api/courses/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF", "MANAGER")
                .requestMatchers("/api/course-registrations/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF")
                .requestMatchers("/api/blogs/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "STAFF", "MANAGER")
                
                // Default - require authentication for other endpoints
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 