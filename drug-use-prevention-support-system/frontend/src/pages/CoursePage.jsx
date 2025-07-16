import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Modal, Form, Tabs, message, Space, List, Typography, Tooltip, Progress, Layout, Select } from 'antd';
import { VideoCameraOutlined, ReadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ShareAltOutlined, LikeOutlined, DislikeOutlined, LinkOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const { Title, Paragraph, Text } = Typography;
const { Sider, Content } = Layout;
const { Option } = Select;

// Mock syllabus content for demo
const mockSyllabus = [
  {
    id: 1,
    type: 'reading',
    title: 'Introduction to Drug Prevention',
    content: 'This section provides an overview of drug prevention, its importance, and key concepts. You will learn about the impact of drugs on individuals and society.',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 2,
    type: 'video',
    title: 'Understanding Drug Types',
    videoUrl: 'https://www.youtube.com/embed/7QUtEmBT_-w',
    description: 'This video explains the different types of drugs and their effects. Watch carefully and take notes for the quiz at the end.',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 3,
    type: 'reading',
    title: 'Prevention Strategies',
    content: 'Learn about effective strategies to prevent drug abuse, including education, community programs, and personal skills.',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: 4,
    type: 'video',
    title: 'Case Study: Prevention in Action',
    videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
    description: 'A real-world case study on how prevention programs are implemented in schools and communities.',
    meetLink: 'https://meet.google.com/abc-defg-hij',
  },
];

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [isStaff, setIsStaff] = useState(false);
  // Thêm state cho modal và editingItem
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // Đã bỏ modal, không cần modalVisible và editingItem nữa
  const [form] = Form.useForm();

  // Lưu bài học mới hoặc cập nhật bài học
  const handleSaveLesson = (values) => {
    let newSyllabus;
    if (editingItem) {
      // Edit
      newSyllabus = syllabus.map(item => item.id === editingItem.id ? { ...editingItem, ...values } : item);
      setSyllabus(newSyllabus);
      message.success('Lesson updated');
    } else {
      // Add
      const newItem = {
        ...values,
        id: Date.now(),
        type: values.type,
      };
      newSyllabus = [...syllabus, newItem];
      setSyllabus(newSyllabus);
      message.success('Lesson added');
    }
    // Lưu syllabus vào localStorage cùng với khóa học
    const courses = JSON.parse(localStorage.getItem('courses_mock_data') || '[]');
    const idx = courses.findIndex(c => String(c.id) === String(courseId));
    if (idx !== -1) {
      courses[idx].syllabus = newSyllabus;
      localStorage.setItem('courses_mock_data', JSON.stringify(courses));
    }
    setModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // Delete syllabus item
  const handleDelete = (id) => {
    const newSyllabus = syllabus.filter(item => item.id !== id);
    setSyllabus(newSyllabus);
    message.success('Section deleted');
    if (activeKey === String(id) && syllabus.length > 1) {
      setActiveKey(String(newSyllabus[0].id));
    }
    // Lưu syllabus vào localStorage cùng với khóa học
    const courses = JSON.parse(localStorage.getItem('courses_mock_data') || '[]');
    const idx = courses.findIndex(c => String(c.id) === String(courseId));
    if (idx !== -1) {
      courses[idx].syllabus = newSyllabus;
      localStorage.setItem('courses_mock_data', JSON.stringify(courses));
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

  // Reset các trường không liên quan khi đổi loại bài học
  useEffect(() => {
    if (!modalVisible) return;
    const type = form.getFieldValue('type');
    if (type === 'video') form.setFieldsValue({ content: undefined });
    if (type === 'reading') form.setFieldsValue({ videoUrl: undefined, description: undefined });
  }, [form.getFieldValue('type'), modalVisible]);

  // Render content cho mỗi syllabus section, bổ sung icon đã học, nút Next/Previous, nút hoàn thành
  const renderContent = (item, total) => {
    const isCompleted = JSON.parse(localStorage.getItem(getProgressKey()) || '{}')[courseId]?.completedLessons?.includes(String(item.id));
    return (
      <div>
        <Title level={3}>{item.title} {isCompleted && <span style={{color: 'green'}} title="Completed">✅</span>}</Title>
        {item.type === 'reading' && (
          <Paragraph>{item.content}</Paragraph>
        )}
        {item.type === 'video' && (
          <>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24 }}>
              {item.videoUrl && (
                <iframe
                  src={convertYoutubeLinkToEmbed(item.videoUrl)}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              )}
            </div>
            <Paragraph>{item.description}</Paragraph>
          </>
        )}
        <Space style={{ marginTop: 16 }}>
          {isValidMeetLink(item.meetLink) && (
            <Tooltip title="Join Google Meet">
              <Button type="primary" icon={<LinkOutlined />} href={item.meetLink} target="_blank">
                Google Meet
              </Button>
            </Tooltip>
          )}
        </Space>
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentIdx === 0}
            onClick={() => setActiveKey(String(validSyllabus[currentIdx - 1]?.id))}
          >
            Previous
          </Button>
          <Button
            disabled={currentIdx === total - 1}
            onClick={() => setActiveKey(String(validSyllabus[currentIdx + 1]?.id))}
          >
            Next
          </Button>
        </div>
        {/* Complete course button */}
        {currentIdx === total - 1 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button type="primary" onClick={() => {
              // Lưu tiến độ hoàn thành vào localStorage
              const progress = JSON.parse(localStorage.getItem(getProgressKey()) || '{}');
              progress[courseId] = {
                completed: true,
                completedLessons: validSyllabus.map(item => String(item.id)),
                totalLessons: validSyllabus.length
              };
              localStorage.setItem(getProgressKey(), JSON.stringify(progress));
              toast.success('🎉 Congratulations! You have completed the course and gained new knowledge on this topic!');
              setTimeout(() => navigate('/courses'), 1500);
            }}>
              Complete
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Tabs for navigation
  const validSyllabus = Array.isArray(syllabus) ? syllabus.filter(item => item && item.title) : [];

  // Lấy index của tab hiện tại trong validSyllabus
  const currentIdx = validSyllabus.findIndex(item => String(item.id) === activeKey);
  const canRender = currentIdx >= 0 && validSyllabus[currentIdx];

  useEffect(() => {
    if (validSyllabus.length > 0 && (currentIdx === -1 || !validSyllabus[currentIdx])) {
      setActiveKey(String(validSyllabus[0].id));
    }
    // eslint-disable-next-line
  }, [syllabus]);

  // Không dùng tabItems nữa

  // Trong phần header, khi tính phần trăm hoàn thành:

  // Khi load lại khóa học, syllabus phải lấy từ localStorage
  useEffect(() => {
    courseService.getCourseById(courseId || 1).then(res => {
      setCourse(res.data || {
        id: 1,
        title: 'Basic Drug Prevention Course',
        description: 'A comprehensive course on drug prevention for all ages.',
        syllabus: mockSyllabus
      });
      // Lấy syllabus từ localStorage nếu có
      const courses = JSON.parse(localStorage.getItem('courses_mock_data') || '[]');
      const found = courses.find(c => String(c.id) === String(courseId));
      setSyllabus(found?.syllabus || res.data?.syllabus || mockSyllabus);
    });
    setIsStaff(authService.getUserRole() === 'STAFF');
  }, [courseId]);

  return (
    <div style={{ background: '#f7f8fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0' }}>
        {/* Header khóa học */}
        <Card style={{ marginBottom: 32, borderRadius: 18, boxShadow: '0 4px 24px rgba(80,80,120,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ flex: 1 }}>
              <Title level={2} style={{ marginBottom: 8, fontWeight: 700 }}>{course?.title || 'Course Detail'}</Title>
              <Paragraph style={{ marginBottom: 8, fontSize: 18, color: '#444' }}>{course?.description}</Paragraph>
              <div style={{ color: '#888', marginBottom: 8, fontSize: 16 }}>Instructor: <b>{course?.author || 'Not updated'}</b></div>
            </div>
          </div>
        </Card>
        {/* Layout chính */}
        <Layout style={{ background: 'transparent' }}>
          {/* Sidebar lessons */}
          <Sider width={290} style={{ background: '#fff', borderRadius: 18, marginRight: 36, boxShadow: '0 2px 12px rgba(80,80,120,0.06)', padding: 28, minHeight: 420, position: 'relative' }} breakpoint="lg" collapsedWidth="0">
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18, color: '#222' }}>Lesson List</div>
            <hr style={{margin: '8px 0 18px 0', border: 'none', borderTop: '1px solid #eee'}} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {validSyllabus.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Button
                    type={String(item.id) === activeKey ? 'primary' : 'default'}
                    onClick={() => setActiveKey(String(item.id))}
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      fontWeight: String(item.id) === activeKey ? 700 : 400,
                      background: JSON.parse(localStorage.getItem(getProgressKey()) || '{}')[courseId]?.completedLessons?.includes(String(item.id)) ? '#e6f7ff' : undefined,
                      border: String(item.id) === activeKey ? '2px solid #6a82fb' : '1px solid #e0e0e0',
                      color: String(item.id) === activeKey ? '#222' : '#444',
                      fontSize: 16,
                      borderRadius: 10,
                      boxShadow: String(item.id) === activeKey ? '0 2px 8px #e0e0e0' : undefined,
                      transition: 'all 0.2s',
                      marginBottom: 2,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      maxWidth: 150,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                    icon={item.type === 'reading' ? <ReadOutlined /> : <VideoCameraOutlined />}
                    block
                  >
                    <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 110 }}>{item.title}</span> {JSON.parse(localStorage.getItem(getProgressKey()) || '{}')[courseId]?.completedLessons?.includes(String(item.id)) && <span style={{ color: 'green', marginLeft: 4 }}>✅</span>}
                  </Button>
                  {/* Sửa/Xóa button cho staff */}
                  {isStaff && (
                    <>
                      <Tooltip title="Edit lesson">
                        <Button size="small" icon={<EditOutlined />} onClick={() => openModal(item)} />
                      </Tooltip>
                      <Tooltip title="Delete lesson">
                        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)} />
                      </Tooltip>
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Add section button for staff */}
            {isStaff && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                style={{ marginTop: 18, width: '100%' }}
                onClick={() => openModal()}
              >
                Add Lesson
              </Button>
            )}
            {/* Add/Edit lesson modal */}
            <Modal
              title={editingItem ? 'Edit Lesson' : 'Add Lesson'}
              open={modalVisible}
              onCancel={() => { setModalVisible(false); setEditingItem(null); }}
              onOk={() => form.submit()}
              okText="Save"
              cancelText="Cancel"
              destroyOnClose
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveLesson}
                initialValues={{ type: 'reading' }}
              >
                <Form.Item
                  name="title"
                  label={<b>Lesson Title</b>}
                  rules={[{ required: true, message: 'Please enter lesson title!' }]}
                >
                  <Input placeholder="Enter lesson title" maxLength={100} showCount />
                </Form.Item>
                <Form.Item
                  name="type"
                  label={<b>Lesson Type</b>}
                  rules={[{ required: true, message: 'Please select lesson type!' }]}
                >
                  <Select placeholder="Select lesson type">
                    <Option value="reading">Reading</Option>
                    <Option value="video">Video</Option>
                  </Select>
                </Form.Item>
                {/* Dynamic form based on lesson type */}
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
                  {({ getFieldValue }) => {
                    const type = getFieldValue('type');
                    if (type === 'reading') {
                      return (
                        <Form.Item
                          name="content"
                          label={<b>Lesson Content</b>}
                          rules={[{ required: true, message: 'Please enter lesson content!' }]}
                        >
                          <Input.TextArea rows={4} placeholder="Enter lesson content" maxLength={1000} showCount />
                        </Form.Item>
                      );
                    }
                    if (type === 'video') {
                      return <>
                        <Form.Item
                          name="videoUrl"
                          label={<b>YouTube Link</b>}
                          rules={[
                            { required: true, message: 'Please enter YouTube link!' },
                            { pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/, message: 'Only valid YouTube links are accepted!' }
                          ]}
                        >
                          <Input placeholder="https://www.youtube.com/watch?v=xxxxxxx" maxLength={200} />
                        </Form.Item>
                        <Form.Item
                          name="description"
                          label={<b>Video Description</b>}
                        >
                          <Input.TextArea rows={2} placeholder="Short description of the video (optional)" maxLength={300} showCount />
                        </Form.Item>
                      </>;
                    }
                    return null;
                  }}
                </Form.Item>
                <Form.Item
                  name="meetLink"
                  label={<b>Google Meet Link (if any)</b>}
                  rules={[]}
                >
                  <Input placeholder="https://meet.google.com/abc-defg-hij" maxLength={200} />
                </Form.Item>
              </Form>
            </Modal>
          </Sider>
          {/* Content bài học */}
          <Content style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(80,80,120,0.06)', padding: 40, minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {canRender && renderContent(validSyllabus[currentIdx], validSyllabus.length)}
            {/* Save button for staff */}
            {isStaff && (
              <Button
                type="primary"
                style={{ marginTop: 32, alignSelf: 'flex-end' }}
                onClick={() => {
                  // Lưu syllabus mới vào backend (nếu có API), ở đây chỉ lưu local
                  setCourse(prev => ({ ...prev, syllabus }));
                  message.success('Course content changes saved!');
                }}
              >
                Save
              </Button>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

// Thêm hàm chuyển link YouTube sang embed
// Chuyển link YouTube watch?v=... hoặc youtu.be/... thành embed/...
function convertYoutubeLinkToEmbed(url) {
  if (!url) return '';
  // https://www.youtube.com/watch?v=xxxxxxx
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url; // fallback
}

// Thêm hàm kiểm tra link Google Meet hợp lệ
function isValidMeetLink(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname === 'meet.google.com';
  } catch {
    return false;
  }
}

// Helper lấy key progress theo user
function getProgressKey() {
  const user = authService.getCurrentUser();
  return user ? `courseProgress_${user.username || user.id}` : 'courseProgress_guest';
}

export default CoursePage; 