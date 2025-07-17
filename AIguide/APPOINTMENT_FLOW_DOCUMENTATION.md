# 📋 Luồng Đặt Lịch Appointment - Drug Use Prevention Support System

## 🏗️ Tổng Quan Hệ Thống

Hệ thống Drug Use Prevention Support System được xây dựng với kiến trúc **Full-Stack**:
- **Backend**: Spring Boot (Java 21) + Spring Security + JPA/Hibernate + SQL Server
- **Frontend**: React 19 + Vite + Ant Design + Axios
- **Database**: Microsoft SQL Server
- **Authentication**: JWT Token
- **Payment**: VNPay Integration

---

## 📦 Cấu Trúc Package & Dependencies

### Backend Dependencies (pom.xml)
```xml
<!-- Core Spring Boot -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Database -->
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <version>12.6.1.jre11</version>
</dependency>

<!-- JWT Authentication -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- API Documentation -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "antd": "^5.25.4",           // UI Components
    "axios": "^1.9.0",           // HTTP Client
    "react": "^19.1.0",          // React Framework
    "react-router-dom": "^7.6.2", // Routing
    "dayjs": "^1.11.0"           // Date/Time handling
  }
}
```

---

## 🔄 Luồng Đặt Lịch Appointment

### 1. **Frontend → Backend Communication**

#### 1.1 Axios Configuration (`frontend/src/config/axios.js`)
```javascript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json;charset=UTF-8',
  },
});

// Request interceptor - tự động thêm JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 1.2 Appointment Service (`frontend/src/services/appointmentService.js`)
```javascript
class AppointmentService {
  // Tạo appointment mới
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to create appointment'
      };
    }
  }

  // Lấy danh sách slot trống
  async getAvailableSlots(consultantId, date) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}/available-slots?date=${date}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load available slots'
      };
    }
  }
}
```

### 2. **Backend API Endpoints**

#### 2.1 Appointment Controller (`backend/src/main/java/com/drugprevention/drugbe/controller/AppointmentController.java`)

```java
@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointment Controller", description = "APIs for appointment management")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Tạo appointment mới
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        try {
            // Validate request
            if (request == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request cannot be null"));
            }
            
            AppointmentDTO appointment = appointmentService.createAppointment(request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Lấy danh sách appointment của user hiện tại
    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
    public ResponseEntity<?> getCurrentUserAppointments(Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = authService.findByUsername(username);
            List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(currentUser.getId());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // Lấy slot trống cho consultant
    @GetMapping("/consultant/{consultantId}/available-slots")
    public ResponseEntity<?> getAvailableSlots(@PathVariable Long consultantId, 
                                             @RequestParam String date) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
            List<String> slots = appointmentService.getAvailableTimeSlots(consultantId, dateTime);
            return ResponseEntity.ok(Map.of("availableSlots", slots));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
```

### 3. **Business Logic Layer**

#### 3.1 Appointment Service (`backend/src/main/java/com/drugprevention/drugbe/service/AppointmentService.java`)

```java
@Service
@Transactional
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    // Tạo appointment mới
    public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
        // 1. Validate request
        validateAppointmentRequest(request);
        
        // 2. Validate appointment date/time
        validateAppointmentDateTime(request.getAppointmentDate());
        
        // 3. Check if client and consultant exist
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        User consultant = userRepository.findById(request.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Consultant not found"));

        // 4. Check consultant role
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // 5. Check for scheduling conflicts
        LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
        List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                request.getConsultantId(), request.getAppointmentDate(), endTime);
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Consultant already has an appointment during this time");
        }

        // 6. Create new appointment
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

        appointment = appointmentRepository.save(appointment);
        
        return convertToDTO(appointment);
    }

    // Validate appointment date/time
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
        
        // Check if time is at 15-minute intervals
        int minute = appointmentDate.getMinute();
        if (minute % 15 != 0) {
            throw new RuntimeException("Time must be in 15-minute intervals (00, 15, 30, 45)");
        }
    }

    // Lấy danh sách slot trống
    public List<String> getAvailableTimeSlots(Long consultantId, LocalDateTime date) {
        // Validate consultant exists
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
                
        if (!"CONSULTANT".equals(consultant.getRole().getName())) {
            throw new RuntimeException("Selected person is not a consultant");
        }
        
        // Validate date
        LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
        if (startOfDay.isBefore(LocalDateTime.now().toLocalDate().atStartOfDay())) {
            throw new RuntimeException("Cannot view appointments in the past");
        }
        
        // Check if it's weekend
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return List.of(); // Return empty list for weekends
        }
        
        // Get all appointments for this consultant on this date
        List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
        
        // Generate all possible time slots from 8:00 to 17:00
        List<String> allSlots = new ArrayList<>();
        for (int hour = 8; hour < 18; hour++) {
            for (int minute = 0; minute < 60; minute += 15) {
                if (hour == 17 && minute > 0) {
                    break; // Last appointment can start at 5:00 PM
                }
                allSlots.add(String.format("%02d:%02d", hour, minute));
            }
        }
        
        // Remove booked slots
        for (Appointment appointment : appointments) {
            if (!"CANCELLED".equals(appointment.getStatus())) {
                LocalDateTime aptStart = appointment.getAppointmentDate();
                LocalDateTime aptEnd = aptStart.plusMinutes(appointment.getDurationMinutes());
                
                // Remove all slots that overlap with this appointment
                allSlots.removeIf(slot -> {
                    String[] timeParts = slot.split(":");
                    int slotHour = Integer.parseInt(timeParts[0]);
                    int slotMinute = Integer.parseInt(timeParts[1]);
                    LocalDateTime slotTime = date.toLocalDate().atTime(slotHour, slotMinute);
                    
                    return !slotTime.isBefore(aptStart) && slotTime.isBefore(aptEnd);
                });
            }
        }
        
        return allSlots;
    }
}
```

### 4. **Data Access Layer**

#### 4.1 Appointment Repository (`backend/src/main/java/com/drugprevention/drugbe/repository/AppointmentRepository.java`)

```java
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by client ID
    List<Appointment> findByClientIdOrderByAppointmentDateDesc(Long clientId);

    // Find appointments by consultant ID
    List<Appointment> findByConsultantIdOrderByAppointmentDateDesc(Long consultantId);

    // Find conflicting appointments
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.status NOT IN ('CANCELLED') " +
           "AND ((a.appointmentDate < :endTime AND a.appointmentDate >= :startTime) " +
           "OR (a.appointmentDate + a.durationMinutes > :startTime AND a.appointmentDate < :endTime))")
    List<Appointment> findConflictingAppointments(
            @Param("consultantId") Long consultantId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    // Find consultant appointments by date
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND DATE(a.appointmentDate) = DATE(:date) " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findConsultantAppointmentsByDate(
            @Param("consultantId") Long consultantId,
            @Param("date") LocalDateTime date);

    // Find upcoming appointments for a consultant
    @Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
           "AND a.appointmentDate > :now AND a.status IN ('PENDING', 'CONFIRMED') " +
           "ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointmentsByConsultant(
            @Param("consultantId") Long consultantId, 
            @Param("now") LocalDateTime now);
}
```

### 5. **Entity Model**

#### 5.1 Appointment Entity (`backend/src/main/java/com/drugprevention/drugbe/entity/Appointment.java`)

```java
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "consultant_id", nullable = false)
    private Long consultantId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 60;

    @Column(name = "status", length = 20)
    private String status = "PENDING"; // PENDING, CONFIRMED, COMPLETED, CANCELLED, RESCHEDULED

    @Column(name = "appointment_type", length = 50)
    private String appointmentType = "ONLINE"; // ONLINE, IN_PERSON

    @Column(name = "client_notes", columnDefinition = "NVARCHAR(MAX)")
    private String clientNotes;

    @Column(name = "consultant_notes", columnDefinition = "NVARCHAR(MAX)")
    private String consultantNotes;

    @Column(name = "meeting_link", length = 500)
    private String meetingLink;

    @Column(name = "fee", precision = 10, scale = 2)
    private BigDecimal fee = BigDecimal.valueOf(100.0);

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "UNPAID";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Payment related fields for VNPay integration
    @Column(name = "vnpay_txn_ref", length = 100)
    private String vnpayTxnRef;
    
    @Column(name = "vnpay_response_code", length = 10)
    private String vnpayResponseCode;
    
    @Column(name = "payment_url", length = 1000)
    private String paymentUrl;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // VNPAY, CASH, BANK_TRANSFER

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", insertable = false, updatable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id", insertable = false, updatable = false)
    private User consultant;

    // Constructors
    public Appointment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Business methods
    public void cancel(Long cancelledBy, String reason) {
        this.status = "CANCELLED";
        this.cancelledAt = LocalDateTime.now();
        this.cancelledBy = cancelledBy;
        this.cancellationReason = reason;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
```

### 6. **DTO (Data Transfer Object)**

#### 6.1 CreateAppointmentRequest (`backend/src/main/java/com/drugprevention/drugbe/dto/CreateAppointmentRequest.java`)

```java
public class CreateAppointmentRequest {
    
    @NotNull(message = "Client ID cannot be empty")
    private Long clientId;
    
    @NotNull(message = "Consultant ID cannot be empty")
    private Long consultantId;
    
    @NotNull(message = "Appointment date cannot be empty")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;
    
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer durationMinutes = 60;
    
    @Pattern(regexp = "^(ONLINE|IN_PERSON)$", message = "Appointment type must be ONLINE or IN_PERSON")
    private String appointmentType = "ONLINE";
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String clientNotes;
    
    @DecimalMin(value = "0.0", message = "Consultation fee cannot be negative")
    private BigDecimal fee = BigDecimal.valueOf(100.0);
    
    private String paymentMethod = "CASH";

    // Getters and Setters...
}
```

---

## 🔄 Luồng Hoạt Động Chi Tiết (Tiếng Việt)

### **1. Khi User Đặt Lịch - Từ Frontend Đến Backend**

#### **Bước 1: User nhập thông tin trên giao diện**
```javascript
// User chọn consultant và ngày trên form
const handleDateChange = (date) => {
  if (date && selectedConsultant) {
    // Gọi API để lấy danh sách slot trống
    loadAvailableSlots(selectedConsultant.id, date);
  }
};
```

#### **Bước 2: Frontend gọi API lấy slot trống**
```javascript
// appointmentService.js
async getAvailableSlots(consultantId, date) {
  try {
    // Gửi HTTP GET request đến backend
    const response = await api.get(`/appointments/consultant/${consultantId}/available-slots?date=${date}`);
    
    // Backend trả về danh sách slot trống
    return {
      success: true,
      data: response.data  // { availableSlots: ["08:00", "08:15", "09:00", ...] }
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Không thể load slot trống'
    };
  }
}
```

#### **Bước 3: Backend xử lý request lấy slot trống**
```java
// AppointmentController.java
@GetMapping("/consultant/{consultantId}/available-slots")
public ResponseEntity<?> getAvailableSlots(@PathVariable Long consultantId, 
                                         @RequestParam String date) {
    try {
        // Chuyển đổi string date thành LocalDateTime
        LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
        
        // Gọi service để tính toán slot trống
        List<String> slots = appointmentService.getAvailableTimeSlots(consultantId, dateTime);
        
        // Trả về JSON response
        return ResponseEntity.ok(Map.of("availableSlots", slots));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

#### **Bước 4: Service tính toán slot trống**
```java
// AppointmentService.java
public List<String> getAvailableTimeSlots(Long consultantId, LocalDateTime date) {
    // 1. Kiểm tra consultant có tồn tại không
    User consultant = userRepository.findById(consultantId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy consultant"));
    
    // 2. Kiểm tra có phải consultant không
    if (!"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("Người này không phải consultant");
    }
    
    // 3. Lấy tất cả appointment của consultant trong ngày này
    List<Appointment> appointments = appointmentRepository.findConsultantAppointmentsByDate(consultantId, date);
    
    // 4. Tạo danh sách tất cả slot có thể (8:00 - 17:00, mỗi 15 phút)
    List<String> allSlots = new ArrayList<>();
    for (int hour = 8; hour < 18; hour++) {
        for (int minute = 0; minute < 60; minute += 15) {
            if (hour == 17 && minute > 0) break;
            allSlots.add(String.format("%02d:%02d", hour, minute));
        }
    }
    
    // 5. Loại bỏ các slot đã được book
    for (Appointment appointment : appointments) {
        if (!"CANCELLED".equals(appointment.getStatus())) {
            // Tính thời gian bắt đầu và kết thúc của appointment
            LocalDateTime aptStart = appointment.getAppointmentDate();
            LocalDateTime aptEnd = aptStart.plusMinutes(appointment.getDurationMinutes());
            
            // Xóa các slot bị trùng
            allSlots.removeIf(slot -> {
                String[] timeParts = slot.split(":");
                int slotHour = Integer.parseInt(timeParts[0]);
                int slotMinute = Integer.parseInt(timeParts[1]);
                LocalDateTime slotTime = date.toLocalDate().atTime(slotHour, slotMinute);
                
                return !slotTime.isBefore(aptStart) && slotTime.isBefore(aptEnd);
            });
        }
    }
    
    return allSlots; // Trả về ["08:00", "08:15", "09:00", ...]
}
```

#### **Bước 5: Repository query database**
```java
// AppointmentRepository.java
@Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
       "AND DATE(a.appointmentDate) = DATE(:date) " +
       "ORDER BY a.appointmentDate ASC")
List<Appointment> findConsultantAppointmentsByDate(
        @Param("consultantId") Long consultantId,
        @Param("date") LocalDateTime date);
```

**SQL được tạo ra:**
```sql
SELECT * FROM appointments 
WHERE consultant_id = 2 
AND CAST(appointment_date AS DATE) = '2024-01-15'
ORDER BY appointment_date ASC;
```

### **2. Khi User Submit Form Đặt Lịch**

#### **Bước 1: Frontend gửi request tạo appointment**
```javascript
// User click "Đặt lịch" button
const handleBooking = async (values) => {
  try {
    // Kết hợp ngày và giờ thành format ISO
    const appointmentDateTime = values.appointmentDate.format('YYYY-MM-DD') + 'T' + values.appointmentTime + ':00';
    
    // Tạo object data để gửi lên backend
    const appointmentData = {
      clientId: currentUser.id,           // ID của user đang đăng nhập
      consultantId: selectedConsultant.id, // ID của consultant được chọn
      appointmentDate: appointmentDateTime, // "2024-01-15T14:00:00"
      durationMinutes: 60,                // Thời gian 60 phút
      appointmentType: values.appointmentType, // "ONLINE" hoặc "IN_PERSON"
      clientNotes: values.notes || '',    // Ghi chú của client
      paymentMethod: values.paymentMethod  // "VNPAY", "CASH", etc.
    };

    // Gọi API tạo appointment
    const result = await appointmentService.createAppointment(appointmentData);
    
    if (result.success) {
      message.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ sớm.');
    } else {
      message.error(result.message);
    }
  } catch (error) {
    message.error('Có lỗi xảy ra khi đặt lịch!');
  }
};
```

#### **Bước 2: Frontend service gửi HTTP POST**
```javascript
// appointmentService.js
async createAppointment(appointmentData) {
  try {
    // Gửi POST request đến /api/appointments
    const response = await api.post('/appointments', appointmentData);
    
    return {
      success: true,
      data: response.data  // AppointmentDTO từ backend
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Không thể tạo appointment'
    };
  }
}
```

#### **Bước 3: Backend Controller nhận request**
```java
// AppointmentController.java
@PostMapping
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    try {
        // Validate request data
        if (request == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Request không được null"));
        }
        
        if (request.getClientId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Client ID không được null"));
        }
        
        // Gọi service để tạo appointment
        AppointmentDTO appointment = appointmentService.createAppointment(request);
        
        // Trả về appointment đã tạo
        return ResponseEntity.ok(appointment);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi tạo appointment: " + e.getMessage()));
    }
}
```

#### **Bước 4: Service xử lý business logic**
```java
// AppointmentService.java
public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
    // 1. Validate request
    if (request == null) {
        throw new RuntimeException("Request không được null");
    }
    
    // 2. Validate date/time
    validateAppointmentDateTime(request.getAppointmentDate());
    
    // 3. Kiểm tra client và consultant có tồn tại không
    User client = userRepository.findById(request.getClientId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy client"));
    
    User consultant = userRepository.findById(request.getConsultantId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy consultant"));

    // 4. Kiểm tra consultant có role CONSULTANT không
    if (!"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("Người được chọn không phải consultant");
    }
    
    // 5. Kiểm tra client và consultant không phải cùng 1 người
    if (request.getClientId().equals(request.getConsultantId())) {
        throw new RuntimeException("Client và consultant không thể là cùng 1 người");
    }

    // 6. Kiểm tra xung đột lịch
    LocalDateTime endTime = request.getAppointmentDate().plusMinutes(request.getDurationMinutes());
    List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
            request.getConsultantId(), request.getAppointmentDate(), endTime);
    
    if (!conflicts.isEmpty()) {
        throw new RuntimeException("Consultant đã có lịch hẹn trong thời gian này");
    }

    // 7. Tạo appointment mới
    Appointment appointment = new Appointment();
    appointment.setClientId(request.getClientId());
    appointment.setConsultantId(request.getConsultantId());
    appointment.setAppointmentDate(request.getAppointmentDate());
    appointment.setDurationMinutes(request.getDurationMinutes());
    appointment.setAppointmentType(request.getAppointmentType() != null ? request.getAppointmentType() : "ONLINE");
    appointment.setClientNotes(request.getClientNotes());
    appointment.setFee(request.getFee() != null ? request.getFee() : BigDecimal.valueOf(100.0));
    appointment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "VNPAY");
    appointment.setStatus("PENDING"); // Trạng thái ban đầu

    // 8. Lưu vào database
    appointment = appointmentRepository.save(appointment);
    
    // 9. Convert thành DTO và trả về
    return convertToDTO(appointment);
}
```

#### **Bước 5: Validate date/time**
```java
private void validateAppointmentDateTime(LocalDateTime appointmentDate) {
    // Kiểm tra không đặt lịch trong quá khứ
    if (appointmentDate.isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Không thể đặt lịch trong quá khứ");
    }
    
    // Kiểm tra không đặt lịch quá xa (tối đa 30 ngày)
    if (appointmentDate.isAfter(LocalDateTime.now().plusDays(30))) {
        throw new RuntimeException("Chỉ có thể đặt lịch trong vòng 30 ngày");
    }
    
    // Kiểm tra không đặt lịch cuối tuần
    DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();
    if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
        throw new RuntimeException("Không thể đặt lịch vào cuối tuần");
    }
    
    // Kiểm tra giờ làm việc (8h - 18h)
    int hour = appointmentDate.getHour();
    if (hour < 8 || hour >= 18) {
        throw new RuntimeException("Giờ làm việc từ 8:00 đến 18:00");
    }
    
    // Kiểm tra thời gian phải là bội số của 15 phút
    int minute = appointmentDate.getMinute();
    if (minute % 15 != 0) {
        throw new RuntimeException("Thời gian phải là bội số của 15 phút (00, 15, 30, 45)");
    }
}
```

#### **Bước 6: Repository kiểm tra xung đột**
```java
// AppointmentRepository.java
@Query("SELECT a FROM Appointment a WHERE a.consultantId = :consultantId " +
       "AND a.status NOT IN ('CANCELLED') " +
       "AND ((a.appointmentDate < :endTime AND a.appointmentDate >= :startTime) " +
       "OR (a.appointmentDate + a.durationMinutes > :startTime AND a.appointmentDate < :endTime))")
List<Appointment> findConflictingAppointments(
        @Param("consultantId") Long consultantId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime);
```

**SQL được tạo ra:**
```sql
SELECT * FROM appointments 
WHERE consultant_id = 2 
AND status NOT IN ('CANCELLED')
AND (
    (appointment_date < '2024-01-15 15:00:00' AND appointment_date >= '2024-01-15 14:00:00')
    OR (appointment_date + duration_minutes > '2024-01-15 14:00:00' AND appointment_date < '2024-01-15 15:00:00')
);
```

#### **Bước 7: Lưu vào database**
```java
// Repository.save() sẽ tạo SQL INSERT
appointment = appointmentRepository.save(appointment);
```

**SQL INSERT được tạo ra:**
```sql
INSERT INTO appointments (
    client_id, consultant_id, appointment_date, duration_minutes,
    status, appointment_type, client_notes, fee, payment_method,
    created_at, updated_at
) VALUES (
    1, 2, '2024-01-15 14:00:00', 60,
    'PENDING', 'ONLINE', 'Cần tư vấn về stress', 100.00, 'VNPAY',
    GETDATE(), GETDATE()
);
```

### **3. Luồng Xác Thực (Authentication)**

#### **Bước 1: Frontend gửi token trong header**
```javascript
// axios.js - Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### **Bước 2: Backend JWT Filter xử lý**
```java
// JwtAuthenticationFilter.java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                              HttpServletResponse response, 
                              FilterChain filterChain) throws ServletException, IOException {
    
    final String authHeader = request.getHeader("Authorization");
    
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        filterChain.doFilter(request, response);
        return;
    }
    
    try {
        // Lấy token từ header
        final String jwt = authHeader.substring(7);
        
        // Giải mã token để lấy username
        final String username = jwtService.extractUsername(jwt);
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user details từ database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // Kiểm tra token có hợp lệ không
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Tạo authentication token
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    } catch (Exception e) {
        // Log error
    }
    
    filterChain.doFilter(request, response);
}
```

### **4. Luồng Thanh Toán (Payment)**

#### **Bước 1: Frontend gọi API tạo payment**
```javascript
// paymentService.js
async createVNPayPayment(paymentData) {
  try {
    const response = await api.post('/payments/vnpay/create', {
      appointmentId: 123,
      amount: 100000,
      userId: currentUser.id,
      description: "Thanh toán cho lịch hẹn"
    });
    
    return {
      success: true,
      data: response.data  // { paymentUrl: "https://sandbox.vnpayment.vn/...", amount: 100000 }
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Không thể tạo payment'
    };
  }
}
```

#### **Bước 2: Backend tạo VNPay payment**
```java
// PaymentController.java
@PostMapping("/vnpay/create")
public ResponseEntity<?> createVnPayPayment(@RequestBody Map<String, Object> request, Principal principal) {
    try {
        Long appointmentId = Long.valueOf(request.get("appointmentId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        String description = request.getOrDefault("description", "Payment for appointment").toString();

        // Tạo payment entity
        Payment payment = new Payment();
        payment.setUser(new User()); 
        payment.getUser().setId(userId);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setCurrency("VND");
        payment.setPaymentMethod("VNPAY");
        payment.setStatus("PENDING");
        payment.setDescription(description);
        payment.setCreatedAt(LocalDateTime.now());
        payment = paymentService.createPayment(payment);

        // Tạo params cho VNPay
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Amount", String.valueOf((long)(amount * 100))); // VNPay yêu cầu amount * 100
        vnpParams.put("vnp_TxnRef", payment.getId().toString());
        vnpParams.put("vnp_OrderInfo", description);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        // Tạo URL thanh toán VNPay
        String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
        payment.setPaymentUrl(paymentUrl);
        paymentService.createPayment(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentId", payment.getId());
        response.put("paymentUrl", paymentUrl);
        response.put("amount", amount);
        response.put("currency", "VND");
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

## 🚀 **Tóm Tắt Luồng Hoạt Động**

```
1. User chọn consultant và ngày
   ↓
2. Frontend gọi API lấy slot trống
   ↓
3. Backend query database → tính toán slot trống → trả về
   ↓
4. User chọn slot và submit form
   ↓
5. Frontend gửi POST request với appointment data
   ↓
6. Backend validate → check conflicts → save database
   ↓
7. Trả về appointment đã tạo
   ↓
8. User thanh toán (nếu cần)
   ↓
9. VNPay callback → update payment status
```

## 📁 **Các File Code Chính và Mối Quan Hệ**

```
Frontend:
├── src/
│   ├── pages/AppointmentPage.jsx          # Giao diện đặt lịch
│   ├── services/appointmentService.js      # Gọi API appointment
│   ├── services/paymentService.js          # Gọi API payment
│   └── config/axios.js                    # Cấu hình HTTP client

Backend:
├── src/main/java/com/drugprevention/drugbe/
│   ├── controller/
│   │   ├── AppointmentController.java      # API endpoints
│   │   └── PaymentController.java         # Payment endpoints
│   ├── service/
│   │   ├── AppointmentService.java        # Business logic
│   │   └── VnPayService.java             # Payment logic
│   ├── repository/
│   │   └── AppointmentRepository.java     # Database queries
│   ├── entity/
│   │   └── Appointment.java              # Database model
│   └── dto/
│       └── CreateAppointmentRequest.java  # Request data
```

**Mối quan hệ:**
- **Frontend** → **Axios** → **Backend Controller** → **Service** → **Repository** → **Database**
- **Database** → **Repository** → **Service** → **Controller** → **Frontend**

---

## 🔐 Security & Authentication

### 1. **JWT Token Authentication**

```java
// JWT Filter
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            final String jwt = authHeader.substring(7);
            final String username = jwtService.extractUsername(jwt);
            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Log error
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### 2. **Role-Based Authorization**

```java
// Controller level authorization
@PostMapping
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    // Only authenticated users with specified roles can create appointments
}

@PutMapping("/{appointmentId}/confirm")
@PreAuthorize("hasAnyRole('CONSULTANT', 'ADMIN')")
public ResponseEntity<?> confirmAppointment(@PathVariable Long appointmentId, @RequestParam Long consultantId) {
    // Only consultants and admins can confirm appointments
}
```

---

## 💳 Payment Integration (VNPay)

### 1. **Payment Controller**

```java
@PostMapping("/vnpay/create")
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN', 'STAFF')")
public ResponseEntity<?> createVnPayPayment(@RequestBody Map<String, Object> request, Principal principal) {
    try {
        Long appointmentId = Long.valueOf(request.get("appointmentId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        Long userId = Long.valueOf(request.get("userId").toString());
        String description = request.getOrDefault("description", "Payment for appointment").toString();

        // Tạo payment entity
        Payment payment = new Payment();
        payment.setUser(new User()); 
        payment.getUser().setId(userId);
        payment.setAmount(BigDecimal.valueOf(amount));
        payment.setCurrency("VND");
        payment.setPaymentMethod("VNPAY");
        payment.setStatus("PENDING");
        payment.setDescription(description);
        payment.setCreatedAt(LocalDateTime.now());
        payment = paymentService.createPayment(payment);

        // Tạo params cho VNPay
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Amount", String.valueOf((long)(amount * 100))); // VNPay yêu cầu amount * 100
        vnpParams.put("vnp_TxnRef", payment.getId().toString());
        vnpParams.put("vnp_OrderInfo", description);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        String paymentUrl = vnPayService.createPaymentUrl(vnpParams);
        payment.setPaymentUrl(paymentUrl);
        paymentService.createPayment(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentId", payment.getId());
        response.put("paymentUrl", paymentUrl);
        response.put("amount", amount);
        response.put("currency", "VND");
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

### 2. **Frontend Payment Service**

```javascript
class PaymentService {
  async createVNPayPayment(paymentData) {
    try {
      const response = await api.post('/payments/vnpay/create', paymentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to create VNPay payment'
      };
    }
  }
}
```

---

## 📊 Database Schema

### Appointments Table
```sql
CREATE TABLE appointments (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    client_id BIGINT NOT NULL,
    consultant_id BIGINT NOT NULL,
    appointment_date DATETIME2 NOT NULL,
    duration_minutes INT DEFAULT 60,
    status VARCHAR(20) DEFAULT 'PENDING',
    appointment_type VARCHAR(50) DEFAULT 'ONLINE',
    client_notes NVARCHAR(MAX),
    consultant_notes NVARCHAR(MAX),
    meeting_link VARCHAR(500),
    fee DECIMAL(10,2) DEFAULT 100.00,
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    payment_method VARCHAR(50),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    cancelled_at DATETIME2,
    cancelled_by BIGINT,
    cancellation_reason NVARCHAR(500),
    
    -- VNPay fields
    vnpay_txn_ref VARCHAR(100),
    vnpay_response_code VARCHAR(10),
    vnpay_transaction_no VARCHAR(100),
    vnpay_bank_code VARCHAR(20),
    payment_url VARCHAR(1000),
    paid_at DATETIME2,
    
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (consultant_id) REFERENCES users(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id)
);
```

---

## 🚀 Deployment & Running

### 1. **Backend (Spring Boot)**
```bash
# Navigate to backend directory
cd drug-use-prevention-support-system/backend

# Run with Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/drug-be-0.0.1-SNAPSHOT.jar
```

### 2. **Frontend (React + Vite)**
```bash
# Navigate to frontend directory
cd drug-use-prevention-support-system/frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### 3. **Database (SQL Server)**
```sql
-- Create database
CREATE DATABASE DrugPreventionDB;
GO

-- Use database
USE DrugPreventionDB;
GO

-- Run schema scripts
-- (appointments table, users table, etc.)
```

---

## 🔧 Configuration Files

### 1. **Backend Application Properties**
```properties
# Database Configuration
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=DrugPreventionDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword123!

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# JWT Configuration
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api
```

### 2. **Frontend Environment**
```javascript
// Vite config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

---

## 📝 Summary

Luồng đặt lịch appointment trong hệ thống hoạt động như sau:

1. **Frontend**: User chọn consultant → chọn ngày → load slot trống → submit form
2. **Backend**: Controller nhận request → Service validate → Repository save → Response
3. **Database**: Insert appointment record với status "PENDING"
4. **Security**: JWT authentication + Role-based authorization
5. **Payment**: VNPay integration cho thanh toán
6. **Validation**: Date/time validation, conflict checking, business rules

Hệ thống được thiết kế với kiến trúc layered, separation of concerns, và security best practices. 