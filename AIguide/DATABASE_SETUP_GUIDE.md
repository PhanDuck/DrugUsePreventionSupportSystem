# Hướng dẫn Setup Database

## Bước 1: Chạy Script Tạo Database

1. **Mở SQL Server Management Studio**
2. **Kết nối đến SQL Server** (localhost hoặc server của bạn)
3. **Chạy script `recreate_database.sql`**:
   - Mở file `drug-use-prevention-support-system/backend/recreate_database.sql`
   - Copy toàn bộ nội dung
   - Paste vào SSMS và chạy (F5)

## Bước 2: Kiểm tra kết quả

Script sẽ tạo:
- ✅ Database `DrugPreventionDB` với collation `Vietnamese_CI_AS`
- ✅ 13 bảng với dữ liệu mẫu
- ✅ Hỗ trợ Unicode cho tiếng Việt
- ✅ Tránh lỗi constraints khi chạy với Hibernate

## Bước 3: Chạy ứng dụng Spring Boot

Sau khi tạo database thành công:
1. **Mở IntelliJ IDEA**
2. **Chạy ứng dụng Spring Boot**
3. **Kiểm tra log** - sẽ không còn lỗi constraints

## Lưu ý quan trọng

- ✅ Script đã được sửa để tránh lỗi constraints
- ✅ Sử dụng `NVARCHAR(255)` cho các trường status
- ✅ Tạo unique indexes sau khi tạo bảng
- ✅ Hỗ trợ đầy đủ tiếng Việt Unicode

## Troubleshooting

Nếu vẫn gặp lỗi:
1. **Kiểm tra kết nối database** trong `application.properties`
2. **Đảm bảo SQL Server đang chạy**
3. **Kiểm tra quyền truy cập** của user `sa`

## Dữ liệu mẫu được tạo

- 👤 **Users**: admin, consultants, regular users
- 📚 **Courses**: 8 khóa học mẫu
- 📝 **Blogs**: 7 bài viết mẫu
- 📊 **Assessments**: 4 loại đánh giá (CRAFFT, ASSIST, AUDIT, DAST-10)
- 📅 **Appointments**: 7 lịch hẹn mẫu
- 📈 **Assessment Results**: 8 kết quả đánh giá mẫu

---

**Chạy script và thử nghiệm ngay!** 🚀 