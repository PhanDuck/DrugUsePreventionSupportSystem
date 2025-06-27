# Hệ thống hỗ trợ phòng ngừa sử dụng ma túy - Nền tảng Web
## 📌 Giới thiệu
Hệ thống hỗ trợ phòng ngừa sử dụng ma túy là một nền tảng web toàn diện, được thiết kế để hỗ trợ cá nhân và cộng đồng trong việc phòng chống và giảm thiểu tác hại của việc sử dụng ma túy. Hệ thống cung cấp thông tin, tài liệu giáo dục, công cụ sàng lọc, và dịch vụ tư vấn trực tuyến, với giao diện người dùng hiện đại và tương tác cao được xây dựng bằng React.

## 🚀 Công nghệ sử dụng
React.js (Frontend) - Xây dựng giao diện người dùng động và tương tác.

HTML, CSS, JavaScript - Ngôn ngữ và công nghệ nền tảng.


Spring Boot (Backend) - Xây dựng API mạnh mẽ và quản lý logic nghiệp vụ.

SQL - Hệ quản trị cơ sở dữ liệu quan hệ.

Firebase Authentication - Xác thực người dùng (hoặc có thể sử dụng Spring Security nếu muốn quản lý hoàn toàn backend để đồng bộ hơn).

RESTful API - Giao thức giao tiếp giữa frontend (React) và backend (Spring Boot).

## 📜 Các tính năng chính
Hệ thống cung cấp các vai trò khác nhau như Guest, Member, Staff, Consultant, Manager, Admin, với các tính năng tương ứng:

## 🌐 Tính năng chung (Guest/Member)
Giới thiệu thông tin, chia sẻ kinh nghiệm: Trang chủ và các trang bài viết giới thiệu thông tin, blog chia sẻ kinh nghiệm về phòng chống ma túy, được trình bày một cách trực quan bằng React components.

Khóa học online: Chức năng tìm kiếm và đăng ký các khóa học online về ma túy (nhận thức ma túy, kỹ năng phòng tránh, kỹ năng từ chối,...) với giao diện thân thiện, dễ dàng điều hướng. Nội dung khóa học được phân loại theo độ tuổi (học sinh, sinh viên, phụ huynh, giáo viên,...).

Công cụ sàng lọc và đánh giá nguy cơ: Các bài khảo sát trắc nghiệm như ASSIST, CRAFFT,... được xây dựng dưới dạng form tương tác trong React, giúp người dùng dễ dàng hoàn thành. Hệ thống sẽ tự động hiển thị kết quả và đề xuất hành động phù hợp (tham gia khóa đào tạo, gặp chuyên viên tư vấn...) dựa trên kết quả đánh giá.

Đặt lịch hẹn tư vấn: Chức năng đặt lịch hẹn tư vấn trực tuyến với chuyên viên tư vấn được thực hiện thông qua giao diện lịch biểu tương tác, giúp người dùng dễ dàng chọn thời gian phù hợp.

## 👩‍💻 Tính năng cho Staff/Consultant/Manager
Quản lý chương trình truyền thông và giáo dục cộng đồng: Giao diện quản lý rõ ràng, cho phép tạo, chỉnh sửa, xóa các chương trình truyền thông và giáo dục. Hỗ trợ tích hợp các bài khảo sát trước/sau chương trình để thu thập phản hồi và cải tiến.

Quản lý thông tin chuyên viên tư vấn: Giao diện quản lý thông tin cá nhân, bằng cấp, chuyên môn, và lịch làm việc của các chuyên viên tư vấn.

##⚙️ Tính năng cho Admin
Quản lý hồ sơ người dùng: Quản lý thông tin người dùng, lịch sử đặt lịch hẹn tư vấn, và lịch sử tham gia các chương trình truyền thông và giáo dục cộng đồng thông qua các bảng dữ liệu và form chỉnh sửa dễ sử dụng.

Dashboard & Report: Tổng quan trực quan về hoạt động của hệ thống, bao gồm các biểu đồ, số liệu thống kê về người dùng, hiệu quả chương trình, được xây dựng bằng các thư viện biểu đồ trong React.
