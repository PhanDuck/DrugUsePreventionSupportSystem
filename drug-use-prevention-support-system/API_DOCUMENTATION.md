# API Documentation - Drug Prevention Support System

## Overview
This document describes the REST APIs for the Drug Prevention Support System, focusing on the newly developed appointment and review management features.

## Base URL
```
http://localhost:8080/api
```

## Authentication
All APIs require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Appointment APIs

### 1. Health Check
```
GET /appointments/health
```
**Response:**
```json
{
  "message": "🏥 Appointment Service is running! Ready for consultation booking."
}
```

### 2. Create Appointment
```
POST /appointments
```
**Request Body:**
```json
{
  "clientId": 1,
  "consultantId": 2,
  "appointmentDate": "2024-01-15T10:00:00",
  "durationMinutes": 60,
  "appointmentType": "ONLINE",
  "clientNotes": "Cần tư vấn về vấn đề sử dụng ma túy",
  "fee": 100.00,
  "paymentMethod": "VNPAY"
}
```

### 3. Get Appointments by Client
```
GET /appointments/client/{clientId}
```

### 4. Get Appointments by Consultant
```
GET /appointments/consultant/{consultantId}
```

### 5. Get Upcoming Appointments
```
GET /appointments/client/{clientId}/upcoming
GET /appointments/consultant/{consultantId}/upcoming
```

### 6. Get Appointment by ID
```
GET /appointments/{appointmentId}
```

### 7. Confirm Appointment
```
PUT /appointments/{appointmentId}/confirm?consultantId={consultantId}
```

### 8. Cancel Appointment
```
PUT /appointments/{appointmentId}/cancel?userId={userId}&reason={reason}
```

### 9. Complete Appointment
```
PUT /appointments/{appointmentId}/complete?consultantId={consultantId}&notes={notes}
```

### 10. Add Meeting Link
```
PUT /appointments/{appointmentId}/meeting-link?consultantId={consultantId}&meetingLink={link}
```

### 11. Reschedule Appointment
```
PUT /appointments/{appointmentId}/reschedule
```
**Request Body:**
```json
{
  "newDateTime": "2024-01-16T14:00:00",
  "reason": "Có việc đột xuất"
}
```

### 12. Get Available Time Slots
```
GET /appointments/consultant/{consultantId}/available-slots?date=2024-01-15
```

### 13. Get Appointment Statistics
```
GET /appointments/statistics/{userId}?period=month
```
**Period options:** week, month, year

### 14. Auto Complete Past Appointments
```
POST /appointments/admin/auto-complete
```

### 15. Send Appointment Reminders
```
POST /appointments/admin/send-reminders
```

---

## Review APIs

### 1. Health Check
```
GET /reviews/health
```
**Response:**
```json
{
  "message": "⭐ Review Service is running! Ready for appointment feedback."
}
```

### 2. Create Review
```
POST /reviews?appointmentId={appointmentId}&clientId={clientId}&rating={rating}&comment={comment}
```

### 3. Get Review by Appointment
```
GET /reviews/appointment/{appointmentId}
```

### 4. Get Reviews by Consultant
```
GET /reviews/consultant/{consultantId}
```

### 5. Get Reviews by Client
```
GET /reviews/client/{clientId}
```

### 6. Get Consultant Review Statistics
```
GET /reviews/consultant/{consultantId}/statistics
```
**Response:**
```json
{
  "averageRating": 4.5,
  "totalReviews": 10
}
```

### 7. Get Consultant Average Rating
```
GET /reviews/consultant/{consultantId}/average-rating
```

### 8. Get Recent Reviews
```
GET /reviews/consultant/{consultantId}/recent?limit=5
```

### 9. Update Review
```
PUT /reviews/{reviewId}?rating={rating}&comment={comment}
```

### 10. Delete Review
```
DELETE /reviews/{reviewId}
```

---

## Data Models

### AppointmentDTO
```json
{
  "id": 1,
  "clientId": 1,
  "consultantId": 2,
  "clientName": "Nguyễn Văn A",
  "consultantName": "Trần Thị B",
  "clientEmail": "client@example.com",
  "consultantEmail": "consultant@example.com",
  "appointmentDate": "2024-01-15T10:00:00",
  "durationMinutes": 60,
  "status": "CONFIRMED",
  "appointmentType": "ONLINE",
  "clientNotes": "Cần tư vấn về vấn đề sử dụng ma túy",
  "consultantNotes": "Đã tư vấn xong",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "fee": 100.00,
  "paymentStatus": "PAID",
  "createdAt": "2024-01-10T09:00:00",
  "updatedAt": "2024-01-10T09:00:00",
  "cancelledAt": null,
  "cancellationReason": null
}
```

### ReviewDTO
```json
{
  "id": 1,
  "appointmentId": 1,
  "clientId": 1,
  "consultantId": 2,
  "clientName": "Nguyễn Văn A",
  "consultantName": "Trần Thị B",
  "rating": 5,
  "comment": "Tư vấn viên rất chuyên nghiệp và tận tâm!",
  "createdAt": "2024-01-15T11:00:00",
  "updatedAt": "2024-01-15T11:00:00"
}
```

### RescheduleRequest
```json
{
  "newDateTime": "2024-01-16T14:00:00",
  "reason": "Có việc đột xuất"
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "error": "Không thể đặt lịch trong quá khứ"
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "error": "Bạn không có quyền thực hiện hành động này"
}
```

### Not Found (404)
```json
{
  "error": "Không tìm thấy lịch hẹn"
}
```

### Internal Server Error (500)
```json
{
  "error": "Lỗi tạo lịch hẹn: Database connection failed"
}
```

---

## Status Codes

### Appointment Status
- `PENDING` - Chờ xác nhận
- `CONFIRMED` - Đã xác nhận
- `COMPLETED` - Đã hoàn thành
- `CANCELLED` - Đã hủy
- `RESCHEDULED` - Đã đổi lịch

### Payment Status
- `UNPAID` - Chưa thanh toán
- `PAID` - Đã thanh toán
- `REFUNDED` - Đã hoàn tiền

---

## Usage Examples

### 1. Book an Appointment
```bash
curl -X POST http://localhost:8080/api/appointments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "consultantId": 2,
    "appointmentDate": "2024-01-15T10:00:00",
    "durationMinutes": 60,
    "appointmentType": "ONLINE",
    "clientNotes": "Cần tư vấn về vấn đề sử dụng ma túy",
    "fee": 100.00,
    "paymentMethod": "VNPAY"
  }'
```

### 2. Submit a Review
```bash
curl -X POST "http://localhost:8080/api/reviews?appointmentId=1&clientId=1&rating=5&comment=Excellent%20consultation" \
  -H "Authorization: Bearer <token>"
```

### 3. Get Available Time Slots
```bash
curl -X GET "http://localhost:8080/api/appointments/consultant/2/available-slots?date=2024-01-15" \
  -H "Authorization: Bearer <token>"
```

---

## Database Schema

### Reviews Table
```sql
CREATE TABLE reviews (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    appointment_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    consultant_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Reviews_Appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    CONSTRAINT FK_Reviews_Client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT FK_Reviews_Consultant FOREIGN KEY (consultant_id) REFERENCES users(id),
    CONSTRAINT UQ_Reviews_Appointment UNIQUE (appointment_id)
);
```

---

## Notes

1. **Time Format**: All dates should be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
2. **Rating**: Reviews use a 1-5 star rating system
3. **Permissions**: Different endpoints require different user roles
4. **Validation**: All inputs are validated on both client and server side
5. **Error Handling**: Comprehensive error handling with meaningful messages in Vietnamese 