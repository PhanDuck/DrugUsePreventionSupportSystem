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
  message,
  Spin,
  Modal,
  Alert
} from 'antd';
import { 
  ClockCircleOutlined, 
  PlayCircleOutlined, 
  UserOutlined,
  SearchOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  BugOutlined
} from '@ant-design/icons';
import authService from '../services/authService';
import courseService from '../services/courseService';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedEnrollmentFilter, setSelectedEnrollmentFilter] = useState('all'); // all, enrolled, not-enrolled
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [enrolling, setEnrolling] = useState(null);
  const [courseStatuses, setCourseStatuses] = useState({});
  const [completing, setCompleting] = useState(null);
  const [paymentModal, setPaymentModal] = useState({
    visible: false,
    paymentInfo: null,
    processing: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, selectedLevel, selectedEnrollmentFilter, courses, userRegistrations]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load current user
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      console.log('Current user:', user);

      // Load courses
      console.log('Loading courses...');
      const coursesResponse = await courseService.getCourses();
      console.log('Courses response:', coursesResponse);
      
      if (coursesResponse.success) {
        console.log('Courses data:', coursesResponse.data);
        console.log('Number of courses:', coursesResponse.data?.length);
        console.log('Paid courses:', coursesResponse.data?.filter(c => c.price > 0));
        console.log('Free courses:', coursesResponse.data?.filter(c => c.price === null || c.price === 0));
        setCourses(coursesResponse.data || []);
        setFilteredCourses(coursesResponse.data || []);
        
        if (!coursesResponse.data || coursesResponse.data.length === 0) {
          console.warn('No courses found in response');
          message.info('Chưa có khóa học nào. Hãy thử lại sau.');
        }
      } else {
        // Fallback to empty array if no courses
        setCourses([]);
        setFilteredCourses([]);
        console.error('Failed to load courses:', coursesResponse.error);
        message.error(`Lỗi tải khóa học: ${coursesResponse.error}`);
      }

      // Load user registrations if logged in
      if (user) {
        console.log('Loading user registrations for user:', user.id);
        const registrationsResponse = await courseService.getUserRegistrations(user.id);
        
        if (registrationsResponse.success) {
          console.log('User registrations:', registrationsResponse.data);
          setUserRegistrations(registrationsResponse.data || []);
          
          // Load course statuses for enrolled courses
          await loadCourseStatuses(registrationsResponse.data || []);
        } else {
          console.error('Failed to load user registrations:', registrationsResponse.error);
          setUserRegistrations([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseStatuses = async (registrations) => {
    try {
      const statuses = {};
      
      for (const registration of registrations) {
        const statusResponse = await courseService.getCourseStatus(registration.courseId);
        if (statusResponse.success) {
          statuses[registration.courseId] = statusResponse.data.status;
        }
      }
      
      setCourseStatuses(statuses);
      console.log('Course statuses loaded:', statuses);
    } catch (error) {
      console.error('Error loading course statuses:', error);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.categoryId === parseInt(selectedCategory));
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.difficultyLevel === selectedLevel);
    }

    // Enrollment filter
    if (selectedEnrollmentFilter === 'enrolled') {
      filtered = filtered.filter(course => isEnrolled(course.id));
    } else if (selectedEnrollmentFilter === 'not-enrolled') {
      filtered = filtered.filter(course => !isEnrolled(course.id));
    }

    setFilteredCourses(filtered);
  };

  const handleEnroll = async (courseId) => {
    if (!authService.isAuthenticated()) {
      message.warning('Vui lòng đăng nhập để đăng ký khóa học');
      navigate('/login');
      return;
    }

    setEnrolling(courseId);
    
    try {
      const response = await courseService.handleCourseEnrollment(courseId);
      
      if (!response.success) {
        message.error(response.error || 'Không thể đăng ký khóa học');
        return;
      }

      if (response.requiresPayment) {
        // Show payment modal for paid courses
        setPaymentModal({
          visible: true,
          paymentInfo: response.paymentInfo,
          processing: false
        });
      } else {
        // Free course - registration completed
        message.success(response.message || 'Đăng ký khóa học miễn phí thành công!');
        // Reload registrations
        if (currentUser) {
          const registrationsResponse = await courseService.getUserRegistrations(currentUser.id);
          if (registrationsResponse.success) {
            setUserRegistrations(registrationsResponse.data || []);
          }
        }
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      message.error('Lỗi khi đăng ký khóa học');
    } finally {
      setEnrolling(null);
    }
  };

  const handlePayment = async () => {
    setPaymentModal(prev => ({ ...prev, processing: true }));
    
    try {
      // Process VNPay payment
      const paymentResult = await courseService.processVNPayPayment(paymentModal.paymentInfo);
      
      if (paymentResult.success) {
        // Payment URL redirect will happen automatically in processVNPayPayment
        message.success('Redirecting to VNPay payment gateway...');
        
        // Close modal
        setPaymentModal({ visible: false, paymentInfo: null, processing: false });
      } else {
        message.error(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Error in payment process');
    } finally {
      setPaymentModal(prev => ({ ...prev, processing: false }));
    }
  };

  const handleCompleteCourse = async (courseId) => {
    setCompleting(courseId);
    try {
      const result = await courseService.completeCourse(courseId);
      
      if (result.success) {
        message.success('Khóa học đã được hoàn thành!');
        
        // Update course status
        setCourseStatuses(prev => ({
          ...prev,
          [courseId]: 'COMPLETED'
        }));
      } else {
        message.error(`Lỗi hoàn thành khóa học: ${result.error}`);
      }
    } catch (error) {
      console.error('Error completing course:', error);
      message.error('Lỗi hoàn thành khóa học');
    } finally {
      setCompleting(null);
    }
  };

  const isEnrolled = (courseId) => {
    return userRegistrations.some(reg => 
      reg.courseId === courseId && reg.status === 'ACTIVE'
    );
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'BEGINNER': return 'green';
      case 'INTERMEDIATE': return 'orange';
      case 'ADVANCED': return 'red';
      default: return 'blue';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'BEGINNER': return 'Beginner';
      case 'INTERMEDIATE': return 'Intermediate';
      case 'ADVANCED': return 'Advanced';
      default: return level;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'closed': return 'Closed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Course Management Functions
  const getCourseManagementTags = (course) => {
    const tags = [];
    
    // Price Tag
    if (course.price === 0 || course.price === null || course.price === undefined) {
      tags.push(<Tag key="price" color="green">Free</Tag>);
    } else {
      tags.push(<Tag key="price" color="orange">Paid</Tag>);
    }
    
    // Enrollment Status
    if (isEnrolled(course.id)) {
      const courseStatus = courseStatuses[course.id];
      if (courseStatus === 'COMPLETED') {
        tags.push(<Tag key="status" color="success" icon={<CheckCircleOutlined />}>Completed</Tag>);
      } else {
        tags.push(<Tag key="status" color="processing" icon={<PlayCircleOutlined />}>In Progress</Tag>);
      }
    } else {
      tags.push(<Tag key="status" color="default">Not Enrolled</Tag>);
    }
    
    return tags;
  };

  const getCourseProgress = (course) => {
    if (!isEnrolled(course.id)) return null;
    
    const registration = userRegistrations.find(reg => reg.courseId === course.id);
    if (!registration) return null;
    
    // Mock progress for demo - in real app this would come from backend
    let progress = registration.progress || 0;
    const courseStatus = courseStatuses[course.id];
    
    // Generate mock progress if not available
    if (progress === 0 && courseStatus !== 'COMPLETED') {
      // Generate random progress between 10-80% for demo
      progress = Math.floor(Math.random() * 70) + 10;
    }
    
    if (courseStatus === 'COMPLETED') {
      return { percent: 100, status: 'success' };
    } else {
      return { percent: progress, status: 'active' };
    }
  };

  // Helper function to get course enrollment date
  const getCourseEnrollmentDate = (courseId) => {
    const registration = userRegistrations.find(reg => reg.courseId === courseId);
    if (registration && registration.registrationDate) {
      return new Date(registration.registrationDate).toLocaleDateString('vi-VN');
    }
    return 'N/A';
  };

  // Render course card for Available Courses only (non-enrolled)
  const renderAvailableCourseCard = (course) => {
    const isFree = course.price === 0 || course.price === null || course.price === undefined;
    const isPaid = course.price > 0;
    
    // Border colors: Green for free, Blue for paid
    const borderColor = isFree ? '#52c41a' : '#1890ff';
    const priceColor = isFree ? '#52c41a' : '#fa8c16';
    
    return (
      <Card
        hoverable
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `2px solid ${borderColor}`
        }}
        cover={
          <div style={{ height: '200px', background: '#f0f2f5', position: 'relative' }}>
            {course.thumbnailUrl ? (
              <img 
                alt={course.title} 
                src={course.thumbnailUrl} 
                style={{ 
                  height: '100%', 
                  width: '100%', 
                  objectFit: 'cover' 
                }} 
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                color: '#d9d9d9'
              }}>
                <BookOutlined />
              </div>
            )}
            
            {/* Price Badge */}
            {isFree && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'normal'
              }}>
                FREE
              </div>
            )}
            
            {isPaid && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#fa8c16',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'normal'
              }}>
                PAID
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
              {course.instructor?.username || 'No Instructor'}
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
            <Tag color={getLevelColor(course.difficultyLevel)}>
              {getLevelText(course.difficultyLevel)}
            </Tag>
            <Tag color="blue">{getStatusText(course.status)}</Tag>
            {isFree ? (
              <Tag color="green">Free</Tag>
            ) : (
              <Tag color="orange">Paid</Tag>
            )}
            <Tag color="default">Not Enrolled</Tag>
          </Space>

          <Divider style={{ margin: '12px 0' }} />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '12px',
            color: '#888'
          }}>
            <Space>
              <ClockCircleOutlined />
              <Text type="secondary">{course.duration || 'Not specified'}</Text>
            </Space>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '8px'
          }}>
            <Text strong style={{ fontSize: '16px', color: priceColor }}>
              {isFree ? 'FREE' : `${Number(course.price).toLocaleString()} VND`}
            </Text>
            {course.averageRating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Rate disabled defaultValue={course.averageRating} style={{ fontSize: '12px' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ({course.totalReviews || 0})
                </Text>
              </div>
            )}
          </div>

          {/* Available Courses - Only show Enroll/Purchase buttons */}
          <Button 
            type="primary"
            block 
            size="large"
            icon={isFree ? <BookOutlined /> : <DollarOutlined />}
            loading={enrolling === course.id}
            onClick={() => handleEnroll(course.id)}
            style={{
              borderRadius: '8px',
              marginTop: '8px'
            }}
          >
            {isFree ? 'Enroll Free' : 'Purchase Course'}
          </Button>
        </Space>
      </Card>
    );
  };

  // Keep original renderCourseCard for backward compatibility (if needed)
  const renderCourseCard = (course, type = 'default') => {
    const isFree = course.price === 0 || course.price === null || course.price === undefined;
    const isPaid = course.price > 0;
    
    const borderColor = '#d9d9d9'; // Always use light gray border
    const badgeColor = type === 'free' ? '#52c41a' : type === 'paid' ? '#fa8c16' : '#1890ff';
    const priceColor = isFree ? '#52c41a' : '#fa8c16';
    
    return (
              <Card
                hoverable
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
          flexDirection: 'column',
                            border: '1px solid #d9d9d9'
                }}
                cover={
                  <div style={{ height: '200px', background: '#f0f2f5', position: 'relative' }}>
                    {course.thumbnailUrl ? (
                      <img 
                        alt={course.title} 
                        src={course.thumbnailUrl} 
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                    ) : (
                      <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        color: '#d9d9d9'
                      }}>
                        <BookOutlined />
                      </div>
                    )}
            
            {/* Price Badge - Simplified */}
            {type === 'free' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'normal'
              }}>
                FREE
              </div>
            )}
            
            {type === 'paid' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: '#fa8c16',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'normal'
              }}>
                PAID
                      </div>
                    )}
                    
                    {isEnrolled(course.id) && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Enrolled
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
                      {course.instructor?.username || 'No Instructor'}
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
                    <Tag color={getLevelColor(course.difficultyLevel)}>
                      {getLevelText(course.difficultyLevel)}
                    </Tag>
                    <Tag color="blue">{getStatusText(course.status)}</Tag>
            {/* Course Management Tags */}
            {getCourseManagementTags(course)}
                  </Space>

                  <Divider style={{ margin: '12px 0' }} />

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#888'
                  }}>
                    <Space>
                      <ClockCircleOutlined />
                      <Text type="secondary">{course.duration || 'Not specified'}</Text>
                    </Space>
                  </div>

          

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '8px'
                  }}>
            <Text strong style={{ fontSize: '16px', color: priceColor }}>
              {isFree ? 'FREE' : `${Number(course.price).toLocaleString()} VND`}
                    </Text>
                    {course.averageRating > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Rate disabled defaultValue={course.averageRating} style={{ fontSize: '12px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          ({course.totalReviews || 0})
                        </Text>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const courseStatus = courseStatuses[course.id];
                    
                    if (!isEnrolled(course.id)) {
                      // Not enrolled - show Enroll button
                      return (
                        <Button 
                          type="primary"
                          block 
                          size="large"
                          icon={isFree ? <BookOutlined /> : <DollarOutlined />}
                          loading={enrolling === course.id}
                          onClick={() => handleEnroll(course.id)}
                          style={{
                            borderRadius: '8px',
                            marginTop: '8px'
                          }}
                        >
                          {isFree ? 'Enroll Free' : 'Purchase Course'}
                        </Button>
                      );
                    } else if (courseStatus === 'COMPLETED') {
                      // Completed - show View Certificate button
                      return (
                        <Button 
                          type="default"
                          block 
                          size="large"
                          icon={<TrophyOutlined />}
                          onClick={() => navigate(`/courses/${course.id}`)}
                          style={{
                            borderRadius: '8px',
                            marginTop: '8px'
                          }}
                        >
                          View Certificate
                        </Button>
                      );
                    } else {
                      // Enrolled but not completed - show Continue Learning button only
                      return (
                        <Button 
                          type="primary"
                          block 
                          size="large"
                          icon={<PlayCircleOutlined />}
                          onClick={() => navigate(`/courses/${course.id}`)}
                          style={{
                            borderRadius: '8px',
                            marginTop: '8px'
                          }}
                        >
                          Continue Learning
                        </Button>
                      );
                    }
                  })()}
        </Space>
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Đang tải khóa học...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Debug Section - Only show when no courses */}
      {filteredCourses.length === 0 && !loading && (
        <Alert
          message="Debug: No courses found"
          description={
            <div>
              <p>Total courses loaded: {courses.length}</p>
              <p>Courses after filtering: {filteredCourses.length}</p>
              <Button 
                icon={<BugOutlined />} 
                onClick={async () => {
                  console.log('=== DEBUG INFO ===');
                  console.log('Current user:', currentUser);
                  console.log('Search term:', searchTerm);
                  console.log('Selected category:', selectedCategory);
                  console.log('Selected level:', selectedLevel);
                  console.log('Raw courses:', courses);
                  console.log('Filtered courses:', filteredCourses);
                  
                  // Test direct API call
                  try {
                    const response = await fetch('http://localhost:8080/api/courses');
                    const data = await response.json();
                    console.log('Direct API call result:', data);
                    message.info('Check console for debug info');
                  } catch (error) {
                    console.error('Direct API call failed:', error);
                    message.error('Backend connection failed');
                  }
                }}
              >
                Test Backend Connection
              </Button>
            </div>
          }
          type="warning"
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '8px' }}>
          🎓 Drug Prevention Courses
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Enhance your knowledge and skills in drug prevention with high-quality courses
        </Paragraph>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select category"
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Option value="all">All Categories</Option>
              <Option value="1">Basic</Option>
              <Option value="2">Advanced</Option>
              <Option value="3">Professional</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select difficulty"
              value={selectedLevel}
              onChange={setSelectedLevel}
            >
              <Option value="all">All Levels</Option>
              <Option value="BEGINNER">Beginner</Option>
              <Option value="INTERMEDIATE">Intermediate</Option>
              <Option value="ADVANCED">Advanced</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Enrollment Status"
              value={selectedEnrollmentFilter}
              onChange={setSelectedEnrollmentFilter}
            >
              <Option value="all">All Courses</Option>
              <Option value="enrolled">My Enrolled Courses</Option>
              <Option value="not-enrolled">Available Courses</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* My Learning Progress - TEMPORARILY HIDDEN TO AVOID BUGS */}
      {/* TODO: Implement proper progress tracking before re-enabling */}

             {/* Courses In Progress Section */}
       {currentUser && courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] !== 'COMPLETED').length > 0 && (
         <div style={{ marginBottom: '32px' }}>
           <Title level={3} style={{ marginBottom: '16px' }}>
             In Progress ({courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] !== 'COMPLETED').length})
           </Title>
          <Row gutter={[16, 16]}>
            {courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] !== 'COMPLETED').map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`my-${course.id}`}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: course.price === 0 || course.price === null || course.price === undefined ? '2px solid #52c41a' : '2px solid #1890ff'
                  }}
                  cover={
                    <div style={{ height: '150px', background: '#f0f2f5', position: 'relative' }}>
                      {course.thumbnailUrl ? (
                        <img 
                          alt={course.title} 
                          src={course.thumbnailUrl} 
                          style={{ 
                            height: '100%', 
                            width: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      ) : (
                        <div style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '36px',
                          color: '#d9d9d9'
                        }}>
                          <BookOutlined />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#1890ff',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        In Progress
                      </div>
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Title level={5} style={{ margin: 0, lineHeight: '1.3' }}>
                      {course.title}
                    </Title>

                    <Space size="small" wrap>
                      {course.price === 0 || course.price === null || course.price === undefined ? (
                        <Tag color="green">Free</Tag>
                      ) : (
                        <Tag color="orange">Paid</Tag>
                      )}
                      <Tag color={getLevelColor(course.difficultyLevel)}>
                        {getLevelText(course.difficultyLevel)}
                      </Tag>
                    </Space>

                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      Enrolled: {getCourseEnrollmentDate(course.id)}
                    </Text>

                    

                                         {/* Action Button */}
                     <Button 
                       type="default"
                       block 
                       size="small"
                       icon={<PlayCircleOutlined />}
                       onClick={() => navigate(`/courses/${course.id}`)}
                       style={{ 
                         borderRadius: '6px',
                         borderColor: '#d9d9d9',
                         backgroundColor: 'white',
                         color: '#1890ff'
                       }}
                     >
                       Continue Learning
                     </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
          <Divider style={{ margin: '32px 0' }} />
        </div>
      )}

      {/* Completed Courses Section */}
      {currentUser && courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] === 'COMPLETED').length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <Title level={3} style={{ marginBottom: '16px' }}>
            Completed ({courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] === 'COMPLETED').length})
          </Title>
          <Row gutter={[16, 16]}>
            {courses.filter(course => isEnrolled(course.id) && courseStatuses[course.id] === 'COMPLETED').map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`completed-${course.id}`}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: course.price === 0 || course.price === null || course.price === undefined ? '2px solid #52c41a' : '2px solid #1890ff'
                  }}
                  cover={
                    <div style={{ height: '150px', background: '#f0f2f5', position: 'relative' }}>
                      {course.thumbnailUrl ? (
                        <img 
                          alt={course.title} 
                          src={course.thumbnailUrl} 
                          style={{ 
                            height: '100%', 
                            width: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      ) : (
                        <div style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '36px',
                          color: '#d9d9d9'
                        }}>
                          <BookOutlined />
                        </div>
                      )}
                      
                      {/* Completed Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#52c41a',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}>
                        Completed
                      </div>
                    </div>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Title level={5} style={{ margin: 0, lineHeight: '1.3' }}>
                      {course.title}
                    </Title>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {course.instructor?.username || 'No Instructor'}
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
                      {course.price === 0 || course.price === null || course.price === undefined ? (
                        <Tag color="green">Free</Tag>
                      ) : (
                        <Tag color="orange">Paid</Tag>
                      )}
                      <Tag color={getLevelColor(course.difficultyLevel)}>
                        {getLevelText(course.difficultyLevel)}
                      </Tag>
                    </Space>

                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      Completed: {getCourseEnrollmentDate(course.id)}
                    </Text>

                    {/* View Course Button with green border */}
                    <Button 
                      type="default"
                      block 
                      size="small"
                      icon={<CheckCircleOutlined />}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      style={{ 
                        borderRadius: '6px',
                        borderColor: '#52c41a',
                        backgroundColor: 'white',
                        color: '#52c41a'
                      }}
                    >
                      ✓ Click to view course
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          <Divider style={{ margin: '32px 0' }} />
        </div>
      )}

      {/* Available Courses Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={3} style={{ marginBottom: '16px' }}>
          Available Courses
        </Title>

        {/* Free Courses Sub-section - Only show non-enrolled */}
        {filteredCourses.filter(course => 
          (course.price === 0 || course.price === null || course.price === undefined) && 
          !isEnrolled(course.id)
        ).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Free Courses ({filteredCourses.filter(course => 
                (course.price === 0 || course.price === null || course.price === undefined) && 
                !isEnrolled(course.id)
              ).length})
            </Title>
          <Row gutter={[24, 24]}>
            {filteredCourses.filter(course => 
              (course.price === 0 || course.price === null || course.price === undefined) && 
              !isEnrolled(course.id)
            ).map(course => (
              <Col xs={24} sm={12} lg={8} xl={6} key={`free-${course.id}`}>
                {renderAvailableCourseCard(course)}
              </Col>
            ))}
            </Row>
          </div>
        )}

        {/* Paid Courses Sub-section - Only show non-enrolled */}
        {filteredCourses.filter(course => course.price > 0 && !isEnrolled(course.id)).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Paid Courses ({filteredCourses.filter(course => course.price > 0 && !isEnrolled(course.id)).length})
            </Title>
          <Row gutter={[24, 24]}>
            {filteredCourses.filter(course => course.price > 0 && !isEnrolled(course.id)).map(course => (
              <Col xs={24} sm={12} lg={8} xl={6} key={`paid-${course.id}`}>
                {renderAvailableCourseCard(course)}
              </Col>
            ))}
            </Row>
          </div>
        )}
      </div>

      {/* No courses found message */}
      {filteredCourses.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <Title level={4}>No matching courses found</Title>
          <Paragraph type="secondary">
            Try changing your search keywords or filters to find your desired course.
          </Paragraph>
          {courses.length === 0 && (
            <div style={{ marginTop: '20px' }}>
              <Text type="secondary">
                No courses available at the moment. Please check back later.
              </Text>
            </div>
          )}
        </Card>
      )}

      {/* Payment Modal */}
      <Modal
        title="Course Payment"
        open={paymentModal.visible}
        onCancel={() => setPaymentModal({ visible: false, paymentInfo: null, processing: false })}
        footer={null}
        width={500}
      >
        {paymentModal.paymentInfo && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>{paymentModal.paymentInfo.courseName}</Title>
              <Text type="secondary">Course Enrollment Payment</Text>
            </div>
            
            <div style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <Text>Course Price:</Text>
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    {paymentModal.paymentInfo.price?.toLocaleString()} {paymentModal.paymentInfo.currency}
                  </Text>
                </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Text>Payment Method:</Text>
                <Text strong>VNPay</Text>
              </div>
            </div>

            {!paymentModal.processing && (
              <div style={{ marginBottom: '20px' }}>
                <Alert
                  message="Payment Information"
                  description="You will be redirected to VNPay payment gateway to complete your purchase. After successful payment, you will have immediate access to the course."
                  type="info"
                  showIcon
                />
              </div>
            )}

            {paymentModal.processing ? (
              <div style={{ padding: '20px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text>Processing payment...</Text>
                </div>
              </div>
            ) : (
              <div>
                
                <Button 
                  type="primary" 
                  size="large"
                  block
                  icon={<DollarOutlined />}
                  onClick={handlePayment}
                  style={{ borderRadius: '8px' }}
                >
                  Pay with VNPay
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 
