# Hệ Thống Tư Vấn & Đặt Lịch - Thiết Kế Chi Tiết

## 🎯 **Tổng Quan Hệ Thống**

Hệ thống tư vấn và đặt lịch được thiết kế để kết nối người dùng (User) với các chuyên gia tư vấn (Consultant) trong lĩnh vực phòng chống ma túy. Hệ thống hỗ trợ đặt lịch trực tuyến, thanh toán và quản lý lịch hẹn.

## 👥 **Các Đối Tượng Người Dùng**

### **1. User (Người Dùng)**
- **Mục đích:** Tìm kiếm và đặt lịch tư vấn
- **Quyền hạn:** Xem danh sách consultant, đặt lịch, thanh toán, quản lý lịch hẹn cá nhân

### **2. Consultant (Chuyên Gia Tư Vấn)**
- **Mục đích:** Cung cấp dịch vụ tư vấn chuyên nghiệp
- **Quyền hạn:** Xem lịch hẹn, xác nhận/hủy lịch hẹn, quản lý thông tin cá nhân

### **3. Admin (Quản Trị Viên)**
- **Mục đích:** Quản lý toàn bộ hệ thống
- **Quyền hạn:** Quản lý users, consultants, appointments, thanh toán, báo cáo

## 🔄 **Flow Hoạt Động Chi Tiết**

### **📋 Phase 1: Tìm Kiếm & Chọn Consultant**

#### **1.1 Trang Tìm Kiếm Consultant**
```
URL: /consultants
Method: GET
```

**Giao diện:**
- **Search Bar:** Tìm kiếm theo tên, chuyên môn, địa điểm
- **Filter Options:**
  - Chuyên môn (Ma túy, Tâm lý, Y tế)
  - Địa điểm (Hà Nội, TP.HCM, Đà Nẵng)
  - Đánh giá (4-5 sao, 3-4 sao)
  - Giá cả (Dưới 500k, 500k-1M, Trên 1M)
- **Sort Options:** Theo đánh giá, giá cả, kinh nghiệm

#### **1.2 API Tìm Kiếm Consultant**
```javascript
// GET /api/consultants/search
{
  "keyword": "ma túy",
  "specialty": "DRUG_PREVENTION",
  "location": "HANOI",
  "rating": 4,
  "priceRange": "500k-1M",
  "page": 1,
  "size": 10
}
```

#### **1.3 Hiển Thị Danh Sách Consultant**
```javascript
// Response từ API
{
  "consultants": [
    {
      "id": 1,
      "name": "Dr. Nguyễn Văn A",
      "specialty": "DRUG_PREVENTION",
      "experience": 5,
      "rating": 4.8,
      "totalReviews": 150,
      "hourlyRate": 800000,
      "location": "HANOI",
      "avatar": "avatar1.jpg",
      "description": "Chuyên gia tư vấn phòng chống ma túy với 5 năm kinh nghiệm",
      "availableSlots": ["09:00", "14:00", "16:00"]
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

### **📅 Phase 2: Đặt Lịch Hẹn**

#### **2.1 Trang Chi Tiết Consultant**
```
URL: /consultants/{id}
Method: GET
```

**Thông tin hiển thị:**
- Thông tin cá nhân consultant
- Đánh giá và review từ khách hàng
- Lịch làm việc
- Giá cả theo giờ
- Nút "Đặt Lịch Tư Vấn"

#### **2.2 Trang Đặt Lịch**
```
URL: /appointments/book
Method: POST
```

**Form đặt lịch:**
```javascript
{
  "consultantId": 1,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "14:30:00",
  "duration": 60, // phút
  "appointmentType": "ONLINE", // ONLINE, OFFLINE
  "notes": "Cần tư vấn về vấn đề sử dụng ma túy",
  "preferredLanguage": "Vietnamese",
  "emergencyContact": {
    "name": "Nguyễn Văn B",
    "phone": "0123456789",
    "relationship": "Bố"
  }
}
```

#### **2.3 Xác Nhận Thông Tin**
**Hiển thị:**
- Thông tin consultant đã chọn
- Thời gian và địa điểm
- Tổng tiền (Giá/giờ × Số giờ)
- Thông tin cá nhân đã nhập
- Nút "Xác Nhận & Thanh Toán"

### **💳 Phase 3: Thanh Toán**

#### **3.1 Trang Thanh Toán**
```
URL: /payments/checkout
Method: POST
```

**Thông tin thanh toán:**
```javascript
{
  "appointmentId": 1,
  "amount": 800000,
  "currency": "VND",
  "paymentMethod": "VNPAY", // VNPAY, MOMO, ZALOPAY
  "billingInfo": {
    "fullName": "Nguyễn Văn C",
    "email": "user@example.com",
    "phone": "0123456789",
    "address": "123 Đường ABC, Hà Nội"
  }
}
```

#### **3.2 Tích Hợp Thanh Toán**
**Các phương thức thanh toán:**
- **VNPAY:** Chuyển hướng đến trang thanh toán VNPAY
- **MOMO:** QR Code hoặc deep link
- **ZaloPay:** QR Code
- **Bank Transfer:** Thông tin chuyển khoản

#### **3.3 Xử Lý Kết Quả Thanh Toán**
```javascript
// Callback từ VNPAY
{
  "appointmentId": 1,
  "transactionId": "VNPAY123456",
  "status": "SUCCESS",
  "amount": 800000,
  "paymentTime": "2024-01-10T14:30:00Z"
}
```

### **📱 Phase 4: Quản Lý Lịch Hẹn**

#### **4.1 Dashboard User**
```
URL: /dashboard/user
```

**Thông tin hiển thị:**
- Lịch hẹn sắp tới
- Lịch hẹn đã hoàn thành
- Lịch hẹn đã hủy
- Thông báo mới

#### **4.2 Dashboard Consultant**
```
URL: /dashboard/consultant
```

**Thông tin hiển thị:**
- Lịch hẹn chờ xác nhận
- Lịch hẹn đã xác nhận
- Lịch hẹn hôm nay
- Thống kê thu nhập

## 🔔 **Hệ Thống Thông Báo**

### **4.3 Notification System**
```javascript
// Cấu trúc notification
{
  "id": 1,
  "userId": 1,
  "type": "APPOINTMENT_CONFIRMED", // APPOINTMENT_CONFIRMED, APPOINTMENT_CANCELLED, PAYMENT_SUCCESS
  "title": "Lịch hẹn đã được xác nhận",
  "message": "Dr. Nguyễn Văn A đã xác nhận lịch hẹn ngày 15/01/2024",
  "data": {
    "appointmentId": 1,
    "consultantName": "Dr. Nguyễn Văn A",
    "appointmentDate": "2024-01-15T14:30:00Z"
  },
  "isRead": false,
  "createdAt": "2024-01-10T10:30:00Z"
}
```

### **4.4 Email Notifications**
**Các loại email:**
- **Xác nhận đặt lịch:** Gửi cho user sau khi thanh toán thành công
- **Xác nhận từ consultant:** Gửi cho user khi consultant xác nhận
- **Nhắc lịch hẹn:** Gửi 24h trước lịch hẹn
- **Hủy lịch hẹn:** Gửi cho user khi consultant hủy

## 📊 **Quản Lý Trạng Thái Lịch Hẹn**

### **4.5 Appointment Status Flow**
```
PENDING → CONFIRMED → COMPLETED
    ↓
CANCELLED
```

**Chi tiết trạng thái:**
- **PENDING:** Lịch hẹn đã đặt, chờ consultant xác nhận
- **CONFIRMED:** Consultant đã xác nhận
- **COMPLETED:** Lịch hẹn đã hoàn thành
- **CANCELLED:** Lịch hẹn đã hủy

### **4.6 API Quản Lý Trạng Thái**
```javascript
// Consultant xác nhận lịch hẹn
PUT /api/appointments/{id}/confirm
{
  "status": "CONFIRMED",
  "notes": "Đã xác nhận lịch hẹn"
}

// Consultant hủy lịch hẹn
PUT /api/appointments/{id}/cancel
{
  "status": "CANCELLED",
  "reason": "Lý do hủy lịch hẹn",
  "refundAmount": 800000
}
```

## 🎨 **Thiết Kế Giao Diện**

### **4.7 Responsive Design**
**Breakpoints:**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **4.8 UI/UX Principles**
- **Đơn giản:** Dễ sử dụng, ít bước
- **Rõ ràng:** Thông tin hiển thị rõ ràng
- **Nhanh chóng:** Tối ưu tốc độ tải trang
- **An toàn:** Bảo mật thông tin cá nhân

## 🔧 **Technical Implementation**

### **4.9 Frontend Technologies**
- **React.js:** UI framework
- **Redux Toolkit:** State management
- **React Router:** Navigation
- **Axios:** HTTP client
- **Material-UI:** Component library

### **4.10 Backend APIs**
```javascript
// Consultant APIs
GET /api/consultants - Lấy danh sách consultant
GET /api/consultants/{id} - Lấy thông tin consultant
GET /api/consultants/search - Tìm kiếm consultant

// Appointment APIs
POST /api/appointments - Tạo lịch hẹn
GET /api/appointments/user/{userId} - Lịch hẹn của user
GET /api/appointments/consultant/{consultantId} - Lịch hẹn của consultant
PUT /api/appointments/{id}/confirm - Xác nhận lịch hẹn
PUT /api/appointments/{id}/cancel - Hủy lịch hẹn

// Payment APIs
POST /api/payments - Tạo thanh toán
GET /api/payments/{id} - Lấy thông tin thanh toán
POST /api/payments/{id}/callback - Callback từ payment gateway

// Notification APIs
GET /api/notifications - Lấy thông báo
PUT /api/notifications/{id}/read - Đánh dấu đã đọc
```

## 📈 **Tính Năng Nâng Cao**

### **4.11 Video Call Integration**
- **WebRTC:** Hỗ trợ video call trực tuyến
- **Room Management:** Quản lý phòng họp
- **Recording:** Ghi lại buổi tư vấn (nếu được phép)

### **4.12 AI Assistant**
- **Chatbot:** Hỗ trợ tư vấn sơ bộ
- **Recommendation:** Gợi ý consultant phù hợp
- **Smart Scheduling:** Tự động sắp xếp lịch hẹn

### **4.13 Analytics & Reporting**
- **User Analytics:** Thống kê người dùng
- **Consultant Performance:** Hiệu suất consultant
- **Revenue Reports:** Báo cáo doanh thu
- **Appointment Trends:** Xu hướng đặt lịch

## 🔒 **Bảo Mật & Tuân Thủ**

### **4.14 Data Protection**
- **Encryption:** Mã hóa dữ liệu nhạy cảm
- **GDPR Compliance:** Tuân thủ quy định bảo vệ dữ liệu
- **HIPAA Compliance:** Tuân thủ quy định y tế (nếu áp dụng)

### **4.15 Authentication & Authorization**
- **JWT Tokens:** Xác thực API
- **Role-based Access:** Phân quyền theo vai trò
- **Session Management:** Quản lý phiên đăng nhập

## 🚀 **Demo Luồng Chạy Thực Tế**

### **📱 Demo 1: User Đặt Lịch Tư Vấn**

#### **Bước 1: Tìm Kiếm Consultant**
```bash
# API: Tìm kiếm consultant
GET /api/consultants/search?keyword=ma túy&specialty=DRUG_PREVENTION&location=HANOI

# Response:
{
  "consultants": [
    {
      "id": 2,
      "name": "Dr. Nguyễn Văn A",
      "specialty": "DRUG_PREVENTION",
      "experience": 5,
      "rating": 4.8,
      "hourlyRate": 800000,
      "location": "HANOI",
      "description": "Chuyên gia tư vấn phòng chống ma túy"
    }
  ]
}
```

#### **Bước 2: Xem Chi Tiết Consultant**
```bash
# API: Lấy thông tin consultant
GET /api/consultants/2

# Response:
{
  "id": 2,
  "name": "Dr. Nguyễn Văn A",
  "specialty": "DRUG_PREVENTION",
  "experience": 5,
  "rating": 4.8,
  "totalReviews": 150,
  "hourlyRate": 800000,
  "location": "HANOI",
  "description": "Chuyên gia tư vấn phòng chống ma túy với 5 năm kinh nghiệm",
  "availableSlots": ["09:00", "14:00", "16:00"]
}
```

#### **Bước 3: Đặt Lịch Hẹn**
```bash
# API: Đặt lịch hẹn
POST /api/appointments/book
{
  "consultantId": 2,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "14:30:00",
  "duration": 60,
  "appointmentType": "ONLINE",
  "notes": "Cần tư vấn về vấn đề sử dụng ma túy"
}

# Response:
{
  "id": 1,
  "clientId": 1,
  "consultantId": 2,
  "appointmentDate": "2024-01-15T14:30:00",
  "duration": 60,
  "status": "PENDING",
  "fee": 800000,
  "createdAt": "2024-01-10T10:30:00Z"
}
```

#### **Bước 4: Thanh Toán**
```bash
# API: Tạo thanh toán
POST /api/payments/create
{
  "appointmentId": 1,
  "amount": 800000,
  "paymentMethod": "VNPAY"
}

# Response:
{
  "id": 1,
  "appointmentId": 1,
  "amount": 800000,
  "currency": "VND",
  "paymentMethod": "VNPAY",
  "status": "PENDING",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?token=abc123"
}
```

### **👨‍⚕️ Demo 2: Consultant Xử Lý Lịch Hẹn**

#### **Bước 1: Xem Lịch Hẹn Chờ Xác Nhận**
```bash
# API: Lấy lịch hẹn pending
GET /api/appointments/pending?consultantId=2

# Response:
{
  "appointments": [
    {
      "id": 1,
      "clientId": 1,
      "clientName": "Nguyễn Văn User",
      "appointmentDate": "2024-01-15T14:30:00",
      "duration": 60,
      "status": "PENDING",
      "notes": "Cần tư vấn về vấn đề sử dụng ma túy",
      "fee": 800000
    }
  ]
}
```

#### **Bước 2: Xác Nhận Lịch Hẹn**
```bash
# API: Xác nhận lịch hẹn
PUT /api/appointments/1/confirm?consultantId=2

# Response:
{
  "id": 1,
  "status": "CONFIRMED",
  "message": "Lịch hẹn đã được xác nhận"
}
```

#### **Bước 3: Thêm Meeting Link**
```bash
# API: Thêm link meeting
PUT /api/appointments/1/meeting-link?consultantId=2&meetingLink=https://meet.google.com/abc-xyz

# Response:
{
  "id": 1,
  "meetingLink": "https://meet.google.com/abc-xyz",
  "message": "Meeting link đã được thêm"
}
```

### **📧 Demo 3: Hệ Thống Thông Báo**

#### **Bước 1: User Nhận Thông Báo**
```bash
# API: Lấy thông báo
GET /api/notifications?userId=1

# Response:
{
  "notifications": [
    {
      "id": 1,
      "type": "APPOINTMENT_CONFIRMED",
      "title": "Lịch hẹn đã được xác nhận",
      "message": "Dr. Nguyễn Văn A đã xác nhận lịch hẹn ngày 15/01/2024",
      "isRead": false,
      "createdAt": "2024-01-10T10:30:00Z"
    },
    {
      "id": 2,
      "type": "PAYMENT_SUCCESS",
      "title": "Thanh toán thành công",
      "message": "Thanh toán lịch hẹn #1 đã thành công",
      "isRead": false,
      "createdAt": "2024-01-10T09:15:00Z"
    }
  ]
}
```

#### **Bước 2: Đánh Dấu Đã Đọc**
```bash
# API: Đánh dấu đã đọc
PUT /api/notifications/1/read

# Response:
{
  "message": "Notification marked as read"
}
```

## 🔐 **Phân Quyền Chuyên Nghiệp**

### **👤 User (Người Dùng)**
**Quyền hạn:**
- ✅ Xem danh sách consultant
- ✅ Tìm kiếm consultant theo chuyên môn, địa điểm
- ✅ Xem chi tiết consultant (profile, đánh giá, giá cả)
- ✅ Đặt lịch hẹn với consultant
- ✅ Thanh toán lịch hẹn
- ✅ Xem lịch hẹn cá nhân
- ✅ Hủy lịch hẹn của mình
- ✅ Xem thông báo cá nhân
- ✅ Đánh giá consultant sau khi hoàn thành

**API Endpoints:**
```bash
GET /api/consultants/**          # Xem consultant
POST /api/appointments/book      # Đặt lịch
GET /api/appointments/user       # Lịch hẹn cá nhân
POST /api/payments/create        # Thanh toán
GET /api/notifications          # Thông báo
PUT /api/appointments/{id}/cancel # Hủy lịch
```

### **👨‍⚕️ Consultant (Chuyên Gia Tư Vấn)**
**Quyền hạn:**
- ✅ Xem lịch hẹn của mình
- ✅ Xác nhận/hủy lịch hẹn
- ✅ Thêm meeting link
- ✅ Đánh dấu hoàn thành lịch hẹn
- ✅ Xem thống kê thu nhập
- ✅ Quản lý lịch làm việc
- ✅ Xem đánh giá từ khách hàng
- ✅ Cập nhật thông tin cá nhân

**API Endpoints:**
```bash
GET /api/appointments/consultant/{id}     # Lịch hẹn của consultant
GET /api/appointments/pending             # Lịch hẹn chờ xác nhận
PUT /api/appointments/{id}/confirm        # Xác nhận lịch hẹn
PUT /api/appointments/{id}/cancel         # Hủy lịch hẹn
PUT /api/appointments/{id}/complete       # Hoàn thành lịch hẹn
PUT /api/appointments/{id}/meeting-link   # Thêm meeting link
GET /api/statistics/{consultantId}        # Thống kê thu nhập
```

### **👨‍💼 Manager (Quản Lý)**
**Quyền hạn:**
- ✅ Tất cả quyền của Consultant
- ✅ Xem danh sách tất cả consultant
- ✅ Quản lý lịch hẹn trong hệ thống
- ✅ Xem báo cáo tổng hợp
- ✅ Quản lý thanh toán
- ✅ Gửi thông báo hệ thống

**API Endpoints:**
```bash
GET /api/users/consultants               # Danh sách consultant
GET /api/appointments/admin/all          # Tất cả lịch hẹn
GET /api/appointments/admin/status/{status} # Lịch hẹn theo status
GET /api/statistics/overview             # Báo cáo tổng hợp
POST /api/notifications/broadcast        # Gửi thông báo hệ thống
```

### **👨‍💻 Admin (Quản Trị Viên)**
**Quyền hạn:**
- ✅ Tất cả quyền của Manager
- ✅ Quản lý users (thêm, sửa, xóa)
- ✅ Quản lý consultant (phê duyệt, từ chối)
- ✅ Quản lý hệ thống thanh toán
- ✅ Xem logs hệ thống
- ✅ Backup/restore dữ liệu
- ✅ Cấu hình hệ thống

**API Endpoints:**
```bash
GET /api/users/**                        # Quản lý users
POST /api/users                          # Tạo user mới
PUT /api/users/{id}                      # Cập nhật user
DELETE /api/users/{id}                   # Xóa user
GET /api/admin/system-logs               # Logs hệ thống
POST /api/admin/backup                   # Backup dữ liệu
GET /api/admin/system-config             # Cấu hình hệ thống
```

### **👨‍🔧 Staff (Nhân Viên Hỗ Trợ)**
**Quyền hạn:**
- ✅ Xem danh sách lịch hẹn
- ✅ Hỗ trợ khách hàng
- ✅ Xử lý khiếu nại
- ✅ Gửi thông báo hỗ trợ
- ✅ Xem báo cáo cơ bản

**API Endpoints:**
```bash
GET /api/appointments/**                 # Xem lịch hẹn
GET /api/users/basic-info               # Thông tin user cơ bản
POST /api/support/tickets               # Tạo ticket hỗ trợ
GET /api/reports/basic                  # Báo cáo cơ bản
```

## 🎯 **Luồng Xử Lý Lỗi Chuyên Nghiệp**

### **📋 Error Handling Strategy**

#### **1. Validation Errors (400)**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Appointment date must be in the future",
  "field": "appointmentDate",
  "code": "INVALID_DATE"
}
```

#### **2. Authentication Errors (401)**
```json
{
  "error": "AUTHENTICATION_ERROR",
  "message": "Invalid JWT token",
  "code": "INVALID_TOKEN"
}
```

#### **3. Authorization Errors (403)**
```json
{
  "error": "AUTHORIZATION_ERROR",
  "message": "You do not have permission to cancel this appointment",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

#### **4. Business Logic Errors (409)**
```json
{
  "error": "BUSINESS_LOGIC_ERROR",
  "message": "Consultant already has an appointment during this time",
  "code": "SCHEDULING_CONFLICT"
}
```

#### **5. System Errors (500)**
```json
{
  "error": "SYSTEM_ERROR",
  "message": "Database connection failed",
  "code": "DB_CONNECTION_ERROR",
  "requestId": "req_123456"
}
```

## 🚀 **Roadmap Phát Triển**

### **Phase 1 (MVP) - Hoàn thành:**
- ✅ Đăng ký/đăng nhập với JWT
- ✅ Tìm kiếm và filter consultant
- ✅ Đặt lịch hẹn với validation
- ✅ Thanh toán VNPAY/MOMO
- ✅ Quản lý trạng thái lịch hẹn
- ✅ Hệ thống thông báo cơ bản
- ✅ Phân quyền role-based

### **Phase 2 (Enhancement) - Đang phát triển:**
- 🔄 Video call integration (WebRTC)
- 🔄 AI chatbot hỗ trợ
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 Email/SMS notifications
- 🔄 Payment gateway expansion

### **Phase 3 (Scale) - Kế hoạch:**
- 📋 Multi-language support (EN/VI)
- 📋 Advanced payment methods (ZaloPay, Bank Transfer)
- 📋 AI recommendation engine
- 📋 Enterprise features (SSO, LDAP)
- 📋 Advanced reporting (BI integration)
- 📋 API rate limiting & caching

### **Phase 4 (Enterprise) - Tương lai:**
- 🚀 Microservices architecture
- 🚀 Kubernetes deployment
- 🚀 Advanced security (OAuth2, 2FA)
- 🚀 Real-time analytics
- 🚀 Machine learning integration
- 🚀 Third-party integrations

---

*Tài liệu này được cập nhật theo quá trình phát triển dự án và best practices trong ngành.* 