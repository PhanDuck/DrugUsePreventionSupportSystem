# Test API Consultation & Phân Quyền Hệ Thống

## 🔐 Phân Quyền Logic Hệ Thống

### 1. **Role-Based Access Control (RBAC)**
```
USER: Đăng ký, đặt lịch, xem thông tin cá nhân
CONSULTANT: Quản lý lịch hẹn, xem kết quả assessment của client
ADMIN: Quản lý toàn bộ hệ thống, user, course
MANAGER: Quản lý consultant, xem báo cáo
STAFF: Hỗ trợ admin, quản lý cơ bản
```

### 2. **API Permission Matrix**
| API Endpoint | USER | CONSULTANT | ADMIN | MANAGER | STAFF |
|--------------|------|------------|-------|---------|-------|
| `/api/appointments` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/appointments/user` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/appointments/consultant/{id}` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/api/assessments/submit` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/assessments/results/user/{id}` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/courses/register` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/users/consultants` | ✅ | ❌ | ✅ | ✅ | ✅ |

## 🧪 Test Cases cho Consultation API

### 1. **Authentication & Authorization Tests**

#### Test 1: Login với các role khác nhau
```bash
# Test USER login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "user1",
    "password": "password123"
  }'

# Test CONSULTANT login  
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "consultant1", 
    "password": "password123"
  }'

# Test ADMIN login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "password123"
  }'
```

#### Test 2: Access Control cho Appointment APIs
```bash
# USER chỉ có thể xem appointment của mình
curl -X GET http://localhost:8080/api/appointments/user \
  -H "Authorization: Bearer {USER_TOKEN}"

# CONSULTANT có thể xem appointment của mình
curl -X GET http://localhost:8080/api/appointments/consultant/1 \
  -H "Authorization: Bearer {CONSULTANT_TOKEN}"

# ADMIN có thể xem tất cả appointments
curl -X GET http://localhost:8080/api/appointments/admin/all \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

### 2. **Appointment Booking Flow Tests**

#### Test 3: Tạo appointment booking
```bash
# USER tạo appointment với CONSULTANT
curl -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "consultantId": 2,
    "appointmentDate": "2024-01-15T10:00:00",
    "durationMinutes": 60,
    "appointmentType": "ONLINE",
    "clientNotes": "Cần tư vấn về stress management",
    "fee": 100.00,
    "paymentMethod": "VNPAY"
  }'
```

#### Test 4: CONSULTANT confirm appointment
```bash
# CONSULTANT xác nhận appointment
curl -X PUT "http://localhost:8080/api/appointments/1/confirm?consultantId=2" \
  -H "Authorization: Bearer {CONSULTANT_TOKEN}"
```

#### Test 5: CONSULTANT complete appointment
```bash
# CONSULTANT hoàn thành appointment
curl -X PUT "http://localhost:8080/api/appointments/1/complete?consultantId=2&notes=Session completed successfully" \
  -H "Authorization: Bearer {CONSULTANT_TOKEN}"
```

### 3. **Assessment Integration Tests**

#### Test 6: USER submit assessment
```bash
# USER submit CRAFFT assessment
curl -X POST http://localhost:8080/api/assessments/submit \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "assessmentId": 1,
    "answers": [
      {"questionId": 1, "answerValue": 1, "answerText": "Yes"},
      {"questionId": 2, "answerValue": 0, "answerText": "No"},
      {"questionId": 3, "answerValue": 1, "answerText": "Yes"},
      {"questionId": 4, "answerValue": 0, "answerText": "No"},
      {"questionId": 5, "answerValue": 1, "answerText": "Yes"},
      {"questionId": 6, "answerValue": 0, "answerText": "No"}
    ]
  }'
```

#### Test 7: CONSULTANT xem assessment results của client
```bash
# CONSULTANT xem kết quả assessment của client
curl -X GET "http://localhost:8080/api/assessments/consultant/client/1/results" \
  -H "Authorization: Bearer {CONSULTANT_TOKEN}"
```

### 4. **Course Registration Tests**

#### Test 8: USER đăng ký course
```bash
# USER đăng ký course
curl -X POST http://localhost:8080/api/courses/1/register \
  -H "Authorization: Bearer {USER_TOKEN}"
```

#### Test 9: Xem course registrations
```bash
# USER xem registrations của mình
curl -X GET http://localhost:8080/api/courses/registrations/user/1 \
  -H "Authorization: Bearer {USER_TOKEN}"

# ADMIN xem tất cả registrations
curl -X GET http://localhost:8080/api/courses/registrations/course/1 \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

### 5. **Error Handling Tests**

#### Test 10: Unauthorized access
```bash
# USER cố gắng truy cập admin endpoint
curl -X GET http://localhost:8080/api/appointments/admin/all \
  -H "Authorization: Bearer {USER_TOKEN}"
# Expected: 403 Forbidden
```

#### Test 11: Invalid appointment booking
```bash
# Tạo appointment với consultant không tồn tại
curl -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "consultantId": 999,
    "appointmentDate": "2024-01-15T10:00:00",
    "durationMinutes": 60
  }'
# Expected: 400 Bad Request - "Consultant not found"
```

#### Test 12: Booking conflict
```bash
# Tạo 2 appointments cùng thời gian
curl -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "consultantId": 2,
    "appointmentDate": "2024-01-15T10:00:00",
    "durationMinutes": 60
  }'

curl -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer {USER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 3,
    "consultantId": 2,
    "appointmentDate": "2024-01-15T10:00:00",
    "durationMinutes": 60
  }'
# Expected: 400 Bad Request - "Consultant already has an appointment during this time"
```

## 🔍 Validation Tests

### 1. **Input Validation**
- Test với null values
- Test với empty strings  
- Test với invalid dates
- Test với invalid user/consultant IDs

### 2. **Business Logic Validation**
- Test appointment time conflicts
- Test consultant availability
- Test course capacity limits
- Test assessment completion

### 3. **Security Validation**
- Test JWT token expiration
- Test role-based access
- Test data isolation between users
- Test SQL injection prevention

## 📊 Expected Results

### ✅ Success Cases:
- USER có thể book appointment với CONSULTANT
- CONSULTANT có thể confirm/complete appointments
- CONSULTANT có thể xem assessment results của clients
- ADMIN có thể quản lý toàn bộ hệ thống
- Proper error messages cho invalid requests

### ❌ Failure Cases:
- Unauthorized access trả về 403
- Invalid data trả về 400 với clear error message
- Business rule violations trả về 400 với explanation
- Missing authentication trả về 401

## 🚀 Test Execution

```bash
# 1. Start backend server
cd backend
mvn spring-boot:run

# 2. Run tests với Postman hoặc curl
# 3. Verify responses và error handling
# 4. Check database state sau mỗi test
```

## 📝 Test Checklist

- [ ] Authentication với tất cả roles
- [ ] Authorization cho từng endpoint
- [ ] Appointment booking flow
- [ ] Assessment submission và viewing
- [ ] Course registration
- [ ] Error handling
- [ ] Input validation
- [ ] Business logic validation
- [ ] Security validation 