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

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Static course data for demo purposes - backend CourseController is currently disabled
// This should be replaced with real API calls when course management backend is ready
const courses = [
  {
    id: 1,
    title: 'Drug Awareness',
    description: 'Basic course helping to identify different types of drugs, their effects and effective prevention methods.',
    image: 'https://images.unsplash.com/photo-1558010089-ff6fd29ea39a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '6 hours 18 minutes',
    lessons: 12,
    level: 'Basic',
    category: 'Education',
    instructor: 'Dr. Nguyen Van Hoc',
    rating: 4.8,
    students: 1250,
    price: 0,
    tags: ['Students', 'Basic'],
    progress: 0,
    isEnrolled: false
  },
  {
    id: 2,
    title: 'Prevention Skills',
    description: 'Equipping skills to refuse, cope and self-protect against drug use risks.',
    image: 'https://images.unsplash.com/photo-1580836618305-605c32623ae0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '4 hours 30 minutes',
    lessons: 8,
    level: 'Intermediate',
    category: 'Skills',
    instructor: 'MSc. Tran Thi Phong',
    rating: 4.9,
    students: 980,
    price: 0,
    tags: ['Youth', 'Life Skills'],
    progress: 25,
    isEnrolled: true
  },
  {
    id: 3,
    title: 'Family Support',
    description: 'Guide for parents and teachers on how to support and educate young people in drug prevention.',
    image: 'https://plus.unsplash.com/premium_photo-1664373232872-e1301e6e610b?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '3 hours 45 minutes',
    lessons: 6,
    level: 'Advanced',
    category: 'Family',
    instructor: 'Assoc. Prof. Le Van Tro',
    rating: 4.7,
    students: 650,
    price: 0,
    tags: ['Parents', 'Teachers', 'Family'],
    progress: 100,
    isEnrolled: true
  },
  {
    id: 4,
    title: 'Psychology in Prevention',
    description: 'Advanced course on psychology in social problem prevention work.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '8 hours 20 minutes',
    lessons: 16,
    level: 'Advanced',
    category: 'Psychology',
    instructor: 'Dr. Pham Thi Ly',
    rating: 4.9,
    students: 420,
    price: 299000,
    tags: ['Professional', 'Psychology'],
    progress: 0,
    isEnrolled: false
  }
];

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    filterCourses();
  }, [searchTerm, selectedCategory, selectedLevel]);

  const filterCourses = () => {
    let filtered = courses;

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
      message.warning('Please login to enroll in courses');
      return;
    }
    message.success('Course enrollment successful!');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Basic': return 'green';
      case 'Intermediate': return 'orange';
      case 'Advanced': return 'red';
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
            Drug Prevention Courses
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', opacity: 0.9 }}>
            Enhance knowledge and skills in drug prevention with quality courses
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
              <Option value="Education">Education</Option>
              <Option value="Skills">Skills</Option>
              <Option value="Family">Family</Option>
              <Option value="Psychology">Psychology</Option>
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              placeholder="Level"
              size="large"
              style={{ width: '100%' }}
              value={selectedLevel}
              onChange={setSelectedLevel}
            >
              <Option value="all">All Levels</Option>
              <Option value="Basic">Basic</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* My Learning Progress (if user is logged in and has enrolled courses) */}
      {currentUser && (
        <Card title="📈 My Learning Progress" style={{ marginBottom: '24px' }}>
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
                      <Text type="secondary">{course.progress}% completed</Text>
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

      {/* Courses Grid */}
      <Row gutter={[24, 24]}>
        {filteredCourses.map((course) => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative'
              }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img 
                    alt={course.title} 
                    src={course.image} 
                    style={{ 
                      height: '200px', 
                      width: '100%',
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <Tag color={getLevelColor(course.level)}>
                      {course.level}
                    </Tag>
                    {course.price === 0 && (
                      <Tag color="volcano">FREE</Tag>
                    )}
                    {course.isEnrolled && (
                      <Badge status="processing" text="Enrolled" />
                    )}
                  </div>
                  {course.isEnrolled && course.progress > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.7)',
                      padding: '8px 12px'
                    }}>
                      <Progress 
                        percent={course.progress} 
                        showInfo={false} 
                        size="small"
                        strokeColor="#52c41a"
                      />
                    </div>
                  )}
                </div>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Title level={4} style={{ margin: 0, lineHeight: '1.3' }}>
                  {course.title}
                </Title>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {course.instructor}
                  </Text>
                </div>

                <Paragraph 
                  style={{ 
                    color: '#666', 
                    fontSize: '14px',
                    margin: '8px 0',
                    lineHeight: '1.4'
                  }}
                  ellipsis={{ rows: 2 }}
                >
                  {course.description}
                </Paragraph>

                <Space size="small" wrap>
                  {course.tags.map(tag => (
                    <Tag key={tag} size="small">{tag}</Tag>
                  ))}
                </Space>

                <Divider style={{ margin: '12px 0' }} />

                <Row gutter={[8, 8]} style={{ fontSize: '12px' }}>
                  <Col span={12}>
                    <Space size="small">
                      <ClockCircleOutlined style={{ color: '#666' }} />
                      <Text type="secondary">{course.duration}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size="small">
                      <BookOutlined style={{ color: '#666' }} />
                      <Text type="secondary">{course.lessons} lessons</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size="small">
                      <StarOutlined style={{ color: '#faad14' }} />
                      <Text type="secondary">{course.rating}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space size="small">
                      <UserOutlined style={{ color: '#666' }} />
                      <Text type="secondary">{course.students}</Text>
                    </Space>
                  </Col>
                </Row>

                {course.price > 0 && (
                  <div style={{ textAlign: 'center', margin: '8px 0' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      {course.price.toLocaleString()} VND
                    </Text>
                  </div>
                )}

                <Button 
                  type={course.isEnrolled ? "default" : "primary"}
                  block 
                  size="large"
                  icon={course.isEnrolled ? <PlayCircleOutlined /> : <BookOutlined />}
                  onClick={() => course.isEnrolled ? null : handleEnroll(course.id)}
                  style={{
                    borderRadius: '8px',
                    fontWeight: '600',
                    marginTop: '8px'
                  }}
                >
                  {course.isEnrolled 
                    ? (course.progress === 100 ? '🏆 Completed' : '📖 Continue Learning')
                    : '🚀 Enroll Now'
                  }
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredCourses.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <Title level={4}>No suitable courses found</Title>
          <Paragraph type="secondary">
            Try changing search keywords or filters to find your desired course.
          </Paragraph>
        </Card>
      )}
    </div>
  );
} 