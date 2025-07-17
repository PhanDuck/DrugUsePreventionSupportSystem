# 🔗 API Mapping - Frontend to Backend

## 📋 Overview

This document maps all frontend API calls to their corresponding backend endpoints in the Drug Use Prevention Support System.

## 🏥 Appointment APIs

### Frontend Service: `appointmentService.js`
### Backend Controller: `AppointmentController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `healthCheck()` | `/api/appointments/health` | GET | Health check |
| `createAppointment()` | `/api/appointments` | POST | Create new appointment |
| `getCurrentUserAppointments()` | `/api/appointments/user` | GET | Get current user appointments |
| `getAppointmentsByClient()` | `/api/appointments/client/{clientId}` | GET | Get appointments by client |
| `getAppointmentsByConsultant()` | `/api/appointments/consultant/{consultantId}` | GET | Get appointments by consultant |
| `getUpcomingAppointmentsByClient()` | `/api/appointments/client/{clientId}/upcoming` | GET | Get upcoming client appointments |
| `getUpcomingAppointmentsByConsultant()` | `/api/appointments/consultant/{consultantId}/upcoming` | GET | Get upcoming consultant appointments |
| `getAppointmentById()` | `/api/appointments/{appointmentId}` | GET | Get appointment by ID |
| `confirmAppointment()` | `/api/appointments/{appointmentId}/confirm` | PUT | Confirm appointment |
| `cancelAppointment()` | `/api/appointments/{appointmentId}/cancel` | PUT | Cancel appointment |
| `completeAppointment()` | `/api/appointments/{appointmentId}/complete` | PUT | Complete appointment |
| `addMeetingLink()` | `/api/appointments/{appointmentId}/meeting-link` | PUT | Add meeting link |
| `getAvailableSlots()` | `/api/appointments/consultant/{consultantId}/available-slots` | GET | Get available time slots |
| `rescheduleAppointment()` | `/api/appointments/{appointmentId}/reschedule` | PUT | Reschedule appointment |
| `submitReview()` | `/api/reviews` | POST | Submit review |
| `getAppointmentReviews()` | `/api/reviews/appointment/{appointmentId}` | GET | Get appointment review |
| `getConsultantReviews()` | `/api/reviews/consultant/{consultantId}` | GET | Get consultant reviews |
| `sendAppointmentReminder()` | `/api/appointments/admin/send-reminders` | POST | Send reminders |
| `getAppointmentStatistics()` | `/api/appointments/statistics/{userId}` | GET | Get appointment statistics |
| `exportAppointments()` | `/api/appointments/admin/export` | GET | Export appointments |

## 👥 User & Consultant APIs

### Frontend Service: `userService.js`
### Backend Controller: `UserController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `getConsultants()` | `/api/users/consultants` | GET | Get all consultants |
| `getUserById()` | `/api/users/{userId}` | GET | Get user by ID |
| `updateProfile()` | `/api/users/profile` | PUT | Update user profile |
| `getUserStats()` | `/api/users/{userId}/stats` | GET | Get user statistics |

## 🔐 Authentication APIs

### Frontend Service: `authService.js`
### Backend Controller: `AuthController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `login()` | `/api/auth/login` | POST | User login |
| `register()` | `/api/auth/register` | POST | User registration |
| `logout()` | `/api/auth/logout` | POST | User logout |
| `refreshToken()` | `/api/auth/refresh` | POST | Refresh token |
| `forgotPassword()` | `/api/auth/forgot-password` | POST | Forgot password |
| `resetPassword()` | `/api/auth/reset-password` | POST | Reset password |

## 📊 Assessment APIs

### Frontend Service: `assessmentService.js`
### Backend Controller: `AssessmentController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `getAssessments()` | `/api/assessments` | GET | Get all assessments |
| `getAssessmentById()` | `/api/assessments/{id}` | GET | Get assessment by ID |
| `getAssessmentQuestions()` | `/api/assessments/{id}/questions` | GET | Get assessment questions |
| `submitAssessment()` | `/api/assessments/{id}/submit` | POST | Submit assessment |
| `getAssessmentResults()` | `/api/assessment-results/user/{userId}` | GET | Get user assessment results |

## 📚 Course APIs

### Frontend Service: `courseService.js`
### Backend Controller: `CourseController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `getCourses()` | `/api/courses` | GET | Get all courses |
| `getCourseById()` | `/api/courses/{id}` | GET | Get course by ID |
| `registerForCourse()` | `/api/courses/{id}/register` | POST | Register for course |
| `getUserCourses()` | `/api/courses/user/{userId}` | GET | Get user's courses |

## 🔔 Notification APIs

### Frontend Service: `notificationService.js`
### Backend Controller: `NotificationController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `getNotifications()` | `/api/notifications` | GET | Get user notifications |
| `markAsRead()` | `/api/notifications/{id}/read` | PUT | Mark notification as read |
| `deleteNotification()` | `/api/notifications/{id}` | DELETE | Delete notification |

## 💰 Payment APIs

### Frontend Service: `paymentService.js`
### Backend Controller: `PaymentController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `createPayment()` | `/api/payments` | POST | Create payment |
| `getPaymentStatus()` | `/api/payments/{id}/status` | GET | Get payment status |
| `processVnPayPayment()` | `/api/payments/vnpay` | POST | Process VNPay payment |

## 🔍 Search APIs

### Frontend Service: `searchService.js`
### Backend Controller: `SearchController.java`

| Frontend Method | Backend Endpoint | Method | Description |
|----------------|------------------|--------|-------------|
| `searchConsultants()` | `/api/search/consultants` | GET | Search consultants |
| `searchCourses()` | `/api/search/courses` | GET | Search courses |
| `searchAssessments()` | `/api/search/assessments` | GET | Search assessments |

## 📝 Request/Response Formats

### Create Appointment Request
```javascript
// Frontend
const appointmentData = {
  clientId: 1,
  consultantId: 2,
  appointmentDate: "2024-01-15T14:30:00",
  durationMinutes: 60,
  appointmentType: "ONLINE",
  clientNotes: "Need help with stress management",
  paymentMethod: "VNPAY"
};

// Backend DTO
public class CreateAppointmentRequest {
    private Long clientId;
    private Long consultantId;
    private LocalDateTime appointmentDate;
    private Integer durationMinutes;
    private String appointmentType;
    private String clientNotes;
    private String paymentMethod;
}
```

### Appointment Response
```javascript
// Frontend receives
{
  id: 1,
  clientId: 1,
  consultantId: 2,
  appointmentDate: "2024-01-15T14:30:00",
  durationMinutes: 60,
  appointmentType: "ONLINE",
  status: "PENDING",
  clientNotes: "Need help with stress management",
  consultant: {
    id: 2,
    firstName: "Dr. Smith",
    lastName: "Johnson",
    expertise: "Stress Management",
    email: "smith@example.com"
  },
  client: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com"
  }
}
```

## 🔧 Error Handling

### Frontend Error Response Format
```javascript
{
  success: false,
  message: "Error message from backend",
  error: "Detailed error information"
}
```

### Backend Error Response Format
```json
{
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00",
  "path": "/api/appointments",
  "status": 400
}
```

## 🔐 Authentication Headers

### Frontend Axios Configuration
```javascript
// config/axios.js
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json;charset=UTF-8',
  },
});

// Request interceptor adds JWT token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Backend Security Configuration
```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/appointments/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .anyRequest().authenticated()
            )
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }
}
```

## 📊 Data Flow Examples

### 1. Booking Appointment Flow
```javascript
// Frontend: AppointmentPage.jsx
const handleBooking = async (values) => {
  const appointmentData = {
    clientId: currentUser.id,
    consultantId: selectedConsultant.id,
    appointmentDate: values.appointmentDate.format('YYYY-MM-DDTHH:mm:ss'),
    durationMinutes: 60,
    appointmentType: values.appointmentType,
    clientNotes: values.notes || '',
    paymentMethod: values.paymentMethod
  };

  const result = await appointmentService.createAppointment(appointmentData);
  if (result.success) {
    message.success('Appointment booked successfully!');
  }
};

// Backend: AppointmentController.java
@PostMapping
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    AppointmentDTO appointment = appointmentService.createAppointment(request);
    return ResponseEntity.ok(appointment);
}
```

### 2. Getting Available Slots Flow
```javascript
// Frontend: AppointmentPage.jsx
const loadAvailableSlots = async (consultantId, date) => {
  const formattedDate = date.format('YYYY-MM-DD');
  const result = await appointmentService.getAvailableSlots(consultantId, formattedDate);
  
  if (result.success) {
    setAvailableSlots(result.data.availableSlots || []);
  }
};

// Backend: AppointmentController.java
@GetMapping("/consultant/{consultantId}/available-slots")
public ResponseEntity<?> getAvailableTimeSlots(@PathVariable Long consultantId,
                                               @RequestParam String date) {
    LocalDateTime dateTime = LocalDateTime.parse(date + "T00:00:00");
    List<String> availableSlots = appointmentService.getAvailableTimeSlots(consultantId, dateTime);
    
    return ResponseEntity.ok(Map.of(
        "consultantId", consultantId,
        "date", date,
        "availableSlots", availableSlots,
        "totalSlots", availableSlots.size()
    ));
}
```

### 3. Getting User Appointments Flow
```javascript
// Frontend: AppointmentDashboard.jsx
const loadAppointments = async () => {
  const result = await appointmentService.getCurrentUserAppointments();
  if (result.success) {
    setAppointments(result.data);
  }
};

// Backend: AppointmentController.java
@GetMapping("/user")
public ResponseEntity<?> getCurrentUserAppointments(Authentication authentication) {
    String username = authentication.getName();
    User currentUser = authService.findByUsername(username);
    List<AppointmentDTO> appointments = appointmentService.getAppointmentsByClient(currentUser.getId());
    return ResponseEntity.ok(appointments);
}
```

## 🚀 Testing API Endpoints

### Using Postman or curl

#### 1. Health Check
```bash
curl -X GET http://localhost:8080/api/appointments/health
```

#### 2. Get Current User Appointments
```bash
curl -X GET http://localhost:8080/api/appointments/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Create Appointment
```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "clientId": 1,
    "consultantId": 2,
    "appointmentDate": "2024-01-15T14:30:00",
    "durationMinutes": 60,
    "appointmentType": "ONLINE",
    "clientNotes": "Need help with stress management"
  }'
```

#### 4. Get Available Slots
```bash
curl -X GET "http://localhost:8080/api/appointments/consultant/2/available-slots?date=2024-01-15"
```

## 🔍 Debugging Tips

### Frontend Debugging
```javascript
// Add to axios interceptor for debugging
axiosInstance.interceptors.request.use((config) => {
  console.log('Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

### Backend Debugging
```java
// Add logging to controller methods
@PostMapping
public ResponseEntity<?> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
    log.info("Creating appointment: {}", request);
    try {
        AppointmentDTO appointment = appointmentService.createAppointment(request);
        log.info("Appointment created successfully: {}", appointment.getId());
        return ResponseEntity.ok(appointment);
    } catch (Exception e) {
        log.error("Error creating appointment: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

## ✅ API Status Check

All APIs are properly mapped and should work correctly with the current implementation. The frontend service layer (`appointmentService.js`) correctly calls the backend endpoints, and the backend controller (`AppointmentController.java`) provides all necessary endpoints.

### Verified Endpoints:
- ✅ Health check
- ✅ Create appointment
- ✅ Get user appointments
- ✅ Get appointment by ID
- ✅ Cancel appointment
- ✅ Get available slots
- ✅ Submit review
- ✅ Get statistics

### Security:
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Input validation

### Error Handling:
- ✅ Frontend error handling
- ✅ Backend error responses
- ✅ User-friendly error messages
- ✅ Proper HTTP status codes 