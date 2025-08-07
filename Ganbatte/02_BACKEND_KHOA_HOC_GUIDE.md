# 🟢 BACKEND - LUỒNG KHÓA HỌC HƯỚNG DẪN CHI TIẾT

## 🎯 TRÁCH NHIỆM CỦA BẠN

Bạn chịu trách nhiệm về **toàn bộ hệ thống quản lý khóa học** trong hệ thống, bao gồm:
- Quản lý khóa học (Courses) - CRUD operations
- Đăng ký khóa học (Course Registrations)
- Nội dung khóa học (Course Content & Lessons)
- Tiến độ học tập (Course Progress)
- Tích hợp thanh toán VNPay

## 📁 CÁC FILE BẠN CẦN NẮMĐƯỢC

### 🎮 **CONTROLLERS (API Endpoints)**

#### **1. CourseController.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/CourseController.java`

**Chức năng chính:**
```java
// API endpoints mà bạn quản lý:
GET    /api/courses                    // Lấy danh sách khóa học (public)
POST   /api/courses                    // Tạo khóa học mới (STAFF+)
GET    /api/courses/{id}               // Chi tiết khóa học
PUT    /api/courses/{id}               // Cập nhật khóa học (STAFF+)
DELETE /api/courses/{id}               // Xóa khóa học (ADMIN+)
GET    /api/courses/category/{categoryId}  // Khóa học theo danh mục
GET    /api/courses/featured           // Khóa học nổi bật
GET    /api/courses/search             // Tìm kiếm khóa học
```

**Phân quyền quan trọng:**
```java
// Public endpoints (không cần auth)
@GetMapping - Browse courses

// STAFF, ADMIN, MANAGER only
@PostMapping - Create course
@PutMapping - Update course

// ADMIN, MANAGER only  
@DeleteMapping - Delete course
```

#### **2. CourseRegistrationController.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/CourseRegistrationController.java`

**Chức năng chính:**
```java
// API endpoints cho đăng ký khóa học:
POST   /api/course-registrations/register/{courseId}     // Đăng ký khóa học
GET    /api/course-registrations/my-courses              // Khóa học của user
GET    /api/course-registrations/course/{courseId}       // Danh sách học viên
PUT    /api/course-registrations/{id}/progress           // Cập nhật tiến độ
DELETE /api/course-registrations/{id}                    // Hủy đăng ký
GET    /api/course-registrations/{id}/certificate        // Lấy chứng chỉ
```

#### **3. StaffCourseController.java**  
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/controller/StaffCourseController.java`

**Chức năng chính:**
```java
// API endpoints cho staff quản lý:
GET    /api/staff/courses                    // Khóa học do staff quản lý
POST   /api/staff/courses                    // Tạo khóa học mới
PUT    /api/staff/courses/{id}               // Cập nhật khóa học
GET    /api/staff/courses/{id}/students      // Danh sách học viên
GET    /api/staff/courses/{id}/statistics    // Thống kê khóa học
POST   /api/staff/courses/{id}/content       // Thêm nội dung
PUT    /api/staff/courses/content/{contentId} // Sửa nội dung
DELETE /api/staff/courses/content/{contentId} // Xóa nội dung
```

### ⚙️ **SERVICES (Business Logic)**

#### **CourseService.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/service/CourseService.java`

**Các method quan trọng:**

```java
// Tạo khóa học mới
public Course createCourse(Course course) {
    // 1. Validate course data
    validateCourseData(course);
    
    // 2. Set default values
    course.setCurrentParticipants(0);
    course.setStatus("open");
    course.setIsFeatured(false);
    course.setTotalReviews(0);
    course.setCreatedAt(LocalDateTime.now());
    
    // 3. Save to database
    Course saved = courseRepository.save(course);
    
    // 4. Create default course content structure
    createDefaultCourseStructure(saved);
    
    return saved;
}

// Cập nhật khóa học
public Course updateCourse(Long id, Course courseUpdate) {
    // 1. Check course exists
    Course existing = courseRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Course not found"));
    
    // 2. Check permission (chỉ instructor hoặc admin)
    validateUpdatePermission(existing, getCurrentUser());
    
    // 3. Update fields
    updateCourseFields(existing, courseUpdate);
    
    // 4. Save changes
    return courseRepository.save(existing);
}

// Tìm kiếm khóa học
public Page<Course> searchCourses(String query, String category, 
                                  String level, BigDecimal maxPrice, Pageable pageable) {
    // 1. Build search criteria
    CourseSearchCriteria criteria = CourseSearchCriteria.builder()
        .query(query)
        .category(category)
        .level(level)
        .maxPrice(maxPrice)
        .status("open")
        .build();
    
    // 2. Execute search với Specification
    return courseRepository.findAll(buildSpecification(criteria), pageable);
}

// Lấy khóa học nổi bật
public List<Course> getFeaturedCourses() {
    return courseRepository.findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc("open");
}
```

**Validation Rules quan trọng:**
```java
private void validateCourseData(Course course) {
    // 1. Title validation
    if (course.getTitle() == null || course.getTitle().trim().isEmpty()) {
        throw new ValidationException("Course title is required");
    }
    
    // 2. Price validation  
    if (course.getPrice() != null && course.getPrice().compareTo(BigDecimal.ZERO) < 0) {
        throw new ValidationException("Course price cannot be negative");
    }
    
    // 3. Duration validation
    if (course.getDurationWeeks() != null && course.getDurationWeeks() <= 0) {
        throw new ValidationException("Duration must be positive");
    }
    
    // 4. Max participants validation
    if (course.getMaxParticipants() != null && course.getMaxParticipants() <= 0) {
        throw new ValidationException("Max participants must be positive");
    }
    
    // 5. Category validation
    if (course.getCategory() != null) {
        categoryRepository.findById(course.getCategory().getId())
            .orElseThrow(() -> new ValidationException("Invalid category"));
    }
}
```

#### **CourseRegistrationService.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/service/CourseRegistrationService.java`

**Các method quan trọng:**

```java
// Đăng ký khóa học
@Transactional
public CourseRegistration registerForCourse(Long courseId, String username) {
    // 1. Tìm user và course
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Course not found"));
    
    // 2. Kiểm tra điều kiện đăng ký
    validateRegistrationEligibility(user, course);
    
    // 3. Kiểm tra đã đăng ký chưa
    Optional<CourseRegistration> existing = courseRegistrationRepository
        .findByUserIdAndCourseId(user.getId(), courseId);
    if (existing.isPresent()) {
        throw new RuntimeException("Already registered for this course");
    }
    
    // 4. Kiểm tra chỗ trống
    if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
        throw new RuntimeException("Course is full");
    }
    
    // 5. Tạo registration
    CourseRegistration registration = new CourseRegistration();
    registration.setUser(user);
    registration.setCourse(course);
    registration.setRegistrationDate(LocalDateTime.now());
    registration.setStatus("active");
    registration.setProgress(0);
    
    // 6. Xử lý thanh toán nếu cần
    if (course.getPrice().compareTo(BigDecimal.ZERO) > 0) {
        Payment payment = createCoursePayment(user, course);
        registration.setPayment(payment);
        registration.setStatus("pending_payment");
    }
    
    // 7. Save registration
    CourseRegistration saved = courseRegistrationRepository.save(registration);
    
    // 8. Cập nhật số lượng participants
    course.setCurrentParticipants(course.getCurrentParticipants() + 1);
    courseRepository.save(course);
    
    // 9. Tạo course progress tracking
    createInitialProgress(saved);
    
    return saved;
}

// Cập nhật tiến độ học tập
@Transactional
public CourseRegistration updateProgress(Long registrationId, int newProgress) {
    // 1. Tìm registration
    CourseRegistration registration = courseRegistrationRepository.findById(registrationId)
        .orElseThrow(() -> new RuntimeException("Registration not found"));
    
    // 2. Validate progress value
    if (newProgress < 0 || newProgress > 100) {
        throw new ValidationException("Progress must be between 0 and 100");
    }
    
    // 3. Check ownership
    String currentUser = getCurrentUsername();
    if (!registration.getUser().getUsername().equals(currentUser)) {
        throw new SecurityException("Cannot update other user's progress");
    }
    
    // 4. Update progress
    registration.setProgress(newProgress);
    registration.setLastAccessDate(LocalDateTime.now());
    
    // 5. Auto-complete nếu đạt 100%
    if (newProgress == 100 && !"completed".equals(registration.getStatus())) {
        registration.setStatus("completed");
        registration.setCompletionDate(LocalDateTime.now());
        
        // Generate certificate
        generateCertificate(registration);
    }
    
    return courseRegistrationRepository.save(registration);
}
```

### 🗃️ **ENTITIES (Database Models)**

#### **Course.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/entity/Course.java`

**Cấu trúc Entity:**
```java
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    private User instructor;        // Giảng viên (STAFF role)
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;      // Danh mục khóa học
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price;       // Giá khóa học
    
    private Integer durationWeeks;  // Thời lượng (tuần)
    private Integer maxParticipants; // Số lượng tối đa
    private Integer currentParticipants; // Số lượng hiện tại
    
    private String level;           // BEGINNER/INTERMEDIATE/ADVANCED
    private String status;          // open/closed/cancelled
    private Boolean isFeatured;     // Khóa học nổi bật
    
    @Column(length = 500)
    private String imageUrl;        // Ảnh thumbnail
    
    private Integer totalReviews;   // Số lượng đánh giá
    private Double averageRating;   // Điểm trung bình
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")  
    private LocalDateTime updatedAt;
    
    // One-to-Many relationships
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseRegistration> registrations = new ArrayList<>();
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CourseContent> contents = new ArrayList<>();
    
    // Getters, setters, constructors...
}
```

#### **CourseRegistration.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/entity/CourseRegistration.java`

```java
@Entity
@Table(name = "course_registrations")
@IdClass(CourseRegistrationId.class)
public class CourseRegistration {
    @Id
    private Long userId;
    
    @Id  
    private Long courseId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @MapsId("userId")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @MapsId("courseId")  
    private Course course;
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    
    private String status;          // active/completed/cancelled/pending_payment
    
    private Integer progress;       // 0-100%
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    @Column(name = "last_access_date")
    private LocalDateTime lastAccessDate;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;        // Thanh toán liên quan
    
    @Column(length = 500)
    private String certificateUrl;  // Link chứng chỉ
    
    // Getters, setters...
}
```

#### **CourseContent.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/entity/CourseContent.java`

```java
@Entity
@Table(name = "course_contents")
public class CourseContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 5000)
    private String content;         // Nội dung text
    
    private String contentType;     // TEXT/VIDEO/DOCUMENT/QUIZ
    
    @Column(length = 500)
    private String mediaUrl;        // Link video/document
    
    private Integer orderIndex;     // Thứ tự hiển thị
    
    private Integer durationMinutes; // Thời lượng (phút)
    
    private Boolean isRequired;     // Bắt buộc hoàn thành
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // One-to-Many với CourseProgress
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL)
    private List<CourseProgress> progresses = new ArrayList<>();
}
```

### 💾 **REPOSITORIES (Data Access)**

#### **CourseRepository.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/repository/CourseRepository.java`

**Custom Query Methods:**
```java
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    
    // Tìm khóa học theo category
    List<Course> findByCategoryIdAndStatusOrderByCreatedAtDesc(Long categoryId, String status);
    
    // Tìm khóa học nổi bật
    List<Course> findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(String status);
    
    // Tìm khóa học theo instructor
    List<Course> findByInstructorIdOrderByCreatedAtDesc(Long instructorId);
    
    // Search khóa học theo title hoặc description
    @Query("SELECT c FROM Course c WHERE c.status = :status AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Course> searchByTitleOrDescription(@Param("query") String query, 
                                          @Param("status") String status, 
                                          Pageable pageable);
    
    // Thống kê khóa học theo tháng
    @Query("SELECT MONTH(c.createdAt) as month, COUNT(c) as count " +
           "FROM Course c WHERE YEAR(c.createdAt) = :year " +
           "GROUP BY MONTH(c.createdAt)")
    List<Object[]> getCourseStatsByMonth(@Param("year") int year);
    
    // Top khóa học có nhiều đăng ký nhất
    @Query("SELECT c FROM Course c WHERE c.status = 'open' " +
           "ORDER BY c.currentParticipants DESC")
    List<Course> findTopPopularCourses(Pageable pageable);
    
    // Khóa học có giá trong khoảng
    List<Course> findByStatusAndPriceBetweenOrderByPriceAsc(String status, 
                                                          BigDecimal minPrice, 
                                                          BigDecimal maxPrice);
    
    // Custom query với Specification để search phức tạp
    @Query("SELECT c FROM Course c WHERE " +
           "(:title IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:level IS NULL OR c.level = :level) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "c.status = 'open'")
    Page<Course> findCoursesWithFilters(@Param("title") String title,
                                       @Param("categoryId") Long categoryId,
                                       @Param("level") String level,
                                       @Param("maxPrice") BigDecimal maxPrice,
                                       Pageable pageable);
}
```

#### **CourseRegistrationRepository.java**
**Đường dẫn:** `backend/src/main/java/com/drugprevention/drugbe/repository/CourseRegistrationRepository.java`

```java
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, CourseRegistrationId> {
    
    // Tìm registration theo user và course
    Optional<CourseRegistration> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Lấy tất cả khóa học của user
    List<CourseRegistration> findByUserIdOrderByRegistrationDateDesc(Long userId);
    
    // Lấy danh sách học viên của khóa học
    Page<CourseRegistration> findByCourseIdOrderByRegistrationDateDesc(Long courseId, Pageable pageable);
    
    // Đếm số học viên của khóa học
    Long countByCourseIdAndStatus(Long courseId, String status);
    
    // Lấy khóa học hoàn thành của user
    List<CourseRegistration> findByUserIdAndStatusOrderByCompletionDateDesc(Long userId, String status);
    
    // Thống kê đăng ký theo thời gian
    @Query("SELECT DATE(cr.registrationDate) as date, COUNT(cr) as count " +
           "FROM CourseRegistration cr WHERE cr.course.id = :courseId " +
           "AND cr.registrationDate >= :startDate " +
           "GROUP BY DATE(cr.registrationDate) ORDER BY date")
    List<Object[]> getRegistrationStatsByDate(@Param("courseId") Long courseId, 
                                            @Param("startDate") LocalDateTime startDate);
    
    // Top users theo số khóa học hoàn thành
    @Query("SELECT cr.user, COUNT(cr) as completedCourses " +
           "FROM CourseRegistration cr WHERE cr.status = 'completed' " +
           "GROUP BY cr.user ORDER BY completedCourses DESC")
    List<Object[]> getTopUsersbyCompletedCourses(Pageable pageable);
    
    // Tính completion rate của khóa học
    @Query("SELECT " +
           "COUNT(CASE WHEN cr.status = 'completed' THEN 1 END) * 100.0 / COUNT(cr) " +
           "FROM CourseRegistration cr WHERE cr.course.id = :courseId")
    Double getCompletionRateByCourseId(@Param("courseId") Long courseId);
}
```

## 🔄 LUỒNG XỬ LÝ CHI TIẾT

### **1. LUỒNG TẠO KHÓA HỌC MỚI**

```
┌─────────────────┐
│ STAFF/ADMIN     │
│ tạo khóa học    │
└─────────┬───────┘
          │ POST /api/courses hoặc /api/staff/courses
          ▼
┌─────────────────┐
│ CourseController│
│ - Validate JWT  │
│ - Check role    │
└─────────┬───────┘
          │ Course object
          ▼
┌─────────────────┐
│ CourseService   │
│ - Validate data │
│ - Set defaults  │ 
│ - Check category│
└─────────┬───────┘
          │ Course entity
          ▼
┌─────────────────┐
│ CourseRepo      │
│ - Save to DB    │
│ - Auto-gen ID   │
└─────────┬───────┘
          │ Saved Course
          ▼
┌─────────────────┐
│ Response        │
│ - Course DTO    │
│ - 201 Created   │
└─────────────────┘
```

**Chi tiết code:**

**Controller Layer:**
```java
@PostMapping
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")
public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course, 
                                         Authentication authentication) {
    // Get current user info
    String username = authentication.getName();
    User instructor = userService.findByUsername(username);
    
    // Set instructor
    course.setInstructor(instructor);
    
    // Create course
    Course created = courseService.createCourse(course);
    
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}
```

**Service Layer:**
```java
@Transactional
public Course createCourse(Course course) {
    // 1. Validate course data
    validateCourseData(course);
    
    // 2. Set default values
    course.setCurrentParticipants(0);
    course.setStatus("open");
    course.setIsFeatured(false);
    course.setTotalReviews(0);
    course.setAverageRating(0.0);
    course.setCreatedAt(LocalDateTime.now());
    course.setUpdatedAt(LocalDateTime.now());
    
    // 3. Save course
    Course saved = courseRepository.save(course);
    
    // 4. Create default course structure (optional)
    createDefaultLessons(saved);
    
    // 5. Log activity
    logCourseActivity(saved, "CREATED");
    
    return saved;
}
```

### **2. LUỒNG ĐĂNG KÝ KHÓA HỌC**

```
┌─────────────────┐
│ User click      │
│ "Đăng ký"       │
└─────────┬───────┘
          │ POST /api/course-registrations/register/{courseId}
          ▼
┌─────────────────┐
│ Check eligibility│
│ - User exists   │
│ - Course open   │ 
│ - Not registered│
│ - Có chỗ trống  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check payment   │
│ - Free course → │
│   Direct active │
│ - Paid course → │
│   Pending pay   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Create          │
│ CourseRegistration│
│ + CourseProgress│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Update course   │
│ participant count│
│ Send notification│
└─────────────────┘
```

**Chi tiết implementation:**

```java
@PostMapping("/register/{courseId}")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<CourseRegistration> registerForCourse(
    @PathVariable Long courseId,
    Authentication authentication) {
    
    String username = authentication.getName();
    
    try {
        CourseRegistration registration = courseRegistrationService
            .registerForCourse(courseId, username);
        return ResponseEntity.ok(registration);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().build();
    }
}
```

### **3. LUỒNG THANH TOÁN VNPAY**

```
┌─────────────────┐
│ User đăng ký    │
│ paid course     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Create Payment  │
│ entity với      │
│ status PENDING  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Generate VNPay  │
│ payment URL     │
│ redirect user   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User pays on    │
│ VNPay portal    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ VNPay callback  │
│ /api/payment/   │
│ vnpay-callback  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Update Payment  │
│ status & Course │
│ Registration    │
└─────────────────┘
```

## 💳 TÍCH HỢP VNPAY PAYMENT

### **Payment Entity:**
```java
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToOne(mappedBy = "payment")
    private CourseRegistration courseRegistration;
    
    private BigDecimal amount;
    private String currency = "VND";
    private String status; // PENDING/COMPLETED/FAILED/CANCELLED
    private String paymentMethod = "VNPAY";
    
    private String vnpTransactionId;
    private String vnpOrderInfo;
    private LocalDateTime paymentDate;
    private LocalDateTime createdAt;
}
```

### **VNPay Service Integration:**
```java
@Service
public class VnPayService {
    
    public String createPaymentUrl(CourseRegistration registration, HttpServletRequest request) {
        // 1. Build payment parameters
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(registration.getCourse().getPrice().multiply(new BigDecimal(100)).longValue()));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", "COURSE_" + registration.getCourse().getId() + "_" + System.currentTimeMillis());
        vnpParams.put("vnp_OrderInfo", "Thanh toan khoa hoc: " + registration.getCourse().getTitle());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", getClientIpAddress(request));
        vnpParams.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        
        // 2. Build URL với signature
        return buildPaymentUrl(vnpParams);
    }
    
    public boolean validateCallback(Map<String, String> params) {
        // Validate VNPay signature
        String receivedHash = params.get("vnp_SecureHash");
        String calculatedHash = calculateHash(params);
        
        return receivedHash.equals(calculatedHash) && 
               "00".equals(params.get("vnp_ResponseCode"));
    }
}
```

## 🔐 SECURITY & VALIDATION

### **Course Access Control:**
```java
// Trong CourseController
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'MANAGER')")    // Create/Update
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")            // Delete
@PreAuthorize("@courseService.isInstructor(#id, authentication.name)")  // Update own course

// Trong CourseRegistrationController  
@PreAuthorize("hasRole('USER')")                           // Register for course
@PreAuthorize("@courseRegistrationService.isOwner(#id, authentication.name)")  // Update progress
```

### **Business Validation:**
```java
private void validateCourseRegistration(User user, Course course) {
    // 1. Course must be open
    if (!"open".equals(course.getStatus())) {
        throw new BusinessException("Course is not available for registration");
    }
    
    // 2. Check capacity
    if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
        throw new BusinessException("Course is full");
    }
    
    // 3. Check prerequisites (if any)
    if (!hasPrerequisites(user, course)) {
        throw new BusinessException("User does not meet prerequisites");
    }
    
    // 4. Check duplicate registration
    if (courseRegistrationRepository.findByUserIdAndCourseId(user.getId(), course.getId()).isPresent()) {
        throw new BusinessException("User already registered for this course");
    }
}
```

## 📊 STATISTICS & REPORTING

### **Course Statistics:**
```java
@Service
public class CourseStatisticsService {
    
    public CourseStatisticsDTO getCourseStatistics(Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Basic stats
        Long totalRegistrations = courseRegistrationRepository.countByCourseId(courseId);
        Long activeStudents = courseRegistrationRepository.countByCourseIdAndStatus(courseId, "active");
        Long completedStudents = courseRegistrationRepository.countByCourseIdAndStatus(courseId, "completed");
        
        // Completion rate
        Double completionRate = courseRegistrationRepository.getCompletionRateByCourseId(courseId);
        
        // Revenue calculation
        BigDecimal totalRevenue = calculateCourseRevenue(courseId);
        
        // Daily registration trends
        List<Object[]> registrationTrends = courseRegistrationRepository
            .getRegistrationStatsByDate(courseId, LocalDateTime.now().minusDays(30));
        
        return CourseStatisticsDTO.builder()
            .courseId(courseId)
            .totalRegistrations(totalRegistrations)
            .activeStudents(activeStudents)
            .completedStudents(completedStudents)
            .completionRate(completionRate)
            .totalRevenue(totalRevenue)
            .registrationTrends(registrationTrends)
            .build();
    }
}
```

## 🧪 TESTING GUIDELINES

### **Unit Tests:**
```java
@ExtendWith(MockitoExtension.class)
class CourseServiceTest {
    
    @Mock
    private CourseRepository courseRepository;
    
    @Mock  
    private CategoryRepository categoryRepository;
    
    @InjectMocks
    private CourseService courseService;
    
    @Test
    void createCourse_ValidData_Success() {
        // Given
        Course course = new Course();
        course.setTitle("Test Course");
        course.setPrice(new BigDecimal("500000"));
        course.setMaxParticipants(20);
        
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        
        // When
        Course result = courseService.createCourse(course);
        
        // Then
        assertThat(result.getCurrentParticipants()).isEqualTo(0);
        assertThat(result.getStatus()).isEqualTo("open");
        assertThat(result.getIsFeatured()).isFalse();
        verify(courseRepository).save(any(Course.class));
    }
    
    @Test
    void createCourse_InvalidPrice_ThrowsException() {
        // Given
        Course course = new Course();
        course.setTitle("Test Course");
        course.setPrice(new BigDecimal("-100"));
        
        // When & Then
        assertThrows(ValidationException.class, () -> {
            courseService.createCourse(course);
        });
    }
}
```

### **Integration Tests:**
```java
@SpringBootTest
@Transactional
class CourseRegistrationIntegrationTest {
    
    @Autowired
    private CourseRegistrationService courseRegistrationService;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    void registerForCourse_FreeeCourse_Success() {
        // Given
        User user = createTestUser();
        Course course = createTestCourse(BigDecimal.ZERO); // Free course
        entityManager.persistAndFlush(user);
        entityManager.persistAndFlush(course);
        
        // When
        CourseRegistration registration = courseRegistrationService
            .registerForCourse(course.getId(), user.getUsername());
        
        // Then
        assertThat(registration.getStatus()).isEqualTo("active");
        assertThat(registration.getProgress()).isEqualTo(0);
        assertThat(registration.getPayment()).isNull();
    }
    
    @Test
    void registerForCourse_PaidCourse_PendingPayment() {
        // Given
        User user = createTestUser();
        Course course = createTestCourse(new BigDecimal("500000")); // Paid course
        entityManager.persistAndFlush(user);
        entityManager.persistAndFlush(course);
        
        // When
        CourseRegistration registration = courseRegistrationService
            .registerForCourse(course.getId(), user.getUsername());
        
        // Then
        assertThat(registration.getStatus()).isEqualTo("pending_payment");
        assertThat(registration.getPayment()).isNotNull();
        assertThat(registration.getPayment().getStatus()).isEqualTo("PENDING");
    }
}
```

## 📈 PERFORMANCE OPTIMIZATION

### **Database Indexing:**
```sql
-- Course table indexes
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_price ON courses(price);
CREATE INDEX idx_courses_featured ON courses(is_featured);
CREATE INDEX idx_courses_created_at ON courses(created_at);

-- Course Registration indexes  
CREATE INDEX idx_course_registrations_user_id ON course_registrations(user_id);
CREATE INDEX idx_course_registrations_course_id ON course_registrations(course_id);
CREATE INDEX idx_course_registrations_status ON course_registrations(status);
CREATE INDEX idx_course_registrations_registration_date ON course_registrations(registration_date);

-- Course Content indexes
CREATE INDEX idx_course_contents_course_id ON course_contents(course_id);
CREATE INDEX idx_course_contents_order_index ON course_contents(order_index);
```

### **Caching Strategy:**
```java
// Cache course list
@Cacheable(value = "courses", key = "'all-' + #status")
public List<Course> getAllCoursesByStatus(String status) {
    return courseRepository.findByStatusOrderByCreatedAtDesc(status);
}

// Cache course details
@Cacheable(value = "course-details", key = "#id")
public Course getCourseById(Long id) {
    return courseRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Course not found"));
}

// Cache featured courses
@Cacheable(value = "featured-courses", key = "'featured'")
public List<Course> getFeaturedCourses() {
    return courseRepository.findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc("open");
}

// Evict cache khi update
@CacheEvict(value = {"courses", "course-details", "featured-courses"}, allEntries = true)
public Course updateCourse(Long id, Course courseUpdate) {
    // Update logic
}
```

## 🎯 NEXT STEPS & IMPROVEMENTS

1. **Live streaming** cho khóa học trực tuyến
2. **AI recommendation** khóa học phù hợp
3. **Mobile app** với offline content
4. **Gamification** (points, badges, leaderboard)
5. **Advanced analytics** và reporting
6. **Multi-language support**
7. **Course marketplace** với revenue sharing

---

**🔥 LỜI KHUYÊN QUAN TRỌNG:**
- Luôn validate payment status trước khi activate course
- Monitor VNPay callback errors và retry mechanism
- Cache heavily-accessed course data
- Implement proper file upload cho course materials
- Track user engagement metrics chi tiết
- Backup strategy cho course content và user progress 