import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  message, 
  Tag, 
  Popconfirm, 
  Row, 
  Col, 
  Statistic,
  Typography,
  Switch,
  Alert,
  Spin
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  BookOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  SettingOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import staffCourseService from '../services/staffCourseService';
import authService from '../services/authService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CourseManagementPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkUserPermissions();
    loadData();
  }, []);

  const checkUserPermissions = () => {
    const user = authService.getCurrentUser();
    const userRole = authService.getUserRole();
    
    console.log('🔍 CourseManagement - Current user:', user);
    console.log('🔍 CourseManagement - User role:', userRole);
    console.log('🔍 CourseManagement - Is staff or higher:', authService.isStaffOrHigher());
    
    if (!authService.isAuthenticated()) {
      message.error('Please login to access course management');
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
      const response = await staffCourseService.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
        calculateStats(response.data || []);
      } else {
        message.error('Unable to load course list');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (coursesData) => {
    setStats({
      totalCourses: coursesData.length,
      publishedCourses: coursesData.filter(course => course.status === 'open').length,
      totalStudents: coursesData.reduce((sum, course) => sum + (course.currentParticipants || 0), 0),
      totalRevenue: coursesData.reduce((sum, course) => sum + ((course.currentParticipants || 0) * (course.price || 0)), 0)
    });
  };

  const handleCreate = () => {
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      ...course,
      price: course.price || 0
    });
    setModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      const courseData = {
        ...values,
        price: values.price || 0,
        maxParticipants: values.maxParticipants || 50,
        difficultyLevel: values.difficultyLevel || 'BEGINNER',
        language: values.language || 'en',
        isActive: values.isActive !== false,
        certificateEnabled: values.certificateEnabled === true
      };

      let response;
      if (editingCourse) {
        response = await staffCourseService.updateCourse(editingCourse.id, courseData);
      } else {
        response = await staffCourseService.createCourse(courseData);
      }

      if (response.success) {
        message.success(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
        setModalVisible(false);
        setEditingCourse(null);
        form.resetFields();
        await loadData();
      } else {
        message.error(response.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      message.error('Error saving course');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await staffCourseService.deleteCourse(courseId);
      if (response.success) {
        message.success('Course deleted successfully!');
        await loadData();
      } else {
        message.error(response.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Error deleting course');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'green';
      case 'closed': return 'orange';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (id) => <Text type="secondary">#{id}</Text>
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Title level={5} style={{ margin: 0 }}>{text}</Title>
          <Text type="secondary">{record.description?.substring(0, 100)}...</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'open' ? 'Open' : 
           status === 'closed' ? 'Closed' :
           status === 'completed' ? 'Completed' : 
           status === 'cancelled' ? 'Cancelled' : status}
        </Tag>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 120,
      render: (level) => (
        <Tag color={getDifficultyColor(level)}>
          {level === 'BEGINNER' ? 'Beginner' :
           level === 'INTERMEDIATE' ? 'Intermediate' :
           level === 'ADVANCED' ? 'Advanced' : level}
        </Tag>
      ),
    },
    // HIDDEN: Participants column - no longer showing participant limits
    // {
    //   title: 'Participants',
    //   dataIndex: 'currentParticipants',
    //   key: 'participants',
    //   width: 120,
    //   render: (current, record) => (
    //     <Text>{current || 0}/{record.maxParticipants || 'N/A'}</Text>
    //   ),
    // },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => (
        <Text strong style={{ color: price > 0 ? '#f50' : '#52c41a' }}>
          {price === 0 || price === null || price === undefined ? 'Free' : `${Number(price).toLocaleString()} VND`}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/courses/${record.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<BookOutlined />}
            onClick={() => navigate(`/course-management/${record.id}/lessons`)}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
          >
            Lessons
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading && courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Loading course management...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Alert
          message="Debug Info"
          description={
            <div>
              <p>Current User: {currentUser?.userName} ({authService.getUserRole()})</p>
              <p>Is Staff or Higher: {authService.isStaffOrHigher() ? 'YES' : 'NO'}</p>
              <Button size="small" onClick={() => navigate('/staff-debug')}>
                Go to Staff Debug Page
              </Button>
            </div>
          }
          type="info"
          style={{ marginBottom: '24px' }}
          closable
        />
      )}

      <Title level={2}>
        <SettingOutlined /> Course Management
      </Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Courses"
              value={stats.publishedCourses}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${value.toLocaleString()} VND`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main content */}
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>Course List</Title>
          <Space>
            <Button
              icon={<BookOutlined />}
              onClick={() => navigate('/staff/courses')}
            >
              Staff Course Manager
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Add New Course
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} courses`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Course Editor Modal */}
      <Modal
        title={editingCourse ? "Edit Course" : "Create New Course"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="open"
              >
                <Select>
                  <Option value="open">Open</Option>
                  <Option value="closed">Closed</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficultyLevel"
                label="Difficulty Level"
                initialValue="BEGINNER"
              >
                <Select>
                  <Option value="BEGINNER">Beginner</Option>
                  <Option value="INTERMEDIATE">Intermediate</Option>
                  <Option value="ADVANCED">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxParticipants"
                label="Max Students"
                initialValue={50}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price (VND)"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration"
              >
                <Input placeholder="e.g. 4 weeks, 20 hours" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Language"
                initialValue="en"
              >
                <Select>
                  <Option value="vi">Vietnamese</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="certificateEnabled"
                label="Certificate Enabled"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingCourse(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagementPage; 