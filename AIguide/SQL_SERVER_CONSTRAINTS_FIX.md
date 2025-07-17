# SQL Server Constraints Fix

## Vấn đề

Khi chạy ứng dụng Spring Boot với SQL Server, bạn có thể gặp các lỗi như:

```
The object 'DF__blogs__status__7F2BE32F' is dependent on column 'status'.
```

Đây là lỗi phổ biến khi Hibernate cố gắng thay đổi schema database với `ddl-auto=update`, nhưng SQL Server có các ràng buộc (constraints) phụ thuộc vào các cột mà Hibernate đang cố gắng sửa đổi.

## Nguyên nhân

1. **Default Constraints**: SQL Server tự động tạo default constraints khi bạn định nghĩa default values
2. **Unique Constraints**: Các unique indexes được tạo tự động cho các cột unique
3. **Foreign Key Constraints**: Các ràng buộc khóa ngoại phụ thuộc vào cột

## Giải pháp

### Cách 1: Chạy script tự động (Khuyến nghị)

1. **Chạy script PowerShell**:
   ```powershell
   .\fix_constraints.ps1
   ```

2. **Hoặc chạy với tham số tùy chỉnh**:
   ```powershell
   .\fix_constraints.ps1 -ServerInstance "localhost" -Database "DrugPreventionDB" -Username "sa" -Password "123123"
   ```

### Cách 2: Chạy script SQL thủ công

1. Mở SQL Server Management Studio
2. Kết nối đến database `DrugPreventionDB`
3. Chạy script trong file `fix_sql_server_constraints.sql`

### Cách 3: Thay đổi cấu hình Hibernate

Thay đổi trong `application.properties`:

```properties
# Thay vì update, sử dụng validate hoặc none
spring.jpa.hibernate.ddl-auto=validate

# Hoặc tắt hoàn toàn
spring.jpa.hibernate.ddl-auto=none
```

## Các bước thực hiện

1. **Dừng ứng dụng Spring Boot**
2. **Chạy script sửa lỗi**:
   ```powershell
   .\fix_constraints.ps1
   ```
3. **Khởi động lại ứng dụng Spring Boot**

## Giải thích script

Script sẽ:

1. **Xóa các default constraints** cũ
2. **Thay đổi kiểu dữ liệu** cột thành `varchar(255)`
3. **Tạo lại default constraints** với tên mới
4. **Xóa và tạo lại unique indexes** cho các cột unique

## Lưu ý

- Script này an toàn và có thể chạy nhiều lần
- Backup database trước khi chạy (để đảm bảo an toàn)
- Sau khi chạy script, ứng dụng sẽ không còn báo lỗi constraints

## Troubleshooting

Nếu gặp lỗi khi chạy script:

1. **Kiểm tra kết nối database**: Đảm bảo SQL Server đang chạy
2. **Kiểm tra thông tin đăng nhập**: Username/password trong script
3. **Kiểm tra tên database**: Đảm bảo tên database đúng
4. **Chạy từng lệnh SQL riêng lẻ** trong SSMS để debug

## Cấu hình khuyến nghị

Để tránh vấn đề này trong tương lai, thay đổi cấu hình:

```properties
# Sử dụng validate thay vì update
spring.jpa.hibernate.ddl-auto=validate

# Hoặc sử dụng Flyway/Liquibase để quản lý schema
``` 