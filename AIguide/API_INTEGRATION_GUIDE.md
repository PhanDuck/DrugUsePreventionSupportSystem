# 🔗 API Integration Guide - Drug Prevention Support System

## 📌 Tổng Quan Tích Hợp API

Tài liệu này giải thích cách **Backend** và **Frontend** giao tiếp với nhau thông qua REST APIs, bao gồm authentication, data flow, và error handling.

### 🏗️ Kiến Trúc Tổng Quan
```
Frontend (React)  ←→  Backend (Spring Boot)  ←→  Database (SQL Server)
     ↓                        ↓                          ↓
   axios               Controllers                   Repositories
   services            Services                      JPA/Hibernate
   authService         Security Filter               Entities
```

---

## 🔐 Authentication Flow

### 1. Login Process - Từ Frontend đến Backend

#### Frontend Code (`authService.js`)
```javascript
const login = async (credentials) => {
  try {
    // 1. Gửi POST request với username/password
    const response = await axios.post('/api/auth/login', {
      userName: credentials.username,  // hoặc username
      password: credentials.password
    });

    // 2. Backend trả về: { token, user, role }
    const { token, user, role } = response.data;
    
    // 3. Lưu vào localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);
    
    // 4. Set header cho các request tiếp theo
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return { success: true, user, role };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || 'Login failed' 
    };
  }
};
```

#### Backend Code (`AuthController.java`)
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
    try {
        // 1. Lấy username và password từ request
        String username = loginRequest.get("userName");
        if (username == null) {
            username = loginRequest.get("username");
        }
        String password = loginRequest.get("password");
        
        // 2. Authenticate qua Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
        );
        
        // 3. Lấy user info từ database
        User user = authService.findByUsername(username);
        
        // 4. Generate JWT token
        String token = jwtService.generateToken(username, user.getRole().getName());
        
        // 5. Trả về response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("role", user.getRole().getName());
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}
```

### 2. JWT Token Validation

#### Mọi Request từ Frontend
```javascript
// Axios interceptor tự động thêm token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }
);
```

#### Backend Security Filter (`JwtAuthenticationFilter.java`)
```java
@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) {
    // 1. Lấy Authorization header
    final String authHeader = request.getHeader("Authorization");
    
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        // 2. Extract JWT token
        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        
        // 3. Validate token và set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    }
    
    filterChain.doFilter(request, response);
}
```

---

## 📋 Appointment System Integration

### 1. Đặt Lịch Appointment - Complete Flow

#### Frontend: Lấy Danh Sách Consultants
```javascript
// appointmentService.js
const getConsultants = async () => {
  try {
    const response = await axios.get('/api/consultants');
    return response.data;  // Array of consultant objects
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to load consultants');
  }
};

// AppointmentPage.jsx
useEffect(() => {
  const loadConsultants = async () => {
    try {
      const consultants = await appointmentService.getConsultants();
      setConsultants(consultants);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  loadConsultants();
}, []);
```

#### Backend: Consultant Controller
```java
@GetMapping
public ResponseEntity<List<User>> getAllConsultants() {
    try {
        List<User> consultants = userService.getConsultants();
        return ResponseEntity.ok(consultants);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}

// UserService.java
public List<User> getConsultants() {
    return userRepository.findConsultants();  // Custom query
}

// UserRepository.java
@Query("SELECT u FROM User u WHERE u.role.name = 'CONSULTANT' AND u.isActive = true")
List<User> findConsultants();
```

#### Frontend: Lấy Available Slots
```javascript
const getAvailableSlots = async (consultantId, date) => {
  try {
    const response = await axios.get(
      `/api/appointments/consultant/${consultantId}/available-slots`,
      { params: { date: date.format('YYYY-MM-DD') } }
    );
    return response.data;  // Array of time strings: ["09:00", "10:00", ...]
  } catch (error) {
    throw new Error('Failed to load available slots');
  }
};
```

#### Backend: Available Slots Logic
```java
@GetMapping("/consultant/{consultantId}/available-slots")
public ResponseEntity<List<String>> getAvailableSlots(
    @PathVariable Long consultantId,
    @RequestParam String date
) {
    try {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<String> availableSlots = appointmentService.getAvailableSlots(consultantId, appointmentDate);
        return ResponseEntity.ok(availableSlots);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(null);
    }
}

// AppointmentService.java
public List<String> getAvailableSlots(Long consultantId, LocalDate date) {
    // 1. Generate all possible time slots (9:00-17:00)
    List<LocalTime> allSlots = List.of(
        LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
        LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
    );
    
    // 2. Get booked slots from database
    List<LocalTime> bookedSlots = appointmentRepository
        .findBookedSlotsByConsultantAndDate(consultantId, date);
    
    // 3. Remove booked slots from available slots
    return allSlots.stream()
        .filter(slot -> !bookedSlots.contains(slot))
        .map(slot -> slot.toString())
        .collect(Collectors.toList());
}
```

#### Frontend: Tạo Appointment
```javascript
const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post('/api/appointments', {
      consultantId: appointmentData.consultantId,
      appointmentDate: appointmentData.date,
      appointmentTime: appointmentData.time,
      notes: appointmentData.notes || ''
    });
    
    return response.data;  // Created appointment object
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create appointment');
  }
};

// Usage in component
const handleBookAppointment = async (timeSlot) => {
  try {
    await appointmentService.createAppointment({
      consultantId: selectedConsultant.id,
      date: selectedDate.format('YYYY-MM-DD'),
      time: timeSlot,
      notes: notesValue
    });
    
    toast.success('Appointment booked successfully!');
    navigate('/appointments/list');
  } catch (error) {
    toast.error(error.message);
  }
};
```

#### Backend: Create Appointment
```java
@PostMapping
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN')")
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    try {
        // 1. Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        User currentUser = authService.findByUsername(username);
        
        // 2. Create appointment
        AppointmentDTO appointment = appointmentService.createAppointment(request, currentUser);
        
        return ResponseEntity.ok(appointment);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

// AppointmentService.java
@Transactional
public AppointmentDTO createAppointment(CreateAppointmentRequest request, User user) {
    // 1. Validate consultant
    User consultant = userRepository.findById(request.getConsultantId())
        .orElseThrow(() -> new RuntimeException("Consultant not found"));
    
    if (!"CONSULTANT".equals(consultant.getRole().getName())) {
        throw new RuntimeException("User is not a consultant");
    }
    
    // 2. Check time slot availability
    LocalDate date = LocalDate.parse(request.getAppointmentDate());
    LocalTime time = LocalTime.parse(request.getAppointmentTime());
    
    boolean hasConflict = appointmentRepository.existsByConsultantAndDateAndTime(
        consultant.getId(), date, time
    );
    
    if (hasConflict) {
        throw new RuntimeException("Time slot is not available");
    }
    
    // 3. Create and save appointment
    Appointment appointment = new Appointment();
    appointment.setUser(user);
    appointment.setConsultant(consultant);
    appointment.setAppointmentDate(date);
    appointment.setAppointmentTime(time);
    appointment.setNotes(request.getNotes());
    appointment.setStatus("PENDING");
    appointment.setCreatedAt(LocalDateTime.now());
    
    Appointment saved = appointmentRepository.save(appointment);
    
    return appointmentMapper.toDTO(saved);
}
```

---

## 📚 Course System Integration

### 1. Lấy Danh Sách Courses (Public)

#### Frontend
```javascript
// courseService.js
const getAllCourses = async () => {
  try {
    const response = await axios.get('/api/courses');
    return response.data;
  } catch (error) {
    throw new Error('Failed to load courses');
  }
};

// CoursesPage.jsx
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadCourses();
}, []);
```

#### Backend
```java
@GetMapping
@Operation(summary = "Get all courses", description = "Public endpoint to view all courses")
public ResponseEntity<List<Course>> getAllCourses() {
    try {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(null);
    }
}

// CourseService.java
public List<Course> getAllCourses() {
    return courseRepository.findByIsActiveOrderByCreatedAtDesc(true);
}
```

### 2. Đăng Ký Course (Require Authentication)

#### Frontend
```javascript
const registerForCourse = async (courseId) => {
  try {
    const response = await axios.post(`/api/courses/${courseId}/register`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to register for courses');
    }
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Usage in component
const handleRegister = async (course) => {
  if (!authService.isAuthenticated()) {
    toast.error('Please login to register for courses');
    navigate('/login');
    return;
  }
  
  try {
    await courseService.registerForCourse(course.id);
    toast.success('Successfully registered for course!');
    // Update UI or reload data
  } catch (error) {
    toast.error(error.message);
  }
};
```

#### Backend
```java
@PostMapping("/{courseId}/register")
@PreAuthorize("hasAnyRole('USER', 'CONSULTANT', 'ADMIN')")
public ResponseEntity<?> registerForCourse(@PathVariable Long courseId, Authentication auth) {
    try {
        String username = auth.getName();
        User user = authService.findByUsername(username);
        
        CourseRegistration registration = courseRegistrationService.registerUserForCourse(user.getId(), courseId);
        
        return ResponseEntity.ok(registration);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

// CourseRegistrationService.java
@Transactional
public CourseRegistration registerUserForCourse(Long userId, Long courseId) {
    // Check if already registered
    if (courseRegistrationRepository.existsByUserIdAndCourseId(userId, courseId)) {
        throw new RuntimeException("Already registered for this course");
    }
    
    // Validate course exists
    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Course not found"));
    
    // Create registration
    CourseRegistration registration = new CourseRegistration();
    registration.setUserId(userId);
    registration.setCourseId(courseId);
    registration.setRegistrationDate(LocalDateTime.now());
    registration.setStatus("ACTIVE");
    
    return courseRegistrationRepository.save(registration);
}
```

---

## 👤 User Management Integration

### 1. Admin - Quản Lý Users với Phân Trang

#### Frontend
```javascript
// userService.js
const getUsers = async (page = 0, size = 10) => {
  try {
    const response = await axios.get('/api/admin/users', {
      params: { page, size }
    });
    return response.data;  // { content: [...], totalElements, totalPages, ... }
  } catch (error) {
    throw new Error('Failed to load users');
  }
};

// AdminDashboard.jsx
const [users, setUsers] = useState([]);
const [pagination, setPagination] = useState({
  current: 1,
  pageSize: 10,
  total: 0
});

const loadUsers = async (page = 0, size = 10) => {
  try {
    const data = await userService.getUsers(page, size);
    setUsers(data.content);
    setPagination(prev => ({
      ...prev,
      total: data.totalElements,
      current: page + 1
    }));
  } catch (error) {
    toast.error(error.message);
  }
};

const handleTableChange = (newPagination) => {
  loadUsers(newPagination.current - 1, newPagination.pageSize);
};
```

#### Backend
```java
@GetMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Page<User>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    try {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return ResponseEntity.ok(users);
    } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
    }
}
```

---

## 🚨 Error Handling Patterns

### 1. Frontend Error Handling

#### Global Error Interceptor
```javascript
// axios.js
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        authService.logout();
        window.location.href = '/login';
        break;
        
      case 403:
        // Forbidden - show error message
        toast.error('You do not have permission to perform this action');
        break;
        
      case 404:
        // Not found
        toast.error('Requested resource not found');
        break;
        
      case 500:
        // Server error
        toast.error('Internal server error. Please try again later.');
        break;
        
      default:
        // Other errors
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
    }
    
    return Promise.reject(error);
  }
);
```

#### Component-Level Error Handling
```javascript
const handleApiCall = async (apiFunction, errorMessage = 'Operation failed') => {
  try {
    setLoading(true);
    const result = await apiFunction();
    return result;
  } catch (error) {
    console.error(error);
    
    // Custom error messages
    if (error.response?.status === 401) {
      toast.error('Please login to continue');
      navigate('/login');
    } else {
      toast.error(error.response?.data?.message || errorMessage);
    }
    
    throw error;
  } finally {
    setLoading(false);
  }
};
```

### 2. Backend Error Handling

#### Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = Map.of(
            "error", e.getMessage(),
            "timestamp", LocalDateTime.now().toString()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(EntityNotFoundException e) {
        Map<String, String> error = Map.of(
            "error", "Resource not found",
            "message", e.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException e) {
        Map<String, String> error = Map.of(
            "error", "Access denied",
            "message", "You do not have permission to perform this action"
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }
}
```

#### Service-Level Error Handling
```java
public AppointmentDTO createAppointment(CreateAppointmentRequest request, User user) {
    try {
        // Validation
        if (request.getConsultantId() == null) {
            throw new IllegalArgumentException("Consultant ID is required");
        }
        
        // Business logic...
        
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid input: " + e.getMessage());
    } catch (DataIntegrityViolationException e) {
        throw new RuntimeException("Database constraint violation");
    } catch (Exception e) {
        logger.error("Unexpected error creating appointment", e);
        throw new RuntimeException("Failed to create appointment");
    }
}
```

---

## 📊 Data Transfer Objects (DTOs)

### 1. Request DTOs

#### CreateAppointmentRequest
```java
// Backend DTO
public class CreateAppointmentRequest {
    @NotNull(message = "Consultant ID is required")
    private Long consultantId;
    
    @NotBlank(message = "Appointment date is required")
    private String appointmentDate;  // "2024-01-15"
    
    @NotBlank(message = "Appointment time is required")
    private String appointmentTime;  // "14:00"
    
    private String notes;
    
    // Getters and setters...
}

// Frontend equivalent
const appointmentData = {
  consultantId: 1,
  appointmentDate: "2024-01-15",
  appointmentTime: "14:00",
  notes: "First consultation"
};
```

### 2. Response DTOs

#### AppointmentDTO
```java
// Backend DTO
public class AppointmentDTO {
    private Long id;
    private String consultantName;
    private String consultantEmail;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters...
}

// Frontend receives
const appointment = {
  id: 1,
  consultantName: "Dr. Smith",
  consultantEmail: "smith@example.com",
  appointmentDate: "2024-01-15",
  appointmentTime: "14:00",
  status: "PENDING",
  notes: "First consultation",
  createdAt: "2024-01-10T10:30:00"
};
```

---

## 🔄 Real-time Data Flow Examples

### 1. Complete Appointment Booking Flow

```
User Action: Book Appointment
     ↓
Frontend: appointmentService.createAppointment()
     ↓
HTTP POST: /api/appointments
     ↓
Backend: AppointmentController.createAppointment()
     ↓
Validation: @Valid CreateAppointmentRequest
     ↓
Security: @PreAuthorize check user roles
     ↓
Service: AppointmentService.createAppointment()
     ↓
Business Logic: Check conflicts, validate consultant
     ↓
Database: appointmentRepository.save()
     ↓
Response: AppointmentDTO
     ↓
Frontend: Update UI, show success message
     ↓
Navigate: Redirect to appointments list
```

### 2. User Dashboard Data Loading

```
Page Load: UserDashboard component
     ↓
useEffect: Load user data
     ↓
Parallel API calls:
  - appointmentService.getUserAppointments()
  - courseService.getUserCourses()
  - notificationService.getNotifications()
     ↓
Backend: Multiple controller endpoints
  - GET /api/appointments (user's appointments)
  - GET /api/courses/my-courses (enrolled courses)
  - GET /api/notifications (user notifications)
     ↓
Database: Repository queries with user filtering
     ↓
Response: Structured data for dashboard
     ↓
Frontend: Update multiple state variables
     ↓
UI: Render dashboard with loading states
```

---

## 🛠️ Development Workflow

### 1. API Development Cycle

#### Backend Developer (BE):
1. Create Entity classes
2. Create Repository interfaces
3. Create Service classes with business logic
4. Create Controller with endpoints
5. Add security annotations
6. Test with Swagger UI

#### Frontend Developers (FE):
1. Create service functions for API calls
2. Create components that use services
3. Add error handling and loading states
4. Implement user feedback (toasts, notifications)
5. Test integration with backend

### 2. Testing Integration

#### API Testing Tools:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Postman**: For manual API testing
- **Frontend Network Tab**: Browser dev tools

#### Common Test Scenarios:
```javascript
// Frontend integration test
const testAppointmentFlow = async () => {
  // 1. Login
  const loginResult = await authService.login({
    username: 'user1',
    password: 'user123'
  });
  
  // 2. Get consultants
  const consultants = await appointmentService.getConsultants();
  
  // 3. Get available slots
  const slots = await appointmentService.getAvailableSlots(
    consultants[0].id, 
    '2024-01-15'
  );
  
  // 4. Book appointment
  const appointment = await appointmentService.createAppointment({
    consultantId: consultants[0].id,
    appointmentDate: '2024-01-15',
    appointmentTime: slots[0],
    notes: 'Test booking'
  });
  
  console.log('Appointment created:', appointment);
};
```

---

## 🎯 Best Practices

### 1. API Design
- **Consistent naming**: Use REST conventions
- **HTTP status codes**: 200, 201, 400, 401, 403, 404, 500
- **Error responses**: Structured error objects
- **Pagination**: For list endpoints
- **Filtering**: Query parameters for search

### 2. Security
- **JWT tokens**: For authentication
- **Role-based access**: @PreAuthorize annotations
- **Input validation**: @Valid annotations
- **CORS configuration**: Allow frontend origin

### 3. Frontend Integration
- **Service layer**: Abstract API calls
- **Error handling**: Global and component-level
- **Loading states**: Show feedback to users
- **Caching**: Store user data appropriately

### 4. Performance
- **Lazy loading**: Load data when needed
- **Debouncing**: For search inputs
- **Pagination**: Don't load all data at once
- **Optimistic updates**: Update UI before API response

---

## 🎊 Kết Luận

Việc tích hợp giữa Frontend và Backend được thực hiện thông qua:

1. **RESTful APIs**: Clear endpoints với HTTP methods
2. **JWT Authentication**: Secure token-based auth
3. **Role-based Access**: Frontend routing + Backend security
4. **Error Handling**: Comprehensive error management
5. **Data Validation**: Both client-side và server-side
6. **Real-time Updates**: Through API calls và state management

**Workflow của team:**
- **BE Developer**: Tạo APIs, test với Swagger
- **FE Developers**: Integrate APIs, create UI components
- **Testing**: Both team test integration together

**Communication between team:**
- Share API documentation
- Coordinate on data structures (DTOs)
- Test together during integration phase 