import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Progress, 
  Input, 
  Select, 
  Space,
  Rate,
  Avatar,
  Badge,
  Divider,
  message
} from 'antd';
import { 
  ClockCircleOutlined, 
  PlayCircleOutlined, 
  UserOutlined,
  SearchOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined
} from '@ant-design/icons';
import authService from '../services/authService';
import courseService from '../services/courseService';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Static course data for demo purposes - backend CourseController is currently disabled
// This should be replaced with real API calls when course management backend is ready
const courses = [
  {
    id: 1,
    title: 'Nhận Thức Về Ma Túy',
    description: 'Khóa học cơ bản giúp nhận biết các loại ma túy, tác hại và cách phòng tránh hiệu quả.',
    image: 'https://images.unsplash.com/photo-1558010089-ff6fd29ea39a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '6 giờ 18 phút',
    lessons: 12,
    level: 'Cơ bản',
    category: 'Giáo dục',
    instructor: 'TS. Nguyễn Văn Học',
    rating: 4.8,
    students: 1250,
    price: 0,
    tags: ['Học sinh', 'Sinh viên', 'Cơ bản'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 2,
    title: 'Kỹ Năng Phòng Tránh',
    description: 'Trang bị kỹ năng từ chối, ứng phó và tự bảo vệ trước nguy cơ sử dụng ma túy.',
    image: 'https://images.unsplash.com/photo-1580836618305-605c32623ae0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '4 giờ 30 phút',
    lessons: 8,
    level: 'Trung bình',
    category: 'Kỹ năng',
    instructor: 'ThS. Trần Thị Phòng',
    rating: 4.9,
    students: 980,
    price: 0,
    tags: ['Thanh thiếu niên', 'Kỹ năng sống'],
    progress: 25,
    isEnrolled: true
  },
  {
    id: 3,
    title: 'Hỗ Trợ Gia Đình',
    description: 'Hướng dẫn phụ huynh, giáo viên cách hỗ trợ và giáo dục người trẻ phòng ngừa ma túy.',
    image: 'https://plus.unsplash.com/premium_photo-1664373232872-e1301e6e610b?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '3 giờ 45 phút',
    lessons: 6,
    level: 'Nâng cao',
    category: 'Gia đình',
    instructor: 'PGS. Lê Văn Trợ',
    rating: 4.7,
    students: 650,
    price: 0,
    tags: ['Phụ huynh', 'Giáo viên', 'Gia đình'],
    progress: 100,
    isEnrolled: true
  },
  {
    id: 4,
    title: 'Tâm Lý Học Phòng Chống',
    description: 'Khóa học chuyên sâu về tâm lý học trong công tác phòng chống tệ nạn xã hội.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '8 giờ 20 phút',
    lessons: 16,
    level: 'Nâng cao',
    category: 'Tâm lý',
    instructor: 'TS. Phạm Thị Lý',
    rating: 4.9,
    students: 420,
    price: 299000,
    tags: ['Chuyên nghiệp', 'Tâm lý học'],
    progress: 0,
    isEnrolled: false
  }
];

// Đưa hàm getProgressKey ra ngoài component
function getProgressKey() {
  const user = authService.getCurrentUser();
  return user ? `courseProgress_${user.username || user.id}` : 'courseProgress_guest';
}

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  // Lấy tiến độ từng khóa học từ localStorage
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    // Lấy danh sách khóa học từ service (mock data dùng chung với staff)
    courseService.getCourses().then(res => {
      setAllCourses(res.data || []);
      setFilteredCourses(res.data || []);
    });
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line
  }, [searchTerm, selectedCategory, selectedLevel, allCourses]);

  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem(getProgressKey()) || '{}');
    setCourseProgress(progress);
  }, [filteredCourses]);

  const filterCourses = () => {
    let filtered = allCourses;
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    setFilteredCourses(filtered);
  };

  const handleEnroll = (courseId) => {
    if (!authService.isAuthenticated()) {
      message.warning('Please log in to enroll in the course');
      return;
    }
    message.success('Course enrollment successful!');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Cơ bản': return 'green';
      case 'Trung bình': return 'orange';
      case 'Nâng cao': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div style={{ minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Card style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '16px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ padding: '40px 20px', color: '#fff' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📚</div>
          <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
            Course Prevention
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', opacity: 0.9 }}>
            Enhance knowledge and skills in preventing drug abuse with high-quality courses
          </Paragraph>
        </div>
      </Card>

      {/* Search & Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search courses..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Category"
              size="large"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Option value="all">All Categories</Option>
              <Option value="Giáo dục">Education</Option>
              <Option value="Kỹ năng">Skills</Option>
              <Option value="Gia đình">Family</Option>
              <Option value="Tâm lý">Psychology</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Danh sách khóa học */}
      <div className="course-grid">
        {filteredCourses.map(course => {
          // Lấy tiến độ từ localStorage
          const progress = courseProgress[course.id];
          const total = course.lessons?.length || 1;
          const completed = progress?.completedLessons?.length || 0;
          const percent = progress?.completed ? 100 : Math.round((completed / total) * 100);
          return (
            <Card
              key={course.id}
              hoverable
              cover={<img alt={course.title} src={course.imageUrl || course.image} style={{ height: 180, objectFit: 'cover' }} />}
              style={{
                width: '100%',
                minWidth: 360,
                minHeight: 440,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(80,80,120,0.06)',
                overflow: 'hidden',
                background: '#fff',
              }}
            >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    marginBottom: 4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: 56,
                    lineHeight: '28px',
                    whiteSpace: 'normal',
                  }}
                >
                  {course.title}
                </div>
                <div
                  style={{
                    color: '#444',
                    fontSize: 15,
                    marginBottom: 8,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: 40
                  }}
                >
                  {course.description}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="blue">{course.category}</Tag>
                  <Tag color="purple">{course.level || course.status}</Tag>
                </div>
                {/* Trạng thái học tập */}
                <div style={{ marginTop: 8 }}>
                  <CourseStatus courseId={course.id} syllabus={course.syllabus} />
                </div>
                <div style={{ color: '#888', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 8 }}>
                  Instructor: {course.instructor} {course.price > 0 ? `${course.price.toLocaleString()} VNĐ` : 'Free'}
                </div>
                <Button type="primary" block style={{ marginTop: 'auto' }} onClick={() => navigate(`/courses/${course.id}`)}>
                  View Course
                </Button>
              </Card>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <Title level={4}>No courses found matching your criteria</Title>
          <Paragraph type="secondary">
            Try changing your search terms or filters to find the course you want.
          </Paragraph>
        </Card>
      )}
      <style>{`
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px 16px;
  align-items: stretch;
  margin-bottom: 32px;
}
`}</style>
    </div>
  );
} 

function CourseStatus({ courseId, syllabus }) {
  const [status, setStatus] = React.useState('Not started');
  React.useEffect(() => {
    const progress = JSON.parse(localStorage.getItem(getProgressKey()) || '{}');
    const p = progress[courseId];
    if (!p || !Array.isArray(p.completedLessons) || p.completedLessons.length === 0) {
      setStatus('Not started');
    } else if (p.completedLessons.length === (syllabus?.length || 0) && (syllabus?.length || 0) > 0) {
      setStatus('Completed');
    } else {
      setStatus('In progress');
    }
  }, [courseId, syllabus]);
  let color = '#aaa';
  if (status === 'In progress') color = '#faad14';
  if (status === 'Completed') color = '#52c41a';
  if (status === 'Not started') color = '#aaa';
  return <span style={{ color, fontWeight: 600 }}>{status}</span>;
} 