# 🛠️ Team Setup & Troubleshooting Guide

## 📌 Tổng Quan

File này hướng dẫn toàn bộ nhóm cách setup environment, chạy dự án, và giải quyết các vấn đề thường gặp.

### 👥 Phân Chia Công Việc
- **1 Backend Developer**: Phụ trách Spring Boot API
- **2 Frontend Developers**: Phụ trách React UI

---

## 🚀 Setup Environment

### 📋 Prerequisites

#### Cho Backend Developer:
```bash
# Java 21
java -version
# Java 21.0.x

# Maven
mvn -version
# Apache Maven 3.9.x

# SQL Server
# Microsoft SQL Server 2019+
```

#### Cho Frontend Developers:
```bash
# Node.js 18+
node -version
# v18.x.x hoặc v20.x.x

# npm
npm -version
# 8.x.x hoặc 9.x.x
```

### 🗄️ Database Setup

#### 1. Install SQL Server (Tất cả thành viên)
```sql
-- Tạo database
CREATE DATABASE DrugPreventionDB;

-- Tạo user (nếu cần)
CREATE LOGIN druguser WITH PASSWORD = '123123';
USE DrugPreventionDB;
CREATE USER druguser FOR LOGIN druguser;
ALTER ROLE db_owner ADD MEMBER druguser;
```

#### 2. Verify Connection
```bash
# Test connection string
Server: localhost,1433
Database: DrugPreventionDB
Username: sa (hoặc druguser)
Password: 123123
```

---

## 🏃‍♂️ Running the Project

### 🔧 Backend Setup (Backend Developer)

#### 1. Navigate to Backend Folder
```bash
cd DrugUsePreventionSupportSystem/drug-use-prevention-support-system/backend
```

#### 2. Configure Database
```properties
# Kiểm tra src/main/resources/application.properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=DrugPreventionDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=123123
```

#### 3. Run Backend
```bash
# Install dependencies
./mvnw clean install

# Run application
./mvnw spring-boot:run

# Trên Windows PowerShell
.\mvnw.cmd spring-boot:run
```

#### 4. Verify Backend is Running
- API Health: http://localhost:8080/api/appointments/health
- Swagger UI: http://localhost:8080/swagger-ui.html
- Console should show: "🚀 Starting Drug Prevention Support System Backend..."

### 🎨 Frontend Setup (Frontend Developers)

#### 1. Navigate to Frontend Folder
```bash
cd DrugUsePreventionSupportSystem/drug-use-prevention-support-system/frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run Frontend
```bash
npm run dev
```

#### 4. Verify Frontend is Running
- Frontend: http://localhost:3000
- Should see login page or homepage

---

## 🔄 Development Workflow

### 🏗️ Daily Workflow

#### Backend Developer:
```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend
cd drug-use-prevention-support-system/backend
./mvnw spring-boot:run

# 3. Test APIs in Swagger
# http://localhost:8080/swagger-ui.html

# 4. Make changes, test, commit
git add .
git commit -m "feat: add new appointment endpoint"
git push origin feature/appointment-api
```

#### Frontend Developers:
```bash
# 1. Pull latest changes
git pull origin main

# 2. Start frontend
cd drug-use-prevention-support-system/frontend
npm run dev

# 3. Work on components/pages
# Test in browser: http://localhost:3000

# 4. Commit changes
git add .
git commit -m "feat: add appointment booking UI"
git push origin feature/appointment-ui
```

### 🔄 Integration Testing

#### Daily Integration Check:
1. **Backend Dev**: Ensure APIs work in Swagger
2. **Frontend Devs**: Test API integration
3. **Team**: Test complete user flows together

---

## 🐛 Common Issues & Solutions

### 🔴 Backend Issues

#### Issue 1: `./mvnw command not found`
```bash
# Error trên PowerShell
./mvnw : The term './mvnw' is not recognized...

# Solutions:
# Option 1: Use .cmd file
.\mvnw.cmd spring-boot:run

# Option 2: Use full maven
mvn spring-boot:run

# Option 3: Check file permissions
chmod +x mvnw
```

#### Issue 2: Database Connection Failed
```
Error: Could not create connection to database server

# Solutions:
# 1. Check SQL Server is running
services.msc → SQL Server Browser → Start

# 2. Check connection string
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=DrugPreventionDB;encrypt=true;trustServerCertificate=true

# 3. Test with SQL Server Management Studio
Server: localhost,1433
Authentication: SQL Server Authentication
Login: sa
Password: 123123

# 4. Enable SQL Server Authentication
SQL Server Configuration Manager → 
SQL Server Network Configuration → 
Protocols for MSSQLSERVER → TCP/IP → Enable
```

#### Issue 3: Port 8080 Already in Use
```
Error: Port 8080 was already in use

# Solutions:
# 1. Kill process using port 8080
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# 2. Change port in application.properties
server.port=8081

# 3. Stop other Java applications
```

#### Issue 4: JWT Token Issues
```
Error: JWT signature does not match

# Solutions:
# 1. Clear browser localStorage
localStorage.clear()

# 2. Restart backend server
Ctrl+C → ./mvnw spring-boot:run

# 3. Check jwt.secret in application.properties
jwt.secret=ThisIsAReallyLongAndSecureSecretKeyForJwtToken123456
```

### 🔵 Frontend Issues

#### Issue 1: `npm install` Fails
```
Error: npm ERR! peer dep missing

# Solutions:
# 1. Clear npm cache
npm cache clean --force

# 2. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Use yarn instead
npm install -g yarn
yarn install

# 4. Check Node.js version
node -v  # Should be 18+ or 20+
```

#### Issue 2: CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy

# Solutions:
# 1. Check Vite proxy configuration
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false
    }
  }
}

# 2. Verify backend CORS settings
@CrossOrigin(origins = "*")  // in controllers

# 3. Check API base URL
const API_BASE_URL = 'http://localhost:8080/api';
```

#### Issue 3: Authentication Not Working
```
Error: 401 Unauthorized

# Solutions:
# 1. Check token in localStorage
console.log(localStorage.getItem('token'));

# 2. Verify token format
Authorization: Bearer <token>

# 3. Check backend JWT filter
JwtAuthenticationFilter logs

# 4. Test login API directly
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"admin123"}'
```

#### Issue 4: API Calls Not Working
```
Error: Network Error / Request failed

# Solutions:
# 1. Check if backend is running
http://localhost:8080/api/appointments/health

# 2. Check network tab in browser dev tools
F12 → Network → XHR/Fetch

# 3. Verify API endpoint URLs
const API_BASE_URL = 'http://localhost:8080/api';

# 4. Check axios configuration
// config/axios.js
axios.defaults.baseURL = 'http://localhost:8080/api';
```

### 🟡 Database Issues

#### Issue 1: Database Connection Timeout
```
Error: Connection timeout

# Solutions:
# 1. Check SQL Server services
services.msc → SQL Server (MSSQLSERVER) → Running

# 2. Enable TCP/IP protocol
SQL Server Configuration Manager →
SQL Server Network Configuration →
Protocols for MSSQLSERVER → TCP/IP → Enabled

# 3. Check firewall
Windows Defender Firewall → Allow app: SQL Server
```

#### Issue 2: Login Failed for User 'sa'
```
Error: Login failed for user 'sa'

# Solutions:
# 1. Enable SQL Server Authentication
SSMS → Server Properties → Security → 
SQL Server and Windows Authentication mode

# 2. Reset sa password
ALTER LOGIN sa WITH PASSWORD = '123123';
ALTER LOGIN sa ENABLE;

# 3. Create new user
CREATE LOGIN druguser WITH PASSWORD = '123123';
USE DrugPreventionDB;
CREATE USER druguser FOR LOGIN druguser;
ALTER ROLE db_owner ADD MEMBER druguser;
```

---

## 🔧 Development Tools

### 📊 Useful Tools cho Backend Dev

#### 1. Swagger UI
```
URL: http://localhost:8080/swagger-ui.html
Purpose: Test APIs, view documentation
Usage: Test endpoints without frontend
```

#### 2. SQL Server Management Studio (SSMS)
```
Purpose: Database management, query testing
Connection: localhost,1433
Usage: View tables, run queries, check data
```

#### 3. Postman (Optional)
```
Purpose: API testing tool
Usage: Test complex requests, save collections
```

### 🎨 Useful Tools cho Frontend Devs

#### 1. Browser DevTools
```
F12 → Network tab: Monitor API calls
F12 → Console: Check errors, logs
F12 → Application → localStorage: Check auth tokens
```

#### 2. React DevTools (Browser Extension)
```
Purpose: Debug React components
Usage: Inspect component state, props
```

#### 3. VS Code Extensions
```
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- Prettier - Code formatter
- ESLint
```

---

## 📚 Testing Guide

### 🧪 Manual Testing Checklist

#### Authentication Flow:
```
□ User can register new account
□ User can login with correct credentials
□ User cannot login with wrong credentials
□ User stays logged in after page refresh
□ User can logout successfully
□ JWT token expires correctly (24h)
```

#### Appointment System:
```
□ User can view available consultants
□ User can see consultant's available time slots
□ User can book appointment
□ User cannot book conflicting appointments
□ User can view their appointments
□ User can cancel appointments
□ Consultant can view their appointments
```

#### Course System:
```
□ Public can view all courses
□ User can register for courses (after login)
□ User cannot register twice for same course
□ User can view their enrolled courses
□ Staff can create/edit courses
```

### 🔍 API Testing với Swagger

#### Test Login:
```
1. Go to http://localhost:8080/swagger-ui.html
2. Find "Auth Controller" → POST /api/auth/login
3. Click "Try it out"
4. Enter JSON:
{
  "userName": "admin",
  "password": "admin123"
}
5. Click "Execute"
6. Should get 200 response with token
```

#### Test Protected Endpoints:
```
1. Copy token from login response
2. Click "Authorize" button (top right)
3. Enter: Bearer <your_token>
4. Now test protected endpoints like GET /api/appointments
```

---

## 🚨 Emergency Troubleshooting

### 🆘 Project Won't Start

#### Quick Reset Steps:
```bash
# 1. Stop all running processes
Ctrl+C (in all terminals)

# 2. Check ports
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# 3. Kill processes if needed
taskkill /PID <process_id> /F

# 4. Clean restart backend
cd drug-use-prevention-support-system/backend
./mvnw clean
./mvnw spring-boot:run

# 5. Clean restart frontend (new terminal)
cd drug-use-prevention-support-system/frontend
rm -rf node_modules
npm install
npm run dev
```

### 🔥 Nuclear Option (Complete Reset)
```bash
# 1. Stop all processes
# 2. Pull latest code
git stash
git pull origin main

# 3. Reset backend
cd backend
./mvnw clean install

# 4. Reset frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install

# 5. Reset database (if needed)
# Drop and recreate DrugPreventionDB in SSMS

# 6. Start backend
cd ../backend
./mvnw spring-boot:run

# 7. Start frontend (new terminal)
cd frontend
npm run dev
```

---

## 📞 Communication Protocol

### 🤝 Team Communication

#### Daily Standup Questions:
```
1. What did you work on yesterday?
2. What will you work on today?
3. Any blockers or issues?
4. Any API changes that affect others?
```

#### When Backend Changes API:
```
1. Update Swagger documentation
2. Notify frontend team
3. Provide example requests/responses
4. Wait for frontend testing before merging
```

#### When Frontend Needs New API:
```
1. Describe what data is needed
2. Provide mockup/wireframe if helpful
3. Specify required fields and data types
4. Define expected error cases
```

### 📋 Issue Reporting Template

```markdown
## Issue Description
Brief description of the problem

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Edge (for frontend issues)
- Java Version: (for backend issues)
- Node Version: (for frontend issues)

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Error Messages
Any error messages or logs

## Screenshots
If applicable
```

---

## 🎯 Success Metrics

### ✅ Definition of Done

#### For Backend Developer:
```
□ API endpoint works in Swagger
□ Proper error handling implemented
□ Security annotations added
□ Database operations work correctly
□ Code is documented
□ No breaking changes to existing APIs
```

#### For Frontend Developers:
```
□ Component renders correctly
□ API integration works
□ Error states handled gracefully
□ Loading states implemented
□ Responsive design (mobile-friendly)
□ User feedback provided (toasts/notifications)
```

#### For Team Integration:
```
□ Frontend can call backend APIs
□ Authentication flow works end-to-end
□ User roles and permissions work
□ Complete user scenarios tested
□ No console errors
□ Performance is acceptable
```

---

## 🎊 Kết Luận

Làm việc nhóm hiệu quả cần:

1. **Clear Communication**: Thông báo thay đổi kịp thời
2. **Consistent Environment**: Cùng setup môi trường phát triển
3. **Regular Testing**: Test integration thường xuyên
4. **Proper Documentation**: Ghi chép API và code changes
5. **Issue Resolution**: Giải quyết vấn đề nhanh chóng

**Remember**: Khi gặp vấn đề, hãy:
1. Đọc error message carefully
2. Check console/logs
3. Google the error
4. Ask team members
5. Document solution for others

**Daily Checklist**:
- [ ] Pull latest code
- [ ] Start your part (BE/FE)
- [ ] Test your changes
- [ ] Communicate with team
- [ ] Commit and push code 