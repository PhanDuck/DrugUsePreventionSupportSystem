# Appointment API Testing Guide

## 🧪 Test Scripts for Appointment System

### 1. Health Check
```bash
curl -X GET "http://localhost:8080/api/appointments/health"
```

### 2. Get All Consultants
```bash
curl -X GET "http://localhost:8080/api/users/consultants" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Available Time Slots
```bash
curl -X GET "http://localhost:8080/api/appointments/consultant/1/available-slots?date=2024-12-20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create Appointment
```bash
curl -X POST "http://localhost:8080/api/appointments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "clientId": 1,
    "consultantId": 2,
    "appointmentDate": "2024-12-20T10:00:00",
    "durationMinutes": 60,
    "appointmentType": "ONLINE",
    "clientNotes": "Test appointment",
    "paymentMethod": "CASH"
  }'
```

### 5. Get Current User Appointments
```bash
curl -X GET "http://localhost:8080/api/appointments/user" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Confirm Appointment (Consultant)
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/confirm?consultantId=2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Cancel Appointment
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/cancel?userId=1&reason=Schedule conflict" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Complete Appointment
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/complete?consultantId=2&notes=Session completed successfully" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Frontend Testing

### Test Vietnamese Name Conversion
1. Try registering with Vietnamese name: "Trần Ân"
2. System should convert to: "Tran An"
3. Check database to confirm English format

### Test Appointment Booking Flow
1. Login as user
2. Go to Appointment page
3. Select consultant
4. Choose date and time
5. Fill form and submit
6. Verify appointment created

## 📋 Expected Results

### Name Conversion
- ✅ "Trần Ân" → "Tran An"
- ✅ "Nguyễn Thị Mai" → "Nguyen Thi Mai"
- ✅ "Lê Văn Đức" → "Le Van Duc"

### Appointment Flow
- ✅ Load consultants from `/api/users/consultants`
- ✅ Load available slots from `/api/appointments/consultant/{id}/available-slots`
- ✅ Create appointment via `/api/appointments`
- ✅ Load user appointments via `/api/appointments/user`

## 🚨 Common Issues & Solutions

### Issue: Vietnamese names causing encoding problems
**Solution**: Use NameConverter utility to convert to English format

### Issue: No available time slots
**Solution**: Check if consultant exists and date is valid (not weekend/past)

### Issue: Appointment creation fails
**Solution**: Verify all required fields and check for scheduling conflicts

## 📊 Test Data

### Sample Consultants
```sql
INSERT INTO users (username, email, first_name, last_name, role_id, expertise) VALUES
('consultant1', 'consultant1@example.com', 'John', 'Smith', 2, 'Addiction Counseling'),
('consultant2', 'consultant2@example.com', 'Sarah', 'Johnson', 2, 'Family Therapy'),
('consultant3', 'consultant3@example.com', 'Michael', 'Brown', 2, 'Youth Counseling');
```

### Sample Appointments
```sql
INSERT INTO appointments (client_id, consultant_id, appointment_date, status, appointment_type) VALUES
(1, 2, '2024-12-20 10:00:00', 'PENDING', 'ONLINE'),
(1, 3, '2024-12-21 14:00:00', 'CONFIRMED', 'IN_PERSON');
``` 