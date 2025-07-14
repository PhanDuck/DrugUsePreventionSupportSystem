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
import { Link } from 'react-router-dom';

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

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

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
      message.warning('Vui lòng đăng nhập để đăng ký khóa học');
      return;
    }
    message.success('Đăng ký khóa học thành công!');
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
            Khóa Học Phòng Chống Tệ Nạn
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', opacity: 0.9 }}>
            Nâng cao kiến thức và kỹ năng phòng ngừa ma túy với các khóa học chất lượng
          </Paragraph>
        </div>
      </Card>

      {/* Search & Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Tìm kiếm khóa học..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Danh mục"
              size="large"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Option value="all">Tất cả danh mục</Option>
              <Option value="Giáo dục">Giáo dục</Option>
              <Option value="Kỹ năng">Kỹ năng</Option>
              <Option value="Gia đình">Gia đình</Option>
              <Option value="Tâm lý">Tâm lý</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Cấp độ"
              size="large"
              style={{ width: '100%' }}
              value={selectedLevel}
              onChange={setSelectedLevel}
            >
              <Option value="all">Tất cả cấp độ</Option>
              <Option value="Cơ bản">Cơ bản</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Nâng cao">Nâng cao</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* My Learning Progress (if user is logged in and has enrolled courses) */}
      {currentUser && (
        <Card title="📈 Tiến Độ Học Tập Của Tôi" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {courses.filter(course => course.isEnrolled).map(course => (
              <Col xs={24} md={8} key={`progress-${course.id}`}>
                <Card size="small" style={{ borderRadius: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>{course.title}</Text>
                    <Progress
                      percent={course.progress}
                      status={course.progress === 100 ? 'success' : 'active'}
                      strokeColor={{
                        '0%': '#667eea',
                        '100%': '#764ba2',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">{course.progress}% hoàn thành</Text>
                      {course.progress === 100 && (
                        <Badge count={<TrophyOutlined style={{ color: '#faad14' }} />} />
                      )}
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Danh sách khóa học */}
      <Row gutter={[24, 24]}>
        {filteredCourses.map(course => (
          <Col xs={24} md={12} lg={8} key={course.id}>
            <Card
              hoverable
              cover={<img alt={course.title} src={course.imageUrl || course.image} style={{ height: 180, objectFit: 'cover' }} />}
              style={{ borderRadius: '12px', marginBottom: 16 }}
            >
              <Title level={4} style={{ marginBottom: 8 }}>
                <Link to={`/courses/${course.id}`} target="_blank" rel="noopener noreferrer">{course.title}</Link>
              </Title>
              <Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
              <div style={{ marginBottom: 8 }}>
                <Tag color="blue">{course.category}</Tag>
                <Tag color="purple">{course.level || course.status}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Instructor: {course.instructor}</Text>
                <Text type="secondary">{course.price ? `${course.price.toLocaleString()} VNĐ` : 'Free'}</Text>
              </div>
              <Button type="primary" block style={{ marginTop: 12 }}>
                <Link to={`/courses/${course.id}`} target="_blank" rel="noopener noreferrer">View Course</Link>
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredCourses.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <Title level={4}>Không tìm thấy khóa học phù hợp</Title>
          <Paragraph type="secondary">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm khóa học mong muốn.
          </Paragraph>
        </Card>
      )}
    </div>
  );
} 