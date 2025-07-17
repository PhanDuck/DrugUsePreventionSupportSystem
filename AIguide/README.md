# Drug Use Prevention Support System - Backend

## Tổng quan
Hệ thống hỗ trợ phòng chống ma túy với các chức năng chính:
- Đánh giá rủi ro sử dụng ma túy (CRAFFT, ASSIST)
- Quản lý khóa học và blog
- Hệ thống phân quyền (Admin, Consultant, User, Guest)
- Tư vấn và khuyến nghị

## Cấu trúc hệ thống

### Phân quyền
1. **ADMIN**: Quản lý toàn bộ hệ thống
   - Dashboard thống kê
   - Quản lý users, courses, blogs
   - Xem báo cáo

2. **CONSULTANT**: Tư vấn viên
   - Xem kết quả đánh giá
   - Tạo khuyến nghị
   - Tư vấn người dùng

3. **USER**: Người dùng đã đăng ký
   - Làm đánh giá
   - Xem khóa học
   - Nhận khuyến nghị

4. **GUEST**: Khách (chưa đăng nhập)
   - Xem blog
   - Đăng ký tài khoản

## Dữ liệu mẫu đã tạo

### Users mẫu:
- **Admin**: username: `admin`, password: `admin123`
- **Consultant 1**: username: `consultant1`, password: `consultant123`
- **Consultant 2**: username: `consultant2`, password: `consultant123`
- **User 1**: username: `user1`, password: `user123`
- **User 2**: username: `user2`, password: `user123`

### Assessment Types:
- CRAFFT (cho thanh thiếu niên 12-21 tuổi)
- ASSIST (cho người lớn 18+ tuổi)

### Courses:
- Hiểu biết về ma túy
- Kỹ năng từ chối ma túy
- Hỗ trợ người nghiện
- Tư vấn trực tuyến

### Blogs:
- Tác hại của ma túy đá
- Dấu hiệu nhận biết người sử dụng ma túy
- Cách phòng chống ma túy cho thanh thiếu niên
- Hành trình phục hồi của người nghiện
- Dịch vụ tư vấn miễn phí

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/signup` - Đăng ký

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard thống kê
- `GET /api/admin/users` - Quản lý users (có phân trang)
- `GET /api/admin/courses` - Quản lý courses (có phân trang)
- `GET /api/admin/blogs` - Quản lý blogs (có phân trang)

### Consultant APIs
- `GET /api/consultant/dashboard` - Dashboard consultant
- `GET /api/consultant/assessments` - Xem kết quả đánh giá
- `GET /api/consultant/recommendations` - Quản lý khuyến nghị
- `POST /api/consultant/recommendations` - Tạo khuyến nghị

### User APIs
- `GET /api/assessment/**` - Làm đánh giá
- `GET /api/course/**` - Xem khóa học
- `GET /api/user/**` - Thông tin cá nhân

### Public APIs
- `GET /api/blog/**` - Xem blog (không cần đăng nhập)

## Cấu hình

### Database
- SQL Server
- Database name: `DrugUsePreventionSystem`
- Username: `sa`
- Password: `123123`

### JWT Authentication
- Token có hiệu lực 24 giờ
- Sử dụng Bearer token trong header Authorization

## Hướng dẫn chạy

1. **Cài đặt dependencies:**
```bash
mvn clean install
```

2. **Chạy ứng dụng:**
```bash
mvn spring-boot:run
```

3. **Truy cập Swagger UI:**
```
http://localhost:8080/swagger-ui.html
```

## Các tính năng đã hoàn thành

✅ **Authentication & Authorization**
- JWT token authentication
- Role-based access control
- Login/Signup endpoints

✅ **Database & Data**
- Dữ liệu mẫu đầy đủ
- Users, Roles, Assessments, Courses, Blogs
- Relationships giữa các entities

✅ **Admin Features**
- Dashboard thống kê
- Quản lý users, courses, blogs
- Phân trang cho tất cả danh sách

✅ **Consultant Features**
- Dashboard consultant
- Xem kết quả đánh giá
- Tạo và quản lý khuyến nghị

✅ **Security**
- CORS configuration
- JWT authentication filter
- Role-based endpoint protection

## Cần hoàn thiện thêm

🔧 **AssessmentResultRepository**: Thêm method `findTop5ByOrderByCompletedAtDesc()`
🔧 **RecommendationRepository**: Thêm methods `countByIsRead()`, `findByIsRead()`, `findByConsultantID()`
🔧 **Recommendation Entity**: Thêm các setter methods
🔧 **AssessmentResultRepository**: Thêm method `findByResultLevelIn()`

## Lưu ý quan trọng

1. **Database**: Đảm bảo SQL Server đang chạy và có database `DrugUsePreventionSystem`
2. **Java Version**: Sử dụng Java 21 (không dùng Java 24 vì Spring Boot 3.3.0 chưa hỗ trợ)
3. **Port**: Ứng dụng chạy trên port 8080
4. **Security**: Hiện tại đã bật JWT authentication, cần gửi Bearer token trong header để truy cập các API được bảo vệ

## Testing

### Test đăng nhập:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test API với token:
```bash
curl -X GET http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
``` 