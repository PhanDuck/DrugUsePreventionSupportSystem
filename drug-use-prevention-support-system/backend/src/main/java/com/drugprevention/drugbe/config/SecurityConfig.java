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
                // Public endpoints - no authentication required
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/*/health").permitAll()
                
                // Course registration endpoints - authenticated users
                .requestMatchers("/api/courses/*/register", "/api/courses/*/confirm-payment").authenticated()
                .requestMatchers("/api/course-registrations/**").authenticated()
                
                // Course CRUD endpoints - staff/admin/manager only
                .requestMatchers(HttpMethod.POST, "/api/courses").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                
                // Staff course management endpoints - staff/admin/manager only
                .requestMatchers("/api/staff/courses/**").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                
                // Assessments - staff and consultants can access
                .requestMatchers(HttpMethod.GET, "/api/assessments/**").hasAnyRole("STAFF", "ADMIN", "MANAGER", "CONSULTANT", "USER")
                .requestMatchers("/api/assessments/**").hasAnyRole("STAFF", "ADMIN", "MANAGER", "CONSULTANT")
                
                // Consultants - public list accessible, detailed management for staff+
                .requestMatchers(HttpMethod.GET, "/api/consultants/public/**").permitAll()
                .requestMatchers("/api/consultants/**").hasAnyRole("STAFF", "ADMIN", "MANAGER", "CONSULTANT")
                
                // Users endpoint - staff can manage users
                .requestMatchers("/api/users/**").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                
                // User-specific endpoints - authenticated users (can access own data)
                .requestMatchers(HttpMethod.GET, "/api/courses/registrations/user/**").authenticated()
                
                // Admin endpoints - admin/manager only
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "MANAGER")
                
                // All other endpoints require authentication
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