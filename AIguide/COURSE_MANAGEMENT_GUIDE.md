# Hướng dẫn tích hợp quản lý khóa học (Frontend)

## Tổng quan
Tài liệu này dành cho lập trình viên backend muốn tích hợp API backend với các tính năng quản lý khóa học trên frontend. Các file sau liên quan trực tiếp đến quản lý khóa học và cần thiết cho việc tích hợp:

### Các file liên quan
- `frontend/src/pages/CoursePage.jsx` — Trang chi tiết khóa học và bài học
- `frontend/src/pages/CoursesPage.jsx` — Trang danh sách và lọc khóa học
- `frontend/src/pages/CourseManagementPage.jsx` — Trang quản lý CRUD khóa học (dành cho staff/admin)
- `frontend/src/services/courseService.js` — Service cho tất cả API khóa học và mock data
- `frontend/src/pages/SearchPage.jsx` — Tìm kiếm và lọc khóa học (và các thực thể khác)

## Trạng thái hiện tại
- Frontend hiện đang sử dụng mock data và localStorage cho toàn bộ thao tác với khóa học.
- Tất cả các API trong `courseService.js` đều là mock. Bạn cần thay thế bằng các API thực kết nối backend.
- Giao diện và thông báo đã được chuyển sang tiếng Anh để phù hợp với dự án tổng.

## Cần làm gì khi tích hợp backend
1. **Thay thế mock data bằng API thật**
   - Trong `courseService.js`, thay thế toàn bộ các hàm mock (getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCategories, ...) bằng các request HTTP thực tới backend.
   - Xóa hoặc comment các mảng mock (`mockCourses`, `mockCategories`).
2. **API Endpoint**
   - Đảm bảo backend cung cấp các endpoint:
     - Lấy tất cả khóa học
     - Lấy chi tiết khóa học theo ID
     - Tạo, cập nhật, xóa khóa học
     - Lấy danh mục khóa học
     - (Tùy chọn) Upload ảnh khóa học
     - (Tùy chọn) Lấy thống kê khóa học
3. **Data Model**
   - Đảm bảo dữ liệu trả về từ backend đúng với cấu trúc frontend mong đợi (tham khảo mock data trong `courseService.js`).
   - Giá trị danh mục phải là: `Basic`, `Advanced`, `Professional`.
4. **Kiểm thử**
   - Có thể chạy frontend với mock data để kiểm thử UI mà không cần backend.
   - Sau khi tích hợp backend, kiểm tra lại toàn bộ tính năng CRUD, lọc, tìm kiếm khóa học.

## Cách chạy frontend
1. Cài đặt dependencies:
   ```bash
   cd drug-use-prevention-support-system/frontend
   npm install
   ```
2. Chạy server phát triển:
   ```bash
   npm start
   ```
3. Ứng dụng sẽ chạy với mock data cho đến khi bạn cập nhật `courseService.js` sang dùng API thật.

## Lưu ý
- Lập trình viên backend chỉ cần các file trên để triển khai và kiểm thử tính năng quản lý khóa học.
- Nếu có thắc mắc về cấu trúc dữ liệu hoặc tích hợp, hãy xem comment trong `courseService.js` hoặc liên hệ frontend developer.

---

**Checklist cho tích hợp backend:**
- [ ] Thay toàn bộ mock data trong `courseService.js` bằng API thật
- [ ] Đảm bảo endpoint backend đúng với frontend
- [ ] Kiểm thử toàn bộ tính năng CRUD, lọc, tìm kiếm khóa học
- [ ] Đảm bảo giá trị danh mục: `Basic`, `Advanced`, `Professional`
- [ ] Xóa hoặc tắt mock data sau khi tích hợp 