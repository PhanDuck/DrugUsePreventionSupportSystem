# 📚 Hệ Thống Khóa Học Nâng Cao - Drug Prevention Support System

## 🎯 Tổng Quan

Hệ thống khóa học đã được nâng cấp với các tính năng giống như Coursera, cho phép:

- **Staff/Admin**: Quản lý khóa học hoàn chỉnh (CRUD)
- **User**: Học tập với video YouTube, nội dung văn bản, và tham gia Meet links
- **Tracking**: Theo dõi tiến độ học tập chi tiết
- **Content Types**: Video, Text, Meet Links, Documents

## 🏗️ Kiến Trúc Hệ Thống

### 📊 Database Schema

```sql
courses (enhanced)
├── price, difficulty_level, language
├── total_lessons, total_duration_minutes  
├── thumbnail_url, preview_video_url
├── certificate_enabled, enrollment_deadline
└── prerequisites, learning_outcomes, tags

course_lessons
├── course_id, title, description
├── lesson_order, estimated_duration
├── is_published, is_free, required_completion
└── learning_objectives, prerequisites

course_contents  
├── course_id, lesson_id
├── content_type (VIDEO/TEXT/MEET_LINK/DOCUMENT)
├── video_url, video_duration, video_thumbnail
├── text_content (HTML supported)
├── meet_link, meet_start_time, meet_password
├── document_url, document_name, document_size
└── content_order, is_published, required_completion

course_progress
├── user_id, course_id, lesson_id, content_id
├── progress_type, completion_percentage
├── time_spent, video_watch_duration
├── is_completed, completed_at
└── first_accessed_at, last_accessed_at
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

**Base URL**: `/api/staff/courses`
**Authentication**: Required (STAFF, ADMIN, MANAGER roles)

#### Course Management
```http
GET    /api/staff/courses                    # Get all courses
GET    /api/staff/courses/{courseId}         # Get course details
POST   /api/staff/courses                    # Create course
PUT    /api/staff/courses/{courseId}         # Update course
DELETE /api/staff/courses/{courseId}         # Delete course
```

#### Lesson Management
```http
GET    /api/staff/courses/{courseId}/lessons              # Get course lessons
GET    /api/staff/courses/{courseId}/lessons/{lessonId}   # Get lesson details
POST   /api/staff/courses/{courseId}/lessons              # Create lesson
PUT    /api/staff/courses/{courseId}/lessons/{lessonId}   # Update lesson
DELETE /api/staff/courses/{courseId}/lessons/{lessonId}   # Delete lesson
```

#### Content Management
```http
GET    /api/staff/courses/{courseId}/content                      # Get course content
GET    /api/staff/courses/{courseId}/lessons/{lessonId}/content   # Get lesson content
GET    /api/staff/courses/{courseId}/content/{contentId}          # Get content details
POST   /api/staff/courses/{courseId}/content                      # Create content
PUT    /api/staff/courses/{courseId}/content/{contentId}          # Update content
DELETE /api/staff/courses/{courseId}/content/{contentId}          # Delete content
```

#### Content Type Specific
```http
POST /api/staff/courses/{courseId}/content/video  # Create video content
POST /api/staff/courses/{courseId}/content/text   # Create text content  
POST /api/staff/courses/{courseId}/content/meet   # Create meet link
```

#### Content Actions
```http
PUT /api/staff/courses/{courseId}/content/{contentId}/publish     # Publish content
PUT /api/staff/courses/{courseId}/content/{contentId}/unpublish   # Unpublish content
PUT /api/staff/courses/{courseId}/content/reorder                 # Reorder content
```

#### Statistics & Meet Links
```http
GET /api/staff/courses/{courseId}/statistics        # Get course statistics
GET /api/staff/courses/meet-links/upcoming          # Get upcoming meet links
GET /api/staff/courses/{courseId}/meet-links         # Get course meet links
```

### 📝 API Request Examples

#### Tạo Video Content
```json
POST /api/staff/courses/1/content/video
{
  "lessonId": 1,
  "title": "Giới thiệu về ma túy",
  "description": "Video giải thích cơ bản về ma túy",
  "videoUrl": "https://www.youtube.com/watch?v=example",
  "duration": 1200,
  "thumbnail": "https://img.youtube.com/vi/example/maxresdefault.jpg"
}
```

#### Tạo Text Content
```json
POST /api/staff/courses/1/content/text
{
  "lessonId": 1,
  "title": "Định nghĩa ma túy",
  "description": "Nội dung văn bản về định nghĩa",
  "textContent": "<h2>Ma túy là gì?</h2><p>Nội dung chi tiết...</p>"
}
```

#### Tạo Meet Link
```json
POST /api/staff/courses/1/content/meet
{
  "lessonId": 2,
  "title": "Buổi tư vấn trực tuyến",
  "description": "Tư vấn với chuyên gia",
  "meetLink": "https://meet.google.com/abc-defg-hij",
  "startTime": "2024-12-20T10:00:00",
  "endTime": "2024-12-20T12:00:00",
  "password": "antidrug2024"
}
```

## 🎨 Frontend Implementation Plan

### 📱 Staff Dashboard Components

```jsx
// Staff Course Management UI
StaffCourseManager/
├── CourseList.jsx              # List all courses
├── CourseEditor.jsx            # Create/Edit course
├── LessonManager.jsx           # Manage lessons
├── ContentEditor.jsx           # Create/Edit content
├── ContentTypes/
│   ├── VideoContentForm.jsx    # Video upload form
│   ├── TextContentEditor.jsx   # Rich text editor
│   ├── MeetLinkForm.jsx        # Meet link scheduler
│   └── DocumentUpload.jsx      # Document uploader
├── ContentPreview.jsx          # Preview content
├── CourseStatistics.jsx        # Analytics dashboard
└── PublishControls.jsx         # Publish/unpublish actions
```

### 👨‍🎓 User Learning Interface

```jsx
// User Course Learning UI (Coursera-style)
CourseLearning/
├── CoursePlayer.jsx            # Main learning interface
├── VideoPlayer.jsx             # YouTube video player
├── TextContent.jsx             # Rich text display
├── MeetLinkPanel.jsx           # Join meet sessions
├── ProgressTracker.jsx         # Progress indicators
├── LessonNavigation.jsx        # Lesson sidebar
├── NotesPanel.jsx              # User notes
└── CertificateView.jsx         # Course completion certificate
```

### 🎯 Key Features Implementation

#### 1. Video Player với Progress Tracking
```jsx
const VideoPlayer = ({ content, onProgressUpdate }) => {
  const handleProgress = (currentTime, duration) => {
    const percentage = (currentTime / duration) * 100;
    onProgressUpdate({
      contentId: content.id,
      watchDuration: currentTime,
      totalDuration: duration,
      percentage: percentage
    });
  };

  return (
    <YouTubePlayer
      videoId={extractVideoId(content.videoUrl)}
      onProgress={handleProgress}
      onEnded={() => markAsCompleted(content.id)}
    />
  );
};
```

#### 2. Rich Text Editor cho Staff
```jsx
const TextContentEditor = ({ content, onChange }) => {
  return (
    <ReactQuill
      value={content.textContent}
      onChange={(value) => onChange({ ...content, textContent: value })}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link', 'image', 'video'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ],
      }}
    />
  );
};
```

#### 3. Meet Link Integration
```jsx
const MeetLinkPanel = ({ meetContent }) => {
  const canJoin = new Date() >= new Date(meetContent.meetStartTime);
  
  return (
    <div className="meet-panel">
      <h3>{meetContent.title}</h3>
      <p>Thời gian: {formatDateTime(meetContent.meetStartTime)}</p>
      {canJoin ? (
        <Button 
          type="primary" 
          href={meetContent.meetLink}
          target="_blank"
        >
          Tham gia buổi học
        </Button>
      ) : (
        <Button disabled>
          Chưa đến giờ học
        </Button>
      )}
      {meetContent.meetPassword && (
        <p>Mật khẩu: <code>{meetContent.meetPassword}</code></p>
      )}
    </div>
  );
};
```

## 🔧 Database Setup

1. **Chạy script SQL**:
```bash
# Execute course_enhancement_database.sql
sqlcmd -S localhost -d DrugPreventionDB -i course_enhancement_database.sql
```

2. **Verify Tables**:
```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME LIKE 'course_%';
```

## 🚀 Deployment Steps

### Backend
1. ✅ **Entities Created**: CourseContent, CourseLesson, CourseProgress
2. ✅ **Repositories Created**: With optimized queries
3. ✅ **Services Created**: CourseContentService with business logic  
4. ✅ **Controllers Created**: StaffCourseController with full CRUD
5. ✅ **Security Updated**: Added staff course management endpoints

### Database
1. ✅ **Tables Created**: course_lessons, course_contents, course_progress
2. ✅ **Indexes Added**: For performance optimization
3. ✅ **Sample Data**: Inserted for testing

### Next Steps (TODO)
- [ ] Create User Course Learning APIs
- [ ] Build Staff Course Management UI
- [ ] Build User Course Learning UI (Coursera-style)
- [ ] Implement Progress Tracking Frontend
- [ ] Add Course Dashboard with Statistics

## 📊 Features Implemented

### ✅ Staff Features (Complete)
- ✅ Create/Edit/Delete courses
- ✅ Manage lessons structure
- ✅ Add video content (YouTube integration)
- ✅ Add text content (HTML support)
- ✅ Schedule Meet links with passwords
- ✅ Upload documents
- ✅ Publish/unpublish content
- ✅ Reorder content within courses
- ✅ View course statistics
- ✅ Manage upcoming meet sessions

### 🔄 User Features (In Progress)
- [ ] Browse available courses
- [ ] Watch YouTube videos with progress tracking
- [ ] Read text content with progress tracking
- [ ] Join scheduled meet sessions
- [ ] Track learning progress
- [ ] Take notes during lessons
- [ ] Download course certificates

### 📈 Analytics Features
- ✅ Track video watch time
- ✅ Monitor content completion
- ✅ Course completion statistics
- ✅ User engagement metrics

## 🎓 Content Types Supported

| Type | Description | Features |
|------|-------------|----------|
| **VIDEO** | YouTube videos | Auto-generated thumbnails, duration tracking, progress saving |
| **TEXT** | Rich text content | HTML formatting, embedded images, progress tracking |
| **MEET_LINK** | Live sessions | Scheduled timing, password protection, attendance tracking |
| **DOCUMENT** | File downloads | PDF, Word, Excel support, download tracking |

## 🔐 Security & Permissions

- **STAFF/ADMIN/MANAGER**: Full course management access
- **USER**: View published content only
- **GUEST**: No course access
- **Progress**: Private to each user
- **Meet Links**: Password protected

## 🎨 UI/UX Design Principles

1. **Coursera-like Interface**: Clean, professional learning environment
2. **Progress Indicators**: Clear visual feedback on completion
3. **Mobile Responsive**: Works on all devices
4. **Accessibility**: Screen reader friendly
5. **Vietnamese Language**: Full localization support

Hệ thống khóa học hiện đã sẵn sàng cho việc triển khai frontend và testing! 🚀 