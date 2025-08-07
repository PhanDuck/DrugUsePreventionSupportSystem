# 📊 DATA FLOW DIAGRAMS - LUỒNG DỮ LIỆU HỆ THỐNG

## 🎯 TỔNG QUAN

File này mô tả **chi tiết luồng dữ liệu** trong Drug Prevention Support System, giúp cả 3 thành viên hiểu rõ cách data di chuyển từ Frontend → Backend → Database và ngược lại.

## 🏗️ KIẾN TRÚC LUỒNG DỮ LIỆU TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   React     │  │   Axios     │  │   Local     │  │   State     │ │
│  │ Components  │  │  Services   │  │  Storage    │  │ Management  │ │
│  │             │  │             │  │             │  │   (useState) │ │
│  │ • Pages     │  │ • API calls │  │ • JWT token │  │ • Form data │ │
│  │ • Forms     │  │ • Error     │  │ • User info │  │ • Loading   │ │
│  │ • Tables    │  │   handling  │  │ • Cache     │  │ • Error     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                             HTTP/HTTPS (JSON)
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Controllers │  │  Services   │  │ Validation  │  │    DTOs     │ │
│  │             │  │             │  │             │  │             │ │
│  │ • REST APIs │  │ • Business  │  │ • Input     │  │ • Request   │ │
│  │ • Request   │  │   Logic     │  │   validation│  │ • Response  │ │
│  │   mapping   │  │ • Transform │  │ • Security  │  │ • Entity    │ │
│  │ • Response  │  │   data      │  │   checks    │  │   mapping   │ │
│  │   building  │  │ • Call repo │  │ • Business  │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │ Repositories│  │   Entities  │  │   Security  │  │ External    │ │
│  │             │  │             │  │             │  │  Services   │ │
│  │ • JPA       │  │ • Database  │  │ • JWT       │  │             │ │
│  │   queries   │  │   models    │  │ • Auth      │  │ • VNPay     │ │
│  │ • Custom    │  │ • Relations │  │ • RBAC      │  │ • Email     │ │
│  │   methods   │  │ • Mapping   │  │             │  │ • Storage   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                              JPA/Hibernate
                                    │
┌─────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Tables    │  │   Indexes   │  │ Constraints │  │  Triggers   │ │
│  │             │  │             │  │             │  │             │ │
│  │ • users     │  │ • Primary   │  │ • Foreign   │  │ • Audit     │ │
│  │ • courses   │  │   keys      │  │   keys      │  │ • Update    │ │
│  │ • appointments│ │ • Foreign   │  │ • Unique    │  │   timestamps│ │
│  │ • registrations│ │ • Indexes  │  │ • Check     │  │ • Data      │ │
│  │ • payments  │  │ • Search    │  │ • Not null  │  │   validation│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔄 LUỒNG ĐĂNG NHẬP CHI TIẾT

### **Sequence Diagram:**

```
Frontend          Backend           Database          SecurityContext
   │                 │                 │                    │
   │ 1. POST login   │                 │                    │
   ├────────────────▶│                 │                    │
   │                 │ 2. find user    │                    │
   │                 ├────────────────▶│                    │
   │                 │ 3. user entity  │                    │
   │                 │◀────────────────┤                    │
   │                 │ 4. validate     │                    │
   │                 │    password     │                    │
   │                 │    (BCrypt)     │                    │
   │                 │ 5. generate JWT │                    │
   │                 ├────────────────────────────────────▶│
   │                 │ 6. JWT token    │                    │
   │                 │◀────────────────────────────────────┤
   │ 7. login resp   │                 │                    │
   │◀────────────────┤                 │                    │
   │ 8. store token  │                 │                    │
   │    localStorage │                 │                    │
   │                 │                 │                    │
   │ 9. API call     │                 │                    │
   │   with Bearer   │                 │                    │
   ├────────────────▶│ 10. validate    │                    │
   │                 │     JWT token   │                    │
   │                 ├────────────────────────────────────▶│
   │                 │ 11. set auth    │                    │
   │                 │     context     │                    │
   │                 │◀────────────────────────────────────┤
   │                 │ 12. execute     │                    │
   │                 │     business    │                    │
   │                 │     logic       │                    │
   │ 13. response    │                 │                    │
   │◀────────────────┤                 │                    │
```

### **Code Flow:**

**Frontend (LoginPage.jsx):**
```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Call API service
        const { user, token } = await authService.login(formData);
        
        // 2. Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // 3. Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 4. Redirect based on role
        switch (user.role.name) {
            case 'ADMIN': navigate('/admin-dashboard'); break;
            case 'STAFF': navigate('/staff-dashboard'); break;
            default: navigate('/dashboard');
        }
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

**Backend (AuthController.java):**
```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        // 1. Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        
        // 2. Generate JWT token
        String jwt = jwtService.generateToken(authentication);
        
        // 3. Get user details
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userService.findById(userPrincipal.getId());
        
        // 4. Return response
        return ResponseEntity.ok(new LoginResponse(jwt, convertToDTO(user)));
        
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new LoginResponse(null, null, "Invalid credentials"));
    }
}
```

## 📚 LUỒNG QUẢN LÝ KHÓA HỌC

### **Create Course Flow:**

```
Frontend (Staff)     Backend              Database           External
     │                   │                    │                │
     │ 1. Fill form      │                    │                │
     │ 2. Submit         │                    │                │
     ├──────────────────▶│                    │                │
     │                   │ 3. Validate       │                │
     │                   │    JWT & Role     │                │
     │                   │ 4. Validate       │                │
     │                   │    course data    │                │
     │                   │ 5. Check category │                │
     │                   ├───────────────────▶│                │
     │                   │ 6. category found │                │
     │                   │◀───────────────────┤                │
     │                   │ 7. Create course  │                │
     │                   │    entity         │                │
     │                   │ 8. Save to DB     │                │
     │                   ├───────────────────▶│                │
     │                   │ 9. Course saved   │                │
     │                   │◀───────────────────┤                │
     │                   │ 10. Upload image  │                │
     │                   ├────────────────────────────────────▶│
     │                   │ 11. Image URL     │                │
     │                   │◀────────────────────────────────────┤
     │                   │ 12. Update course │                │
     │                   │     with imageURL │                │
     │                   ├───────────────────▶│                │
     │ 13. Success       │                    │                │
     │◀──────────────────┤                    │                │
```

### **Course Registration Flow:**

```
Frontend (User)      Backend              Database           Payment Gateway
     │                   │                    │                    │
     │ 1. Click register │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 2. Check eligibility                   │
     │                   │    - Course open?  │                    │
     │                   │    - Available slots?                  │
     │                   │    - Not registered?                   │
     │                   ├───────────────────▶│                    │
     │                   │ 3. Validation OK   │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 4. Check price     │                    │
     │                   │    Free vs Paid    │                    │
     │                   │                    │                    │
     │ FREE COURSE:      │ 5. Create active   │                    │
     │                   │    registration    │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 6. Update course   │                    │
     │                   │    participant     │                    │
     │                   │    count           │                    │
     │                   ├───────────────────▶│                    │
     │ 7. Success        │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ PAID COURSE:      │ 5. Create pending  │                    │
     │                   │    registration    │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 6. Create payment  │                    │
     │                   │    entity          │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 7. Generate VNPay  │                    │
     │                   │    URL             │                    │
     │                   ├────────────────────────────────────────▶│
     │                   │ 8. Payment URL     │                    │
     │                   │◀────────────────────────────────────────┤
     │ 9. Redirect to    │                    │                    │
     │    VNPay          │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 10. User pays     │                    │                    │
     ├────────────────────────────────────────────────────────────▶│
     │                   │                    │                    │
     │                   │ 11. Payment        │                    │
     │                   │     callback       │                    │
     │                   │◀────────────────────────────────────────┤
     │                   │ 12. Update payment │                    │
     │                   │     status         │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 13. Activate       │                    │
     │                   │     registration   │                    │
     │                   ├───────────────────▶│                    │
     │ 14. Success page  │                    │                    │
     │◀──────────────────┤                    │                    │
```

## 📅 LUỒNG ĐẶT LỊCH TƯ VẤN

### **Appointment Booking Flow:**

```
Frontend (User)      Backend              Database           Notification
     │                   │                    │                   │
     │ 1. Choose         │                    │                   │
     │    consultant     │                    │                   │
     │ 2. Select date    │                    │                   │
     │ 3. Request        │                    │                   │
     │    available slots│                    │                   │
     ├──────────────────▶│ 4. Query booked    │                   │
     │                   │    slots for date  │                   │
     │                   ├───────────────────▶│                   │
     │                   │ 5. Booked times    │                   │
     │                   │◀───────────────────┤                   │
     │                   │ 6. Calculate       │                   │
     │                   │    available slots │                   │
     │ 7. Available      │    (8AM-5PM minus  │                   │
     │    times          │     booked times)  │                   │
     │◀──────────────────┤                    │                   │
     │ 8. Select time    │                    │                   │
     │ 9. Fill details   │                    │                   │
     │ 10. Submit        │                    │                   │
     ├──────────────────▶│ 11. Validate       │                   │
     │                   │     - Time future? │                   │
     │                   │     - Within hours?│                   │
     │                   │     - Not conflict?│                   │
     │                   ├───────────────────▶│                   │
     │                   │ 12. Validation OK  │                   │
     │                   │◀───────────────────┤                   │
     │                   │ 13. Create         │                   │
     │                   │     appointment    │                   │
     │                   ├───────────────────▶│                   │
     │                   │ 14. Appointment    │                   │
     │                   │     created        │                   │
     │                   │◀───────────────────┤                   │
     │                   │ 15. Send email     │                   │
     │                   │     notifications  │                   │
     │                   ├───────────────────────────────────────▶│
     │ 16. Success       │                    │                   │
     │◀──────────────────┤                    │                   │
```

### **Appointment Management States:**

```
┌─────────────────┐
│    SCHEDULED    │ ──────┐
│                 │       │
│ Initial state   │       │ User/Consultant
│ when created    │       │ can reschedule
└─────────────────┘       │
          │               │
          │ Consultant    │
          │ completes     │
          ▼               │
┌─────────────────┐       │
│    COMPLETED    │       │
│                 │       │
│ Session done    │       │
│ Review prompt   │       │
└─────────────────┘       │
          │               │
          │ User submits  │
          │ review        │
          ▼               │
┌─────────────────┐       │
│    REVIEWED     │       │
│                 │       │
│ Final state     │       │
└─────────────────┘       │
                          │
                          ▼
                 ┌─────────────────┐
                 │   RESCHEDULED   │
                 │                 │
                 │ New time set    │
                 │ Becomes         │
                 │ SCHEDULED       │
                 └─────────────────┘
                          │
                          │ Can also be
                          ▼
                 ┌─────────────────┐
                 │    CANCELLED    │
                 │                 │
                 │ Final state     │
                 │ No further      │
                 │ actions         │
                 └─────────────────┘
```

## 💳 LUỒNG THANH TOÁN VNPAY

### **Payment Process Flow:**

```
Frontend         Backend           Database         VNPay Gateway
   │                │                 │                   │
   │ 1. Register    │                 │                   │
   │    paid course │                 │                   │
   ├───────────────▶│ 2. Create       │                   │
   │                │    pending      │                   │
   │                │    registration │                   │
   │                ├────────────────▶│                   │
   │                │ 3. Create       │                   │
   │                │    payment      │                   │
   │                │    record       │                   │
   │                ├────────────────▶│                   │
   │                │ 4. Generate     │                   │
   │                │    VNPay params │                   │
   │                │    + signature  │                   │
   │                │ 5. Build        │                   │
   │                │    payment URL  │                   │
   │                ├─────────────────────────────────────▶│
   │ 6. Payment URL │                 │                   │
   │◀───────────────┤                 │                   │
   │                │                 │                   │
   │ 7. Redirect    │                 │                   │
   │    to VNPay    │                 │                   │
   ├─────────────────────────────────────────────────────▶│
   │                │                 │                   │
   │ 8. User pays   │                 │                   │
   │    on VNPay    │                 │                   │
   │◀─────────────────────────────────────────────────────┤
   │                │                 │                   │
   │                │ 9. Payment      │                   │
   │                │    callback     │                   │
   │                │    with result  │                   │
   │                │◀─────────────────────────────────────┤
   │                │ 10. Validate    │                   │
   │                │     signature   │                   │
   │                │     + response  │                   │
   │                │ 11. Update      │                   │
   │                │     payment     │                   │
   │                │     status      │                   │
   │                ├────────────────▶│                   │
   │                │ 12. If success: │                   │
   │                │     Activate    │                   │
   │                │     registration│                   │
   │                ├────────────────▶│                   │
   │                │ 13. Update      │                   │
   │                │     course      │                   │
   │                │     participant │                   │
   │                │     count       │                   │
   │                ├────────────────▶│                   │
   │ 14. Redirect   │                 │                   │
   │     to result  │                 │                   │
   │     page       │                 │                   │
   │◀───────────────┤                 │                   │
```

### **VNPay Callback Handler:**

```java
@PostMapping("/vnpay-callback")
public ResponseEntity<String> vnpayCallback(@RequestParam Map<String, String> params) {
    try {
        // 1. Validate signature
        boolean isValidSignature = vnPayService.validateSignature(params);
        if (!isValidSignature) {
            logger.error("Invalid VNPay signature");
            return ResponseEntity.badRequest().body("Invalid signature");
        }
        
        // 2. Get payment info
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String amount = params.get("vnp_Amount");
        
        // 3. Find payment record
        Payment payment = paymentService.findByTransactionRef(txnRef);
        if (payment == null) {
            logger.error("Payment not found for txnRef: {}", txnRef);
            return ResponseEntity.badRequest().body("Payment not found");
        }
        
        // 4. Update payment status
        if ("00".equals(responseCode)) {
            // Success
            paymentService.markAsCompleted(payment.getId(), params);
            
            // Activate course registration
            courseRegistrationService.activateRegistration(payment.getCourseRegistration().getId());
            
            // Send success notification
            notificationService.sendPaymentSuccessNotification(payment);
            
        } else {
            // Failed
            paymentService.markAsFailed(payment.getId(), responseCode);
            
            // Send failure notification
            notificationService.sendPaymentFailureNotification(payment);
        }
        
        return ResponseEntity.ok("Success");
        
    } catch (Exception e) {
        logger.error("Error processing VNPay callback", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error");
    }
}
```

## 📊 DATABASE RELATIONSHIPS

### **Entity Relationship Diagram:**

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      ROLES      │       │     USERS       │       │   CATEGORIES    │
│                 │       │                 │       │                 │
│ • id (PK)       │◀──────│ • id (PK)       │       │ • id (PK)       │
│ • name          │       │ • username      │       │ • name          │
│ • description   │       │ • password      │       │ • description   │
└─────────────────┘       │ • email         │       └─────────────────┘
                          │ • full_name     │                 │
                          │ • role_id (FK)  │                 │
                          └─────────────────┘                 │
                                    │                         │
                                    │                         │
┌─────────────────┐                 │                         │
│   APPOINTMENTS  │                 │                         │
│                 │                 │                         │
│ • id (PK)       │                 │                         │
│ • user_id (FK)  │─────────────────┘                         │
│ • consultant_id │─────────────────┐                         │
│ • appointment_  │                 │                         │
│   time          │                 ▼                         │
│ • type          │       ┌─────────────────┐                 │
│ • status        │       │    COURSES      │◀────────────────┘
│ • notes         │       │                 │
│ • created_at    │       │ • id (PK)       │
└─────────────────┘       │ • title         │
          │               │ • description   │
          │               │ • instructor_id │─────────────────┐
          │               │   (FK)          │                 │
          │               │ • category_id   │                 │
          │               │   (FK)          │                 ▼
          │               │ • price         │       ┌─────────────────┐
          │               │ • duration_weeks│       │    (USERS)      │
          │               │ • max_participants      │  INSTRUCTORS    │
          │               │ • current_participants  │                 │
          │               │ • status        │       │ • role = STAFF  │
          │               │ • is_featured   │       └─────────────────┘
          │               └─────────────────┘
          │                         │
          │                         │
          ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│    REVIEWS      │       │ COURSE_         │
│                 │       │ REGISTRATIONS   │
│ • id (PK)       │       │                 │
│ • appointment_  │       │ • user_id (PK)  │
│   id (FK)       │       │ • course_id     │
│ • user_id (FK)  │       │   (PK)          │
│ • consultant_id │       │ • registration_ │
│   (FK)          │       │   date          │
│ • rating        │       │ • status        │
│ • comment       │       │ • progress      │
│ • created_at    │       │ • completion_   │
└─────────────────┘       │   date          │
                          │ • payment_id    │
                          │   (FK)          │
                          └─────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │    PAYMENTS     │
                          │                 │
                          │ • id (PK)       │
                          │ • user_id (FK)  │
                          │ • amount        │
                          │ • currency      │
                          │ • status        │
                          │ • payment_method│
                          │ • vnp_transaction_id
                          │ • created_at    │
                          │ • payment_date  │
                          └─────────────────┘
```

## 🔍 DATA VALIDATION LAYERS

### **Multi-Layer Validation:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND VALIDATION                     │
│                                                             │
│ • Form validation (React)                                  │
│ • Real-time field validation                               │
│ • Client-side business rules                               │
│ • User experience improvements                              │
│                                                             │
│ Example: Required fields, email format, date ranges        │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    CONTROLLER VALIDATION                   │
│                                                             │
│ • @Valid annotation on DTOs                                │
│ • Bean Validation (JSR-303)                                │
│ • Request format validation                                 │
│ • Authentication & Authorization                            │
│                                                             │
│ Example: @NotNull, @Size, @Email, @Pattern                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVICE VALIDATION                     │
│                                                             │
│ • Business logic validation                                 │
│ • Cross-entity validation                                   │
│ • Complex business rules                                    │
│ • Security checks                                           │
│                                                             │
│ Example: Appointment time conflicts, course capacity       │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE VALIDATION                     │
│                                                             │
│ • Foreign key constraints                                   │
│ • Unique constraints                                        │
│ • Check constraints                                         │
│ • Data type enforcement                                     │
│                                                             │
│ Example: NOT NULL, UNIQUE, FOREIGN KEY, CHECK              │
└─────────────────────────────────────────────────────────────┘
```

## 📈 PERFORMANCE CONSIDERATIONS

### **Data Flow Optimization:**

**1. Database Queries:**
```java
// ❌ N+1 Query Problem
List<Course> courses = courseRepository.findAll();
for (Course course : courses) {
    course.getInstructor().getFullName(); // Lazy loading trigger
}

// ✅ Fetch Join Solution
@Query("SELECT c FROM Course c JOIN FETCH c.instructor JOIN FETCH c.category")
List<Course> findAllWithInstructorAndCategory();

// ✅ DTO Projection Solution
@Query("SELECT new com.drugprevention.dto.CourseListDTO(c.id, c.title, c.price, i.fullName) " +
       "FROM Course c JOIN c.instructor i")
List<CourseListDTO> findAllCourseListDTOs();
```

**2. Caching Strategy:**
```java
// Service level caching
@Cacheable(value = "courses", key = "'featured'")
public List<Course> getFeaturedCourses() {
    return courseRepository.findByIsFeaturedTrue();
}

@CacheEvict(value = "courses", allEntries = true)
public Course updateCourse(Long id, Course course) {
    // Cache invalidation on update
}
```

**3. Pagination:**
```java
// Backend pagination
@GetMapping("/courses")
public ResponseEntity<Page<Course>> getCourses(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "12") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy) {
    
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
    Page<Course> courses = courseService.findAll(pageable);
    return ResponseEntity.ok(courses);
}
```

**Frontend pagination:**
```javascript
const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0
});

const fetchCourses = async () => {
    const response = await courseService.getCourses({
        page: pagination.page,
        size: pagination.size,
        ...filters
    });
    
    setCourses(response.content);
    setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
    });
};
```

## 🎯 DATA CONSISTENCY & TRANSACTIONS

### **Transaction Management:**

```java
@Transactional
public CourseRegistration registerForCourse(Long courseId, String username) {
    // 1. Lock course for update để tránh race condition
    Course course = courseRepository.findByIdForUpdate(courseId);
    
    // 2. Check capacity
    if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
        throw new CourseFullException("Course is full");
    }
    
    // 3. Create registration
    CourseRegistration registration = new CourseRegistration();
    // ... set properties
    
    // 4. Save registration
    courseRegistrationRepository.save(registration);
    
    // 5. Update course participant count
    course.setCurrentParticipants(course.getCurrentParticipants() + 1);
    courseRepository.save(course);
    
    // 6. Send notification (could be async)
    applicationEventPublisher.publishEvent(new CourseRegisteredEvent(registration));
    
    return registration;
}
```

### **Event-Driven Updates:**

```java
@EventListener
@Async
public void handleCourseRegistered(CourseRegisteredEvent event) {
    // Send welcome email
    emailService.sendCourseWelcomeEmail(event.getRegistration());
    
    // Update statistics
    statisticsService.updateCourseStats(event.getRegistration().getCourse().getId());
    
    // Log activity
    auditService.logCourseRegistration(event.getRegistration());
}
```

---

**🔥 QUAN TRỌNG CHO HIỆU SUẤT:**
- Luôn sử dụng pagination cho large datasets
- Implement proper database indexing
- Use DTOs để giảm data transfer
- Cache frequently accessed data
- Monitor database query performance
- Optimize N+1 query problems
- Use async processing cho non-critical operations 