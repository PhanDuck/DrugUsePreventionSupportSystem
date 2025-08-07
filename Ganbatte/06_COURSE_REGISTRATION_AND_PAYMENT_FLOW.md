# LUỒNG ĐĂNG KÝ KHÓA HỌC VÀ THANH TOÁN CHI TIẾT

## 📋 TỔNG QUAN LUỒNG HỆ THỐNG

Hệ thống hỗ trợ 2 loại khóa học:
- **Khóa học miễn phí**: Đăng ký trực tiếp, không cần thanh toán
- **Khóa học có phí**: Yêu cầu thanh toán qua VNPay trước khi cấp quyền truy cập

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG ĐĂNG KÝ KHÓA HỌC

```
Frontend (User)      Backend              Database           VNPay Gateway
     │                   │                    │                    │
     │ 1. Click Enroll   │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 2. Check Auth      │                    │
     │                   │    & User Info     │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 3. User Found      │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 4. Get Course      │                    │
     │                   │    Details         │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 5. Course Info     │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 6. Validate        │                    │
     │                   │    Registration    │                    │
     │                   │    Conditions      │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 7. Check if        │                    │
     │                   │    Already         │                    │
     │                   │    Registered      │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 8. Not Registered  │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 9. Check Course    │                    │
     │                   │    Capacity        │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 10. Capacity OK    │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 11. Check Price    │                    │
     │                   │    Free vs Paid    │                    │
     │                   │                    │                    │
     │ FREE COURSE:      │ 12. Create Active  │                    │
     │                   │    Registration    │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 13. Update Course  │                    │
     │                   │    Participants    │                    │
     │                   ├───────────────────▶│                    │
     │ 14. Success       │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ PAID COURSE:      │ 12. Return Payment │                    │
     │                   │    Required        │                    │
     │ 13. Payment Info  │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 14. Create VNPay  │                    │                    │
     │    Payment        │                    │                    │
     │                   │ 15. Create Payment │                    │
     │                   │    Record          │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 16. Generate VNPay │                    │
     │                   │    Parameters      │                    │
     │                   │ 17. Build Payment  │                    │
     │                   │    URL with        │                    │
     │                   │    Signature       │                    │
     │                   │ 18. Store Payment  │                    │
     │                   │    URL             │                    │
     │                   ├───────────────────▶│                    │
     │ 19. Payment URL   │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 20. Redirect to   │                    │                    │
     │    VNPay Portal   │                    │                    │
     ├─────────────────────────────────────────────────────────────▶│
     │                   │                    │                    │
     │ 21. User pays on  │                    │                    │
     │    VNPay          │                    │                    │
     │                   │                    │                    │
     │ 22. VNPay         │                    │                    │
     │    Callback       │                    │                    │
     │                   │ 23. Validate       │                    │
     │                   │    Signature       │                    │
     │                   │ 24. Update Payment │                    │
     │                   │    Status          │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 25. Create Course  │                    │
     │                   │    Registration    │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 26. Update Course  │                    │
     │                   │    Participants    │                    │
     │                   ├───────────────────▶│                    │
     │ 27. Success       │                    │                    │
     │    Redirect       │                    │                    │
     │◀──────────────────┤                    │                    │
```

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG XỬ LÝ LỖI CHI TIẾT

```
Frontend (User)      Backend              Database           VNPay Gateway
     │                   │                    │                    │
     │ 1. Click Enroll   │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 2. Check Auth      │                    │
     │                   │    & User Info     │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 3. User Not Found  │                    │
     │                   │◀───────────────────┤                    │
     │ 4. Error:         │                    │                    │
     │    Auth Required  │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 5. Login & Retry  │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 6. Get Course      │                    │
     │                   │    Details         │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 7. Course Not      │                    │
     │                   │    Found           │                    │
     │                   │◀───────────────────┤                    │
     │ 8. Error:         │                    │                    │
     │    Course Not     │                    │                    │
     │    Found          │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 9. Check Course   │                    │                    │
     │    Status         │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 10. Course         │                    │
     │                   │     Inactive       │                    │
     │                   │◀───────────────────┤                    │
     │ 11. Error:        │                    │                    │
     │     Course Not    │                    │                    │
     │     Available     │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 12. Check         │                    │                    │
     │     Already       │                    │                    │
     │     Registered    │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 13. Already        │                    │
     │                   │     Registered     │                    │
     │                   │◀───────────────────┤                    │
     │ 14. Error:        │                    │                    │
     │     Already       │                    │                    │
     │     Enrolled      │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ 15. Check         │                    │                    │
     │     Capacity      │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 16. Course Full    │                    │
     │                   │◀───────────────────┤                    │
     │ 17. Error:        │                    │                    │
     │     Course Full   │                    │                    │
     │◀──────────────────┤                    │                    │
```

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG VNPAY INTEGRATION CHI TIẾT

```
Frontend (User)      Backend              VNPay Service      VNPay Gateway
     │                   │                       │                    │
     │ 1. Create Payment │                       │                    │
     │    Request        │                       │                    │
     ├──────────────────▶│                       │                    │
     │                   │ 2. Create Payment    │                    │
     │                   │    Entity             │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 3. Payment Created    │                    │
     │                   │◀───────────────────────┤                    │
     │                   │ 4. Build VNPay        │                    │
     │                   │    Parameters         │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 5. Add Required       │                    │
     │                   │    Fields             │                    │
     │                   │    - vnp_Version      │                    │
     │                   │    - vnp_Command      │                    │
     │                   │    - vnp_TmnCode      │                    │
     │                   │    - vnp_CurrCode     │                    │
     │                   │    - vnp_Locale       │                    │
     │                   │    - vnp_ReturnUrl    │                    │
     │                   │    - vnp_IpAddr       │                    │
     │                   │    - vnp_CreateDate   │                    │
     │                   │◀───────────────────────┤                    │
     │                   │ 6. Sort Parameters    │                    │
     │                   │    Alphabetically     │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 7. Build Hash Data    │                    │
     │                   │    String             │                    │
     │                   │◀───────────────────────┤                    │
     │                   │ 8. Generate HMAC      │                    │
     │                   │    SHA512 Signature   │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 9. Signature          │                    │
     │                   │    Generated          │                    │
     │                   │◀───────────────────────┤                    │
     │                   │ 10. Build Final URL   │                    │
     │                   │     with Signature    │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 11. Payment URL       │                    │
     │                   │     Ready             │                    │
     │                   │◀───────────────────────┤                    │
     │ 12. Payment URL   │                       │                    │
     │◀──────────────────┤                       │                    │
     │                   │                       │                    │
     │ 13. Redirect to   │                       │                    │
     │     VNPay         │                       │                    │
     ├─────────────────────────────────────────────────────────────▶│
     │                   │                       │                    │
     │ 14. User Payment  │                       │                    │
     │     Process       │                       │                    │
     │                   │                       │                    │
     │ 15. VNPay         │                       │                    │
     │     Callback      │                       │                    │
     │                   │ 16. Validate          │                    │
     │                   │     Signature         │                    │
     │                   ├───────────────────────▶│                    │
     │                   │ 17. Signature Valid   │                    │
     │                   │◀───────────────────────┤                    │
     │                   │ 18. Process Response  │                    │
     │                   │     Code              │                    │
     │                   │ 19. Update Payment    │                    │
     │                   │     Status            │                    │
     │                   │ 20. Create Course     │                    │
     │                   │     Registration      │                    │
     │                   │ 21. Redirect User     │                    │
     │                   │     to Success Page   │                    │
     │ 22. Success Page  │                       │                    │
     │◀──────────────────┤                       │                    │
```

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG DATABASE TRANSACTION

```
CourseRegistrationController    CourseRegistrationService    Database
           │                              │                      │
           │ 1. registerForCourse()       │                      │
           ├─────────────────────────────▶│                      │
           │                              │ 2. @Transactional    │
           │                              │    begin             │
           │                              ├─────────────────────▶│
           │                              │ 3. Find User         │
           │                              ├─────────────────────▶│
           │                              │ 4. User Data         │
           │                              │◀─────────────────────┤
           │                              │ 5. Find Course       │
           │                              ├─────────────────────▶│
           │                              │ 6. Course Data       │
           │                              │◀─────────────────────┤
           │                              │ 7. Check Existing    │
           │                              │    Registration      │
           │                              ├─────────────────────▶│
           │                              │ 8. Registration      │
           │                              │    Status            │
           │                              │◀─────────────────────┤
           │                              │ 9. Create New        │
           │                              │    Registration      │
           │                              ├─────────────────────▶│
           │                              │ 10. Registration     │
           │                              │     Saved            │
           │                              │◀─────────────────────┤
           │                              │ 11. Update Course    │
           │                              │     Participants     │
           │                              ├─────────────────────▶│
           │                              │ 12. Course Updated   │
           │                              │◀─────────────────────┤
           │                              │ 13. @Transactional   │
           │                              │     commit           │
           │                              ├─────────────────────▶│
           │ 14. Registration Success     │                      │
           │◀─────────────────────────────┤                      │
           │                              │                      │
           │                              │                      │
           │ ERROR SCENARIO:              │                      │
           │                              │                      │
           │ 15. registerForCourse()      │                      │
           │     (with error)             │                      │
           ├─────────────────────────────▶│                      │
           │                              │ 16. @Transactional   │
           │                              │     begin            │
           │                              ├─────────────────────▶│
           │                              │ 17. Validation       │
           │                              │     Error            │
           │                              │ 18. @Transactional   │
           │                              │     rollback         │
           │                              ├─────────────────────▶│
           │ 19. Error Response           │                      │
           │◀─────────────────────────────┤                      │
```

---

## 🔄 FLOWCHART - LUỒNG QUYẾT ĐỊNH ĐĂNG KÝ KHÓA HỌC

```
                    START
                       │
                       ▼
              [User Click Enroll]
                       │
                       ▼
              [Check Authentication]
                       │
                       ▼
              ┌─────────────────┐
              │   Is Logged     │
              │     In?         │
              └─────────────────┘
                       │
              ┌─────── NO ───────┐
              ▼                  ▼
    [Redirect to Login]    [Get User Info]
              │                  │
              │                  ▼
              │            [Get Course Info]
              │                  │
              │                  ▼
              │            [Validate Course]
              │                  │
              │                  ▼
              │        ┌─────────────────┐
              │        │   Course        │
              │        │   Exists?       │
              │        └─────────────────┘
              │                  │
              │            ┌───── NO ─────┐
              │            ▼              ▼
              │    [Error: Course     [Check Course
              │     Not Found]        Status]
              │            │              │
              │            │              ▼
              │            │        ┌─────────────────┐
              │            │        │   Course        │
              │            │        │   Active?       │
              │            │        └─────────────────┘
              │            │              │
              │            │            NO │
              │            │              ▼
              │            │    [Error: Course
              │            │     Not Available]
              │            │              │
              │            │              ▼
              │            │        [Check Already
              │            │         Registered]
              │            │              │
              │            │              ▼
              │            │        ┌─────────────────┐
              │            │        │   Already       │
              │            │        │   Registered?   │
              │            │        └─────────────────┘
              │            │              │
              │            │            YES│
              │            │              ▼
              │            │    [Error: Already
              │            │     Enrolled]
              │            │              │
              │            │              ▼
              │            │        [Check Course
              │            │         Capacity]
              │            │              │
              │            │              ▼
              │            │        ┌─────────────────┐
              │            │        │   Course        │
              │            │        │   Full?         │
              │            │        └─────────────────┘
              │            │              │
              │            │            YES│
              │            │              ▼
              │            │    [Error: Course
              │            │     Full]
              │            │              │
              │            │              ▼
              │            │        [Check Course
              │            │         Price]
              │            │              │
              │            │              ▼
              │            │        ┌─────────────────┐
              │            │        │   Free Course?  │
              │            │        └─────────────────┘
              │            │              │
              │            │    ┌─────── YES ───────┐
              │            │    ▼                  ▼
              │            │[Direct Registration] [Payment Required]
              │            │    │                  │
              │            │    ▼                  ▼
              │            │[Create Registration] [Create Payment]
              │            │    │                  │
              │            │    ▼                  ▼
              │            │[Update Participants] [Generate VNPay URL]
              │            │    │                  │
              │            │    ▼                  ▼
              │            │[Success Message]   [Redirect to VNPay]
              │            │    │                  │
              │            │    ▼                  ▼
              │            │   END              [User Payment]
              │            │                      │
              │            │                      ▼
              │            │              [VNPay Callback]
              │            │                      │
              │            │                      ▼
              │            │              [Validate Payment]
              │            │                      │
              │            │                      ▼
              │            │              ┌─────────────────┐
              │            │              │   Payment       │
              │            │              │   Success?      │
              │            │              └─────────────────┘
              │            │                      │
              │            │              ┌───── NO ─────┐
              │            │              ▼              ▼
              │            │    [Payment Failed]   [Create Registration]
              │            │              │              │
              │            │              ▼              ▼
              │            │    [Error Message]   [Update Participants]
              │            │              │              │
              │            │              ▼              ▼
              │            │             END        [Success Message]
              │            │                          │
              │            │                          ▼
              │            │                         END
              │            │
              ▼            ▼
             END          END
```

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG REFUND VÀ HỦY ĐĂNG KÝ

```
Frontend (User)      Backend              Database           VNPay Gateway
     │                   │                    │                    │
     │ 1. Request Refund │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 2. Validate        │                    │
     │                   │    Payment         │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 3. Payment Found   │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 4. Check Refund    │                    │
     │                   │    Eligibility     │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 5. Eligible for    │                    │
     │                   │    Refund          │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 6. Cancel Course   │                    │
     │                   │    Registration    │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 7. Registration    │                    │
     │                   │    Cancelled       │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 8. Update Payment  │                    │
     │                   │    Status          │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 9. Payment         │                    │
     │                   │    Updated         │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 10. Process VNPay  │                    │
     │                   │     Refund         │                    │
     │                   ├─────────────────────────────────────────▶│
     │                   │ 11. Refund         │                    │
     │                   │     Processed      │                    │
     │                   │◀─────────────────────────────────────────┤
     │ 12. Refund        │                    │                    │
     │     Success       │                    │                    │
     │◀──────────────────┤                    │                    │
```

---

## 🔄 SEQUENCE DIAGRAM - LUỒNG MONITORING VÀ LOGGING

```
Frontend (User)      Backend              Database           Log System
     │                   │                    │                    │
     │ 1. User Action    │                    │                    │
     ├──────────────────▶│                    │                    │
     │                   │ 2. Log User        │                    │
     │                   │    Action          │                    │
     │                   ├─────────────────────────────────────────▶│
     │                   │ 3. Action Logged   │                    │
     │                   │◀─────────────────────────────────────────┤
     │                   │ 4. Process         │                    │
     │                   │    Business Logic  │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 5. Database        │                    │
     │                   │    Operation       │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 6. Operation       │                    │
     │                   │    Result          │                    │
     │                   │◀───────────────────┤                    │
     │                   │ 7. Log Operation   │                    │
     │                   │    Result          │                    │
     │                   ├─────────────────────────────────────────▶│
     │                   │ 8. Result Logged   │                    │
     │                   │◀─────────────────────────────────────────┤
     │                   │ 9. Update Metrics  │                    │
     │                   │    (if needed)     │                    │
     │                   ├───────────────────▶│                    │
     │                   │ 10. Metrics        │                    │
     │                   │     Updated        │                    │
     │                   │◀───────────────────┤                    │
     │ 11. Response      │                    │                    │
     │     to User       │                    │                    │
     │◀──────────────────┤                    │                    │
     │                   │                    │                    │
     │ ERROR SCENARIO:   │                    │                    │
     │                   │                    │                    │
     │ 12. Error         │                    │                    │
     │     Occurs        │                    │                    │
     │                   │ 13. Log Error      │                    │
     │                   │     Details        │                    │
     │                   ├─────────────────────────────────────────▶│
     │                   │ 14. Error Logged   │                    │
     │                   │◀─────────────────────────────────────────┤
     │                   │ 15. Send Error     │                    │
     │                   │     Alert          │                    │
     │                   ├─────────────────────────────────────────▶│
     │ 16. Error         │                    │                    │
     │     Response      │                    │                    │
     │◀──────────────────┤                    │                    │
```

---

## 📁 CÁC FILE CODE CHÍNH VÀ LUỒNG THỰC THI

### **1. FRONTEND - TRIGGER ĐĂNG KÝ**

#### **File: `frontend/src/pages/CoursesPage.jsx`**
- **Method: `handleEnroll(courseId)`** (dòng 160-200)
  - Kiểm tra authentication
  - Gọi `courseService.handleCourseEnrollment(courseId)`
  - Xử lý response: free course vs paid course
  - Hiển thị payment modal nếu cần thanh toán

#### **File: `frontend/src/services/courseService.js`**
- **Method: `handleCourseEnrollment(courseId)`** (dòng 188-225)
  - Gọi API đăng ký khóa học
  - Phân tích response để xác định free/paid
  - Trả về payment info nếu cần thanh toán

- **Method: `registerForCourse(courseId)`** (dòng 132-141)
  - Gọi API `POST /api/course-registrations/register/{courseId}`
  - Xử lý response từ backend

### **2. BACKEND - XỬ LÝ ĐĂNG KÝ**

#### **File: `backend/src/main/java/com/drugprevention/drugbe/controller/CourseRegistrationController.java`**

- **Method: `registerForCourse(courseId, authentication)`** (dòng 40-120)
  - **Bước 1**: Validate authentication
  - **Bước 2**: Tìm user từ database
  - **Bước 3**: Lấy thông tin khóa học
  - **Bước 4**: Kiểm tra điều kiện đăng ký:
    - Khóa học có active không?
    - User đã đăng ký chưa?
    - Còn chỗ trống không?
  - **Bước 5**: Phân loại khóa học:
    - **FREE COURSE**: Tạo registration trực tiếp
    - **PAID COURSE**: Trả về payment required

#### **File: `backend/src/main/java/com/drugprevention/drugbe/service/CourseRegistrationService.java`**

- **Method: `registerForCourse(userId, courseId)`** (dòng 25-85)
  - Validate user và course tồn tại
  - Kiểm tra điều kiện đăng ký
  - Tạo CourseRegistration entity
  - Cập nhật số lượng participants
  - Lưu vào database

### **3. LUỒNG THANH TOÁN VNPAY**

#### **File: `frontend/src/services/paymentService.js`**

- **Method: `createCoursePayment(courseId, amount, description)`** (dòng 5-60)
  - Tạo payment request với thông tin khóa học
  - Gọi API `POST /api/payments/vnpay/create`
  - Nhận payment URL từ backend

- **Method: `redirectToPayment(paymentUrl)`** (dòng 84+)
  - Redirect user đến VNPay portal

#### **File: `backend/src/main/java/com/drugprevention/drugbe/controller/PaymentController.java`**

- **Method: `createVnPayPayment(request, principal)`** (dòng 35-90)
  - **Bước 1**: Tạo Payment entity với status "PENDING"
  - **Bước 2**: Lưu payment vào database
  - **Bước 3**: Tạo VNPay parameters
  - **Bước 4**: Gọi VnPayService để tạo payment URL
  - **Bước 5**: Trả về payment URL cho frontend

#### **File: `backend/src/main/java/com/drugprevention/drugbe/service/VnPayService.java`**

- **Method: `createPaymentUrl(params)`** (dòng 15-70)
  - Tạo VNPay parameters theo chuẩn
  - Tạo HMAC SHA512 signature
  - Build payment URL với signature
  - Trả về URL hoàn chỉnh

### **4. CALLBACK VÀ HOÀN THÀNH THANH TOÁN**

#### **File: `backend/src/main/java/com/drugprevention/drugbe/controller/PaymentController.java`**

- **Method: `handleVnPayCallback(params)`** (dòng 252-275)
  - **Bước 1**: Validate VNPay signature
  - **Bước 2**: Kiểm tra response code
  - **Bước 3**: Cập nhật payment status
  - **Bước 4**: Tạo course registration nếu thành công
  - **Bước 5**: Redirect user về trang thành công

---

## 🎯 CÁC TRƯỜNG HỢP THÀNH CÔNG VÀ THẤT BẠI

### **✅ THÀNH CÔNG - KHÓA HỌC MIỄN PHÍ**

**Luồng thực thi:**
1. Frontend gọi `handleEnroll(courseId)`
2. Backend kiểm tra `course.getPrice() == 0`
3. Tạo registration trực tiếp
4. Trả về success message

**Code chạy:**
- `CoursesPage.jsx:handleEnroll()` → `courseService.handleCourseEnrollment()`
- `CourseRegistrationController:registerForCourse()` (dòng 100-110)
- `CourseRegistrationService:registerForCourse()` (dòng 25-85)

### **✅ THÀNH CÔNG - KHÓA HỌC CÓ PHÍ**

**Luồng thực thi:**
1. Frontend gọi `handleEnroll(courseId)`
2. Backend trả về `requiresPayment: true`
3. Frontend hiển thị payment modal
4. User click thanh toán → tạo VNPay payment
5. Redirect đến VNPay portal
6. User thanh toán thành công
7. VNPay callback → tạo registration
8. Redirect về trang thành công

**Code chạy:**
- `CoursesPage.jsx:handlePayment()` → `courseService.processVNPayPayment()`
- `PaymentController:createVnPayPayment()` (dòng 35-90)
- `VnPayService:createPaymentUrl()` (dòng 15-70)
- `PaymentController:handleVnPayCallback()` (dòng 252-275)

### **❌ THẤT BẠI - CÁC TRƯỜNG HỢP**

#### **1. User chưa đăng nhập**
- **Code chạy**: `CoursesPage.jsx:handleEnroll()` (dòng 162-166)
- **Kết quả**: Redirect đến `/login`

#### **2. Khóa học không tồn tại**
- **Code chạy**: `CourseRegistrationController:registerForCourse()` (dòng 55-60)
- **Kết quả**: Trả về error "Course not found"

#### **3. User đã đăng ký**
- **Code chạy**: `CourseRegistrationController:registerForCourse()` (dòng 75-80)
- **Kết quả**: Trả về error "User is already registered"

#### **4. Khóa học đã đầy**
- **Code chạy**: `CourseRegistrationController:registerForCourse()` (dòng 85-90)
- **Kết quả**: Trả về error "Course is full"

#### **5. Khóa học không active**
- **Code chạy**: `CourseRegistrationController:registerForCourse()` (dòng 65-70)
- **Kết quả**: Trả về error "Course is not available"

#### **6. Thanh toán thất bại**
- **Code chạy**: `PaymentController:handleVnPayCallback()` (dòng 252-275)
- **Kết quả**: Cập nhật payment status = "FAILED", không tạo registration

---

## 🔧 CÁC API ENDPOINTS CHÍNH

### **Course Registration APIs:**
- `POST /api/course-registrations/register/{courseId}` - Đăng ký khóa học
- `POST /api/course-registrations/complete-enrollment/{courseId}` - Hoàn thành đăng ký sau thanh toán
- `GET /api/course-registrations/check/{courseId}` - Kiểm tra trạng thái đăng ký
- `DELETE /api/course-registrations/cancel/{courseId}` - Hủy đăng ký

### **Payment APIs:**
- `POST /api/payments/vnpay/create` - Tạo VNPay payment
- `POST /api/payments/vnpay/callback` - Xử lý callback từ VNPay
- `POST /api/payments/vnpay/return` - Xử lý return từ VNPay

---

## 📊 DATABASE ENTITIES LIÊN QUAN

### **CourseRegistration Entity:**
- `userId` - ID của user đăng ký
- `courseId` - ID của khóa học
- `registrationDate` - Ngày đăng ký
- `status` - Trạng thái (ACTIVE, PENDING, CANCELLED)
- `isActive` - Có active không

### **Payment Entity:**
- `id` - Payment ID
- `userId` - ID của user thanh toán
- `amount` - Số tiền
- `currency` - Loại tiền (VND)
- `status` - Trạng thái (PENDING, COMPLETED, FAILED)
- `paymentMethod` - Phương thức thanh toán (VNPAY)
- `paymentUrl` - URL thanh toán VNPay

### **Course Entity:**
- `id` - Course ID
- `title` - Tên khóa học
- `price` - Giá (null = free, > 0 = paid)
- `currentParticipants` - Số người đã đăng ký
- `maxParticipants` - Số người tối đa
- `status` - Trạng thái (open, closed)
- `isActive` - Có active không

---

## 🎨 FRONTEND COMPONENTS

### **Payment Modal:**
- **File**: `CoursesPage.jsx` (dòng 200-230)
- **Chức năng**: Hiển thị thông tin thanh toán và nút thanh toán
- **Trigger**: Khi `response.requiresPayment = true`

### **Success/Error Messages:**
- **File**: `CoursesPage.jsx` (sử dụng Ant Design message)
- **Chức năng**: Hiển thị thông báo thành công/thất bại
- **Trigger**: Sau mỗi action đăng ký/thanh toán

---

## 🔒 SECURITY & VALIDATION

### **Authentication:**
- Tất cả API đều yêu cầu JWT token
- Sử dụng `@PreAuthorize` annotation
- Kiểm tra user ownership

### **Validation:**
- Validate course tồn tại và active
- Kiểm tra user chưa đăng ký
- Validate course capacity
- Validate VNPay signature

### **Error Handling:**
- Try-catch blocks trong tất cả methods
- Logging chi tiết cho debugging
- User-friendly error messages

---

## 📝 KẾT LUẬN

Luồng đăng ký khóa học được thiết kế để xử lý cả khóa học miễn phí và có phí một cách linh hoạt. Hệ thống sử dụng VNPay làm payment gateway chính và có cơ chế callback để xử lý kết quả thanh toán. Toàn bộ flow được bảo mật bằng JWT authentication và có validation đầy đủ ở cả frontend và backend.

---

## 🔍 CHI TIẾT BỔ SUNG - HIỂU SÂU HƠN VỀ HỆ THỐNG

### **📊 CẤU TRÚC DATABASE CHI TIẾT**

#### **CourseRegistration Entity - Cấu trúc đầy đủ:**
```java
@Entity
@Table(name = "course_registrations")
public class CourseRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "course_id")
    private Long courseId;
    
    private String status; // registered, attended, completed, cancelled
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate;
    
    @Column(name = "completion_date")
    private LocalDateTime completionDate;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**Các trạng thái registration:**
- `registered` - Đã đăng ký nhưng chưa bắt đầu
- `attended` - Đang tham gia khóa học
- `completed` - Đã hoàn thành khóa học
- `cancelled` - Đã hủy đăng ký

#### **Payment Entity - Cấu trúc đầy đủ:**
```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column(length = 3)
    private String currency; // VND
    
    @Column(name = "payment_method", length = 50, nullable = false)
    private String paymentMethod; // VNPAY
    
    @Column(length = 20)
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED
    
    @Column(name = "transaction_id", length = 100)
    private String transactionId; // VNPay transaction ID
    
    @Column(name = "payment_url", length = 1000)
    private String paymentUrl; // VNPay payment URL
    
    @Column(length = 500)
    private String description;
    
    @Column(name = "gateway_response", columnDefinition = "NVARCHAR(MAX)")
    private String gatewayResponse; // Raw VNPay response
    
    @Column(name = "error_message", length = 500)
    private String errorMessage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;
}
```

#### **Course Entity - Các trường quan trọng:**
```java
@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "max_participants")
    private Integer maxParticipants;
    
    @Column(name = "current_participants")
    private Integer currentParticipants;
    
    @Column(name = "price")
    private BigDecimal price; // null = free, > 0 = paid
    
    private String status; // open, closed, completed, cancelled
    
    @Column(name = "is_active")
    private Boolean isActive;
    
    @Column(name = "difficulty_level")
    private String difficultyLevel; // BEGINNER, INTERMEDIATE, ADVANCED
    
    @Column(name = "total_lessons")
    private Integer totalLessons;
    
    @Column(name = "certificate_enabled")
    private Boolean certificateEnabled;
    
    @Column(name = "enrollment_deadline")
    private LocalDateTime enrollmentDeadline;
}
```

### **🔄 LUỒNG XỬ LÝ CHI TIẾT HƠN**

#### **1. FRONTEND - XỬ LÝ ENROLLMENT (CoursePage.jsx)**

**Method `handleEnrollment()` (dòng 218-260):**
```javascript
const handleEnrollment = async () => {
  // 1. Kiểm tra authentication
  if (!authService.isAuthenticated()) {
    message.warning('Please login to enroll in this course');
    navigate('/login');
    return;
  }

  setEnrollmentLoading(true);
  try {
    // 2. Phân loại khóa học
    if (!course.price || course.price === 0) {
      // FREE COURSE - Đăng ký trực tiếp
      const response = await courseService.enrollInCourse(courseId);
      if (response.success) {
        message.success('Successfully enrolled in the course!');
        setIsEnrolled(true);
        await checkEnrollmentStatus();
      } else {
        message.error(response.error || 'Failed to enroll in course');
      }
    } else {
      // PAID COURSE - Tạo payment trước
      const paymentResponse = await paymentService.createCoursePayment(
        courseId, 
        course.price, 
        `Enrollment for ${course.title}`
      );
      
      if (paymentResponse.success) {
        message.info('Redirecting to payment gateway...');
        paymentService.redirectToPayment(paymentResponse.paymentUrl);
      } else {
        message.error(paymentResponse.error || 'Failed to create payment');
      }
    }
  } catch (error) {
    console.error('Error during enrollment:', error);
    message.error('An error occurred during enrollment');
  } finally {
    setEnrollmentLoading(false);
  }
};
```

#### **2. BACKEND - VALIDATION CHI TIẾT**

**CourseRegistrationController - Validation logic:**
```java
@PostMapping("/register/{courseId}")
public ResponseEntity<?> registerForCourse(@PathVariable Long courseId, Authentication authentication) {
    try {
        // 1. Validate authentication
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        String username = authentication.getName();
        User user = authService.findByUsername(username);
        
        // 2. Validate course exists
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course not found"));
        }
        
        Course course = courseOpt.get();
        
        // 3. Validate course availability
        if (!course.getIsActive() || !"open".equals(course.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course is not available for registration"));
        }
        
        // 4. Check enrollment deadline
        if (course.getEnrollmentDeadline() != null && 
            LocalDateTime.now().isAfter(course.getEnrollmentDeadline())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enrollment deadline has passed"));
        }
        
        // 5. Check if already registered
        boolean alreadyRegistered = courseRegistrationService.isUserRegisteredForCourse(user.getId(), courseId);
        if (alreadyRegistered) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is already registered for this course"));
        }
        
        // 6. Check course capacity
        if (course.getCurrentParticipants() >= course.getMaxParticipants()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Course is full"));
        }
        
        // 7. Handle free vs paid course
        if (course.getPrice() != null && course.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            // PAID COURSE - Return payment required
            return ResponseEntity.ok(Map.of(
                "requiresPayment", true,
                "courseId", courseId,
                "courseName", course.getTitle(),
                "price", course.getPrice(),
                "currency", "VND",
                "message", "This course requires payment. Please proceed with payment.",
                "nextStep", "PAYMENT_REQUIRED"
            ));
        } else {
            // FREE COURSE - Direct registration
            CourseRegistration registration = courseRegistrationService.registerForCourse(user.getId(), courseId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "registration", registration,
                "message", "Successfully registered for free course",
                "nextStep", "ACCESS_GRANTED"
            ));
        }
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body(Map.of("error", "Error registering for course: " + e.getMessage()));
    }
}
```

### **💳 VNPAY INTEGRATION CHI TIẾT**

#### **1. Tạo Payment URL (VnPayService.java)**

**Method `createPaymentUrl()`:**
```java
public String createPaymentUrl(Map<String, String> params) {
    try {
        // 1. Thêm các tham số bắt buộc cho VNPay
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr", "127.0.0.1");
        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        
        // 2. Sắp xếp tham số theo alphabet
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        
        // 3. Build hash data và query string
        for (int i = 0; i < fieldNames.size(); i++) {
            String name = fieldNames.get(i);
            String value = params.get(name);
            if ((value != null) && (value.length() > 0)) {
                hashData.append(name).append('=').append(value);
                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                }
                
                query.append(URLEncoder.encode(name, StandardCharsets.US_ASCII)).append('=')
                     .append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
                if (i < fieldNames.size() - 1) {
                    query.append('&');
                }
            }
        }
        
        // 4. Tạo chữ ký HMAC SHA512
        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        
        // 5. Build final URL
        String finalUrl = vnPayConfig.getPaymentUrl() + "?" + query.toString();
        return finalUrl;
    } catch (Exception e) {
        throw new RuntimeException("Error creating VNPay payment URL", e);
    }
}
```

#### **2. Xử lý Callback (PaymentController.java)**

**Method `handleVnPayCallback()`:**
```java
@PostMapping("/vnpay/callback")
public ResponseEntity<?> handleVnPayCallback(@RequestParam Map<String, String> params) {
    try {
        // 1. Validate VNPay signature
        String vnpSecureHash = params.get("vnp_SecureHash");
        if (!vnPayService.validateVnPayResponse(params, vnpSecureHash)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid VNPay signature!"));
        }
        
        // 2. Extract payment info
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String status = responseCode.equals("00") ? "SUCCESS" : "FAILED";
        
        // 3. Find payment record
        Payment payment = paymentService.getPaymentById(Long.valueOf(txnRef)).orElse(null);
        if (payment == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payment not found!"));
        }
        
        // 4. Update payment status
        payment.setStatus(status);
        payment.setTransactionId(params.get("vnp_TransactionNo"));
        payment.setGatewayResponse(params.toString());
        
        if (status.equals("SUCCESS")) {
            payment.setPaidAt(LocalDateTime.now());
            
            // 5. Extract courseId from orderInfo and create registration
            String orderInfo = params.get("vnp_OrderInfo");
            if (orderInfo != null && orderInfo.contains("Course ID: ")) {
                try {
                    String courseIdStr = orderInfo.substring(orderInfo.indexOf("Course ID: ") + 11);
                    if (courseIdStr.contains(" ")) {
                        courseIdStr = courseIdStr.substring(0, courseIdStr.indexOf(" "));
                    }
                    Long courseId = Long.valueOf(courseIdStr);
                    
                    // Create course registration
                    courseRegistrationService.registerForCourse(payment.getUser().getId(), courseId);
                } catch (Exception e) {
                    System.err.println("Error creating course registration: " + e.getMessage());
                }
            }
        }
        
        // 6. Save updated payment
        paymentService.createPayment(payment);
        
        return ResponseEntity.ok(Map.of("message", "Payment status updated", "status", status));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Error processing VNPay callback: " + e.getMessage()));
    }
}
```

### **🎯 CÁC TRƯỜNG HỢP ĐẶC BIỆT**

#### **1. Khóa học có deadline đăng ký**
```java
// Kiểm tra enrollment deadline
if (course.getEnrollmentDeadline() != null && 
    LocalDateTime.now().isAfter(course.getEnrollmentDeadline())) {
    return ResponseEntity.badRequest().body(Map.of("error", "Enrollment deadline has passed"));
}
```

#### **2. Khóa học có yêu cầu đặc biệt**
```java
// Kiểm tra prerequisites
if (course.getPrerequisites() != null && !course.getPrerequisites().isEmpty()) {
    // Logic kiểm tra user có đủ điều kiện không
    boolean meetsPrerequisites = checkUserPrerequisites(user, course.getPrerequisites());
    if (!meetsPrerequisites) {
        return ResponseEntity.badRequest().body(Map.of("error", "You don't meet the course prerequisites"));
    }
}
```

#### **3. Xử lý refund/hoàn tiền**
```java
@PostMapping("/refund/{paymentId}")
public ResponseEntity<?> refundPayment(@PathVariable Long paymentId, @RequestBody Map<String, String> request) {
    try {
        String reason = request.get("reason");
        Payment payment = paymentService.getPaymentById(paymentId).orElse(null);
        
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update payment status
        payment.setStatus("REFUNDED");
        payment.setRefundedAt(LocalDateTime.now());
        payment.setRefundReason(reason);
        
        // Cancel course registration
        courseRegistrationService.cancelCourseRegistration(payment.getUser().getId(), courseId);
        
        paymentService.createPayment(payment);
        
        return ResponseEntity.ok(Map.of("message", "Payment refunded successfully"));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Error refunding payment: " + e.getMessage()));
    }
}
```

### **📱 FRONTEND COMPONENTS CHI TIẾT**

#### **1. Payment Modal Component**
```javascript
// Payment Modal trong CoursesPage.jsx
const PaymentModal = ({ visible, paymentInfo, onOk, onCancel, loading }) => {
  return (
    <Modal
      title="Thanh toán khóa học"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <div>
        <h3>{paymentInfo?.courseName}</h3>
        <p>Giá: {paymentInfo?.price?.toLocaleString('vi-VN')} VND</p>
        <p>Phương thức: VNPay</p>
        <Alert
          message="Thông báo"
          description="Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch."
          type="info"
          showIcon
        />
      </div>
    </Modal>
  );
};
```

#### **2. Course Status Indicator**
```javascript
// Hiển thị trạng thái khóa học
const CourseStatus = ({ course, isEnrolled, enrollmentStatus }) => {
  if (isEnrolled) {
    return <Tag color="green">Đã đăng ký</Tag>;
  }
  
  if (course.currentParticipants >= course.maxParticipants) {
    return <Tag color="red">Đã đầy</Tag>;
  }
  
  if (course.enrollmentDeadline && new Date() > new Date(course.enrollmentDeadline)) {
    return <Tag color="orange">Hết hạn đăng ký</Tag>;
  }
  
  if (course.price && course.price > 0) {
    return <Tag color="blue">Có phí</Tag>;
  }
  
  return <Tag color="green">Miễn phí</Tag>;
};
```

### **🔧 CONFIGURATION VÀ ENVIRONMENT**

#### **1. VNPay Configuration**
```java
@Configuration
@ConfigurationProperties(prefix = "vnpay")
public class VnPayConfig {
    private String tmnCode;
    private String hashSecret;
    private String paymentUrl;
    private String returnUrl;
    private String ipnUrl;
    
    // Getters and setters
}
```

#### **2. Application Properties**
```properties
# VNPay Configuration
vnpay.tmnCode=DEMO
vnpay.hashSecret=SECRET_SHA256
vnpay.paymentUrl=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.returnUrl=http://localhost:3000/payment-return
vnpay.ipnUrl=http://localhost:8080/api/payments/vnpay/callback

# Course Configuration
course.max-participants=100
course.enrollment-deadline-days=7
course.auto-approve-free=true
```

### **📊 MONITORING VÀ LOGGING**

#### **1. Payment Logging**
```java
@Slf4j
public class PaymentService {
    public Payment createPayment(Payment payment) {
        log.info("Creating payment: userId={}, amount={}, description={}", 
                payment.getUser().getId(), payment.getAmount(), payment.getDescription());
        
        Payment savedPayment = paymentRepository.save(payment);
        
        log.info("Payment created: paymentId={}, status={}", 
                savedPayment.getId(), savedPayment.getStatus());
        
        return savedPayment;
    }
}
```

#### **2. Course Registration Metrics**
```java
@Service
public class CourseRegistrationMetricsService {
    public Map<String, Object> getRegistrationMetrics(Long courseId) {
        Map<String, Object> metrics = new HashMap<>();
        
        // Total registrations
        long totalRegistrations = courseRegistrationRepository.countByCourseId(courseId);
        metrics.put("totalRegistrations", totalRegistrations);
        
        // Active registrations
        long activeRegistrations = courseRegistrationRepository.countByCourseIdAndIsActiveTrue(courseId);
        metrics.put("activeRegistrations", activeRegistrations);
        
        // Completion rate
        long completedRegistrations = courseRegistrationRepository.countByCourseIdAndStatus(courseId, "completed");
        double completionRate = totalRegistrations > 0 ? (double) completedRegistrations / totalRegistrations : 0;
        metrics.put("completionRate", completionRate);
        
        // Revenue (for paid courses)
        BigDecimal totalRevenue = paymentRepository.sumAmountByCourseIdAndStatus(courseId, "SUCCESS");
        metrics.put("totalRevenue", totalRevenue);
        
        return metrics;
    }
}
```

### **🚀 PERFORMANCE OPTIMIZATION**

#### **1. Database Indexing**
```sql
-- Indexes for better performance
CREATE INDEX idx_course_registrations_user_course ON course_registrations(user_id, course_id);
CREATE INDEX idx_course_registrations_status ON course_registrations(status);
CREATE INDEX idx_payments_user_status ON payments(user_id, status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_courses_status_active ON courses(status, is_active);
```

#### **2. Caching Strategy**
```java
@Service
@CacheConfig(cacheNames = "courses")
public class CourseService {
    @Cacheable(key = "#courseId")
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }
    
    @CacheEvict(key = "#courseId")
    public void updateCourseParticipants(Long courseId) {
        // Update logic
    }
}
```

### **🔒 SECURITY ENHANCEMENTS**

#### **1. Rate Limiting**
```java
@RestController
@RateLimiter(name = "course-registration")
public class CourseRegistrationController {
    @PostMapping("/register/{courseId}")
    @RateLimiter(name = "course-registration", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<?> registerForCourse(@PathVariable Long courseId, Authentication authentication) {
        // Registration logic
    }
    
    public ResponseEntity<?> rateLimitFallback(Long courseId, Authentication authentication) {
        return ResponseEntity.status(429).body(Map.of("error", "Too many registration attempts. Please try again later."));
    }
}
```

#### **2. Input Validation**
```java
@Validated
public class CourseRegistrationController {
    @PostMapping("/register/{courseId}")
    public ResponseEntity<?> registerForCourse(
        @PathVariable @Min(1) Long courseId,
        @Valid Authentication authentication) {
        // Registration logic
    }
}
```

---

## 📝 KẾT LUẬN

Luồng đăng ký khóa học được thiết kế để xử lý cả khóa học miễn phí và có phí một cách linh hoạt. Hệ thống sử dụng VNPay làm payment gateway chính và có cơ chế callback để xử lý kết quả thanh toán. Toàn bộ flow được bảo mật bằng JWT authentication và có validation đầy đủ ở cả frontend và backend.

**Điểm mạnh của hệ thống:**
- ✅ Xử lý linh hoạt cả khóa học miễn phí và có phí
- ✅ Tích hợp VNPay an toàn với signature validation
- ✅ Validation đầy đủ ở nhiều tầng
- ✅ Error handling chi tiết
- ✅ Monitoring và logging tốt
- ✅ Performance optimization với caching và indexing
- ✅ Security enhancements với rate limiting

**Các tính năng nâng cao:**
- 🔄 Auto-completion sau thanh toán thành công
- 📊 Metrics và analytics cho course registration
- 🔒 Rate limiting để tránh spam
- 💰 Refund mechanism
- 📱 Responsive UI với Ant Design
- 🎯 Prerequisites checking
- ⏰ Enrollment deadline management 