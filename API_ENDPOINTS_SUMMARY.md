# API Endpoints Summary - Drug Use Prevention Support System

## Base URL
- Development: `http://localhost:8080`
- API Base: `/api`

## Authentication & Authorization
- **JWT Bearer Token** required for most endpoints
- **Roles**: USER, CONSULTANT, ADMIN, STAFF, MANAGER

---

## 🔐 Authentication APIs (`/api/auth`)

### Public Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

**Login Request:**
```json
{
  "userName": "username",
  "password": "password"
}
```

**Login Response:**
```json
{
  "token": "jwt_token_here",
  "user": { /* user object */ },
  "role": "USER"
}
```

---

## 📅 Appointment APIs (`/api/appointments`)

### Health Check
- `GET /api/appointments/health` - Service health check

### Appointment Management
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/user` - Get current user's appointments
- `GET /api/appointments/client/{clientId}` - Get appointments by client
- `GET /api/appointments/consultant/{consultantId}` - Get appointments by consultant
- `GET /api/appointments/{appointmentId}` - Get specific appointment

### Upcoming Appointments
- `GET /api/appointments/client/{clientId}/upcoming` - Get client's upcoming appointments
- `GET /api/appointments/consultant/{consultantId}/upcoming` - Get consultant's upcoming appointments

### Appointment Status Management
- `PUT /api/appointments/{appointmentId}/confirm` - Confirm appointment (Consultant/Admin)
- `PUT /api/appointments/{appointmentId}/cancel` - Cancel appointment
- `PUT /api/appointments/{appointmentId}/complete` - Complete appointment (Consultant/Admin)

### Meeting Management
- `PUT /api/appointments/{appointmentId}/meeting-link` - Add meeting link
- `PUT /api/appointments/{appointmentId}/update-meeting-link` - Update meeting link
- `DELETE /api/appointments/{appointmentId}/meeting-link` - Remove meeting link
- `PUT /api/appointments/{appointmentId}/in-person-location` - Set in-person location
- `GET /api/appointments/{appointmentId}/meeting-info` - Get meeting information

### Time Slot Management
- `GET /api/appointments/consultant/{consultantId}/booked-slots` - Get booked slots (Public)
- `GET /api/appointments/consultant/{consultantId}/available-slots` - Get available slots

### Rescheduling
- `PUT /api/appointments/{appointmentId}/reschedule` - Reschedule appointment

### Statistics & Admin
- `GET /api/appointments/statistics/{userId}` - Get appointment statistics
- `GET /api/appointments/admin/all` - Get all appointments (Admin)
- `GET /api/appointments/admin/status/{status}` - Get appointments by status
- `GET /api/appointments/consultant/{consultantId}/stats/count` - Get consultant stats
- `POST /api/appointments/admin/auto-complete` - Auto complete past appointments
- `POST /api/appointments/admin/send-reminders` - Send appointment reminders
- `GET /api/appointments/pending` - Get pending appointments

### Simple Booking
- `POST /api/appointments/book` - Simple appointment booking

---

## 📚 Course APIs (`/api/courses`)

### Health Check
- `GET /api/courses/health` - Service health check

### Public Course Endpoints (No Auth Required)
- `GET /api/courses` - Get all active courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/category/{categoryId}` - Get courses by category

### Course Registration
- `GET /api/courses/registrations/user/{userId}` - Get user registrations
- `GET /api/courses/registrations/course/{courseId}` - Get course registrations (Staff only)

### Course Management (Staff/Admin)
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course (Admin/Manager only)

---

## 👥 User Management APIs (`/api/users`)

### User Profile
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{id}` - Get user by ID

### User Management (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

---

## 🧑‍⚕️ Consultant APIs (`/api/consultants`)

### Consultant Management
- `GET /api/consultants` - Get all consultants
- `GET /api/consultants/{id}` - Get consultant by ID
- `POST /api/consultants` - Create consultant
- `PUT /api/consultants/{id}` - Update consultant
- `DELETE /api/consultants/{id}` - Delete consultant

### Consultant Availability
- `GET /api/consultants/{id}/availability` - Get consultant availability
- `PUT /api/consultants/{id}/availability` - Update consultant availability

---

## 📊 Assessment APIs (`/api/assessments`)

### Assessment Management
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/{id}` - Get assessment by ID
- `POST /api/assessments` - Create assessment
- `PUT /api/assessments/{id}` - Update assessment
- `DELETE /api/assessments/{id}` - Delete assessment

### Assessment Results
- `GET /api/assessments/results` - Get assessment results
- `POST /api/assessments/submit` - Submit assessment
- `GET /api/assessments/results/{userId}` - Get user's assessment results

---

## 💳 Payment APIs (`/api/payments`)

### Payment Processing
- `POST /api/payments/create` - Create payment
- `POST /api/payments/vnpay/create` - Create VNPay payment
- `GET /api/payments/vnpay/return` - VNPay return URL
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/user/{userId}` - Get user payments

---

## 📝 Review APIs (`/api/reviews`)

### Review Management
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/{id}` - Get review by ID
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

---

## 🔔 Notification APIs (`/api/notifications`)

### Notification Management
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete notification

---

## 📰 Blog APIs (`/api/blogs`)

### Blog Management
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/{id}` - Get blog by ID
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

---

## 🏷️ Category APIs (`/api/categories`)

### Category Management
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

---

## 🎯 Recommendation APIs (`/api/recommendations`)

### Recommendation Management
- `GET /api/recommendations` - Get recommendations
- `GET /api/recommendations/{id}` - Get recommendation by ID
- `POST /api/recommendations` - Create recommendation
- `PUT /api/recommendations/{id}` - Update recommendation
- `DELETE /api/recommendations/{id}` - Delete recommendation

---

## 👨‍💼 Admin APIs (`/api/admin`)

### Admin Management
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/statistics` - Get system statistics
- `POST /api/admin/users/{id}/role` - Update user role

---

## 🧪 Test APIs (`/api/test`)

### Testing Endpoints
- `GET /api/test/health` - Test health check
- `GET /api/test/auth` - Test authentication
- `GET /api/test/roles` - Test role-based access

---

## 🔧 Staff Course Management APIs (`/api/staff/courses`)

### Staff Course Management
- `GET /api/staff/courses` - Get courses for staff management
- `POST /api/staff/courses` - Create course (Staff)
- `PUT /api/staff/courses/{id}` - Update course (Staff)
- `DELETE /api/staff/courses/{id}` - Delete course (Staff)
- `GET /api/staff/courses/{id}/content` - Get course content
- `POST /api/staff/courses/{id}/content` - Add course content
- `PUT /api/staff/courses/{id}/content/{contentId}` - Update course content
- `DELETE /api/staff/courses/{id}/content/{contentId}` - Delete course content

---

## 📋 Common Request/Response Patterns

### Standard Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

---

## 🔒 Security Notes

1. **JWT Authentication**: Most endpoints require valid JWT token
2. **Role-based Access**: Different endpoints require different user roles
3. **CORS**: Configured for cross-origin requests
4. **Input Validation**: All inputs are validated
5. **Error Handling**: Comprehensive error handling with meaningful messages

---

## 📖 Swagger Documentation

When the backend is running, you can access the Swagger UI at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

The Swagger UI provides:
- Interactive API documentation
- Request/response examples
- Authentication testing
- API testing interface 