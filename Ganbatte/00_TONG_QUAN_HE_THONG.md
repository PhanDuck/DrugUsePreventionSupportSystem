# TỔNG QUAN HỆ THỐNG - DRUG PREVENTION SUPPORT SYSTEM

## 🎯 MỤC ĐÍCH HỆ THỐNG

Hệ thống hỗ trợ phòng chống tệ nạn xã hội với các chức năng chính:
- **Đặt lịch tư vấn** với các chuyên gia
- **Quản lý khóa học** phòng chống tệ nạn
- **Đánh giá tâm lý** người dùng
- **Hệ thống thanh toán** VNPay
- **Quản lý nội dung** blog và tài liệu

## 🏗️ KIẾN TRÚC TỔNG THỂ

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Pages     │ │ Components  │ │      Services           │ │
│  │             │ │             │ │                         │ │
│  │ • Login     │ │ • Calendar  │ │ • appointmentService.js │ │
│  │ • Dashboard │ │ • Forms     │ │ • courseService.js      │ │
│  │ • Courses   │ │ • Cards     │ │ • authService.js        │ │
│  │ • Booking   │ │ • Tables    │ │ • paymentService.js     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot + JPA)                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │Controllers  │ │  Services   │ │     Repositories        │ │
│  │             │ │             │ │                         │ │
│  │ • Auth      │ │ • Auth      │ │ • UserRepository        │ │
│  │ • Appointment│ │ • Appointment│ │ • AppointmentRepo      │ │
│  │ • Course    │ │ • Course    │ │ • CourseRepository      │ │
│  │ • Payment   │ │ • Payment   │ │ • PaymentRepository     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │ JPA/Hibernate
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (SQL Server)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Users     │ │ Appointments│ │       Courses           │ │
│  │   Roles     │ │   Reviews   │ │   CourseRegistrations   │ │
│  │  Payments   │ │ Assessments │ │     Categories          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 👥 PHÂN CHIA TRÁCH NHIỆM NHÓM

### 🔵 **THÀNH VIÊN 1: BACKEND - LUỒNG ĐẶT LỊCH**
**Packages chịu trách nhiệm:**
- `controller/AppointmentController.java`
- `controller/ConsultantController.java` 
- `controller/ReviewController.java`
- `service/AppointmentService.java`
- `entity/Appointment.java`, `Review.java`
- `repository/AppointmentRepository.java`, `ReviewRepository.java`

**Chi tiết:** Xem file `01_BACKEND_DAT_LICH_GUIDE.md`

### 🟢 **THÀNH VIÊN 2: BACKEND - LUỒNG KHÓA HỌC**
**Packages chịu trách nhiệm:**
- `controller/CourseController.java`
- `controller/CourseRegistrationController.java`
- `controller/StaffCourseController.java`
- `service/CourseService.java`, `CourseRegistrationService.java`
- `entity/Course.java`, `CourseRegistration.java`, `CourseContent.java`
- `repository/CourseRepository.java`, `CourseRegistrationRepository.java`

**Chi tiết:** Xem file `02_BACKEND_KHOA_HOC_GUIDE.md`

### 🟡 **THÀNH VIÊN 3: FRONTEND**
**Folders chịu trách nhiệm:**
- `frontend/src/pages/` - Tất cả các trang
- `frontend/src/components/` - Tất cả components
- `frontend/src/services/` - Tất cả API services
- `frontend/src/styles/` - Styling

**Chi tiết:** Xem file `03_FRONTEND_GUIDE.md`

## 🔐 HỆ THỐNG BẢO MẬT VÀ PHÂN QUYỀN

### **Roles trong hệ thống:**
1. **USER** - Người dùng thông thường
2. **CONSULTANT** - Chuyên gia tư vấn  
3. **STAFF** - Nhân viên quản lý nội dung
4. **ADMIN** - Quản trị viên
5. **MANAGER** - Quản lý cấp cao

### **Luồng Authentication:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Login     │───▶│   JWT Token │───▶│ Access APIs │
│   Request   │    │  Generation │    │ by Roles    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### **Security Configuration:**
- JWT Token authentication
- Role-based access control (@PreAuthorize)
- CORS configuration cho frontend
- Password encryption với BCrypt

## 🔄 LUỒNG DỮ LIỆU CHÍNH

### **1. Luồng Đăng nhập:**
Frontend → AuthController → AuthService → JWT Token → Response

### **2. Luồng Đặt lịch:**
Frontend → AppointmentController → AppointmentService → Database → Email notification

### **3. Luồng Đăng ký khóa học:**
Frontend → CourseRegistrationController → CourseRegistrationService → Payment → Database

### **4. Luồng Thanh toán:**
Frontend → PaymentController → VnPayService → VNPay Gateway → Callback

## 📁 CẤU TRÚC THƯ MỤC QUAN TRỌNG

```
drug-use-prevention-support-system/
├── backend/src/main/java/com/drugprevention/drugbe/
│   ├── config/          # Cấu hình Security, JWT, Swagger
│   ├── controller/      # REST API endpoints
│   ├── service/         # Business logic
│   ├── repository/      # Data access layer  
│   ├── entity/          # Database entities
│   ├── dto/             # Data transfer objects
│   └── util/            # Utility classes
└── frontend/src/
    ├── pages/           # React pages/routes
    ├── components/      # Reusable components  
    ├── services/        # API calling services
    ├── config/          # Axios configuration
    └── styles/          # CSS styles
```

## 🚀 HƯỚNG DẪN SETUP VÀ CHẠY HỆ THỐNG

### **Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### **Frontend:**
```bash
cd frontend  
npm install
npm run dev
```

### **Database:**
- SQL Server với connection string trong `application.properties`
- Chạy các script SQL setup trong thư mục gốc

## 📋 CHECKLIST CHO TỪNG THÀNH VIÊN

### ✅ **Backend - Đặt lịch:**
- [ ] Hiểu luồng tạo appointment
- [ ] Hiểu validation dates và timeslots
- [ ] Hiểu notification system
- [ ] Test các API endpoints

### ✅ **Backend - Khóa học:**  
- [ ] Hiểu luồng tạo/sửa course
- [ ] Hiểu course registration flow
- [ ] Hiểu payment integration
- [ ] Test staff course management

### ✅ **Frontend:**
- [ ] Hiểu React component structure  
- [ ] Hiểu routing và navigation
- [ ] Hiểu API integration
- [ ] Test responsive design

---

**📞 Liên hệ và hỗ trợ:** Trao đổi trong nhóm khi có thắc mắc về từng module! 