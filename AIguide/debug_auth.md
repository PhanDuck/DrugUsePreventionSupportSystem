# 🔍 AUTHENTICATION DEBUG GUIDE

## 1. Login và lấy token
```bash
POST /api/auth/login
{
  "username": "stab",
  "password": "your_password"
}
```

**Response sẽ có:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 16,
    "username": "stab",
    "role": "STAFF"
  }
}
```

## 2. Kiểm tra JWT payload
Vào https://jwt.io và paste token để decode xem:
- `sub`: username
- `role`: STAFF hay ROLE_STAFF?
- `exp`: token expiry

## 3. Test Authorization header
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

## 4. Check backend logs
Tìm dòng logs:
- `Username extracted from token: stab`
- `User details loaded: username=stab, authorities=[ROLE_STAFF]`
- `Authentication set successfully`

## 5. Common Issues:
- ❌ Token format: thiếu "Bearer " prefix
- ❌ Token expired: login lại
- ❌ Role format: STAFF vs ROLE_STAFF
- ❌ SecurityConfig order: rules conflict

## 6. Test endpoints theo thứ tự:
1. GET /api/courses (public) → 200 ✅
2. POST /api/staff/courses → 200 ✅ 
3. POST /api/courses → 200 ✅ 