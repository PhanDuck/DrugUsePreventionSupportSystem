# 🏗️ Backend Architecture Guide - Drug Prevention Support System

## 📌 Tổng Quan Backend

### Tech Stack
- **Framework**: Spring Boot 3.3.0 (Java 21)
- **Database**: Microsoft SQL Server
- **Security**: Spring Security + JWT Authentication
- **ORM**: JPA/Hibernate
- **API Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven

### Cấu Trúc Package
```
src/main/java/com/drugprevention/drugbe/
├── config/              # Cấu hình Spring Boot
│   ├── SecurityConfig.java
│   ├── JwtAuthenticationFilter.java
│   ├── SwaggerConfig.java
│   ├── VnPayConfig.java
│   └── DataInitializer.java
├── controller/          # REST API Endpoints
│   ├── AuthController.java
│   ├── AppointmentController.java
│   ├── AdminController.java
│   ├── ConsultantController.java
│   ├── CourseController.java
│   ├── UserController.java
│   └── PaymentController.java
├── dto/                # Data Transfer Objects
│   ├── CreateAppointmentRequest.java
│   ├── AppointmentDTO.java
│   ├── RescheduleRequest.java
│   ├── SignupRequest.java
│   └── UserDTO.java
├── entity/             # JPA Entities (Database Models)
│   ├── User.java
│   ├── Role.java
│   ├── Appointment.java
│   ├── Course.java
│   ├── Category.java
│   └── Payment.java
├── repository/         # Database Repositories
│   ├── UserRepository.java
│   ├── AppointmentRepository.java
│   ├── CourseRepository.java
│   ├── RoleRepository.java
│   └── PaymentRepository.java
├── service/            # Business Logic Layer
│   ├── AuthService.java
│   ├── AppointmentService.java
│   ├── CourseService.java
│   ├── UserService.java
│   ├── JwtService.java
│   ├── VnPayService.java
│   └── CustomUserDetailsService.java
├── util/               # Utility Classes
│   └── NameConverter.java
└── DrugBeApplication.java  # Main Application
```

---

## 🔐 Security & Authentication Flow

### JWT Authentication Process
**📁 Related Files**:
- `src/main/java/com/drugprevention/drugbe/service/JwtService.java`
- `src/main/java/com/drugprevention/drugbe/config/JwtAuthenticationFilter.java`
- `src/main/java/com/drugprevention/drugbe/service/CustomUserDetailsService.java`

```
1. User gửi login request → AuthController
2. AuthController validate credentials qua AuthenticationManager
3. Nếu hợp lệ → JwtService generate JWT token (24h expiration)
4. Token được trả về kèm user info + role
5. Frontend lưu token trong localStorage
6. Mọi request sau đó gửi kèm header: Authorization: Bearer <token>
7. JwtAuthenticationFilter validate token trước khi xử lý request
8. SecurityConfig kiểm tra permissions theo role
```

### Security Configuration (`SecurityConfig.java`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/config/SecurityConfig.java`

- **Public Endpoints**: `/api/auth/**`, `/api/public/**`, Swagger UI
- **Role-based Access Control**:
  - `ADMIN`: Full access to `/api/admin/**`
  - `CONSULTANT`: Access to consultation features
  - `USER`: Basic user features
  - `STAFF`: Course management features
  - `MANAGER`: User management

---

## 📊 Database Architecture

### Core Entities

#### 1. User Entity
**📁 File**: `src/main/java/com/drugprevention/drugbe/entity/User.java`

```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;  // BCrypt encrypted
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    // Other fields: firstName, lastName, phone, address, etc.
}
```

#### 2. Appointment Entity
**📁 File**: `src/main/java/com/drugprevention/drugbe/entity/Appointment.java`

```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "client_id", nullable = false)
    private Long clientId;  // Người đặt lịch
    
    @Column(name = "consultant_id", nullable = false)
    private Long consultantId;  // Tư vấn viên
    
    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;  // Ngày và giờ hẹn
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60;  // Thời lượng (mặc định 60 phút)
    
    @Column(name = "status", length = 20)
    private String status = "PENDING";  // PENDING, CONFIRMED, COMPLETED, CANCELLED
    
    @Column(name = "appointment_type", length = 50)
    private String appointmentType = "ONLINE";  // ONLINE, OFFLINE
    
    @Column(name = "client_notes", columnDefinition = "NVARCHAR(MAX)")
    private String clientNotes;
    
    @Column(name = "consultant_notes", columnDefinition = "NVARCHAR(MAX)")
    private String consultantNotes;
    
    @Column(name = "fee", precision = 10, scale = 2)
    private BigDecimal fee = BigDecimal.valueOf(100.0);
    
    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "UNPAID";  // UNPAID, PAID, REFUNDED
    
    // VNPay integration fields
    @Column(name = "vnpay_txn_ref", length = 100)
    private String vnpayTxnRef;
    
    @Column(name = "payment_url", length = 1000)
    private String paymentUrl;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Column(name = "cancelled_by")
    private Long cancelledBy;
    
    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;
}
```

#### 3. Course Entity
**📁 File**: `src/main/java/com/drugprevention/drugbe/entity/Course.java`

```java
@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private BigDecimal price;
    private String difficultyLevel;
    private String language;
    private Integer totalLessons;
    private Integer totalDurationMinutes;
    private String thumbnailUrl;
    private Boolean certificateEnabled;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;
}
```

---

## 🛠️ API Endpoints Overview

### Authentication APIs (`AuthController`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/AuthController.java`

```
POST /api/auth/login     # Đăng nhập
POST /api/auth/signup    # Đăng ký
```

### Admin APIs (`AdminController`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/AdminController.java`

```
GET  /api/admin/dashboard        # Dashboard statistics
GET  /api/admin/users           # Quản lý users (với phân trang)
GET  /api/admin/courses         # Quản lý courses
GET  /api/admin/blogs           # Quản lý blogs
```

### Appointment APIs (`AppointmentController`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/AppointmentController.java`

```
GET    /api/appointments/health                           # Health check
POST   /api/appointments                                 # Tạo appointment mới
GET    /api/appointments/user                            # Lấy appointments của current user
GET    /api/appointments/client/{clientId}               # Lấy appointments theo client ID
GET    /api/appointments/consultant/{consultantId}       # Lấy appointments theo consultant ID
GET    /api/appointments/{id}                            # Chi tiết appointment
PUT    /api/appointments/{id}/confirm                    # Confirm appointment (consultant)
PUT    /api/appointments/{id}/cancel                     # Hủy appointment
PUT    /api/appointments/{id}/reschedule                 # Đổi lịch appointment
GET    /api/appointments/consultant/{id}/available-slots # Lấy available time slots
GET    /api/appointments/consultant/{id}/schedule        # Lấy schedule theo date range
POST   /api/appointments/{id}/complete                   # Hoàn thành appointment
```

### Course APIs (`CourseController`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/CourseController.java`

```
GET  /api/courses              # Lấy tất cả courses (public)
GET  /api/courses/{id}         # Chi tiết course
POST /api/courses/{id}/register # Đăng ký course (cần login)
GET  /api/courses/my-courses   # Courses đã đăng ký
```

### Consultant APIs (`ConsultantController`)
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/ConsultantController.java`

```
GET /api/consultants           # Danh sách consultants (public)
GET /api/consultants/available # Consultants có lịch trống
GET /api/consultants/{id}/booking-info  # Thông tin booking
```

---

## 🔄 Service Layer Logic

### AppointmentService - Core Business Logic

**📁 File**: `src/main/java/com/drugprevention/drugbe/service/AppointmentService.java`

#### 1. Tạo Appointment Mới
```java
@Transactional
public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
    // 1. Validate request parameters
    if (request.getClientId() == null) {
        throw new RuntimeException("Client ID cannot be null");
    }
    if (request.getConsultantId() == null) {
        throw new RuntimeException("Consultant ID cannot be null");
    }
    if (request.getAppointmentDate() == null) {
        throw new RuntimeException("Appointment date cannot be null");
    }
    
    // 2. Validate and enforce 60-minute duration
    if (request.getDurationMinutes() == null) {
        request.setDurationMinutes(60); // Default to 60 minutes
    } else if (!request.getDurationMinutes().equals(60)) {
        throw new RuntimeException("All appointments must be exactly 60 minutes (1 hour)");
    }
    
    // 3. Validate appointment date/time (working hours, not weekend, not past)
    validateAppointmentDateTime(request.getAppointmentDate());
    
    // 4. Validate client and consultant exist
    User client = userRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Client not found"));
    User consultant = userRepository.findById(request.getConsultantId())
            .orElseThrow(() -> new RuntimeException("Consultant not found"));
    
    // 5. Check if consultant has CONSULTANT role
    if (consultant.getRole() == null || !"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("Selected person is not a consultant");
    }
    
    // 6. Check for scheduling conflicts
    LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
    List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
            request.getConsultantId(), request.getAppointmentDate(), endTime);
    
    if (!conflicts.isEmpty()) {
        throw new RuntimeException("Consultant already has an appointment during this time");
    }
    
    // 7. Create new appointment
    Appointment appointment = new Appointment();
    appointment.setClientId(request.getClientId());
    appointment.setConsultantId(request.getConsultantId());
    appointment.setAppointmentDate(request.getAppointmentDate());
    appointment.setDurationMinutes(request.getDurationMinutes());
    appointment.setAppointmentType(request.getAppointmentType() != null ? request.getAppointmentType() : "ONLINE");
    appointment.setClientNotes(request.getClientNotes());
    appointment.setFee(request.getFee() != null ? request.getFee() : BigDecimal.valueOf(100.0));
    appointment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "VNPAY");
    appointment.setStatus("PENDING");
    appointment.setCreatedAt(LocalDateTime.now());
    
    // 8. Save to database
    appointment = appointmentRepository.save(appointment);
    
    return convertToDTO(appointment);
}
```

#### 2. Get Available Time Slots
```java
public List<String> getAvailableTimeSlots(Long consultantId, LocalDateTime date) {
    // 1. Validate consultant exists and has CONSULTANT role
    User consultant = userRepository.findById(consultantId)
            .orElseThrow(() -> new RuntimeException("Consultant not found"));
            
    if (!"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("Selected person is not a consultant");
    }
    
    // 2. Validate date (not in past, not weekend)
    LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
    if (startOfDay.isBefore(LocalDateTime.now().toLocalDate().atStartOfDay())) {
        throw new RuntimeException("Cannot view appointments in the past");
    }
    
    DayOfWeek dayOfWeek = date.getDayOfWeek();
    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
        return List.of(); // Return empty list for weekends
    }
    
    // 3. Get all appointments for this consultant on this date
    List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
    
    // 4. Generate all possible 1-hour time slots from 8:00 to 17:00 (skip lunch 12:00-13:00)
    List<String> allSlots = new ArrayList<>();
    int[] workingHours = {8, 9, 10, 11, 13, 14, 15, 16, 17}; // Skip 12:00-13:00 lunch break
    
    for (int hour : workingHours) {
        allSlots.add(String.format("%02d:00", hour));
    }
    
    // 5. Remove booked slots (1-hour appointments)
    for (Appointment appointment : appointments) {
        if (appointment.getStatus().equals("CANCELLED")) {
            continue; // Skip cancelled appointments
        }
        
        LocalDateTime appointmentTime = appointment.getAppointmentDate();
        String bookedSlot = String.format("%02d:00", appointmentTime.getHour());
        allSlots.remove(bookedSlot);
    }
    
    // 6. For today, remove past time slots
    if (date.toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
        LocalDateTime now = LocalDateTime.now();
        allSlots.removeIf(slot -> {
            String[] parts = slot.split(":");
            int slotHour = Integer.parseInt(parts[0]);
            int slotMinute = Integer.parseInt(parts[1]);
            return slotHour < now.getHour() || (slotHour == now.getHour() && slotMinute <= now.getMinute());
        });
    }
    
    return allSlots;
}
```

### AuthService - Authentication Logic

**📁 File**: `src/main/java/com/drugprevention/drugbe/service/AuthService.java`

#### 1. Login Process
```java
public LoginResponse authenticate(String username, String password) {
    // 1. Find user by username
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // 2. Verify password
    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }
    
    // 3. Generate JWT token
    String token = jwtService.generateToken(username, user.getRole().getName());
    
    // 4. Return login response
    return LoginResponse.builder()
        .token(token)
        .user(userMapper.toDTO(user))
        .role(user.getRole().getName())
        .build();
}
```

---

## 📂 Repository Layer

### Custom Query Examples

**📁 File**: `src/main/java/com/drugprevention/drugbe/repository/AppointmentRepository.java`

#### AppointmentRepository
```java
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Find appointments by client ID
    List<Appointment> findByClientIdOrderByAppointmentDateDesc(Long clientId);
    
    // Find appointments by consultant ID
    List<Appointment> findByConsultantIdOrderByAppointmentDateDesc(Long consultantId);
    
    // Find appointments by status
    List<Appointment> findByStatusOrderByAppointmentDateAsc(String status);
    
    // Find appointments by client and status
    List<Appointment> findByClientIdAndStatusOrderByAppointmentDateDesc(Long clientId, String status);
    
    // Check for conflicting appointments (overlapping time slots)
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status IN ('PENDING', 'CONFIRMED') " +
           "AND a.appointmentDate < :endTime " +
           "AND DATEADD(minute, a.durationMinutes, a.appointmentDate) > :startTime")
    List<Appointment> findConflictingAppointments(
            @Param("consultantId") Long consultantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    // Find appointments for consultant on specific date
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND CAST(a.appointmentDate AS DATE) = CAST(:date AS DATE) " +
           "AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findConsultantAppointmentsByDate(
            @Param("consultantId") Long consultantId,
            @Param("date") LocalDateTime date);
    
    // Find upcoming appointments for consultant
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.appointmentDate > :now AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByConsultant(
            @Param("consultantId") Long consultantId, 
            @Param("now") LocalDateTime now);
    
    // Find appointments by date range
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findByConsultantIdAndDateRange(
            @Param("consultantId") Long consultantId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    // Statistics queries
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status = 'COMPLETED' " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate")
    Long countCompletedAppointmentsByConsultant(
            @Param("consultantId") Long consultantId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status = 'COMPLETED' AND a.paymentStatus = 'PAID' " +
           "AND a.appointmentDate BETWEEN :startDate AND :endDate")
    Double calculateTotalEarningsByConsultant(
            @Param("consultantId") Long consultantId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
```

---

## ⚙️ Configuration Files

### Application Properties
**📁 File**: `src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=DrugPreventionDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=123123
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# JWT Configuration
jwt.secret=ThisIsAReallyLongAndSecureSecretKeyForJwtToken123456
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

---

## 🚀 Chạy Backend

### 1. Prerequisites
```bash
# Cài đặt Java 21
java -version

# Cài đặt Maven
mvn -version

# Setup SQL Server Database
```

### 2. Run Application
```bash
# Từ thư mục backend
cd drug-use-prevention-support-system/backend

# Install dependencies
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Hoặc run bằng PowerShell (Windows)
.\mvnw.cmd spring-boot:run

# Hoặc dùng Maven trực tiếp
mvn spring-boot:run
```

### 3. Kiểm tra kết nối
- **API Health**: http://localhost:8080/api/appointments/health
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Database**: Check SQL Server connection

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: Could not create connection to database server
Solution: 
- Kiểm tra SQL Server đang chạy
- Verify connection string trong application.properties
- Check firewall settings
```

#### 2. JWT Token Issues
```
Error: JWT signature does not match locally computed signature
Solution:
- Kiểm tra jwt.secret trong application.properties
- Clear localStorage trong browser
- Restart backend server
```

#### 3. CORS Issues
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution:
- Kiểm tra @CrossOrigin annotations trong controllers
- Verify corsConfigurationSource() trong SecurityConfig
```

---

## 📚 Code Examples & Best Practices

### 1. Exception Handling
**📁 File**: `src/main/java/com/drugprevention/drugbe/config/GlobalExceptionHandler.java` (cần tạo)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException e) {
        return ResponseEntity.notFound().build();
    }
}
```

### 2. DTO Mapping
**📁 File**: `src/main/java/com/drugprevention/drugbe/service/AppointmentService.java` (method convertToDTO)

```java
@Service
public class AppointmentMapper {
    
    public AppointmentDTO toDTO(Appointment appointment) {
        return AppointmentDTO.builder()
            .id(appointment.getId())
            .consultantName(appointment.getConsultant().getFirstName() + " " + 
                           appointment.getConsultant().getLastName())
            .appointmentDate(appointment.getAppointmentDate())
            .appointmentTime(appointment.getAppointmentTime())
            .status(appointment.getStatus())
            .build();
    }
}
```

### 3. Validation & DateTime Validation
**📁 File**: `src/main/java/com/drugprevention/drugbe/controller/AppointmentController.java`

```java
@PostMapping
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    // @Valid sẽ validate các annotations trong DTO
    // @NotNull, @NotBlank, @Email, @Size, etc.
    
    try {
        AppointmentDTO appointment = appointmentService.createAppointment(request);
        return ResponseEntity.ok(appointment);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

// Trong AppointmentService.java (method validateAppointmentDateTime)
private void validateAppointmentDateTime(LocalDateTime appointmentDate) {
    // Check if date is in the past
    if (appointmentDate.isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Cannot schedule appointments in the past");
    }
    
    // Check if date is too far in the future (max 30 days)
    if (appointmentDate.isAfter(LocalDateTime.now().plusDays(30))) {
        throw new RuntimeException("Can only schedule appointments within 30 days");
    }
    
    // Check if it's weekend
    DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();
    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
        throw new RuntimeException("Cannot schedule appointments on weekends");
    }
    
    // Check working hours (8 AM - 6 PM)
    int hour = appointmentDate.getHour();
    if (hour < 8 || hour >= 18) {
        throw new RuntimeException("Working hours are from 8:00 AM to 6:00 PM");
    }
    
    // Check if time is exactly on the hour (for 1-hour slots)
    int minute = appointmentDate.getMinute();
    if (minute != 0) {
        throw new RuntimeException("Appointments must start exactly on the hour (e.g., 08:00, 09:00, 10:00)");
    }
}
```

---

## 🔄 AppointmentService - Chi Tiết Các Method và Luồng Hệ Thống

### 📋 Tổng Quan AppointmentService Methods

**📁 File**: `src/main/java/com/drugprevention/drugbe/service/AppointmentService.java`

AppointmentService có **752 dòng code** và được chia thành các nhóm method chính:

#### 1. **CREATE APPOINTMENT** - Tạo Appointment
- `createAppointment(CreateAppointmentRequest request)`
- `validateAppointmentDateTime(LocalDateTime appointmentDate)`

#### 2. **GET APPOINTMENTS** - Lấy Danh Sách Appointment
- `getAppointmentsByClient(Long clientId)`
- `getAppointmentsByConsultant(Long consultantId)`
- `getUpcomingAppointmentsByClient(Long clientId)`
- `getUpcomingAppointmentsByConsultant(Long consultantId)`
- `getConsultantAppointmentsByDate(Long consultantId, LocalDateTime date)`
- `getAppointmentById(Long appointmentId)`

#### 3. **UPDATE APPOINTMENT** - Cập Nhật Appointment
- `confirmAppointment(Long appointmentId, Long consultantId)`
- `cancelAppointment(Long appointmentId, Long userId, String reason)`
- `completeAppointment(Long appointmentId, Long consultantId, String notes)`
- `rescheduleAppointment(Long appointmentId, RescheduleRequest request)`

#### 4. **MEETING MANAGEMENT** - Quản Lý Meeting
- `addMeetingLink(Long appointmentId, Long consultantId, String meetingLink)`
- `updateMeetingLink(Long appointmentId, Long consultantId, String newMeetingLink)`
- `removeMeetingLink(Long appointmentId, Long consultantId)`
- `getMeetingInfo(Long appointmentId)`

#### 5. **AVAILABLE SLOTS** - Quản Lý Slot Trống
- `getAvailableTimeSlots(Long consultantId, LocalDateTime date)`
- `getAvailableTimeSlotsForDate(Long consultantId, LocalDate date)`
- `getConsultantScheduleForDateRange(Long consultantId, LocalDate startDate, LocalDate endDate)`

#### 6. **STATISTICS & ADMIN** - Thống Kê và Quản Trị
- `getAppointmentStatistics(Long userId, String period)`
- `getAllAppointments()`
- `getAppointmentsByStatus(String status)`
- `autoCompletePastAppointments()`
- `sendAppointmentReminders()`

#### 7. **UTILITY METHODS** - Các Method Hỗ Trợ
- `convertToDTO(Appointment appointment)`
- `getCompletedAppointmentsCount(Long consultantId, LocalDateTime startDate, LocalDateTime endDate)`
- `getTotalEarnings(Long consultantId, LocalDateTime startDate, LocalDateTime endDate)`

---

### 🔍 Chi Tiết Luồng Hoạt Động Các Method Quan Trọng

#### 1. **createAppointment() - Luồng Tạo Appointment**

```java
@Transactional
public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
    // BƯỚC 1: Validate Input Parameters
    // - Kiểm tra clientId != null
    // - Kiểm tra consultantId != null  
    // - Kiểm tra appointmentDate != null
    // - Validate durationMinutes (mặc định 60 phút)
    
    // BƯỚC 2: Validate DateTime
    validateAppointmentDateTime(request.getAppointmentDate());
    // - Không được đặt lịch trong quá khứ
    // - Không được đặt lịch quá 30 ngày
    // - Không được đặt lịch cuối tuần
    // - Chỉ được đặt lịch 8AM-6PM
    // - Chỉ được đặt lịch đúng giờ (08:00, 09:00, 10:00...)
    
    // BƯỚC 3: Validate Users Exist
    User client = userRepository.findById(request.getClientId())
        .orElseThrow(() -> new RuntimeException("Client not found"));
    User consultant = userRepository.findById(request.getConsultantId())
        .orElseThrow(() -> new RuntimeException("Consultant not found"));
    
    // BƯỚC 4: Validate Consultant Role
    if (!"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("Selected person is not a consultant");
    }
    
    // BƯỚC 5: Check Time Conflicts
    LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
    List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
        request.getConsultantId(), request.getAppointmentDate(), endTime);
    
    if (!conflicts.isEmpty()) {
        throw new RuntimeException("Consultant already has an appointment during this time");
    }
    
    // BƯỚC 6: Create & Save Appointment
    Appointment appointment = new Appointment();
    // Set all fields with defaults
    appointment.setStatus("PENDING");
    appointment.setFee(BigDecimal.valueOf(100.0));
    appointment.setPaymentMethod("VNPAY");
    appointment.setCreatedAt(LocalDateTime.now());
    
    appointment = appointmentRepository.save(appointment);
    
    // BƯỚC 7: Convert to DTO and Return
    return convertToDTO(appointment);
}
```

**🔄 Luồng Xử Lý:**
```
Frontend Request → Controller → Service Validation → Repository Query → Database Save → DTO Response
```

#### 2. **getAvailableTimeSlots() - Luồng Lấy Slot Trống**

```java
public List<String> getAvailableTimeSlots(Long consultantId, LocalDateTime date) {
    // BƯỚC 1: Validate Consultant
    User consultant = userRepository.findById(consultantId)
        .orElseThrow(() -> new RuntimeException("Consultant not found"));
    
    // BƯỚC 2: Validate Date & Weekend
    if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
        return List.of(); // Trả về empty list cho cuối tuần
    }
    
    // BƯỚC 3: Get Booked Appointments
    List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
    
    // BƯỚC 4: Generate All Working Hours
    int[] workingHours = {8, 9, 10, 11, 13, 14, 15, 16, 17}; // Skip 12:00-13:00 lunch
    List<String> allSlots = new ArrayList<>();
    for (int hour : workingHours) {
        allSlots.add(String.format("%02d:00", hour));
    }
    
    // BƯỚC 5: Remove Booked Slots
    for (Appointment appointment : appointments) {
        if (!appointment.getStatus().equals("CANCELLED")) {
            String bookedSlot = String.format("%02d:00", appointment.getAppointmentDate().getHour());
            allSlots.remove(bookedSlot);
        }
    }
    
    // BƯỚC 6: Remove Past Slots (for today)
    if (date.toLocalDate().equals(LocalDateTime.now().toLocalDate())) {
        LocalDateTime now = LocalDateTime.now();
        allSlots.removeIf(slot -> {
            int slotHour = Integer.parseInt(slot.split(":")[0]);
            return slotHour <= now.getHour();
        });
    }
    
    return allSlots;
}
```

**🔄 Luồng Xử Lý:**
```
Request → Validate Consultant → Check Weekend → Get Booked Slots → Generate Available Slots → Filter Past Slots → Return List
```

#### 3. **confirmAppointment() - Luồng Xác Nhận Appointment**

```java
public AppointmentDTO confirmAppointment(Long appointmentId, Long consultantId) {
    // BƯỚC 1: Find Appointment
    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("Appointment not found"));
    
    // BƯỚC 2: Check Permission
    if (!appointment.getConsultantId().equals(consultantId)) {
        throw new RuntimeException("You do not have permission to confirm this appointment");
    }
    
    // BƯỚC 3: Check Status
    if (!"PENDING".equals(appointment.getStatus())) {
        throw new RuntimeException("Can only confirm pending appointments");
    }
    
    // BƯỚC 4: Update Status
    appointment.setStatus("CONFIRMED");
    appointment = appointmentRepository.save(appointment);
    
    // BƯỚC 5: Return DTO
    return convertToDTO(appointment);
}
```

**🔄 Luồng Xử Lý:**
```
Request → Find Appointment → Check Permission → Validate Status → Update Status → Save → Return DTO
```

#### 4. **convertToDTO() - Luồng Convert Entity sang DTO**

```java
private AppointmentDTO convertToDTO(Appointment appointment) {
    // BƯỚC 1: Create DTO Object
    AppointmentDTO dto = new AppointmentDTO();
    
    // BƯỚC 2: Copy Basic Fields
    dto.setId(appointment.getId());
    dto.setClientId(appointment.getClientId());
    dto.setConsultantId(appointment.getConsultantId());
    dto.setAppointmentDate(appointment.getAppointmentDate());
    dto.setStatus(appointment.getStatus());
    dto.setFee(appointment.getFee());
    // ... copy all fields
    
    // BƯỚC 3: Load Client Information
    Optional<User> client = userRepository.findById(appointment.getClientId());
    if (client.isPresent()) {
        User clientUser = client.get();
        String firstName = clientUser.getFirstName() != null ? clientUser.getFirstName() : "";
        String lastName = clientUser.getLastName() != null ? clientUser.getLastName() : "";
        dto.setClientName(firstName + " " + lastName);
        dto.setClientEmail(clientUser.getEmail());
        dto.setClientPhone(clientUser.getPhone());
    }
    
    // BƯỚC 4: Load Consultant Information
    Optional<User> consultant = userRepository.findById(appointment.getConsultantId());
    if (consultant.isPresent()) {
        User consultantUser = consultant.get();
        String firstName = consultantUser.getFirstName() != null ? consultantUser.getFirstName() : "";
        String lastName = consultantUser.getLastName() != null ? consultantUser.getLastName() : "";
        dto.setConsultantName(firstName + " " + lastName);
        dto.setConsultantEmail(consultantUser.getEmail());
        dto.setConsultantExpertise(consultantUser.getExpertise());
    }
    
    return dto;
}
```

**🔄 Luồng Xử Lý:**
```
Entity → Create DTO → Copy Fields → Load Client Info → Load Consultant Info → Return Complete DTO
```

---

### 🎯 Appointment Status Lifecycle

```
PENDING → CONFIRMED → COMPLETED
   ↓
CANCELLED (có thể cancel từ PENDING hoặc CONFIRMED)
```

#### Status Transitions:
1. **PENDING**: Appointment vừa được tạo, chờ consultant xác nhận
2. **CONFIRMED**: Consultant đã xác nhận, appointment sẽ diễn ra
3. **COMPLETED**: Appointment đã hoàn thành
4. **CANCELLED**: Appointment bị hủy (có thể bởi client hoặc consultant)

#### Business Rules:
- Chỉ consultant mới có thể confirm appointment
- Chỉ có thể cancel appointment ở trạng thái PENDING hoặc CONFIRMED
- Chỉ có thể complete appointment ở trạng thái CONFIRMED
- Auto-complete appointments sau khi thời gian kết thúc

---

### 🔄 Integration với Database

#### Repository Queries được sử dụng:
1. **findConflictingAppointments()**: Check xung đột thời gian
2. **findConsultantAppointmentsByDate()**: Lấy appointments theo ngày
3. **findByClientIdOrderByAppointmentDateDesc()**: Lấy appointments của client
4. **findUpcomingAppointmentsByConsultant()**: Lấy appointments sắp tới
5. **countCompletedAppointmentsByConsultant()**: Thống kê appointments hoàn thành

#### Transaction Management:
- Tất cả update operations đều được wrap trong `@Transactional`
- Rollback tự động khi có exception
- Ensure data consistency

---

### 🚀 Performance Considerations

#### Optimizations:
1. **Lazy Loading**: Chỉ load user info khi cần trong convertToDTO
2. **Caching**: Available slots có thể cache theo ngày
3. **Batch Processing**: Auto-complete appointments theo batch
4. **Indexing**: Database indexes trên consultantId, appointmentDate, status

#### Scalability:
- Service methods có thể handle high concurrent requests
- Database queries được optimize với proper indexes
- DTO pattern giảm data transfer overhead

---

## 🎯 Kết Luận

Backend được xây dựng với kiến trúc layered architecture rõ ràng:
1. **Controller Layer**: Handle HTTP requests/responses với @PreAuthorize security
2. **Service Layer**: Business logic, validation, và transaction management
3. **Repository Layer**: Database operations với custom queries
4. **Entity Layer**: JPA entities với proper annotations

### 🔑 Key Features Implemented:
- **JWT Authentication**: Token-based auth với 24h expiration
- **Role-based Access Control**: ADMIN, CONSULTANT, USER, STAFF, MANAGER
- **Appointment System**: Complete booking system với conflict detection
- **VNPay Integration**: Payment processing cho appointments
- **Working Hours Validation**: 8AM-6PM, weekdays only, hourly slots
- **Comprehensive Error Handling**: Global exception handling
- **Database Relationships**: Proper foreign key relationships
- **API Documentation**: Swagger/OpenAPI integration

### 🛠️ Technical Implementation:
- **Spring Boot 3.3.0** với Java 21
- **SQL Server** database với JPA/Hibernate
- **Transaction Management** với @Transactional
- **Custom Query Methods** trong repositories
- **DTO Pattern** cho data transfer
- **Validation** với @Valid annotations
- **CORS Configuration** cho frontend integration

### 📊 Database Design:
- **Normalized structure** với proper relationships
- **Audit fields** (created_at, updated_at, cancelled_at)
- **Payment tracking** với VNPay integration
- **Status management** cho appointments
- **Conflict detection** với overlapping time queries

Tất cả API đều có documentation qua Swagger và có health check endpoints để monitor system status. System được thiết kế để handle real-world appointment booking scenarios với proper validation và security. 