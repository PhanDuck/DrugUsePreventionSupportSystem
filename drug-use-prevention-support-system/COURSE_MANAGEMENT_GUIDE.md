# Hướng dẫn sử dụng trang Quản lý khóa học

## Tổng quan
Trang quản lý khóa học được thiết kế dành cho Staff và Admin để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với các khóa học trong hệ thống.

## Tính năng chính

### 1. Thống kê tổng quan
- **Tổng khóa học**: Hiển thị số lượng khóa học trong hệ thống
- **Khóa học hoạt động**: Số khóa học đang trong trạng thái ACTIVE
- **Tổng học viên**: Tổng số học viên đã đăng ký
- **Doanh thu**: Tổng doanh thu từ các khóa học

### 2. Quản lý khóa học
- **Xem danh sách**: Hiển thị tất cả khóa học với thông tin chi tiết
- **Thêm mới**: Tạo khóa học mới với đầy đủ thông tin
- **Chỉnh sửa**: Cập nhật thông tin khóa học
- **Xem chi tiết**: Xem thông tin đầy đủ của khóa học
- **Xóa**: Xóa khóa học khỏi hệ thống

### 3. Thông tin khóa học
Mỗi khóa học bao gồm:
- Tên khóa học
- Mô tả
- Danh mục
- Giảng viên
- Thời lượng
- Số học viên tối đa
- Giá khóa học
- Ngày bắt đầu/kết thúc
- Trạng thái (DRAFT/ACTIVE)
- Nội dung khóa học (syllabus)
- Hình ảnh

## Cách truy cập

### 1. Từ Staff Dashboard
- Đăng nhập với tài khoản Staff
- Vào Staff Dashboard
- Click nút "Quản lý khóa học"

### 2. Từ Menu người dùng
- Đăng nhập với tài khoản Staff hoặc Admin
- Click vào avatar người dùng
- Chọn "Quản lý khóa học" từ dropdown menu

### 3. Truy cập trực tiếp
- URL: `/staff/courses`

## Hướng dẫn sử dụng

### Thêm khóa học mới
1. Click nút "Thêm khóa học mới"
2. Điền đầy đủ thông tin:
   - **Tên khóa học**: Bắt buộc
   - **Danh mục**: Chọn từ danh sách có sẵn
   - **Mô tả**: Mô tả chi tiết về khóa học
   - **Giảng viên**: Tên người giảng dạy
   - **Thời lượng**: VD: "4 tuần", "6 tháng"
   - **Số học viên tối đa**: Giới hạn số lượng học viên
   - **Giá khóa học**: Đơn vị VNĐ
   - **Ngày bắt đầu/kết thúc**: Thời gian diễn ra khóa học
   - **Trạng thái**: DRAFT (nháp) hoặc ACTIVE (hoạt động)
   - **Nội dung khóa học**: Mỗi dòng là một bài học
   - **URL hình ảnh**: Link hình ảnh đại diện
3. Click "Tạo khóa học"

### Chỉnh sửa khóa học
1. Click nút "Chỉnh sửa" (biểu tượng bút chì) trong bảng
2. Thay đổi thông tin cần thiết
3. Click "Cập nhật"

### Xem chi tiết khóa học
1. Click nút "Xem chi tiết" (biểu tượng mắt) trong bảng
2. Modal hiển thị đầy đủ thông tin khóa học
3. Click "Đóng" để thoát

### Xóa khóa học
1. Click nút "Xóa" (biểu tượng thùng rác) trong bảng
2. Xác nhận trong popup
3. Khóa học sẽ bị xóa khỏi hệ thống

## Mock Data

Hệ thống hiện có sẵn 4 khóa học mẫu:

1. **Khóa học phòng chống ma túy cơ bản**
   - Danh mục: Cơ bản
   - Giảng viên: Nguyễn Văn A
   - Thời lượng: 4 tuần
   - Giá: 500,000 VNĐ

2. **Khóa học nâng cao về phòng chống ma túy**
   - Danh mục: Nâng cao
   - Giảng viên: Trần Thị B
   - Thời lượng: 6 tuần
   - Giá: 800,000 VNĐ

3. **Khóa học cho phụ huynh**
   - Danh mục: Gia đình
   - Giảng viên: Lê Văn C
   - Thời lượng: 3 tuần
   - Giá: 300,000 VNĐ

4. **Khóa học cho giáo viên**
   - Danh mục: Giáo dục
   - Giảng viên: Phạm Thị D
   - Thời lượng: 5 tuần
   - Giá: 600,000 VNĐ
   - Trạng thái: DRAFT

## Danh mục khóa học

Hệ thống hỗ trợ 5 danh mục:
- **Cơ bản**: Khóa học cơ bản cho người mới bắt đầu
- **Nâng cao**: Khóa học nâng cao cho người có kinh nghiệm
- **Gia đình**: Khóa học dành cho phụ huynh
- **Giáo dục**: Khóa học dành cho giáo viên
- **Chuyên nghiệp**: Khóa học dành cho chuyên gia

## API Integration

Trang này được thiết kế để hoạt động với cả:
- **Backend API**: Khi backend sẵn sàng
- **Mock Data**: Khi backend chưa sẵn sàng

### API Endpoints được sử dụng:
- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/{id}` - Lấy chi tiết khóa học
- `POST /api/courses` - Tạo khóa học mới
- `PUT /api/courses/{id}` - Cập nhật khóa học
- `DELETE /api/courses/{id}` - Xóa khóa học
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/courses/stats` - Lấy thống kê khóa học
- `POST /api/courses/upload-image` - Upload hình ảnh

## Lưu ý

1. **Quyền truy cập**: Chỉ Staff và Admin mới có thể truy cập trang này
2. **Validation**: Tất cả trường bắt buộc phải được điền đầy đủ
3. **Trạng thái**: Khóa học có thể ở trạng thái DRAFT hoặc ACTIVE
4. **Hình ảnh**: Hiện tại chỉ hỗ trợ URL hình ảnh, chưa có upload file
5. **Mock Data**: Dữ liệu sẽ được reset khi refresh trang (vì chỉ lưu trong memory)

## Troubleshooting

### Lỗi thường gặp:
1. **Không thể tải dữ liệu**: Kiểm tra kết nối mạng và backend
2. **Form validation**: Đảm bảo điền đầy đủ các trường bắt buộc
3. **Ngày tháng**: Đảm bảo ngày kết thúc sau ngày bắt đầu
4. **Số học viên**: Số học viên tối đa phải lớn hơn 0

### Debug:
- Mở Developer Tools (F12) để xem console logs
- Kiểm tra Network tab để xem API calls
- Mock data sẽ hiển thị warning trong console khi API không khả dụng 