# 🔵 BACKEND - LUỒNG ĐẶT LỊCH HƯỚNG DẪN CHI TIẾT

## 🎯 TRÁCH NHIỆM CỦA BẠN

Bạn chịu trách nhiệm về **toàn bộ luồng đặt lịch tư vấn** trong hệ thống, bao gồm:
- Quản lý cuộc hẹn (Appointments)
- Quản lý thông tin chuyên gia tư vấn (Consultants) 
- Hệ thống đánh giá sau buổi tư vấn (Reviews)
- Notification và email thông báo

## 📁 CÁC FILE BẠN CẦN NẮMĐƯỢC

### 🎮 **CONTROLLERS (API Endpoints)**

#### **1. AppointmentController.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/AppointmentController.java`

**Chức năng chính:**
```java
// API endpoints mà bạn quản lý:
GET    /api/appointments              // Lấy danh sách appointments
POST   /api/appointments              // Tạo appointment mới  
GET    /api/appointments/{id}         // Lấy chi tiết 1 appointment
PUT    /api/appointments/{id}         // Cập nhật appointment
DELETE /api/appointments/{id}         // Xóa appointment
PUT    /api/appointments/{id}/reschedule  // Đổi lịch hẹn
POST   /api/appointments/{id}/complete   // Hoàn thành buổi hẹn
```

**Luồng hoạt động:**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│ AppointmentCtrl  │───▶│ AppointmentSvc  │
│   (React)       │    │                  │    │                 │
│                 │◀───│  Response JSON   │◀───│  Business Logic │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### **2. ConsultantController.java** 
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/ConsultantController.java`

**Chức năng chính:**
```java
// API endpoints cho consultant management:
GET    /api/consultants                    // Lấy danh sách chuyên gia
GET    /api/consultants/{id}               // Chi tiết chuyên gia
GET    /api/consultants/{id}/availability  // Lấy lịch trống của chuyên gia  
GET    /api/consultants/{id}/appointments  // Lịch hẹn của chuyên gia
PUT    /api/consultants/{id}/schedule      // Cập nhật lịch làm việc
```

#### **3. ReviewController.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/ReviewController.java`

**Chức năng chính:**
```java
// API endpoints cho review system:
POST   /api/reviews                 // Tạo đánh giá mới
GET    /api/reviews/appointment/{id} // Lấy review của appointment
GET    /api/reviews/consultant/{id}  // Lấy tất cả review của consultant
PUT    /api/reviews/{id}            // Cập nhật review
DELETE /api/reviews/{id}            // Xóa review
```

### ⚙️ **SERVICES (Business Logic)**

#### **AppointmentService.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/service/AppointmentService.java`

**Các method quan trọng bạn cần hiểu:**

```java
// Tạo appointment mới với validation
public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
    // 1. Validate user có quyền đặt lịch không
    // 2. Check consultant có available không  
    // 3. Validate thời gian đặt (không được quá khứ, không trùng lịch)
    // 4. Tạo appointment entity
    // 5. Save vào database
    // 6. Gửi notification
    // 7. Return DTO
}

// Cập nhật appointment 
public AppointmentDTO updateAppointment(Long id, UpdateAppointmentRequest request) {
    // 1. Check ownership (chỉ user tạo hoặc consultant được phép update)
    // 2. Validate new data
    // 3. Update entity  
    // 4. Save và return
}

// Reschedule appointment
public AppointmentDTO rescheduleAppointment(Long id, RescheduleRequest request) {
    // 1. Check appointment status (chỉ SCHEDULED mới reschedule được)
    // 2. Validate new time slot
    // 3. Check consultant availability  
    // 4. Update appointment
    // 5. Send notification về thay đổi
}

// Hoàn thành appointment
public AppointmentDTO completeAppointment(Long id) {
    // 1. Check chỉ consultant mới có thể complete
    // 2. Update status thành COMPLETED
    // 3. Trigger review process
    // 4. Update consultant statistics
}
```

**Validation Rules quan trọng:**
```java
// Thời gian validation
- appointmentTime phải > hiện tại + 1 giờ
- appointmentTime phải trong giờ làm việc (8:00-17:00)  
- appointmentTime không được trùng với appointment khác của consultant
- appointmentTime phải là multiple của 30 phút (VD: 9:00, 9:30, 10:00...)

// Permission validation  
- USER chỉ có thể tạo appointment cho chính họ
- CONSULTANT có thể view appointment của họ và update status
- ADMIN/MANAGER có thể view/update tất cả appointments
```

### 🗃️ **ENTITIES (Database Models)**

#### **Appointment.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/entity/Appointment.java`

**Cấu trúc Entity:**
```java
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne  // Many appointments -> One user
    @JoinColumn(name = "user_id")
    private User user;          // Người đặt lịch
    
    @ManyToOne  // Many appointments -> One consultant  
    @JoinColumn(name = "consultant_id")
    private User consultant;    // Chuyên gia tư vấn
    
    private LocalDateTime appointmentTime;  // Thời gian hẹn
    private String appointmentType;         // Loại tư vấn (ONLINE/OFFLINE)
    private String status;                  // SCHEDULED/COMPLETED/CANCELLED
    private String notes;                   // Ghi chú của user
    private String consultantNotes;         // Ghi chú của consultant
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters, setters, constructors...
}
```

**Appointment Status Flow:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  SCHEDULED  │───▶│  COMPLETED  │───▶│   REVIEWED  │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────┐
│  CANCELLED  │    │  RESCHEDULED│
└─────────────┘    └─────────────┘
```

#### **Review.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/entity/Review.java`

```java
@Entity  
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne  // One review -> One appointment
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @ManyToOne  // Many reviews -> One user (reviewer)
    @JoinColumn(name = "user_id") 
    private User user;
    
    @ManyToOne  // Many reviews -> One consultant (được review)
    @JoinColumn(name = "consultant_id")
    private User consultant;
    
    private Integer rating;        // 1-5 stars
    private String comment;        // Nội dung đánh giá
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 💾 **REPOSITORIES (Data Access)**

#### **AppointmentRepository.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/repository/AppointmentRepository.java`

**Custom Query Methods:**
```java
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Tìm appointments của 1 user
    List<Appointment> findByUserIdOrderByAppointmentTimeDesc(Long userId);
    
    // Tìm appointments của 1 consultant
    List<Appointment> findByConsultantIdOrderByAppointmentTimeDesc(Long consultantId);
    
    // Tìm appointments theo status
    List<Appointment> findByStatusOrderByAppointmentTimeDesc(String status);
    
    // Check conflict - tìm appointment trùng thời gian với consultant
    @Query("SELECT a FROM Appointment a WHERE a.consultant.id = :consultantId " +
           "AND a.appointmentTime = :appointmentTime AND a.status = 'SCHEDULED'")
    Optional<Appointment> findConflictingAppointment(
        @Param("consultantId") Long consultantId, 
        @Param("appointmentTime") LocalDateTime appointmentTime
    );
    
    // Thống kê appointments theo tháng
    @Query("SELECT MONTH(a.appointmentTime) as month, COUNT(a) as count " +
           "FROM Appointment a WHERE YEAR(a.appointmentTime) = :year " +
           "GROUP BY MONTH(a.appointmentTime)")
    List<Object[]> getAppointmentStatsByMonth(@Param("year") int year);
    
    // Tìm available time slots cho consultant
    @Query("SELECT a.appointmentTime FROM Appointment a WHERE a.consultant.id = :consultantId " +
           "AND DATE(a.appointmentTime) = DATE(:date) AND a.status = 'SCHEDULED'")
    List<LocalDateTime> getBookedTimeSlots(
        @Param("consultantId") Long consultantId,
        @Param("date") LocalDate date
    );
}
```

#### **ReviewRepository.java**  
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/repository/ReviewRepository.java`

```java
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Tìm review của appointment
    Optional<Review> findByAppointmentId(Long appointmentId);
    
    // Lấy tất cả reviews của consultant với pagination
    Page<Review> findByConsultantIdOrderByCreatedAtDesc(
        Long consultantId, Pageable pageable
    );
    
    // Tính rating trung bình của consultant
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.consultant.id = :consultantId")
    Double getAverageRatingByConsultantId(@Param("consultantId") Long consultantId);
    
    // Đếm số lượng reviews của consultant
    Long countByConsultantId(Long consultantId);
}
```

## 🔄 LUỒNG XỬ LÝ CHI TIẾT

### **1. LUỒNG TẠO APPOINTMENT MỚI**

```
┌─────────────────┐
│ 1. User Request │ 
│ (Frontend)      │
└─────────┬───────┘
          │ POST /api/appointments
          ▼
┌─────────────────┐
│ 2. Controller   │
│ Nhận request    │ 
│ Validate JWT    │
└─────────┬───────┘
          │ CreateAppointmentRequest DTO
          ▼
┌─────────────────┐
│ 3. Service      │
│ Business Logic  │
│ - Check user    │
│ - Validate time │ 
│ - Check conflict│
└─────────┬───────┘
          │ Appointment Entity
          ▼
┌─────────────────┐
│ 4. Repository   │
│ Save to DB      │
└─────────┬───────┘
          │ Saved Entity
          ▼
┌─────────────────┐
│ 5. Response     │
│ AppointmentDTO  │
│ + Notification  │
└─────────────────┘
```

**Chi tiết từng bước:**

**Bước 1 - Frontend Request:**
```javascript
// Frontend gửi request
const createAppointment = async (appointmentData) => {
    const response = await axios.post('/api/appointments', {
        consultantId: 14,
        appointmentTime: '2024-12-25T10:00:00',
        appointmentType: 'ONLINE',
        notes: 'Cần tư vấn về vấn đề stress'
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
```

**Bước 2 - Controller Processing:**
```java
@PostMapping
@PreAuthorize("hasRole('USER') or hasRole('CONSULTANT')")
public ResponseEntity<AppointmentDTO> createAppointment(
    @RequestBody CreateAppointmentRequest request,
    Authentication authentication
) {
    // Extract user từ JWT token
    String username = authentication.getName();
    
    // Validate request data
    if (request.getConsultantId() == null || request.getAppointmentTime() == null) {
        return ResponseEntity.badRequest().build();
    }
    
    // Call service
    AppointmentDTO appointment = appointmentService.createAppointment(request, username);
    
    return ResponseEntity.ok(appointment);
}
```

**Bước 3 - Service Business Logic:**
```java
public AppointmentDTO createAppointment(CreateAppointmentRequest request, String username) {
    // 1. Tìm user từ username
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // 2. Tìm consultant
    User consultant = userRepository.findById(request.getConsultantId())
        .orElseThrow(() -> new RuntimeException("Consultant not found"));
    
    // 3. Validate consultant role
    if (!consultant.getRole().getName().equals("CONSULTANT")) {
        throw new RuntimeException("Selected user is not a consultant");
    }
    
    // 4. Validate appointment time
    LocalDateTime appointmentTime = request.getAppointmentTime();
    if (appointmentTime.isBefore(LocalDateTime.now().plusHours(1))) {
        throw new RuntimeException("Appointment must be at least 1 hour in the future");
    }
    
    // 5. Check time conflict
    Optional<Appointment> conflict = appointmentRepository.findConflictingAppointment(
        consultant.getId(), appointmentTime
    );
    if (conflict.isPresent()) {
        throw new RuntimeException("Time slot is already booked");
    }
    
    // 6. Create new appointment
    Appointment appointment = new Appointment();
    appointment.setUser(user);
    appointment.setConsultant(consultant);
    appointment.setAppointmentTime(appointmentTime);
    appointment.setAppointmentType(request.getAppointmentType());
    appointment.setNotes(request.getNotes());
    appointment.setStatus("SCHEDULED");
    appointment.setCreatedAt(LocalDateTime.now());
    
    // 7. Save to database
    Appointment saved = appointmentRepository.save(appointment);
    
    // 8. Send notifications
    sendAppointmentNotification(saved);
    
    // 9. Convert to DTO và return
    return convertToDTO(saved);
}
```

### **2. LUỒNG RESCHEDULE APPOINTMENT**

```
┌─────────────────┐
│ User wants to   │
│ change time     │
└─────────┬───────┘
          │ PUT /api/appointments/{id}/reschedule
          ▼
┌─────────────────┐
│ Validate        │
│ - Ownership     │
│ - New time      │
│ - Availability  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Update DB       │
│ Send notification│
│ to both parties │
└─────────────────┘
```

### **3. LUỒNG COMPLETE APPOINTMENT**

```
┌─────────────────┐
│ Consultant      │
│ completes       │ 
│ session         │
└─────────┬───────┘
          │ POST /api/appointments/{id}/complete
          ▼
┌─────────────────┐
│ Update status   │
│ to COMPLETED    │
└─────────┬───────┘
          │
          ▼  
┌─────────────────┐
│ Trigger review  │
│ request to user │
└─────────────────┘
```

## 🔐 SECURITY & VALIDATION

### **Authentication & Authorization Rules:**

```java
// Trong AppointmentController
@PreAuthorize("hasRole('USER') or hasRole('CONSULTANT')")  // Tạo appointment
@PreAuthorize("hasRole('CONSULTANT')")                     // Complete appointment  
@PreAuthorize("@appointmentService.isOwnerOrConsultant(#id, authentication.name)")  // Update appointment
```

### **Validation Logic:**

```java
// Time validation
private void validateAppointmentTime(LocalDateTime appointmentTime) {
    // 1. Không được trong quá khứ
    if (appointmentTime.isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Cannot schedule appointment in the past");
    }
    
    // 2. Phải cách ít nhất 1 giờ
    if (appointmentTime.isBefore(LocalDateTime.now().plusHours(1))) {
        throw new RuntimeException("Appointment must be at least 1 hour in advance");
    }
    
    // 3. Trong giờ làm việc (8:00 - 17:00)
    int hour = appointmentTime.getHour();
    if (hour < 8 || hour >= 17) {
        throw new RuntimeException("Appointments only available between 8:00 AM and 5:00 PM");
    }
    
    // 4. Chỉ 30-minute slots (9:00, 9:30, 10:00...)
    if (appointmentTime.getMinute() != 0 && appointmentTime.getMinute() != 30) {
        throw new RuntimeException("Appointments must be scheduled on 30-minute intervals");
    }
}

// Ownership validation
public boolean isOwnerOrConsultant(Long appointmentId, String username) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElse(null);
    if (appointment == null) return false;
    
    return appointment.getUser().getUsername().equals(username) ||
           appointment.getConsultant().getUsername().equals(username);
}
```

## 📧 NOTIFICATION SYSTEM

### **Email Templates:**

**1. Appointment Created:**
```java
private void sendAppointmentCreatedEmail(Appointment appointment) {
    // Gửi cho user
    emailService.sendEmail(
        appointment.getUser().getEmail(),
        "Xác nhận đặt lịch tư vấn",
        buildAppointmentCreatedTemplate(appointment)
    );
    
    // Gửi cho consultant  
    emailService.sendEmail(
        appointment.getConsultant().getEmail(),
        "Lịch hẹn mới được đặt",
        buildNewAppointmentTemplate(appointment)
    );
}
```

**2. Appointment Rescheduled:**
```java
private void sendRescheduleNotification(Appointment appointment, LocalDateTime oldTime) {
    String message = String.format(
        "Lịch hẹn đã được thay đổi từ %s sang %s", 
        oldTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
        appointment.getAppointmentTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
    );
    
    // Gửi cho cả 2 bên
    notificationService.sendToUser(appointment.getUser().getId(), message);
    notificationService.sendToUser(appointment.getConsultant().getId(), message);
}
```

## 🧪 TESTING GUIDELINES

### **Unit Tests cần viết:**

```java
@Test
void testCreateAppointment_Success() {
    // Given
    CreateAppointmentRequest request = new CreateAppointmentRequest();
    request.setConsultantId(14L);
    request.setAppointmentTime(LocalDateTime.now().plusDays(1));
    request.setAppointmentType("ONLINE");
    
    // Mock dependencies
    when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
    when(userRepository.findById(14L)).thenReturn(Optional.of(consultant));
    when(appointmentRepository.findConflictingAppointment(any(), any())).thenReturn(Optional.empty());
    when(appointmentRepository.save(any())).thenReturn(savedAppointment);
    
    // When
    AppointmentDTO result = appointmentService.createAppointment(request, "testuser");
    
    // Then
    assertThat(result).isNotNull();
    assertThat(result.getStatus()).isEqualTo("SCHEDULED");
    verify(appointmentRepository).save(any(Appointment.class));
}

@Test  
void testCreateAppointment_TimeConflict() {
    // Given - có appointment trùng giờ
    when(appointmentRepository.findConflictingAppointment(any(), any()))
        .thenReturn(Optional.of(existingAppointment));
    
    // When & Then
    assertThrows(RuntimeException.class, () -> {
        appointmentService.createAppointment(request, "testuser");
    });
}
```

### **Integration Tests:**

```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AppointmentControllerIT {
    
    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    void testCreateAppointment_E2E() throws Exception {
        // Test complete flow từ controller đến database
        mockMvc.perform(post("/api/appointments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }
}
```

## 🐛 COMMON ISSUES & TROUBLESHOOTING

### **1. Time Zone Issues:**
```java
// Luôn sử dụng UTC trong database, convert khi cần
LocalDateTime utcTime = appointmentTime.atZone(ZoneId.systemDefault())
    .withZoneSameInstant(ZoneOffset.UTC)
    .toLocalDateTime();
```

### **2. Concurrent Booking:**
```java
// Sử dụng database lock để tránh race condition
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT a FROM Appointment a WHERE a.consultant.id = :consultantId")
List<Appointment> findByConsultantIdWithLock(@Param("consultantId") Long consultantId);
```

### **3. Data Validation:**
```java
// Validate input ở nhiều layer
@Valid @RequestBody CreateAppointmentRequest request  // Controller layer
// + Service layer validation
// + Database constraints
```

## 📈 PERFORMANCE OPTIMIZATION

### **Database Indexing:**
```sql
-- Indexes cần tạo cho performance
CREATE INDEX idx_appointment_user_id ON appointments(user_id);
CREATE INDEX idx_appointment_consultant_id ON appointments(consultant_id);  
CREATE INDEX idx_appointment_time ON appointments(appointment_time);
CREATE INDEX idx_appointment_status ON appointments(status);
CREATE UNIQUE INDEX idx_appointment_consultant_time ON appointments(consultant_id, appointment_time) 
    WHERE status = 'SCHEDULED';
```

### **Caching Strategy:**
```java
// Cache consultant availability
@Cacheable(value = "consultant-availability", key = "#consultantId + '_' + #date")
public List<LocalTime> getAvailableTimeSlots(Long consultantId, LocalDate date) {
    // Implementation
}
```

## 🎯 NEXT STEPS & IMPROVEMENTS

1. **Real-time notifications** với WebSocket
2. **Calendar integration** (Google Calendar, Outlook)  
3. **Video call integration** cho online consultations
4. **Automated reminders** trước appointment
5. **Analytics dashboard** cho consultants
6. **Mobile push notifications**

---

**🔥 LỜI KHUYÊN QUAN TRỌNG:**
- Luôn test thoroughly với các edge cases về thời gian
- Logging chi tiết cho appointment operations  
- Handle timezone carefully khi deploy production
- Monitor database performance với appointment queries
- Backup strategy cho appointment data 