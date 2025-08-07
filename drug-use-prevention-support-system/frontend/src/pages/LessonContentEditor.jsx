import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Select, 
  Modal, 
  List, 
  Space, 
  Typography, 
  Row, 
  Col, 
  message, 
  Popconfirm,
  Tabs,
  Divider,
  Tag,
  Badge,
  Alert,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  VideoCameraOutlined, 
  ReadOutlined, 
  LinkOutlined,
  ArrowLeftOutlined,
  PlayCircleOutlined,
  BookOutlined,
  SaveOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import staffCourseService from '../services/staffCourseService';
import authService from '../services/authService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const LessonContentEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [contentModalVisible, setContentModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [lessonForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);

  // Debug: Log contents state changes
  useEffect(() => {
    console.log('🔄 Contents state changed:', contents);
    console.log('🔄 Contents length:', contents.length);
    console.log('🔄 Contents array:', contents);
  }, [contents]);

  useEffect(() => {
    checkUserPermissions();
    loadData();
  }, [courseId]);

  const checkUserPermissions = () => {
    const user = authService.getCurrentUser();
    const userRole = authService.getUserRole();
    
    console.log('🔍 LessonContentEditor - Current user:', user);
    console.log('🔍 LessonContentEditor - User role:', userRole);
    console.log('🔍 LessonContentEditor - Is staff or higher:', authService.isStaffOrHigher());
    
    if (!authService.isAuthenticated()) {
      message.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    if (!authService.isStaffOrHigher()) {
      message.error('Access denied. Staff privileges required.');
      navigate('/unauthorized');
      return;
    }
    
    setCurrentUser(user);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load course details
      const courseResponse = await staffCourseService.getCourseById(courseId);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      }

      // Load lessons
      await loadLessons();
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Error loading course data');
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      console.log('🔍 Loading lessons for courseId:', courseId);
      console.log('🔍 Current token:', authService.getToken() ? 'EXISTS' : 'MISSING');
      console.log('🔍 API call URL:', `/staff/courses/${courseId}/lessons`);
      
      const response = await staffCourseService.getCourseLessons(courseId);
      console.log('✅ Lessons response:', response);
      
      if (response.success) {
        setLessons(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedLesson(response.data[0]);
          await loadLessonContents(response.data[0].id);
        }
      } else {
        console.error('❌ Failed to load lessons:', response.error);
        message.error('Failed to load lessons: ' + response.error);
      }
    } catch (error) {
      console.error('❌ Error loading lessons:', error);
      message.error('Error loading lessons');
    }
  };

  const loadLessonContents = async (lessonId) => {
    try {
      console.log('🔄 Loading lesson contents for lessonId:', lessonId);
      const response = await staffCourseService.getLessonContent(lessonId);
      console.log('📥 Response from getLessonContent:', response);
      console.log('📥 Response.success:', response.success);
      console.log('📥 Response.data:', response.data);
      console.log('📥 Response.data type:', typeof response.data);
      console.log('📥 Response.data.data:', response.data?.data);
      console.log('📥 Response.data.data length:', response.data?.data?.length);
      
      if (response.success) {
        // FIX: Extract data array correctly from nested response structure
        const contentData = response.data?.data || response.data || [];
        console.log('✅ Setting contents to:', contentData);
        console.log('✅ Content data type:', typeof contentData);
        console.log('✅ Content data is array:', Array.isArray(contentData));
        setContents(contentData);
        console.log('✅ Contents state should be updated to length:', contentData.length);
      } else {
        console.log('❌ Response not successful:', response);
      }
    } catch (error) {
      console.error('Error loading lesson contents:', error);
      message.error('Error loading lesson contents');
    }
  };

  const handleLessonSelect = async (lesson) => {
    setSelectedLesson(lesson);
    await loadLessonContents(lesson.id);
  };

  const handleCreateLesson = () => {
    console.log('🔵 Create Lesson button clicked!');
    setEditingLesson(null);
    lessonForm.resetFields();
    setModalVisible(true);
    console.log('🔵 Modal should be visible now:', true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    lessonForm.setFieldsValue({
      title: lesson.title,
      description: lesson.description,
      lessonOrder: lesson.lessonOrder,
      estimatedDuration: lesson.estimatedDuration,
      isPublished: lesson.isPublished,
      isFree: lesson.isFree,
      requiredCompletion: lesson.requiredCompletion
    });
    setModalVisible(true);
  };

  const handleSaveLesson = async (values) => {
    try {
      const lessonData = {
        ...values,
        courseId: courseId,
        createdBy: currentUser.id
      };

      let response;
      if (editingLesson) {
        response = await staffCourseService.updateLesson(courseId, editingLesson.id, lessonData);
      } else {
        response = await staffCourseService.createLesson(courseId, lessonData);
      }

      if (response.success) {
        message.success(editingLesson ? 'Lesson updated successfully!' : 'Lesson created successfully!');
        setModalVisible(false);
        setEditingLesson(null);
        lessonForm.resetFields();
        await loadLessons();
      } else {
        message.error(response.error || 'Failed to save lesson');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      message.error('Error saving lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      const response = await staffCourseService.deleteLesson(courseId, lessonId);
      if (response.success) {
        message.success('Lesson deleted successfully!');
        await loadLessons();
        if (selectedLesson && selectedLesson.id === lessonId) {
          setSelectedLesson(null);
          setContents([]);
        }
      } else {
        message.error(response.error || 'Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      message.error('Error deleting lesson');
    }
  };

  const handleCreateContent = () => {
    setEditingContent(null);
    contentForm.resetFields();
    setContentModalVisible(true);
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    contentForm.setFieldsValue({
      title: content.title,
      description: content.description,
      contentType: content.contentType,
      textContent: content.textContent,
      videoUrl: content.videoUrl,
      meetLink: content.meetLink,
      meetPassword: content.meetPassword,
      contentOrder: content.contentOrder,
      isPublished: content.isPublished,
      isFree: content.isFree,
      estimatedDuration: content.estimatedDuration
    });
    setContentModalVisible(true);
  };

  const handleSaveContent = async (values) => {
    if (!selectedLesson) {
      message.error('Please select a lesson first');
      return;
    }

    try {
      const contentData = {
        ...values,
        courseId: courseId,
        lessonId: selectedLesson.id,
        createdBy: currentUser.id
      };

      let response;
      if (editingContent) {
        response = await staffCourseService.updateLessonContent(selectedLesson.id, editingContent.id, contentData);
      } else {
        response = await staffCourseService.createLessonContent(selectedLesson.id, contentData);
      }

      if (response.success) {
        message.success(editingContent ? 'Content updated successfully!' : 'Content created successfully!');
        setContentModalVisible(false);
        setEditingContent(null);
        contentForm.resetFields();
        await loadLessonContents(selectedLesson.id);
      } else {
        message.error(response.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      message.error('Error saving content');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!selectedLesson) return;

    try {
      const response = await staffCourseService.deleteLessonContent(selectedLesson.id, contentId);
      if (response.success) {
        message.success('Content deleted successfully!');
        await loadLessonContents(selectedLesson.id);
      } else {
        message.error(response.error || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      message.error('Error deleting content');
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <VideoCameraOutlined />;
      case 'TEXT': return <FileTextOutlined />;
      case 'MEET_LINK': return <LinkOutlined />;
      default: return <BookOutlined />;
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'VIDEO': return 'red';
      case 'TEXT': return 'blue';
      case 'MEET_LINK': return 'green';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Loading lesson editor...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/course-management')}
              >
                Back to Course Management
              </Button>
              <Divider type="vertical" />
              <Title level={3} style={{ margin: 0 }}>
                Lesson Content Editor
              </Title>
            </Space>
            {course && (
              <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                Course: {course.title}
              </Paragraph>
            )}
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateLesson}
              >
                Add New Lesson
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Alert
          message="🔧 Lesson Editor Debug Info"
          description={
            <div>
              <p>Course ID: {courseId}</p>
              <p>User: {currentUser?.userName} ({authService.getUserRole()})</p>
              <p>Token: {authService.getToken() ? 'EXISTS' : 'MISSING'}</p>
              <p>Lessons Count: {lessons.length}</p>
              <p>Selected Lesson: {selectedLesson?.title || 'None'}</p>
              <Button size="small" onClick={() => navigate('/staff-debug')}>
                Debug Page
              </Button>
            </div>
          }
          type="info"
          style={{ marginBottom: '24px' }}
          closable
        />
      )}

      <Row gutter={24}>
        {/* Lessons List */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                <span>Lessons ({lessons.length})</span>
              </Space>
            }
            extra={
              <Button 
                size="small" 
                type="text" 
                icon={<PlusOutlined />} 
                onClick={handleCreateLesson}
              >
                Add
              </Button>
            }
          >
            {lessons.length > 0 ? (
              <List
                dataSource={lessons}
                renderItem={(lesson, index) => (
                  <List.Item
                    key={lesson.id}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedLesson?.id === lesson.id ? '#e6f7ff' : 'transparent',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      padding: '12px',
                      border: selectedLesson?.id === lesson.id ? '1px solid #1890ff' : '1px solid transparent'
                    }}
                    onClick={() => handleLessonSelect(lesson)}
                    actions={[
                      <EditOutlined 
                        key="edit" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditLesson(lesson); 
                        }} 
                      />,
                      <Popconfirm
                        key="delete"
                        title="Are you sure you want to delete this lesson?"
                        onConfirm={(e) => {
                          e.stopPropagation();
                          handleDeleteLesson(lesson.id);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined 
                          onClick={(e) => e.stopPropagation()} 
                        />
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Badge count={index + 1} style={{ backgroundColor: '#52c41a' }} />
                          <span>{lesson.title}</span>
                          {lesson.isPublished && <Tag color="green" size="small">Published</Tag>}
                        </Space>
                      }
                      description={lesson.description}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <BookOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Paragraph type="secondary">
                  No lessons created yet. Add your first lesson to get started!
                </Paragraph>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateLesson}>
                  Create First Lesson
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Lesson Content */}
        <Col span={16}>
          {selectedLesson ? (
            <Card
              title={
                <Space>
                  <PlayCircleOutlined />
                  <span>{selectedLesson.title} - Content</span>
                </Space>
              }
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={handleCreateContent}
                >
                  Add Content
                </Button>
              }
            >
              {(() => {
                console.log('🎨 Rendering contents section - contents.length:', contents.length);
                console.log('🎨 Contents data:', contents);
                return contents.length > 0 ? (
                  <List
                    dataSource={contents}
                    renderItem={(content) => {
                      console.log('🎨 Rendering content item:', content);
                      return (
                        <List.Item
                          key={content.id}
                          actions={[
                            <EditOutlined 
                              key="edit" 
                              onClick={() => handleEditContent(content)} 
                            />,
                            <Popconfirm
                              key="delete"
                              title="Are you sure you want to delete this content?"
                              onConfirm={() => handleDeleteContent(content.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined />
                            </Popconfirm>
                          ]}
                        >
                          <List.Item.Meta
                            avatar={getContentTypeIcon(content.contentType)}
                            title={
                              <Space>
                                <span>{content.title}</span>
                                <Tag color={getContentTypeColor(content.contentType)}>
                                  {content.contentType}
                                </Tag>
                                {/* HIDDEN: Published status tags - simplified UI
                                {content.isPublished ? (
                                  <Tag color="green" size="small">✅ Published</Tag>
                                ) : (
                                  <Tag color="orange" size="small">📝 Draft</Tag>
                                )}
                                */}
                              </Space>
                            }
                            description={
                              <div>
                                <Paragraph ellipsis={{ rows: 2 }}>
                                  {content.description || content.textContent}
                                </Paragraph>
                                {content.videoUrl && (
                                  <Text type="secondary">Video: {content.videoUrl}</Text>
                                )}
                                {content.meetLink && (
                                  <Text type="secondary">Meeting: {content.meetLink}</Text>
                                )}
                                {content.estimatedDuration && (
                                  <Tag icon={<VideoCameraOutlined />}>
                                    {content.estimatedDuration} min
                                  </Tag>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Paragraph type="secondary">
                      No content added to this lesson yet. Add content to make it engaging!
                    </Paragraph>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateContent}>
                      Add First Content
                    </Button>
                  </div>
                );
              })()}
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                <BookOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '24px' }} />
                <Title level={4}>Select a Lesson</Title>
                <Paragraph type="secondary">
                  Choose a lesson from the left panel to manage its content
                </Paragraph>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Lesson Modal */}
      <Modal
        title={editingLesson ? "Edit Lesson" : "Create New Lesson"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingLesson(null);
          lessonForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={lessonForm}
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
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Brief description of the lesson" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="lessonOrder"
                label="Lesson Order"
                initialValue={lessons.length + 1}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedDuration"
                label="Duration (minutes)"
              >
                <Input type="number" min={1} placeholder="e.g. 30" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="isPublished"
                label="Published"
                valuePropName="checked"
                initialValue={false}
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isFree"
                label="Free Access"
                valuePropName="checked"
                initialValue={true}
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="requiredCompletion"
                label="Required"
                valuePropName="checked"
                initialValue={false}
              >
                <Select>
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingLesson(null);
                lessonForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingLesson ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Content Modal */}
      <Modal
        title={editingContent ? "Edit Content" : "Add New Content"}
        open={contentModalVisible}
        onCancel={() => {
          setContentModalVisible(false);
          setEditingContent(null);
          contentForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={contentForm}
          onFinish={handleSaveContent}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Content Title"
            rules={[{ required: true, message: 'Please enter content title!' }]}
          >
            <Input placeholder="Enter content title" />
          </Form.Item>

          <Form.Item
            name="contentType"
            label="Content Type"
            rules={[{ required: true, message: 'Please select content type!' }]}
          >
            <Select placeholder="Select content type">
              <Option value="TEXT">Text Content</Option>
              <Option value="VIDEO">Video Content</Option>
              <Option value="MEET_LINK">Live Meeting Link</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.contentType !== currentValues.contentType}>
            {({ getFieldValue }) => {
              const type = getFieldValue('contentType');
              
              if (type === 'TEXT') {
                return (
                  <Form.Item
                    name="textContent"
                    label="Text Content"
                    rules={[{ required: true, message: 'Please enter text content!' }]}
                  >
                    <TextArea rows={6} placeholder="Enter lesson text content..." />
                  </Form.Item>
                );
              }
              
              if (type === 'VIDEO') {
                return (
                  <>
                    <Form.Item
                      name="videoUrl"
                      label="YouTube Video URL"
                      rules={[
                        { required: true, message: 'Please enter YouTube video URL!' },
                        { pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/, message: 'Please enter a valid YouTube URL!' }
                      ]}
                    >
                      <Input placeholder="https://www.youtube.com/watch?v=xxxxxxx" />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Video Description"
                    >
                      <TextArea rows={3} placeholder="Brief description of the video content" />
                    </Form.Item>
                  </>
                );
              }
              
              if (type === 'MEET_LINK') {
                return (
                  <>
                    <Form.Item
                      name="meetLink"
                      label="Meeting Link"
                      rules={[{ required: true, message: 'Please enter meeting link!' }]}
                    >
                      <Input placeholder="https://meet.google.com/abc-defg-hij" />
                    </Form.Item>
                    <Form.Item
                      name="meetPassword"
                      label="Meeting Password"
                    >
                      <Input placeholder="Optional meeting password" />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Meeting Description"
                    >
                      <TextArea rows={3} placeholder="What will be covered in this live session?" />
                    </Form.Item>
                  </>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="contentOrder"
                label="Content Order"
                initialValue={contents.length + 1}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="estimatedDuration"
                label="Duration (minutes)"
              >
                <Input type="number" min={1} placeholder="e.g. 15" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPublished"
                label="Published Status"
                initialValue={true}
                tooltip="Published content is visible to enrolled users. Unpublished content is only visible to staff."
              >
                <Select>
                  <Option value={true}>✅ Published (Users can see)</Option>
                  <Option value={false}>📝 Draft (Staff only)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setContentModalVisible(false);
                setEditingContent(null);
                contentForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                {editingContent ? 'Update' : 'Add'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LessonContentEditor; 