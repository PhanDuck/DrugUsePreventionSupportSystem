import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Form, Tabs, message, Space, List, Typography, Tooltip, Progress, Layout, Select } from 'antd';
import { VideoCameraOutlined, ReadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ShareAltOutlined, LikeOutlined, DislikeOutlined, LinkOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import staffCourseService from '../services/staffCourseService';
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

  useEffect(() => {
    loadCourseData();
    checkUserPermissions();
  }, [courseId]);

  const loadCourseData = async () => {
    setLoading(true);
    try {
      // Load course details
      const courseResponse = await courseService.getCourseById(courseId);
      if (courseResponse.success) {
        setCourse(courseResponse.data);
      } else {
        message.error('Không thể tải thông tin khóa học');
        navigate('/courses');
        return;
      }

      // Load lessons and content for staff
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user && ['STAFF', 'ADMIN', 'MANAGER'].includes(user.role?.name)) {
          setIsStaff(true);
          await loadLessonsAndContent();
        }
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      message.error('Lỗi khi tải dữ liệu khóa học');
    } finally {
      setLoading(false);
    }
  };

  const loadLessonsAndContent = async () => {
    try {
      // Load lessons
      const lessonsResponse = await staffCourseService.getCourseLessons(courseId);
      if (lessonsResponse.success) {
        setLessons(lessonsResponse.data || []);
      }

      // Load content
      const contentResponse = await staffCourseService.getCourseContent(courseId);
      if (contentResponse.success) {
        setContents(contentResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading lessons and content:', error);
    }
  };

  const checkUserPermissions = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsStaff(['STAFF', 'ADMIN', 'MANAGER'].includes(user.role?.name));
      // TODO: Check if user is enrolled in this course
      // For now, set to false
      setIsEnrolled(false);
    }
  };

  const handleEnrollCourse = async () => {
    if (!authService.isAuthenticated()) {
      message.warning('Vui lòng đăng nhập để đăng ký khóa học');
      navigate('/login');
      return;
    }

    try {
      const response = await courseService.registerForCourse(courseId);
      if (response.success) {
        message.success('Đăng ký khóa học thành công!');
        setIsEnrolled(true);
      } else {
        message.error(response.error || 'Không thể đăng ký khóa học');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      message.error('Lỗi khi đăng ký khóa học');
    }
  };

  const handleCreateLesson = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditContent = (content) => {
    setEditingItem(content);
    form.setFieldsValue(content);
    setModalVisible(true);
  };

  const handleSaveLesson = async (values) => {
    try {
      if (editingItem) {
        // Update existing content
        const response = await staffCourseService.updateContent(courseId, editingItem.id, values);
        if (response.success) {
          message.success('Cập nhật nội dung thành công');
          await loadLessonsAndContent();
        } else {
          message.error('Không thể cập nhật nội dung');
        }
      } else {
        // Create new lesson or content
        const response = await staffCourseService.createContent(courseId, values);
        if (response.success) {
          message.success('Tạo nội dung thành công');
          await loadLessonsAndContent();
        } else {
          message.error('Không thể tạo nội dung');
        }
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      message.error('Lỗi khi lưu nội dung');
    }

    setModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDeleteContent = async (contentId) => {
    try {
      const response = await staffCourseService.deleteContent(courseId, contentId);
      if (response.success) {
        message.success('Xóa nội dung thành công');
        await loadLessonsAndContent();
        // Reset active tab if needed
        if (activeKey === String(contentId) && contents.length > 1) {
          setActiveKey(String(contents[0].id));
        }
      } else {
        message.error('Không thể xóa nội dung');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      message.error('Lỗi khi xóa nội dung');
    }
  };

  const renderContentByType = (content) => {
    if (!content) return null;

    switch (content.contentType) {
      case 'VIDEO':
        return (
          <div>
            <iframe
              width="100%"
              height="400"
              src={content.videoUrl}
              title={content.title}
              frameBorder="0"
              allowFullScreen
            />
            <Paragraph style={{ marginTop: 16 }}>
              {content.description}
            </Paragraph>
          </div>
        );

      case 'TEXT':
        return (
          <div>
            <div dangerouslySetInnerHTML={{ __html: content.textContent }} />
          </div>
        );

      case 'MEET_LINK':
        return (
          <Card title="🎥 Live Session">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Thời gian: {content.meetStartTime}</Text>
              {content.meetPassword && (
                <Text>Mật khẩu: <code>{content.meetPassword}</code></Text>
              )}
              <Button type="primary" href={content.meetLink} target="_blank">
                Tham gia buổi học
              </Button>
            </Space>
          </Card>
        );

      case 'DOCUMENT':
        return (
          <Card title="📄 Tài liệu">
            <Space direction="vertical">
              <Text>{content.description}</Text>
              <Button type="primary" href={content.documentUrl} target="_blank">
                Tải xuống: {content.documentName}
              </Button>
            </Space>
          </Card>
        );

      default:
        return <Text>Loại nội dung không được hỗ trợ</Text>;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>;
  }

  if (!course) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy khóa học</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar with course info */}
      <Sider width={300} theme="light" style={{ padding: '20px' }}>
        <Card>
          <Title level={4}>{course.title}</Title>
          <Paragraph>{course.description}</Paragraph>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Giảng viên: {course.instructor?.username || 'N/A'}</Text>
            <Text>Thời lượng: {course.duration || 'N/A'}</Text>
            <Text>Học viên: {course.currentParticipants || 0}/{course.maxParticipants || 'N/A'}</Text>
            
            {!isStaff && !isEnrolled && (
              <Button type="primary" block onClick={handleEnrollCourse}>
                Đăng ký khóa học
              </Button>
            )}
            
            {isEnrolled && (
              <Button type="default" block disabled>
                Đã đăng ký
              </Button>
            )}
          </Space>

          {isStaff && (
            <div style={{ marginTop: 20 }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateLesson}
                block
              >
                Thêm nội dung
              </Button>
            </div>
          )}
        </Card>
      </Sider>

      {/* Main content area */}
      <Content style={{ padding: '20px' }}>
        <Card>
          {contents.length > 0 ? (
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              type="card"
              tabBarExtraContent={
                isStaff ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateLesson}
                  >
                    Thêm nội dung
                  </Button>
                ) : null
              }
            >
              {contents.map(content => (
                <Tabs.TabPane
                  tab={
                    <span>
                      {content.contentType === 'VIDEO' && <VideoCameraOutlined />}
                      {content.contentType === 'TEXT' && <ReadOutlined />}
                      {content.contentType === 'MEET_LINK' && <VideoCameraOutlined />}
                      {content.contentType === 'DOCUMENT' && <ReadOutlined />}
                      {' '}{content.title}
                    </span>
                  }
                  key={String(content.id)}
                >
                  <div style={{ position: 'relative' }}>
                    {isStaff && (
                      <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                        <Space>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditContent(content)}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteContent(content.id)}
                          />
                        </Space>
                      </div>
                    )}
                    
                    <Title level={3}>{content.title}</Title>
                    {renderContentByType(content)}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Text type="secondary">Chưa có nội dung nào</Text>
              {isStaff && (
                <div style={{ marginTop: 20 }}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateLesson}>
                    Thêm nội dung đầu tiên
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </Content>

      {/* Content Editor Modal */}
      <Modal
        title={editingItem ? "Sửa nội dung" : "Thêm nội dung mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSaveLesson}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="contentType"
            label="Loại nội dung"
            rules={[{ required: true, message: 'Vui lòng chọn loại nội dung' }]}
          >
            <Select>
              <Option value="VIDEO">Video</Option>
              <Option value="TEXT">Văn bản</Option>
              <Option value="MEET_LINK">Link Meeting</Option>
              <Option value="DOCUMENT">Tài liệu</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item dependencies={['contentType']} noStyle>
            {({ getFieldValue }) => {
              const contentType = getFieldValue('contentType');
              
              if (contentType === 'VIDEO') {
                return (
                  <Form.Item
                    name="videoUrl"
                    label="URL Video"
                    rules={[{ required: true, message: 'Vui lòng nhập URL video' }]}
                  >
                    <Input placeholder="https://www.youtube.com/watch?v=..." />
                  </Form.Item>
                );
              }
              
              if (contentType === 'TEXT') {
                return (
                  <Form.Item
                    name="textContent"
                    label="Nội dung văn bản"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                  >
                    <Input.TextArea rows={10} />
                  </Form.Item>
                );
              }
              
              if (contentType === 'MEET_LINK') {
                return (
                  <>
                    <Form.Item
                      name="meetLink"
                      label="Link Meeting"
                      rules={[{ required: true, message: 'Vui lòng nhập link meeting' }]}
                    >
                      <Input placeholder="https://meet.google.com/..." />
                    </Form.Item>
                    <Form.Item name="meetPassword" label="Mật khẩu (tùy chọn)">
                      <Input />
                    </Form.Item>
                  </>
                );
              }
              
              if (contentType === 'DOCUMENT') {
                return (
                  <>
                    <Form.Item
                      name="documentUrl"
                      label="URL Tài liệu"
                      rules={[{ required: true, message: 'Vui lòng nhập URL tài liệu' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name="documentName" label="Tên tài liệu">
                      <Input />
                    </Form.Item>
                  </>
                );
              }
              
              return null;
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingItem(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CoursePage; 