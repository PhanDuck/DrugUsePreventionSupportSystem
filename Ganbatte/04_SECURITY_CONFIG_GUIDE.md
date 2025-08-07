# 🔐 SECURITY & CONFIG - HƯỚNG DẪN BẢO MẬT HỆ THỐNG

## 🎯 TỔNG QUAN BẢO MẬT

Đây là hướng dẫn chi tiết về **cách thức hoạt động của hệ thống bảo mật** trong Drug Prevention Support System. Tài liệu này giúp cả 3 thành viên hiểu rõ luồng authentication, authorization và các cơ chế bảo vệ dữ liệu.

## 🏗️ KIẾN TRÚC BẢO MẬT TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                   │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │  FRONTEND   │───▶│   GATEWAY   │───▶│    BACKEND      │ │
│  │   (React)   │    │  (CORS +    │    │  (Spring Sec)   │ │
│  │             │    │   Headers)  │    │                 │ │
│  │ • JWT Token │    │             │    │ • JWT Validation│ │
│  │ • Auth State│    │             │    │ • Role Checks   │ │
│  │ • Route Guards    │             │    │ • @PreAuthorize │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    DATABASE LAYER                      │ │
│  │                                                         │ │
│  │  • Encrypted Passwords (BCrypt)                        │ │
│  │  • Role-based Data Access                              │ │
│  │  • SQL Injection Prevention                            │ │
│  │  • Data Validation & Constraints                       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 AUTHENTICATION FLOW CHI TIẾT

### **Luồng Đăng nhập hoàn chỉnh:**

```
┌─────────────────┐
│ 1. User nhập    │
│ username/pass   │
│ trên Frontend   │
└─────────┬───────┘
          │ POST /api/auth/login
          ▼
┌─────────────────┐
│ 2. AuthController│
│ nhận request    │
│ validate format │
└─────────┬───────┘
          │ LoginRequest DTO
          ▼
┌─────────────────┐
│ 3. AuthService  │
│ • Find user by  │
│   username      │
│ • Check password│
│   với BCrypt    │
└─────────┬───────┘
          │ User entity (if valid)
          ▼
┌─────────────────┐
│ 4. JwtService   │
│ • Generate JWT  │
│   token với:    │
│   - username    │
│   - roles       │
│   - expiration  │
└─────────┬───────┘
          │ JWT Token
          ▼
┌─────────────────┐
│ 5. Response     │
│ • JWT token     │
│ • User info     │
│ • Redirect info │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ 6. Frontend     │
│ • Store token   │
│   in localStorage│
│ • Set axios     │
│   default header│
│ • Redirect theo │
│   role          │
└─────────────────┘
```

### **Luồng Validate Token (mỗi API call):**

```
┌─────────────────┐
│ Frontend gửi    │
│ API request với │
│ Bearer token    │
└─────────┬───────┘
          │ Authorization: Bearer <token>
          ▼
┌─────────────────┐
│ Spring Security │
│ Filter Chain    │
│                 │
│ 1. Extract token│
│ 2. Validate JWT │
│ 3. Get username │
│ 4. Load UserDetails
└─────────┬───────┘
          │ Authentication object
          ▼
┌─────────────────┐
│ Controller      │
│ @PreAuthorize   │
│ annotation      │
│ checks roles    │
└─────────┬───────┘
          │ Authorized request
          ▼
┌─────────────────┐
│ Business Logic  │
│ executes        │
└─────────────────┘
```

## ⚙️ CÁC FILE CONFIGURATION QUAN TRỌNG

### **1. SecurityConfig.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/config/SecurityConfig.java`

**Chức năng:** Cấu hình toàn bộ Spring Security

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired  
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF cho REST API
            .csrf(csrf -> csrf.disable())
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure session management (stateless cho JWT)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Configure authorization rules
            .authorizeHttpRequests(authz -> authz
                // PUBLIC ENDPOINTS - no authentication required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/payment/vnpay-callback").permitAll()
                
                // COURSE MANAGEMENT - role-based access
                .requestMatchers(HttpMethod.POST, "/api/courses").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyRole("ADMIN", "MANAGER")
                
                // APPOINTMENT MANAGEMENT
                .requestMatchers("/api/appointments/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "MANAGER")
                .requestMatchers("/api/consultants/**").hasAnyRole("USER", "CONSULTANT", "ADMIN", "MANAGER")
                
                // COURSE REGISTRATION - users only
                .requestMatchers("/api/course-registrations/**").hasRole("USER")
                
                // STAFF OPERATIONS
                .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN", "MANAGER")
                
                // ADMIN OPERATIONS
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "MANAGER")
                
                // ALL OTHER REQUESTS - authenticated users
                .anyRequest().authenticated()
            )
            
            // Add JWT filter before UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // Configure exception handling
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                .accessDeniedHandler(jwtAccessDeniedHandler())
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins (frontend URL)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",    // React dev server
            "http://localhost:5173",    // Vite dev server  
            "https://yourdomain.com"    // Production frontend
        ));
        
        // Allow specific HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "Accept", "Origin", 
            "Access-Control-Request-Method", "Access-Control-Request-Headers"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // Strength 12 for security
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Unauthorized\", \"message\": \"" + 
                authException.getMessage() + "\"}"
            );
        };
    }

    @Bean
    public AccessDeniedHandler jwtAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"error\": \"Forbidden\", \"message\": \"" + 
                accessDeniedException.getMessage() + "\"}"
            );
        };
    }
}
```

### **2. JwtAuthenticationFilter.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/config/JwtAuthenticationFilter.java`

**Chức năng:** Filter để validate JWT token trên mỗi request

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // 1. Extract JWT token từ Authorization header
            String jwt = getJwtFromRequest(request);
            
            if (jwt != null && jwtService.validateToken(jwt)) {
                // 2. Get username từ token
                String username = jwtService.getUsernameFromToken(jwt);
                
                // 3. Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 4. Create authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                // 5. Set authentication context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // 6. Log successful authentication (optional)
                logger.debug("Successfully authenticated user: " + username);
            }
        } catch (Exception ex) {
            // Log error nhưng không block request
            logger.error("Could not set user authentication in security context", ex);
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip filter cho public endpoints
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || 
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/v3/api-docs/") ||
               (path.equals("/api/courses") && "GET".equals(request.getMethod()));
    }
}
```

### **3. JwtService.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/service/JwtService.java`

**Chức năng:** Service để tạo và validate JWT tokens

```java
@Service
public class JwtService {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private long jwtExpirationInMs;

    // Generate JWT token
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .claim("userId", userPrincipal.getId())
                .claim("role", userPrincipal.getAuthorities().iterator().next().getAuthority())
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // Generate token từ username (for refresh)
    public String generateTokenFromUsername(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationInMs);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // Get username từ token
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getSubject();
    }

    // Get user ID từ token
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        return Long.valueOf(claims.get("userId").toString());
    }

    // Get role từ token
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        return claims.get("role").toString();
    }

    // Validate token
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty");
        }
        return false;
    }

    // Get expiration date
    public Date getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        
        return claims.getExpiration();
    }

    // Check if token is expired
    public boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // Refresh token
    public String refreshToken(String token) {
        if (!validateToken(token)) {
            throw new RuntimeException("Invalid token for refresh");
        }
        
        String username = getUsernameFromToken(token);
        return generateTokenFromUsername(username);
    }
}
```

## 🛡️ ROLE-BASED ACCESS CONTROL

### **Roles và Permissions Matrix:**

| Role | Courses | Appointments | Users | Admin | Staff Functions |
|------|---------|-------------|-------|-------|----------------|
| **USER** | View, Register | Create, View Own | Update Own Profile | ❌ | ❌ |
| **CONSULTANT** | View | View Assigned, Complete | Update Own Profile | ❌ | ❌ |
| **STAFF** | Full CRUD | View All | View Profiles | Limited | Course Management |
| **ADMIN** | Full Control | Full Control | Full CRUD | Full Access | All Functions |
| **MANAGER** | Full Control | Full Control | Full CRUD | Full Access | All Functions |

### **@PreAuthorize Examples trong Controllers:**

```java
// Course Controller examples
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
@PostMapping
public ResponseEntity<Course> createCourse(@RequestBody Course course) {
    // Only STAFF+ can create courses
}

@PreAuthorize("@courseService.isInstructorOrAdmin(#id, authentication.name)")
@PutMapping("/{id}")
public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
    // Only course instructor or admin can update
}

// Appointment Controller examples
@PreAuthorize("hasRole('USER') or hasRole('CONSULTANT')")
@PostMapping
public ResponseEntity<Appointment> createAppointment(@RequestBody CreateAppointmentRequest request) {
    // Users can create, consultants can create for others
}

@PreAuthorize("@appointmentService.isOwnerOrConsultant(#id, authentication.name)")
@PutMapping("/{id}")
public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody UpdateAppointmentRequest request) {
    // Only appointment owner or assigned consultant can update
}

@PreAuthorize("hasRole('CONSULTANT')")
@PostMapping("/{id}/complete")
public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
    // Only consultants can mark appointments as complete
}

// User Controller examples
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
@GetMapping
public ResponseEntity<Page<User>> getAllUsers(Pageable pageable) {
    // Only admins can view all users
}

@PreAuthorize("@userService.isOwnerOrAdmin(#id, authentication.name)")
@PutMapping("/{id}")
public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
    // Users can update own profile, admins can update any
}
```

### **Custom Security Expressions:**

```java
// Trong CourseService
@Component
public class CourseService {
    
    public boolean isInstructorOrAdmin(Long courseId, String username) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return false;
        
        User currentUser = userRepository.findByUsername(username).orElse(null);
        if (currentUser == null) return false;
        
        // Check if user is instructor của course này
        if (course.getInstructor().getId().equals(currentUser.getId())) {
            return true;
        }
        
        // Check if user is admin/manager
        String role = currentUser.getRole().getName();
        return "ADMIN".equals(role) || "MANAGER".equals(role);
    }
}

// Trong AppointmentService  
@Component
public class AppointmentService {
    
    public boolean isOwnerOrConsultant(Long appointmentId, String username) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
        if (appointment == null) return false;
        
        // Check if user is owner hoặc consultant của appointment
        return appointment.getUser().getUsername().equals(username) ||
               appointment.getConsultant().getUsername().equals(username);
    }
}
```

## 🔒 PASSWORD SECURITY

### **Password Encoding:**

```java
// DataInitializer.java - tạo users với mật khẩu mã hóa
@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Tạo admin user
        if (!userRepository.findByUsername("admin").isPresent()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // BCrypt encoding
            admin.setEmail("admin@example.com");
            admin.setFullName("System Administrator");
            admin.setRole(adminRole);
            userRepository.save(admin);
        }
        
        // Tạo test users với passwords mã hóa
        createTestUser("testuser", "password123", "USER");
        createTestUser("consultant1", "consultant123", "CONSULTANT");
        createTestUser("staff1", "staff123", "STAFF");
    }
    
    private void createTestUser(String username, String rawPassword, String roleName) {
        if (!userRepository.findByUsername(username).isPresent()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(rawPassword)); // Always encode!
            user.setEmail(username + "@example.com");
            user.setFullName(username.toUpperCase());
            user.setRole(findRoleByName(roleName));
            userRepository.save(user);
        }
    }
}
```

### **Password Validation:**

```java
// AuthService.java - validate password khi login
@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public LoginResponse login(LoginRequest loginRequest) {
        // 1. Find user by username
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));
        
        // 2. Validate password using BCrypt
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        // 3. Check if account is active
        if (!user.isEnabled()) {
            throw new DisabledException("Account is disabled");
        }
        
        // 4. Generate JWT token
        String token = jwtService.generateToken(user);
        
        return new LoginResponse(token, convertToDTO(user));
    }
}
```

## 🌐 CORS CONFIGURATION

### **Frontend-Backend CORS Setup:**

```java
// SecurityConfig.java - CORS configuration
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Production: chỉ allow specific domains
    if (isProduction()) {
        configuration.setAllowedOrigins(Arrays.asList(
            "https://yourapp.com",
            "https://www.yourapp.com"
        ));
    } else {
        // Development: allow localhost
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*"
        ));
    }
    
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
    ));
    
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## 📝 APPLICATION PROPERTIES SECURITY

### **application.properties:**

```properties
# JWT Configuration
app.jwt.secret=mySecretKey123456789012345678901234567890
app.jwt.expiration=86400000

# Database connection với SSL
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=drug_prevention_db;encrypt=true;trustServerCertificate=true
spring.datasource.username=${DB_USERNAME:sa}
spring.datasource.password=${DB_PASSWORD:yourpassword}

# Hibernate settings
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Logging
logging.level.com.drugprevention.drugbe=INFO
logging.level.org.springframework.security=WARN
logging.level.org.springframework.web.cors=DEBUG

# Server configuration
server.port=8080
server.servlet.context-path=/

# File upload limits
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# VNPay configuration (sensitive - use environment variables)
vnpay.tmnCode=${VNPAY_TMN_CODE:}
vnpay.secretKey=${VNPAY_SECRET_KEY:}
vnpay.payUrl=${VNPAY_PAY_URL:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}
vnpay.returnUrl=${VNPAY_RETURN_URL:http://localhost:3000/payment/result}
```

### **Environment Variables cho Production:**

```bash
# Database
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits
JWT_EXPIRATION=86400000

# VNPay
VNPAY_TMN_CODE=your_vnpay_merchant_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_RETURN_URL=https://yourapp.com/payment/result

# Other
SPRING_PROFILES_ACTIVE=production
```

## 🛡️ SECURITY BEST PRACTICES

### **1. Input Validation:**

```java
// DTO validation với Bean Validation
public class CreateAppointmentRequest {
    
    @NotNull(message = "Consultant ID is required")
    @Positive(message = "Consultant ID must be positive")
    private Long consultantId;
    
    @NotNull(message = "Appointment time is required")
    @Future(message = "Appointment time must be in the future")
    private LocalDateTime appointmentTime;
    
    @NotBlank(message = "Appointment type is required")
    @Pattern(regexp = "ONLINE|OFFLINE", message = "Invalid appointment type")
    private String appointmentType;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
}

// Service validation
@Service
public class AppointmentService {
    
    public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
        // Additional business validation
        validateAppointmentTime(request.getAppointmentTime());
        validateConsultantAvailability(request.getConsultantId(), request.getAppointmentTime());
        
        // Process request...
    }
    
    private void validateAppointmentTime(LocalDateTime appointmentTime) {
        if (appointmentTime.isBefore(LocalDateTime.now().plusHours(1))) {
            throw new ValidationException("Appointment must be at least 1 hour in advance");
        }
        
        if (appointmentTime.getHour() < 8 || appointmentTime.getHour() >= 17) {
            throw new ValidationException("Appointments only available between 8 AM and 5 PM");
        }
    }
}
```

### **2. Error Handling:**

```java
// Global exception handler
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse(
            "ACCESS_DENIED",
            "You don't have permission to access this resource"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR", 
            ex.getMessage()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        // Don't expose internal database errors
        ErrorResponse error = new ErrorResponse(
            "DATA_ERROR",
            "Invalid data provided"
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

### **3. Logging & Monitoring:**

```java
// Security events logging
@Service
public class SecurityEventService {
    
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");
    
    public void logSuccessfulLogin(String username, String ipAddress) {
        securityLogger.info("Successful login - User: {}, IP: {}", username, ipAddress);
    }
    
    public void logFailedLogin(String username, String ipAddress, String reason) {
        securityLogger.warn("Failed login - User: {}, IP: {}, Reason: {}", username, ipAddress, reason);
    }
    
    public void logUnauthorizedAccess(String username, String resource, String ipAddress) {
        securityLogger.warn("Unauthorized access attempt - User: {}, Resource: {}, IP: {}", 
                          username, resource, ipAddress);
    }
}

// Audit logging cho sensitive operations
@Service
public class AuditService {
    
    public void logCourseCreation(Long courseId, String createdBy) {
        auditLogger.info("Course created - ID: {}, By: {}", courseId, createdBy);
    }
    
    public void logAppointmentCreation(Long appointmentId, String userUsername, String consultantUsername) {
        auditLogger.info("Appointment created - ID: {}, User: {}, Consultant: {}", 
                        appointmentId, userUsername, consultantUsername);
    }
}
```

## 🔧 DEBUGGING SECURITY ISSUES

### **Common Security Problems & Solutions:**

**1. CORS Issues:**
```bash
# Browser console error: "Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:3000' has been blocked by CORS policy"

# Solution: Check CORS configuration trong SecurityConfig
# Make sure allowedOrigins includes frontend URL
```

**2. 401 Unauthorized:**
```bash
# Check:
# 1. JWT token có được gửi không?
# 2. Token có expired không?
# 3. Token format có đúng không? (Bearer <token>)
# 4. Endpoint có cần authentication không?
```

**3. 403 Forbidden:**
```bash
# Check:
# 1. User role có phù hợp không?
# 2. @PreAuthorize expression có đúng không?
# 3. SecurityConfig rules có conflict không?
```

### **Debug Tools:**

```java
// Enable security debugging
@Configuration
@EnableWebSecurity(debug = true)  // Add debug = true
public class SecurityConfig {
    // ...
}

// Custom debug filter
@Component
public class DebugSecurityFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // Log request details
        logger.debug("Request: {} {}", httpRequest.getMethod(), httpRequest.getRequestURI());
        logger.debug("Authorization Header: {}", httpRequest.getHeader("Authorization"));
        
        // Log authentication context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            logger.debug("Authenticated User: {}", auth.getName());
            logger.debug("Authorities: {}", auth.getAuthorities());
        }
        
        chain.doFilter(request, response);
    }
}
```

---

**🔥 LỜI KHUYÊN BẢO MẬT QUAN TRỌNG:**
- Không bao giờ commit passwords hoặc secret keys vào Git
- Luôn validate input ở cả frontend và backend
- Sử dụng HTTPS trong production
- Regularly update dependencies để tránh security vulnerabilities
- Monitor logs để detect suspicious activities
- Implement rate limiting để tránh brute force attacks 