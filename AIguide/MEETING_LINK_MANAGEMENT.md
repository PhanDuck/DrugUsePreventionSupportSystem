# 🎯 Quản Lý Link Gặp Mặt & Địa Điểm

## 📋 Tổng Quan

Hệ thống hỗ trợ 2 loại cuộc hẹn:
- **ONLINE**: Sử dụng link Meet/Zoom/Teams
- **IN_PERSON**: Gặp mặt trực tiếp tại địa điểm cụ thể

## 🔗 API Quản Lý Link

### 1. Thêm Link Online
```http
PUT /api/appointments/{appointmentId}/meeting-link
```
**Parameters:**
- `consultantId`: ID của consultant
- `meetingLink`: Link Meet/Zoom/Teams

**Ví dụ:**
```json
{
  "consultantId": 2,
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

### 2. Cập Nhật Link Online
```http
PUT /api/appointments/{appointmentId}/update-meeting-link
```
**Parameters:**
- `consultantId`: ID của consultant  
- `newMeetingLink`: Link mới

### 3. Xóa Link Online
```http
DELETE /api/appointments/{appointmentId}/meeting-link
```
**Parameters:**
- `consultantId`: ID của consultant

### 4. Thiết Lập Địa Điểm Gặp Mặt Trực Tiếp
```http
PUT /api/appointments/{appointmentId}/in-person-location
```
**Parameters:**
- `consultantId`: ID của consultant
- `location`: Địa chỉ (bắt buộc)
- `room`: Phòng (tùy chọn)
- `notes`: Ghi chú (tùy chọn)

**Ví dụ:**
```json
{
  "consultantId": 2,
  "location": "123 Đường ABC, Quận 1, TP.HCM",
  "room": "Phòng 301, Tầng 3",
  "notes": "Có bãi xe hơi, gần trạm xe buýt"
}
```

### 5. Lấy Thông Tin Gặp Mặt
```http
GET /api/appointments/{appointmentId}/meeting-info
```

**Response:**
```json
{
  "appointmentId": 1,
  "appointmentType": "ONLINE",
  "appointmentDate": "2024-01-15T14:00:00",
  "status": "CONFIRMED",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "type": "online"
}
```

## 🎯 Luồng Sử Dụng Thực Tế

### **Cho Consultant:**

1. **Nhận cuộc hẹn mới** → Kiểm tra loại (ONLINE/IN_PERSON)
2. **ONLINE**: Thêm link Meet vĩnh viễn hoặc tạo link mới
3. **IN_PERSON**: Thiết lập địa điểm, phòng, ghi chú
4. **Cập nhật link** nếu cần thay đổi
5. **Xóa link** nếu chuyển sang gặp trực tiếp

### **Cho User:**

1. **Đặt lịch** → Chọn loại cuộc hẹn
2. **Chờ consultant** thiết lập link/địa điểm
3. **Nhận thông báo** khi có link/địa điểm
4. **Tham gia cuộc hẹn** theo thông tin được cung cấp

## 🔐 Phân Quyền

- **CONSULTANT**: Thêm, cập nhật, xóa link/địa điểm cho cuộc hẹn của mình
- **ADMIN**: Quản lý tất cả link/địa điểm
- **USER**: Chỉ xem thông tin gặp mặt

## 📱 Ví Dụ JSON Test

### Tạo cuộc hẹn ONLINE:
```json
{
  "clientId": 1,
  "consultantId": 2,
  "appointmentDate": "2024-01-15T14:00:00",
  "durationMinutes": 60,
  "appointmentType": "ONLINE",
  "clientNotes": "Cần tư vấn về vấn đề stress",
  "fee": 150.0,
  "paymentMethod": "VNPAY"
}
```

### Tạo cuộc hẹn IN_PERSON:
```json
{
  "clientId": 1,
  "consultantId": 2,
  "appointmentDate": "2024-01-15T14:00:00",
  "durationMinutes": 60,
  "appointmentType": "IN_PERSON",
  "clientNotes": "Cần tư vấn trực tiếp",
  "fee": 200.0,
  "paymentMethod": "CASH"
}
```

### Thêm link Meet:
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/meeting-link" \
  -H "Content-Type: application/json" \
  -d '{
    "consultantId": 2,
    "meetingLink": "https://meet.google.com/abc-defg-hij"
  }'
```

### Thiết lập địa điểm:
```bash
curl -X PUT "http://localhost:8080/api/appointments/1/in-person-location" \
  -H "Content-Type: application/json" \
  -d '{
    "consultantId": 2,
    "location": "123 Đường ABC, Quận 1, TP.HCM",
    "room": "Phòng 301, Tầng 3",
    "notes": "Có bãi xe hơi, gần trạm xe buýt"
  }'
```

## 🎨 Gợi Ý Frontend

### **Component Quản Lý Link:**
```jsx
const MeetingLinkManager = ({ appointmentId, appointmentType, consultantId }) => {
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');

  const addOnlineLink = async () => {
    // Gọi API thêm link
  };

  const updateOnlineLink = async () => {
    // Gọi API cập nhật link
  };

  const setInPersonLocation = async () => {
    // Gọi API thiết lập địa điểm
  };

  return (
    <div>
      {appointmentType === 'ONLINE' ? (
        <div>
          <input 
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="Nhập link Meet/Zoom/Teams"
          />
          <button onClick={addOnlineLink}>Thêm Link</button>
          <button onClick={updateOnlineLink}>Cập Nhật Link</button>
        </div>
      ) : (
        <div>
          <input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Địa chỉ"
          />
          <input 
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Phòng (tùy chọn)"
          />
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú (tùy chọn)"
          />
          <button onClick={setInPersonLocation}>Thiết Lập Địa Điểm</button>
        </div>
      )}
    </div>
  );
};
```

## 🚀 Lợi Ích

1. **Linh hoạt**: Hỗ trợ cả online và offline
2. **Bảo mật**: Chỉ consultant mới có quyền quản lý link
3. **Tiện lợi**: Có thể cập nhật/xóa link khi cần
4. **Thông tin đầy đủ**: Bao gồm địa chỉ, phòng, ghi chú
5. **Tích hợp**: Hoạt động với hệ thống thông báo

## 📞 Hỗ Trợ

Nếu có vấn đề về quản lý link, liên hệ:
- **Technical Support**: support@drugprevention.com
- **Documentation**: `/api/swagger-ui.html`
- **Health Check**: `GET /api/appointments/health` 