import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Form, Tabs, message, Space, List, Typography, Tooltip, Progress, Layout, Select, Row, Col, Badge, Tag } from 'antd';
import { VideoCameraOutlined, ReadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ShareAltOutlined, LikeOutlined, DislikeOutlined, LinkOutlined, PlayCircleOutlined, BookOutlined, TrophyOutlined, FileTextOutlined, FileOutlined, ClockCircleOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import staffCourseService from '../services/staffCourseService';
import paymentService from '../services/paymentService';
import authService from '../services/authService';

const { Title, Paragraph, Text } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [contents, setContents] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [courseStatus, setCourseStatus] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadCourseData();
    checkUserPermissions();
    checkEnrollmentStatus();
  }, [courseId]);

  // Debug: Track lessons state changes
  useEffect(() => {
    console.log('🔄 LESSONS STATE CHANGED:');
    console.log('🔄 lessons:', lessons);
    console.log('🔄 lessons length:', lessons?.length);
    console.log('🔄 lessons array:', Array.isArray(lessons));
  }, [lessons]);

  // Debug: Track activeKey changes
  useEffect(() => {
    console.log('🔑 ACTIVE KEY CHANGED:');
    console.log('🔑 activeKey:', activeKey);
  }, [activeKey]);

  useEffect(() => {
    loadCourseData();
    checkUserPermissions();
    checkEnrollmentStatus();
  }, [courseId]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      // Load course details from backend
      const courseResponse = await courseService.getCourseById(courseId);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
        
        // Load lessons from backend for all users
        await loadLessonsFromBackend();
      } else {
        message.error('Unable to load course information');
        navigate('/courses');
        return;
      }

      // Load additional content for staff
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && ['STAFF', 'ADMIN', 'MANAGER'].includes(user.role?.name)) {
          setIsStaff(true);
          await loadStaffContent();
        }
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      message.error('Error loading course data');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonsFromBackend = async () => {
    try {
      // Load lessons for all enrolled users
      const lessonsResponse = await courseService.getCourseLessons(courseId);
      if (lessonsResponse.success && lessonsResponse.data && lessonsResponse.data.length > 0) {
        console.log('📚 Loaded lessons from backend:', lessonsResponse.data);
        
        // Transform backend lesson data to frontend format
        const transformedLessons = await Promise.all(lessonsResponse.data.map(async (lesson) => {
          // Load content for each lesson - use appropriate service based on user role
          let lessonContent = null;
          try {
            let contentResponse;
            if (isStaff) {
              // Staff can use staffCourseService to see all content (published + unpublished)
              console.log('👨‍💼 Staff - loading all content for lesson:', lesson.id);
              contentResponse = await staffCourseService.getLessonContent(lesson.id);
            } else {
              // Regular users use courseService to see only published content
              console.log('👤 Regular user - loading published content for lesson:', lesson.id);
              console.log('👤 Course ID:', courseId);
              console.log('👤 Calling courseService.getLessonContent with:', courseId, lesson.id);
              contentResponse = await courseService.getLessonContent(courseId, lesson.id);
              console.log('👤 Response from courseService.getLessonContent:', contentResponse);
            }
            
            if (contentResponse && contentResponse.success) {
              lessonContent = contentResponse.data;
              console.log('✅ Lesson content loaded:', lessonContent?.length || 0, 'items');
              console.log('✅ Content data:', lessonContent);
            } else {
              console.log('⚠️ No content or failed to load:', contentResponse?.error);
              console.log('⚠️ Full response:', contentResponse);
            }
          } catch (error) {
            console.error('Error loading lesson content:', error);
          }

          // FIX: Handle array of content items properly
          let primaryContent = null;
          if (lessonContent && Array.isArray(lessonContent) && lessonContent.length > 0) {
            // Use first content item as primary content (or find video content if available)
            primaryContent = lessonContent.find(content => content.contentType === 'VIDEO') || lessonContent[0];
            console.log('📝 Primary content selected:', primaryContent);
          }

          return {
            id: lesson.id,
            type: primaryContent ? (primaryContent.contentType === 'VIDEO' ? 'video' : 'reading') : 'reading',
            title: lesson.title,
            content: primaryContent ? (primaryContent.textContent || primaryContent.description) : lesson.description,
            videoUrl: primaryContent ? primaryContent.videoUrl : null,
            description: primaryContent ? primaryContent.description : lesson.description,
            meetLink: primaryContent ? primaryContent.meetLink : null,
            meetPassword: primaryContent ? primaryContent.meetPassword : null,
            // NEW: Add all content items for detailed display
            allContent: lessonContent || []
          };
        }));
        
        setLessons(transformedLessons);
        console.log('🎯 Transformed lessons set:', transformedLessons);
        console.log('🎯 Lessons count:', transformedLessons.length);
        console.log('🎯 First lesson:', transformedLessons[0]);
        
        // FIX: Set activeKey to first lesson's ID to show content
        if (transformedLessons.length > 0) {
          const firstLessonId = String(transformedLessons[0].id);
          console.log('🔑 Setting activeKey to first lesson ID:', firstLessonId);
          setActiveKey(firstLessonId);
        }
      } else {
        console.log('📚 No lessons found or error loading lessons:', lessonsResponse);
        setLessons([]);
      }
    } catch (error) {
      console.error('❌ Error loading lessons from backend:', error);
      setLessons([]);
    }
  };

  const loadStaffContent = async () => {
    try {
      // Load additional content from staff API
      const contentResponse = await staffCourseService.getCourseContent(courseId);
      if (contentResponse.success) {
        setContents(contentResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading staff content:', error);
    }
  };

  const checkUserPermissions = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsStaff(['STAFF', 'ADMIN', 'MANAGER'].includes(user.role?.name));
      // TODO: Check if user is enrolled in this course
      setIsEnrolled(false);
    }
  };

  // Check if user is enrolled in the course
  const checkEnrollmentStatus = async () => {
    if (!authService.isAuthenticated()) {
      console.log('❌ User not authenticated');
      setIsEnrolled(false);
      return;
    }

    try {
      console.log('🔍 Checking enrollment for course:', courseId);
      console.log('👤 Current user:', authService.getCurrentUser());
      
      const response = await courseService.checkEnrollment(courseId);
      console.log('📋 Enrollment response:', response);
      console.log('📋 Response data:', response.data);
      console.log('📋 Response success:', response.success);
      
      const isEnrolledStatus = response.success && response.isEnrolled;
      console.log('✅ Is enrolled:', isEnrolledStatus);
      console.log('🔍 response.isEnrolled value:', response.isEnrolled);
      
      setIsEnrolled(isEnrolledStatus);
      console.log('🎯 Setting isEnrolled state to:', isEnrolledStatus);
      
      // Load course status if enrolled
      if (isEnrolledStatus) {
        console.log('📊 Loading course status...');
        await loadCourseStatus();
      }
    } catch (error) {
      console.error('❌ Error checking enrollment status:', error);
      setIsEnrolled(false);
    }
  };

  const loadCourseStatus = async () => {
    try {
      console.log('🔄 Loading course status for course:', courseId);
      const response = await courseService.getCourseStatus(courseId);
      console.log('📊 Course status response:', response);
      
      if (response.success) {
        console.log('✅ Course status loaded:', response.data.status);
        setCourseStatus(response.data.status);
      } else {
        console.log('❌ Failed to load course status:', response.error);
      }
    } catch (error) {
      console.error('❌ Error loading course status:', error);
    }
  };

  const handleCompleteCourse = async () => {
    setCompleting(true);
    try {
      const result = await courseService.completeCourse(courseId);
      
      if (result.success) {
        message.success('Khóa học đã được hoàn thành!');
        setCourseStatus('COMPLETED');
      } else {
        message.error(`Lỗi hoàn thành khóa học: ${result.error}`);
      }
    } catch (error) {
      console.error('Error completing course:', error);
      message.error('Lỗi hoàn thành khóa học');
    } finally {
      setCompleting(false);
    }
  };

  // Handle course enrollment
  const handleEnrollment = async () => {
    if (!authService.isAuthenticated()) {
      message.warning('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    setEnrollmentLoading(true);
    try {
      // Check if course is free or paid
      if (!course.price || course.price === 0) {
        // FREE COURSE - Call registration API directly
        const response = await courseService.enrollInCourse(courseId);
        if (response.success) {
          message.success('Successfully enrolled in the course!');
          setIsEnrolled(true);
          await checkEnrollmentStatus();
        } else {
          message.error(response.error || 'Failed to enroll in course');
        }
      } else {
        // PAID COURSE - Create VNPay payment first
        const paymentResponse = await paymentService.createCoursePayment(
          courseId, 
          course.price, 
          `Enrollment for ${course.title}`
        );
        
        if (paymentResponse.success) {
          message.info('Redirecting to payment gateway...');
          // Redirect to VNPay
          paymentService.redirectToPayment(paymentResponse.paymentUrl);
        } else {
          message.error(paymentResponse.error || 'Failed to create payment');
        }
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      message.error('An error occurred during enrollment');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Save lesson (add/edit)
  const handleSaveLesson = async (values) => {
    try {
      if (!isStaff) {
        message.error('Only staff members can manage lessons');
        return;
      }

      // Transform frontend data to backend format
      const lessonData = {
        title: values.title,
        contentType: values.type === 'video' ? 'VIDEO' : 'TEXT',
        content: values.content,
        textContent: values.content,
        videoUrl: values.videoUrl,
        description: values.description,
        meetLink: values.meetLink
      };

      if (editingItem) {
        // Update existing lesson
        const response = await staffCourseService.updateLesson(courseId, editingItem.id, lessonData);
        if (response.success) {
          message.success('Lesson updated successfully');
          await loadLessonsFromBackend(); // Reload from backend
        } else {
          message.error(response.error || 'Failed to update lesson');
          return;
        }
      } else {
        // Create new lesson
        const response = await staffCourseService.createLesson(courseId, lessonData);
        if (response.success) {
          message.success('Lesson added successfully');
          await loadLessonsFromBackend(); // Reload from backend
        } else {
          message.error(response.error || 'Failed to create lesson');
          return;
        }
      }
      
      setModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      console.error('Error saving lesson:', error);
      message.error('Error saving lesson');
    }
  };

  // Delete lesson
  const handleDelete = async (id) => {
    try {
      if (!isStaff) {
        message.error('Only staff members can delete lessons');
        return;
      }

      // Delete from backend
      const response = await staffCourseService.deleteLesson(courseId, id);
      if (response.success) {
        message.success('Lesson deleted successfully');
        
        // Update active key if needed
        if (activeKey === String(id) && lessons.length > 1) {
          const remainingLessons = lessons.filter(item => item.id !== id);
          setActiveKey(String(remainingLessons[0]?.id || '1'));
        }
        
        // Reload lessons from backend
        await loadLessonsFromBackend();
      } else {
        message.error(response.error || 'Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      message.error('Error deleting lesson');
    }
  };

  // Open modal for add/edit
  const openModal = (item = null) => {
    setEditingItem(item);
    setModalVisible(true);
    if (item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
  };

  // Convert YouTube URL to embed format
  const convertYoutubeLinkToEmbed = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  // Render lesson content
  const renderContent = (item) => {
    if (!item) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Title level={4}>No lessons available</Title>
          <Paragraph>
            {isStaff ? 'Create your first lesson to get started!' : 'This course has no lessons yet.'}
          </Paragraph>
          {isStaff && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              Add First Lesson
            </Button>
          )}
        </div>
      );
    }

    // Get all content items for this lesson
    const allContentItems = item.allContent || [];
    console.log('🎨 Rendering all content items:', allContentItems);
    
    // Sort content by contentOrder
    const sortedContent = allContentItems.sort((a, b) => (a.contentOrder || 0) - (b.contentOrder || 0));

    return (
      <div style={{ padding: '20px' }}>
        <Title level={3}>
          <BookOutlined /> {item.title}
        </Title>
        
        {sortedContent.length > 0 ? (
          <div>
            {sortedContent.map((contentItem, index) => (
              <div key={contentItem.id || index} style={{ marginBottom: '24px' }}>
                {/* Content Title */}
                <Title level={4} style={{ marginBottom: '16px' }}>
                  {contentItem.contentType === 'VIDEO' && <PlayCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />}
                  {contentItem.contentType === 'TEXT' && <FileTextOutlined style={{ color: '#1890ff', marginRight: '8px' }} />}
                  {contentItem.contentType === 'MEET_LINK' && <LinkOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
                  {contentItem.title}
                </Title>

                {/* VIDEO Content */}
                {contentItem.contentType === 'VIDEO' && contentItem.videoUrl && (
                  <Card style={{ marginBottom: '16px' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                      <iframe
                        src={convertYoutubeLinkToEmbed(contentItem.videoUrl)}
                        title={contentItem.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                      />
                    </div>
                    {contentItem.description && (
                      <div style={{ marginTop: '16px' }}>
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          {contentItem.description}
                        </Paragraph>
                      </div>
                    )}
                  </Card>
                )}

                {/* TEXT Content */}
                {contentItem.contentType === 'TEXT' && (
                  <Card style={{ marginBottom: '16px' }}>
                    {contentItem.description && (
                      <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
                        <Text strong>Description: </Text>{contentItem.description}
                      </Paragraph>
                    )}
                    {contentItem.textContent && (
                      <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        {contentItem.textContent}
                      </Paragraph>
                    )}
                  </Card>
                )}

                {/* MEET_LINK Content */}
                {contentItem.contentType === 'MEET_LINK' && contentItem.meetLink && (
                  <Card style={{ marginBottom: '16px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <LinkOutlined style={{ color: '#52c41a' }} />
                        <Text strong>Live Session Link:</Text>
                        <Button 
                          type="link" 
                          href={contentItem.meetLink} 
                          target="_blank"
                          style={{ color: '#52c41a' }}
                        >
                          Join Meeting
                        </Button>
                      </Space>
                      {contentItem.meetPassword && (
                        <Space>
                          <Text type="secondary">Password:</Text>
                          <Text code>{contentItem.meetPassword}</Text>
                        </Space>
                      )}
                      {contentItem.description && (
                        <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                          {contentItem.description}
                        </Paragraph>
                      )}
                    </Space>
                  </Card>
                )}

                {/* DOCUMENT Content */}
                {contentItem.contentType === 'DOCUMENT' && contentItem.documentUrl && (
                  <Card style={{ marginBottom: '16px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <FileOutlined style={{ color: '#722ed1' }} />
                        <Text strong>Document:</Text>
                        <Button 
                          type="link" 
                          href={contentItem.documentUrl} 
                          target="_blank"
                          style={{ color: '#722ed1' }}
                        >
                          {contentItem.documentName || 'Download Document'}
                        </Button>
                      </Space>
                      {contentItem.description && (
                        <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                          {contentItem.description}
                        </Paragraph>
                      )}
                    </Space>
                  </Card>
                )}

                {/* Duration Info */}
                {contentItem.estimatedDuration && (
                  <div style={{ textAlign: 'right', marginBottom: '8px' }}>
                    <Tag icon={<ClockCircleOutlined />} color="blue">
                      {contentItem.estimatedDuration} minutes
                    </Tag>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Fallback to old single content display if no allContent
          <>
            {item.type === 'reading' && (
              <Card>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  {item.content}
                </Paragraph>
              </Card>
            )}
            
            {item.type === 'video' && (
              <>
                <Card style={{ marginBottom: '16px' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    {item.videoUrl && (
                      <iframe
                        src={convertYoutubeLinkToEmbed(item.videoUrl)}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                      />
                    )}
                  </div>
                </Card>
                {item.description && (
                  <Card>
                    <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      {item.description}
                    </Paragraph>
                  </Card>
                )}
              </>
            )}
            
            {item.meetLink && (
              <Card style={{ marginTop: '16px', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <LinkOutlined style={{ color: '#52c41a' }} />
                    <Text strong>Live Session Link:</Text>
                    <Button 
                      type="link" 
                      href={item.meetLink} 
                      target="_blank"
                      style={{ color: '#52c41a' }}
                    >
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
          </>
        )}

        {/* Navigation buttons */}
        <Row justify="space-between" style={{ marginTop: '24px' }}>
          <Col>
            {currentIdx > 0 && (
              <Button onClick={() => {
                setCurrentIdx(currentIdx - 1);
                setActiveKey(String(lessons[currentIdx - 1].id));
              }}>
                ← Previous
              </Button>
            )}
          </Col>
          <Col>
            {currentIdx < lessons.length - 1 && (
              <Button type="primary" onClick={() => {
                setCurrentIdx(currentIdx + 1);
                setActiveKey(String(lessons[currentIdx + 1].id));
              }}>
                Next →
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!course) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Course not found</div>;
  }

  // Calculate current lesson directly
  const currentLesson = lessons.find(lesson => String(lesson.id) === activeKey);
  const currentIndex = lessons.findIndex(lesson => String(lesson.id) === activeKey);
  const currentIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Course Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                {course.title}
                {isEnrolled && (
                  <Tag color="green" style={{ marginLeft: 12 }}>
                    Enrolled
                  </Tag>
                )}
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#666', margin: '8px 0' }}>
                {course.description}
              </Paragraph>
              <Space size="large">
                <Text strong style={{ fontSize: '18px', color: course.price > 0 ? '#f50' : '#52c41a' }}>
                  {course.price === 0 || course.price === null || course.price === undefined 
                    ? 'Free' 
                    : `${Number(course.price).toLocaleString()} VND`
                  }
                </Text>
                <Text type="secondary">
                  Duration: {course.duration || 'Not specified'}
                </Text>
                <Text type="secondary">
                  Level: {course.level || 'Beginner'}
                </Text>
              </Space>
            </Col>
            <Col>
              {(() => {
                console.log('🎯 Button rendering debug:');
                console.log('  - isEnrolled:', isEnrolled);
                console.log('  - isStaff:', isStaff);
                console.log('  - courseStatus:', courseStatus);
                console.log('  - course.price:', course.price);
                
                if (!isEnrolled && !isStaff) {
                  console.log('🎯 Rendering: Pay/Enroll button');
                  return (
                    <Button 
                      type="primary" 
                      size="large" 
                      onClick={handleEnrollment} 
                      loading={enrollmentLoading}
                      style={{ minWidth: 150 }}
                    >
                      {enrollmentLoading 
                        ? 'Processing...' 
                        : course.price > 0 
                          ? `Pay ${Number(course.price).toLocaleString()} VND` 
                          : 'Enroll Free'
                      }
                    </Button>
                  );
                } else if (isEnrolled && !isStaff) {
                  console.log('🎯 Rendering: Enrolled/Complete buttons');
                  if (courseStatus === 'COMPLETED') {
                    console.log('🎯 Rendering: Completed button');
                    return (
                      <Button type="default" size="large" disabled style={{ background: '#52c41a', color: 'white', borderColor: '#52c41a' }}>
                        ✅ Completed
                      </Button>
                    );
                  } else {
                    console.log('🎯 Rendering: Enrolled + Complete Course buttons');
                    return (
                      <Space direction="vertical" size="small">
                        <Button type="default" size="large" disabled>
                          ✅ Enrolled
                        </Button>
                        <Button 
                          type="primary" 
                          size="large" 
                          icon={<TrophyOutlined />}
                          loading={completing}
                          onClick={handleCompleteCourse}
                          style={{ minWidth: 150 }}
                        >
                          🏆 Complete Course
                        </Button>
                      </Space>
                    );
                  }
                } else if (isStaff) {
                  console.log('🎯 Rendering: Staff Edit button');
                  return (
                    <Button 
                      type="dashed" 
                      size="large" 
                      onClick={() => navigate(`/course-management/${courseId}/lessons`)}
                    >
                      📝 Edit Lessons
                    </Button>
                  );
                }
                console.log('🎯 No button rendered');
                return null;
              })()}
            </Col>
          </Row>
      </Card>

      {/* Course Content */}
      <Layout style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        {/* Sidebar - Lesson List */}
        <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Title level={4}>Lesson List</Title>
              {isStaff && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={() => openModal()}
                >
                  Add Lesson
                </Button>
              )}
            </Space>
            
            {(() => {
              console.log('🎨 RENDERING LESSONS LIST:');
              console.log('🎨 lessons:', lessons);
              console.log('🎨 lessons.length:', lessons?.length);
              console.log('🎨 lessons type:', typeof lessons);
              console.log('🎨 lessons is array:', Array.isArray(lessons));
              return null;
            })()}
            
            {lessons.length > 0 ? (
              <List
                dataSource={lessons}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.id}
                    className={activeKey === String(item.id) ? 'active-lesson' : ''}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      backgroundColor: activeKey === String(item.id) ? '#e6f7ff' : 'transparent',
                      border: activeKey === String(item.id) ? '1px solid #1890ff' : '1px solid transparent'
                    }}
                    onClick={() => setActiveKey(String(item.id))}
                    actions={isStaff ? [
                      <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); openModal(item); }} />,
                      <DeleteOutlined key="delete" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} />
                    ] : []}
                  >
                    <List.Item.Meta
                      avatar={item.type === 'video' ? <PlayCircleOutlined /> : <ReadOutlined />}
                      title={`${index + 1}. ${item.title}`}
                      description={item.type === 'video' ? 'Video Lesson' : 'Reading Material'}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Paragraph type="secondary">
                  {isStaff ? 'No lessons created yet. Add your first lesson to get started!' : 'No lessons available for this course.'}
                </Paragraph>
                {isStaff && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                    Create First Lesson
                  </Button>
                )}
              </div>
            )}
          </div>
        </Sider>

        {/* Main Content */}
        <Content style={{ minHeight: '500px' }}>
          {renderContent(currentLesson)}
        </Content>
      </Layout>

      {/* Add/Edit Lesson Modal */}
      <Modal
        title={editingItem ? "Edit Lesson" : "Add New Lesson"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSaveLesson}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Lesson Title"
            rules={[{ required: true, message: 'Please enter lesson title!' }]}
          >
            <Input placeholder="Enter lesson title" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Lesson Type"
            rules={[{ required: true, message: 'Please select lesson type!' }]}
          >
            <Select placeholder="Select lesson type">
              <Option value="reading">Reading Material</Option>
              <Option value="video">Video Lesson</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'reading') {
                return (
                  <Form.Item
                    name="content"
                    label="Lesson Content"
                    rules={[{ required: true, message: 'Please enter lesson content!' }]}
                  >
                    <Input.TextArea rows={6} placeholder="Enter lesson content" />
                  </Form.Item>
                );
              }
              if (type === 'video') {
                return (
                  <>
                    <Form.Item
                      name="videoUrl"
                      label="YouTube Link"
                      rules={[
                        { required: true, message: 'Please enter YouTube link!' },
                        { pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/, message: 'Only valid YouTube links are accepted!' }
                      ]}
                    >
                      <Input placeholder="https://www.youtube.com/watch?v=xxxxxxx" />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Video Description"
                    >
                      <Input.TextArea rows={3} placeholder="Short description of the video (optional)" />
                    </Form.Item>
                  </>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="meetLink"
            label="Google Meet Link (optional)"
          >
            <Input placeholder="https://meet.google.com/abc-defg-hij" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingItem(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage; 