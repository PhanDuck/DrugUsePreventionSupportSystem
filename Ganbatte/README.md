# 📖 DRUG PREVENTION SUPPORT SYSTEM - DOCUMENTATION

## 🎉 CHÀO MỪNG NHÓM GANBATTE!

Đây là bộ tài liệu hoàn chỉnh cho **Drug Prevention Support System** được tạo riêng cho nhóm 3 người của bạn. Mỗi file tài liệu được thiết kế chi tiết để giúp từng thành viên hiểu rõ trách nhiệm và cách vận hành hệ thống.

## 📋 DANH SÁCH TÀI LIỆU

### 🔵 **00_TONG_QUAN_HE_THONG.md**
**Đối tượng:** Cả 3 thành viên  
**Nội dung:** 
- Tổng quan kiến trúc hệ thống
- Phân chia trách nhiệm rõ ràng
- Roles và permissions
- Setup hướng dẫn
- Checklist cho từng người

**📖 Đọc đầu tiên để hiểu big picture!**

---

### 🔵 **01_BACKEND_DAT_LICH_GUIDE.md**  
**Đối tượng:** Thành viên Backend - Luồng đặt lịch  
**Nội dung:**
- Chi tiết AppointmentController, ConsultantController, ReviewController
- AppointmentService business logic
- Database entities: Appointment, Review
- Repository patterns và custom queries
- Validation rules và security
- Email notifications
- Testing guidelines

**🎯 Dành cho người phụ trách appointment booking system**

---

### 🟢 **02_BACKEND_KHOA_HOC_GUIDE.md**
**Đối tượng:** Thành viên Backend - Luồng khóa học  
**Nội dung:**
- Chi tiết CourseController, CourseRegistrationController, StaffCourseController  
- CourseService và CourseRegistrationService
- Database entities: Course, CourseRegistration, CourseContent
- VNPay payment integration
- Course statistics và reporting
- Performance optimization

**🎯 Dành cho người phụ trách course management system**

---

### 🟡 **03_FRONTEND_GUIDE.md**
**Đối tượng:** Thành viên Frontend  
**Nội dung:**
- Cấu trúc toàn bộ React components
- Chi tiết các services (authService, courseService, appointmentService)
- Major pages breakdown với code examples
- Protected routes và role-based access
- Axios configuration
- Styling guidelines và responsive design
- Testing với React Testing Library

**🎯 Dành cho người phụ trách toàn bộ UI/UX**

---

### 🔐 **04_SECURITY_CONFIG_GUIDE.md**
**Đối tượng:** Cả 3 thành viên (quan trọng!)  
**Nội dung:**
- Kiến trúc bảo mật tổng thể
- Chi tiết authentication flow
- SecurityConfig.java và JwtAuthenticationFilter
- JwtService implementation
- Role-based access control
- Password security và CORS
- Common security issues và debugging

**🔒 Essential cho tất cả - hiểu bảo mật hệ thống**

---

### 📊 **05_DATA_FLOW_DIAGRAMS.md**
**Đối tượng:** Cả 3 thành viên  
**Nội dung:**
- Sequence diagrams cho các luồng chính
- Database relationship diagrams  
- Data validation layers
- Performance considerations
- Transaction management
- Event-driven updates

**📈 Hiểu luồng dữ liệu từ A đến Z**

---

## 🚀 HƯỚNG DẪN SỬ DỤNG TÀI LIỆU

### **BƯỚC 1: Đọc Tổng Quan (Cả nhóm)**
```
1. Mở file 00_TONG_QUAN_HE_THONG.md
2. Hiểu kiến trúc system và phân chia trách nhiệm
3. Xác định role của mình trong nhóm
4. Setup môi trường development
```

### **BƯỚC 2: Đọc File Chuyên Môn (Theo role)**

**🔵 Nếu bạn là Backend - Đặt lịch:**
```
1. Đọc 01_BACKEND_DAT_LICH_GUIDE.md từ đầu đến cuối
2. Focus vào AppointmentController và AppointmentService
3. Hiểu validation rules và business logic
4. Practice với appointment booking flow
5. Đọc 04_SECURITY_CONFIG_GUIDE.md cho security context
```

**🟢 Nếu bạn là Backend - Khóa học:**
```
1. Đọc 02_BACKEND_KHOA_HOC_GUIDE.md từ đầu đến cuối  
2. Focus vào CourseController và CourseService
3. Hiểu VNPay integration flow
4. Practice với course registration flow
5. Đọc 04_SECURITY_CONFIG_GUIDE.md cho security context
```

**🟡 Nếu bạn là Frontend:**
```
1. Đọc 03_FRONTEND_GUIDE.md từ đầu đến cuối
2. Hiểu React component structure
3. Practice với API integration
4. Hiểu authentication flow từ frontend perspective
5. Setup responsive design patterns
```

### **BƯỚC 3: Hiểu Bảo Mật (Cả nhóm)**
```
1. Đọc 04_SECURITY_CONFIG_GUIDE.md
2. Hiểu JWT authentication flow
3. Hiểu role-based access control
4. Practice debugging security issues
```

### **BƯỚC 4: Hiểu Data Flow (Cả nhóm)**
```
1. Đọc 05_DATA_FLOW_DIAGRAMS.md
2. Trace qua các sequence diagrams
3. Hiểu database relationships
4. Hiểu performance considerations
```

## 🎯 LEARNING PATH CHO TỪNG THÀNH VIÊN

### **👨‍💻 Backend Developer - Appointments**

**Tuần 1:**
- [ ] Đọc 00_TONG_QUAN_HE_THONG.md
- [ ] Đọc 01_BACKEND_DAT_LICH_GUIDE.md (sections 1-3)
- [ ] Setup development environment
- [ ] Hiểu AppointmentController endpoints

**Tuần 2:**  
- [ ] Đọc 01_BACKEND_DAT_LICH_GUIDE.md (sections 4-6)
- [ ] Hiểu AppointmentService business logic
- [ ] Practice tạo appointment validation
- [ ] Đọc 04_SECURITY_CONFIG_GUIDE.md

**Tuần 3:**
- [ ] Implement appointment booking flow
- [ ] Test API endpoints với Postman
- [ ] Đọc 05_DATA_FLOW_DIAGRAMS.md
- [ ] Debug common issues

### **👨‍💻 Backend Developer - Courses** 

**Tuần 1:**
- [ ] Đọc 00_TONG_QUAN_HE_THONG.md  
- [ ] Đọc 02_BACKEND_KHOA_HOC_GUIDE.md (sections 1-3)
- [ ] Setup development environment
- [ ] Hiểu CourseController endpoints

**Tuần 2:**
- [ ] Đọc 02_BACKEND_KHOA_HOC_GUIDE.md (sections 4-6)
- [ ] Hiểu CourseService và registration logic
- [ ] Hiểu VNPay integration
- [ ] Đọc 04_SECURITY_CONFIG_GUIDE.md

**Tuần 3:**
- [ ] Implement course registration flow
- [ ] Test payment integration
- [ ] Đọc 05_DATA_FLOW_DIAGRAMS.md
- [ ] Performance optimization

### **🎨 Frontend Developer**

**Tuần 1:**
- [ ] Đọc 00_TONG_QUAN_HE_THONG.md
- [ ] Đọc 03_FRONTEND_GUIDE.md (sections 1-3)  
- [ ] Setup React development environment
- [ ] Hiểu component structure

**Tuần 2:**
- [ ] Đọc 03_FRONTEND_GUIDE.md (sections 4-6)
- [ ] Implement authentication flow
- [ ] Create major pages (Login, Dashboard, Courses)
- [ ] Đọc 04_SECURITY_CONFIG_GUIDE.md (frontend security)

**Tuần 3:**
- [ ] Implement API integration
- [ ] Create appointment booking UI
- [ ] Test responsive design
- [ ] Đọc 05_DATA_FLOW_DIAGRAMS.md

## 🔧 TROUBLESHOOTING GUIDE

### **❌ Khi gặp lỗi Security 403/401:**
1. Đọc 04_SECURITY_CONFIG_GUIDE.md section "Debugging Security Issues"
2. Check JWT token trong browser developer tools
3. Verify role assignments trong database
4. Test với Postman để isolate frontend vs backend issues

### **❌ Khi gặp lỗi CORS:**
1. Đọc 04_SECURITY_CONFIG_GUIDE.md section "CORS Configuration"  
2. Check allowedOrigins trong SecurityConfig
3. Verify frontend URL matches CORS settings

### **❌ Khi API không hoạt động:**
1. Check backend logs
2. Verify database connection
3. Test endpoints với Swagger UI (http://localhost:8080/swagger-ui.html)
4. Đọc relevant sections trong API guides

### **❌ Khi Frontend không render đúng:**
1. Check browser console errors
2. Verify API responses với Network tab
3. Check component state và props
4. Đọc 03_FRONTEND_GUIDE.md troubleshooting section

## 📞 COLLABORATION WORKFLOW

### **💬 Daily Standup Questions:**
1. **Hôm qua tôi đã làm gì?** (reference specific sections từ docs)
2. **Hôm nay tôi sẽ làm gì?** (theo learning path)  
3. **Có blockers gì không?** (sử dụng troubleshooting guide)

### **🔄 Code Review Checklist:**
- [ ] Code follows patterns từ documentation
- [ ] Security best practices được implement
- [ ] Error handling theo guidelines
- [ ] Performance considerations được address
- [ ] Tests được viết theo examples

### **📝 Documentation Updates:**
- Khi implement features mới, update docs accordingly
- Share learnings với team members
- Keep troubleshooting guide updated với new issues

## 🎉 NEXT STEPS

### **Phase 1: Foundation (Tuần 1-3)**
- Setup development environment
- Understand system architecture  
- Implement basic CRUD operations
- Basic authentication working

### **Phase 2: Core Features (Tuần 4-6)**
- Complete appointment booking system
- Complete course registration with payment
- Full responsive frontend
- Role-based access working

### **Phase 3: Advanced Features (Tuần 7-8)**
- Real-time notifications
- Advanced search và filtering
- Performance optimization
- Comprehensive testing

### **Phase 4: Production (Tuần 9-10)**
- Deployment setup
- Security hardening  
- Performance monitoring
- User acceptance testing

---

## 💡 TIPS FOR SUCCESS

**🔥 Cho Backend Developers:**
- Luôn test APIs với realistic data
- Understand database relationships thoroughly
- Pay attention to transaction boundaries
- Monitor performance của complex queries

**🔥 Cho Frontend Developer:**  
- Think mobile-first khi design
- Handle loading và error states gracefully
- Implement proper form validation
- Test trên multiple browsers

**🔥 Cho Cả Nhóm:**
- Communicate early và often
- Share code patterns và best practices
- Review nhau's code regularly
- Keep documentation updated

---

**🚀 GOOD LUCK VÀ HAPPY CODING!**

*Tài liệu này được tạo với ❤️ để giúp nhóm Ganbatte thành công với Drug Prevention Support System project.* 