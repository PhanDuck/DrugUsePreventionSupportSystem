# 📚 Hướng Dẫn Tích Hợp API Khóa Học - CoursePage Integration Guide

## 🎯 Tổng Quan

Tài liệu này giải thích chi tiết cách hệ thống khóa học hoạt động, đặc biệt là trang CoursePage (`/courses/:id`) và cách nó tích hợp với backend APIs để hiển thị nội dung khóa học.

## 🏗️ Kiến Trúc Hệ Thống

### 📊 Database Schema

```sql
-- Bảng khóa học chính
courses
├── id, title, description
├── price, difficulty_level, language
├── total_lessons, total_duration_minutes
├── thumbnail_url, preview_video_url
├── certificate_enabled, enrollment_deadline
└── prerequisites, learning_outcomes, tags

-- Bảng bài học
course_lessons
├── id, course_id, title, description
├── lesson_order, estimated_duration
├── is_published, is_free, required_completion
├── learning_objectives, prerequisites
└── created_at, updated_at, created_by

-- Bảng nội dung bài học
course_contents
├── id, course_id, lesson_id
├── title, description, content_type
├── video_url, video_duration, video_thumbnail
├── text_content (HTML supported)
├── meet_link, meet_start_time, meet_end_time, meet_password
├── document_url, document_name, document_size
├── content_order, is_published, is_free
└── required_completion, estimated_duration
```

### 🔗 Entity Relationships

```
Course (1) -----> (N) CourseLesson
Course (1) -----> (N) CourseContent  
CourseLesson (1) -> (N) CourseContent
User (1) --------> (N) CourseProgress
Course (1) ------> (N) CourseProgress
```

## 🛠️ Backend APIs

### 👨‍💼 Staff Course Management APIs

#### **1. Course APIs**
```http
GET    /api/staff/courses                    # Lấy tất cả khóa học
GET    /api/staff/courses/{courseId}         # Lấy chi tiết khóa học
POST   /api/staff/courses                    # Tạo khóa học mới
PUT    /api/staff/courses/{courseId}         # Cập nhật khóa học
DELETE /api/staff/courses/{courseId}         # Xóa khóa học
```

#### **2. Lesson APIs**
```http
GET    /api/staff/courses/{courseId}/lessons                    # Lấy tất cả bài học
GET    /api/staff/courses/{courseId}/lessons/{lessonId}         # Lấy chi tiết bài học
POST   /api/staff/courses/{courseId}/lessons                    # Tạo bài học mới
PUT    /api/staff/courses/{courseId}/lessons/{lessonId}         # Cập nhật bài học
DELETE /api/staff/courses/{courseId}/lessons/{lessonId}         # Xóa bài học
```

#### **3. Content APIs**
```http
GET    /api/staff/courses/{courseId}/content                    # Lấy tất cả nội dung
GET    /api/staff/courses/{courseId}/lessons/{lessonId}/content # Lấy nội dung bài học
GET    /api/staff/courses/{courseId}/content/{contentId}        # Lấy chi tiết nội dung
POST   /api/staff/courses/{courseId}/content                    # Tạo nội dung mới
PUT    /api/staff/courses/{courseId}/content/{contentId}        # Cập nhật nội dung
DELETE /api/staff/courses/{courseId}/content/{contentId}        # Xóa nội dung
```

### 👤 User Course APIs

#### **1. Course Registration**
```http
POST   /api/courses/{courseId}/register      # Đăng ký khóa học
GET    /api/courses/{courseId}/progress      # Lấy tiến độ học tập
PUT    /api/courses/{courseId}/progress      # Cập nhật tiến độ
```

#### **2. Course Content Access**
```http
GET    /api/courses/{courseId}/lessons       # Lấy bài học (user view)
GET    /api/courses/{courseId}/content       # Lấy nội dung (user view)
```

## 🎨 Frontend CoursePage Implementation

### 📁 File Structure
```
frontend/src/pages/CoursePage.jsx
├── State Management
├── API Integration
├── Content Rendering
└── User Interactions
```

### 🔄 Data Flow

#### **1. Page Load Process**
```javascript
// 1. Load course data
const loadCourseData = async () => {
  const response = await courseService.getCourseById(courseId);
  setCourse(response.data);
}

// 2. Load lessons from backend
const loadLessonsFromBackend = async () => {
  const lessonsResponse = await staffCourseService.getCourseLessons(courseId);
  // Transform backend data to frontend format
  const transformedLessons = await Promise.all(lessonsResponse.data.map(async (lesson) => {
    // Load content for each lesson
    const contentResponse = await staffCourseService.getLessonContent(lesson.id);
    return {
      id: lesson.id,
      type: lessonContent.contentType === 'VIDEO' ? 'video' : 'reading',
      title: lesson.title,
      content: lessonContent.textContent,
      videoUrl: lessonContent.videoUrl,
      meetLink: lessonContent.meetLink,
      meetPassword: lessonContent.meetPassword
    };
  }));
  setLessons(transformedLessons);
}
```

#### **2. Data Mapping (Backend → Frontend)**

| Backend Field | Frontend Field | Description |
|---------------|----------------|-------------|
| `lesson.id` | `id` | Lesson ID |
| `lesson.title` | `title` | Lesson title |
| `content.contentType` | `type` | 'video' or 'reading' |
| `content.textContent` | `content` | Text content for reading |
| `content.videoUrl` | `videoUrl` | YouTube video URL |
| `content.meetLink` | `meetLink` | Google Meet link |
| `content.meetPassword` | `meetPassword` | Meet password |

### 🎭 Content Rendering

#### **1. Video Content**
```javascript
{item.type === 'video' && (
  <>
    <Card style={{ marginBottom: '16px' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={convertYoutubeLinkToEmbed(item.videoUrl)}
          title={item.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
    </Card>
    {item.description && (
      <Card>
        <Paragraph>{item.description}</Paragraph>
      </Card>
    )}
  </>
)}
```

#### **2. Text Content**
```javascript
{item.type === 'reading' && (
  <Card>
    <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
      {item.content} {/* Rendered from textContent */}
    </Paragraph>
  </Card>
)}
```

#### **3. Meet Link Content**
```javascript
{item.meetLink && (
  <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <LinkOutlined style={{ color: '#52c41a' }} />
        <Text strong>Live Session Link:</Text>
        <Button type="link" href={item.meetLink} target="_blank">
          Join Google Meet
        </Button>
      </Space>
      {item.meetPassword && (
        <Space>
          <Text type="secondary">Password:</Text>
          <Text code>{item.meetPassword}</Text>
        </Space>
      )}
    </Space>
  </Card>
)}
```

### 🔧 API Service Integration

#### **1. CourseService (courseService.js)**
```javascript
// Get course by ID
getCourseById: async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return { success: true, data: response.data };
}

// Handle course enrollment
handleCourseEnrollment: async (courseId) => {
  const response = await api.post(`/courses/${courseId}/register`);
  return { success: true, data: response.data };
}
```

#### **2. StaffCourseService (staffCourseService.js)**
```javascript
// Get course lessons
getCourseLessons: async (courseId) => {
  const response = await apiClient.get(`/staff/courses/${courseId}/lessons`);
  return { success: true, data: response.data };
}

// Get lesson content
getLessonContent: async (lessonId) => {
  const response = await apiClient.get(`/staff/courses/lessons/${lessonId}/content`);
  return { success: true, data: response.data };
}

// Create lesson
createLesson: async (courseId, lessonData) => {
  const response = await apiClient.post(`/staff/courses/${courseId}/lessons`, lessonData);
  return { success: true, data: response.data };
}
```

## 📋 API Response Examples

### **1. Course Data Response**
```json
{
  "id": 1,
  "title": "Hiểu biết cơ bản về tác hại của ma túy",
  "description": "Khóa học cung cấp kiến thức cơ bản về các loại ma túy...",
  "price": 0.00,
  "difficultyLevel": "BEGINNER",
  "totalLessons": 8,
  "totalDurationMinutes": 240,
  "thumbnailUrl": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400"
}
```

### **2. Lesson Data Response**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "Giới thiệu về ma túy",
    "description": "Khái niệm cơ bản và phân loại ma túy",
    "lessonOrder": 1,
    "estimatedDuration": 30,
    "isPublished": true,
    "isFree": true,
    "requiredCompletion": true
  }
]
```

### **3. Content Data Response**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "lessonId": 1,
    "title": "Video: What are Drugs?",
    "description": "Video introducing basic concepts about drugs",
    "contentType": "VIDEO",
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "videoDuration": 1200,
    "videoThumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "textContent": null,
    "meetLink": null,
    "meetPassword": null,
    "isPublished": true,
    "isFree": true,
    "requiredCompletion": false
  }
]
```

## 🔐 Authentication & Authorization

### **Role-Based Access**
```javascript
// Check user permissions
const checkUserPermissions = () => {
  const user = authService.getCurrentUser();
  if (user) {
    setCurrentUser(user);
    setIsStaff(['STAFF', 'ADMIN', 'MANAGER'].includes(user.role?.name));
    setIsEnrolled(false); // TODO: Check enrollment status
  }
}
```

### **API Authorization**
- **Staff APIs**: Require `STAFF`, `ADMIN`, or `MANAGER` role
- **User APIs**: Require authenticated user
- **Public APIs**: No authentication required

## 🎯 Key Features

### **1. Dynamic Content Loading**
- Load lessons from backend API
- Load content for each lesson separately
- Transform backend data to frontend format

### **2. Content Type Support**
- **Video**: YouTube iframe embedding
- **Text**: HTML content rendering
- **Meet Link**: Google Meet integration with password

### **3. Staff Management**
- Create/Edit/Delete lessons
- Add different content types
- Manage lesson order and visibility

### **4. User Experience**
- Responsive design
- Loading states
- Error handling
- Navigation between lessons

## 🐛 Error Handling

### **1. API Error Handling**
```javascript
try {
  const response = await staffCourseService.getCourseLessons(courseId);
  if (response.success) {
    setLessons(response.data);
  } else {
    message.error(response.error || 'Failed to load lessons');
  }
} catch (error) {
  console.error('Error loading lessons:', error);
  message.error('Error loading lessons');
}
```

### **2. Content Fallback**
```javascript
// If no content found, show lesson description
content: lessonContent ? lessonContent.textContent : lesson.description,
```

## 🚀 Performance Optimizations

### **1. Lazy Loading**
- Load content only when lesson is selected
- Load lessons on demand

### **2. Caching**
- Cache course data
- Cache lesson data
- Cache content data

### **3. Error Boundaries**
- React Error Boundaries for component errors
- API error handling
- Fallback UI for failed loads

## 📝 Testing

### **1. API Testing**
```bash
# Test course API
curl -X GET "http://localhost:8080/api/courses/1"

# Test lessons API
curl -X GET "http://localhost:8080/api/staff/courses/1/lessons"

# Test content API
curl -X GET "http://localhost:8080/api/staff/courses/1/lessons/1/content"
```

### **2. Frontend Testing**
```javascript
// Test course loading
const course = await courseService.getCourseById(1);
expect(course.success).toBe(true);

// Test lesson loading
const lessons = await staffCourseService.getCourseLessons(1);
expect(lessons.data.length).toBeGreaterThan(0);
```

## 🔄 State Management

### **1. Component State**
```javascript
const [course, setCourse] = useState(null);
const [lessons, setLessons] = useState([]);
const [currentUser, setCurrentUser] = useState(null);
const [isStaff, setIsStaff] = useState(false);
const [isEnrolled, setIsEnrolled] = useState(false);
const [loading, setLoading] = useState(true);
const [activeKey, setActiveKey] = useState('1');
```

### **2. Form State**
```javascript
const [modalVisible, setModalVisible] = useState(false);
const [editingItem, setEditingItem] = useState(null);
const [form] = Form.useForm();
```

## 🎨 UI Components

### **1. Layout Structure**
```
CoursePage
├── Course Header (Title, Description, Enroll Button)
├── Layout
│   ├── Sider (Lesson List)
│   └── Content (Lesson Content)
└── Modal (Add/Edit Lesson)
```

### **2. Lesson List**
- Sidebar with lesson navigation
- Active lesson highlighting
- Staff actions (Edit/Delete)
- Lesson type indicators

### **3. Content Display**
- Video iframe for video content
- Text content with HTML support
- Meet link with password display
- Navigation buttons

## 📊 Data Flow Diagram

```
User visits /courses/1
    ↓
Load course data (GET /api/courses/1)
    ↓
Load lessons (GET /api/staff/courses/1/lessons)
    ↓
For each lesson, load content (GET /api/staff/courses/1/lessons/{id}/content)
    ↓
Transform data to frontend format
    ↓
Render UI with content
```

## 🔧 Configuration

### **1. API Base URLs**
```javascript
// axios.js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});

// staffCourseService.js
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000
});
```

### **2. Environment Variables**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_BACKEND_URL=http://localhost:8080
```

## 📚 Additional Resources

- [Backend API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SETUP_GUIDE.md)
- [Frontend Architecture](./FRONTEND_ARCHITECTURE_GUIDE.md)
- [Course System Documentation](./COURSE_SYSTEM_DOCUMENTATION.md)

---

**Lưu ý**: Tài liệu này được cập nhật theo phiên bản mới nhất của hệ thống. Vui lòng kiểm tra các thay đổi trong codebase để đảm bảo tính chính xác. 