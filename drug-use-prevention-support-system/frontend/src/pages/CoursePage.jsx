import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Input, Modal, Form, Tabs, message, Space, List, Typography, Tooltip } from 'antd';
import { VideoCameraOutlined, ReadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ShareAltOutlined, LikeOutlined, DislikeOutlined, LinkOutlined } from '@ant-design/icons';
import courseService from '../services/courseService';
import authService from '../services/authService';

const { Title, Paragraph, Text } = Typography;

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
  const [course, setCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [isStaff, setIsStaff] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Mock: get course detail by id
    courseService.getCourseById(courseId || 1).then(res => {
      setCourse(res.data || {
        id: 1,
        title: 'Basic Drug Prevention Course',
        description: 'A comprehensive course on drug prevention for all ages.',
        syllabus: mockSyllabus
      });
      setSyllabus(res.data?.syllabus || mockSyllabus);
    });
    setIsStaff(authService.getUserRole() === 'STAFF');
  }, [courseId]);

  // Add or edit syllabus item
  const handleSave = (values) => {
    if (editingItem) {
      // Edit
      setSyllabus(prev => prev.map(item => item.id === editingItem.id ? { ...editingItem, ...values } : item));
      message.success('Section updated');
    } else {
      // Add
      const newItem = {
        ...values,
        id: Date.now(),
        type: values.type,
      };
      setSyllabus(prev => [...prev, newItem]);
      message.success('Section added');
    }
    setModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  // Delete syllabus item
  const handleDelete = (id) => {
    setSyllabus(prev => prev.filter(item => item.id !== id));
    message.success('Section deleted');
    if (activeKey === String(id) && syllabus.length > 1) {
      setActiveKey(String(syllabus[0].id));
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

  // Render content for each syllabus section
  const renderContent = (item) => {
    return (
      <div>
        <Title level={3}>{item.title}</Title>
        {item.type === 'reading' && (
          <Paragraph>{item.content}</Paragraph>
        )}
        {item.type === 'video' && (
          <>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24 }}>
              <iframe
                src={item.videoUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
            <Paragraph>{item.description}</Paragraph>
          </>
        )}
        <Space style={{ marginTop: 16 }}>
          <Tooltip title="Join Google Meet">
            <Button type="primary" icon={<LinkOutlined />} href={item.meetLink} target="_blank">
              Google Meet
            </Button>
          </Tooltip>
          <Button icon={<LikeOutlined />}>Like</Button>
          <Button icon={<DislikeOutlined />}>Dislike</Button>
          <Button icon={<ShareAltOutlined />}>Share</Button>
        </Space>
      </div>
    );
  };

  // Tabs for navigation
  const validSyllabus = Array.isArray(syllabus) ? syllabus.filter(item => item && item.title) : [];
  const tabItems = validSyllabus.map(item => ({
    key: String(item.id),
    label: (
      <span>
        {item.type === 'reading' ? <ReadOutlined /> : <VideoCameraOutlined />} {item.title}
      </span>
    ),
    children: renderContent(item)
  }));

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>{course?.title || 'Course Detail'}</Title>
        <Paragraph>{course?.description}</Paragraph>
      </Card>
      {isStaff && (
        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Button type="primary" onClick={async () => {
            if (!course) return;
            const updatedCourse = { ...course, syllabus };
            await courseService.updateCourse(course.id, updatedCourse);
            message.success('Course content saved!');
          }}>
            Save
          </Button>
        </div>
      )}
      <Card>
        {validSyllabus.length > 0 ? (
          <Tabs
            tabPosition="left"
            items={tabItems}
            activeKey={activeKey}
            onChange={setActiveKey}
            tabBarExtraContent={isStaff && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                Add Section
              </Button>
            )}
          />
        ) : (
          <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
            No content yet.
            {isStaff && (
              <div style={{ marginTop: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                  Add Section
                </Button>
              </div>
            )}
          </div>
        )}
        {isStaff && validSyllabus.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <List
              header={<b>Edit Course Content</b>}
              dataSource={validSyllabus}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button icon={<EditOutlined />} onClick={() => openModal(item)} key="edit">Edit</Button>,
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(item.id)} key="delete">Delete</Button>
                  ]}
                >
                  <span>{item.type === 'reading' ? <ReadOutlined /> : <VideoCameraOutlined />} {item.title}</span>
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>
      <Modal
        title={editingItem ? 'Edit Section' : 'Add Section'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setEditingItem(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText={editingItem ? 'Update' : 'Add'}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ type: 'reading' }}
        >
          <Form.Item name="type" label="Type" rules={[{ required: true }]}> 
            <Input.Group compact>
              <Form.Item name="type" noStyle>
                <select style={{ width: '100%' }}>
                  <option value="reading">Reading</option>
                  <option value="video">Video</option>
                </select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter section title' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="meetLink" label="Google Meet Link" rules={[{ required: true, message: 'Please enter Google Meet link' }]}> 
            <Input />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
            {({ getFieldValue }) => getFieldValue('type') === 'reading' ? (
              <Form.Item name="content" label="Reading Content" rules={[{ required: true, message: 'Please enter reading content' }]}> 
                <Input.TextArea rows={4} />
              </Form.Item>
            ) : (
              <>
                <Form.Item name="videoUrl" label="Video URL" rules={[{ required: true, message: 'Please enter video URL' }]}> 
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Video Description" rules={[{ required: true, message: 'Please enter video description' }]}> 
                  <Input.TextArea rows={3} />
                </Form.Item>
              </>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage; 