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
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [enrolling, setEnrolling] = useState(null);
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
  }, [searchTerm, selectedCategory, selectedLevel, courses]);

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
        console.log('Registrations response:', registrationsResponse);
        
        if (registrationsResponse.success) {
          setUserRegistrations(registrationsResponse.data || []);
        } else {
          console.warn('Failed to load user registrations:', registrationsResponse.error);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Lỗi khi tải dữ liệu khóa học');
      // Set empty arrays on error
      setCourses([]);
      setFilteredCourses([]);
    } finally {
      setLoading(false);
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
      // Process VNPay payment (mock for now)
      const paymentResult = await courseService.processVNPayPayment(paymentModal.paymentInfo);
      
      if (paymentResult.success) {
        // Confirm payment with backend
        const confirmResponse = await courseService.confirmPayment(
          paymentModal.paymentInfo.courseId,
          {
            paymentStatus: paymentResult.paymentStatus,
            transactionId: paymentResult.transactionId
          }
        );
        
        if (confirmResponse.success) {
          message.success('Thanh toán thành công! Khóa học đã được kích hoạt.');
          
          // Close modal and reload data
          setPaymentModal({ visible: false, paymentInfo: null, processing: false });
          
          // Reload user registrations
          if (currentUser) {
            const registrationsResponse = await courseService.getUserRegistrations(currentUser.id);
            if (registrationsResponse.success) {
              setUserRegistrations(registrationsResponse.data || []);
            }
          }
        } else {
          message.error(confirmResponse.error || 'Lỗi xác nhận thanh toán');
        }
      } else {
        message.error('Thanh toán thất bại');
      }
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Lỗi trong quá trình thanh toán');
    } finally {
      setPaymentModal(prev => ({ ...prev, processing: false }));
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
      case 'BEGINNER': return 'Cơ bản';
      case 'INTERMEDIATE': return 'Trung bình';
      case 'ADVANCED': return 'Nâng cao';
      default: return level;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Đang mở';
      case 'closed': return 'Đã đóng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
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
          message="Debug: Không tìm thấy khóa học"
          description={
            <div>
              <p>Tổng số khóa học tải về: {courses.length}</p>
              <p>Khóa học sau khi filter: {filteredCourses.length}</p>
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
          🎓 Khóa Học Phòng Chống Ma Túy
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Nâng cao kiến thức và kỹ năng phòng chống tệ nạn ma túy với các khóa học chất lượng cao
        </Paragraph>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn danh mục"
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Option value="all">Tất cả danh mục</Option>
              <Option value="1">Cơ bản</Option>
              <Option value="2">Nâng cao</Option>
              <Option value="3">Chuyên nghiệp</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn độ khó"
              value={selectedLevel}
              onChange={setSelectedLevel}
            >
              <Option value="all">Tất cả độ khó</Option>
              <Option value="BEGINNER">Cơ bản</Option>
              <Option value="INTERMEDIATE">Trung bình</Option>
              <Option value="ADVANCED">Nâng cao</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* My Learning Progress (if user is logged in and has enrolled courses) */}
      {currentUser && userRegistrations.length > 0 && (
        <Card title="📈 Tiến Độ Học Tập Của Tôi" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            {userRegistrations.map(registration => {
              const course = courses.find(c => c.id === registration.courseId);
              if (!course) return null;
              
              return (
                <Col xs={24} md={8} key={`progress-${registration.id}`}>
                  <Card size="small" style={{ borderRadius: '8px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>{course.title}</Text>
                      <Progress
                        percent={0} // TODO: Implement real progress tracking
                        status="active"
                        strokeColor={{
                          '0%': '#667eea',
                          '100%': '#764ba2',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">0% hoàn thành</Text>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          Tiếp tục học
                        </Button>
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredCourses.map(course => (
            <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
              <Card
                hoverable
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
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
                        Đã đăng ký
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
                      {course.instructor?.username || 'Chưa có giảng viên'}
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
                      <Text type="secondary">{course.duration || 'Chưa xác định'}</Text>
                    </Space>
                    <Space>
                      <UserOutlined />
                      <Text type="secondary">
                        {course.currentParticipants || 0} học viên
                      </Text>
                    </Space>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '8px'
                  }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      {course.price === 0 ? 'Miễn phí' : `${course.price?.toLocaleString()} VNĐ`}
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

                  <Button 
                    type={isEnrolled(course.id) ? "default" : "primary"}
                    block 
                    size="large"
                    icon={isEnrolled(course.id) ? <PlayCircleOutlined /> : <BookOutlined />}
                    loading={enrolling === course.id}
                    onClick={() => 
                      isEnrolled(course.id) 
                        ? navigate(`/courses/${course.id}`)
                        : handleEnroll(course.id)
                    }
                    style={{
                      borderRadius: '8px',
                      fontWeight: '600',
                      marginTop: '8px'
                    }}
                  >
                    {isEnrolled(course.id) ? '📖 Tiếp tục học' : '🚀 Đăng ký ngay'}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={{ textAlign: 'center', padding: '40px', marginTop: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
          <Title level={4}>Không tìm thấy khóa học phù hợp</Title>
          <Paragraph type="secondary">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm khóa học mong muốn.
          </Paragraph>
          {courses.length === 0 && (
            <div style={{ marginTop: '20px' }}>
              <Text type="secondary">
                Hiện tại chưa có khóa học nào. Vui lòng quay lại sau.
              </Text>
            </div>
          )}
        </Card>
      )}

      {/* Payment Modal */}
      <Modal
        title="💳 Thanh toán khóa học"
        open={paymentModal.visible}
        onCancel={() => !paymentModal.processing && setPaymentModal({ visible: false, paymentInfo: null, processing: false })}
        footer={null}
        closable={!paymentModal.processing}
        width={500}
      >
        {paymentModal.paymentInfo && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>{paymentModal.paymentInfo.courseName}</Title>
              <Text type="secondary">{paymentModal.paymentInfo.message}</Text>
            </div>
            
            <div style={{ 
              background: '#f5f5f5', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tên khóa học:</Text>
                  <Text strong>{paymentModal.paymentInfo.courseName}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Giá:</Text>
                  <Text strong style={{ color: '#f50', fontSize: '18px' }}>
                    {paymentModal.paymentInfo.price?.toLocaleString()} {paymentModal.paymentInfo.currency}
                  </Text>
                </div>
              </Space>
            </div>

            {paymentModal.processing ? (
              <div style={{ padding: '20px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text>Đang xử lý thanh toán...</Text>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ 
                  background: '#e6f7ff', 
                  border: '1px solid #91d5ff',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '20px'
                }}>
                  <Text style={{ fontSize: '14px' }}>
                    🏦 Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch
                  </Text>
                </div>
                
                <Button 
                  type="primary" 
                  size="large"
                  block
                  icon={<DollarOutlined />}
                  onClick={handlePayment}
                  style={{ borderRadius: '8px' }}
                >
                  Thanh toán qua VNPay
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 