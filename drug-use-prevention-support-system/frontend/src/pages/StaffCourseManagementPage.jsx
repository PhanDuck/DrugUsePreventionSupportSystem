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
  DatePicker, 
  InputNumber, 
  Upload, 
  message, 
  Tag, 
  Popconfirm, 
  Row, 
  Col, 
  Statistic,
  Image,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  UploadOutlined,
  BookOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import staffCourseService from '../services/staffCourseService';
import categoryService from '../services/categoryService';
import authService from '../services/authService';
import apiTestService from '../services/apiTestService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffCourseManagementPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check authentication and role
    if (!authService.isAuthenticated()) {
      message.error('Please login to access this page');
      return;
    }

    const userRole = authService.getUserRole();
    if (!['STAFF', 'ADMIN', 'MANAGER'].includes(userRole)) {
      message.error('Access denied. Staff role required.');
      return;
    }

    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching courses...');
      const response = await staffCourseService.getAllCourses();
      console.log('✅ Courses response:', response);
      if (response.success) {
        setCourses(response.data || []);
        console.log('✅ Courses loaded:', response.data);
      } else {
        console.error('❌ Failed to fetch courses:', response.error);
        message.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      const response = await categoryService.getCategories();
      console.log('✅ Categories response:', response);
      if (response.success) {
        setCategories(response.data || []);
        console.log('✅ Categories loaded:', response.data);
      } else {
        console.error('❌ Failed to load categories:', response.message);
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleTestAPI = async () => {
    console.log('🧪 Testing APIs...');
    try {
      const results = await apiTestService.testApiConnectivity();
      console.log('API Test Results:', results);
      if (results.success) {
        message.success(`API tests completed: ${results.summary.passed}/${results.summary.total} passed`);
      } else {
        message.error(`API tests failed: ${results.summary.failed}/${results.summary.total} failed`);
      }
    } catch (error) {
      console.error('Error testing APIs:', error);
      message.error('Failed to run API tests');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setModalVisible(true);
    form.setFieldsValue({
      ...course,
      startDate: course.startDate ? dayjs(course.startDate) : null,
      endDate: course.endDate ? dayjs(course.endDate) : null,
      enrollmentDeadline: course.enrollmentDeadline ? dayjs(course.enrollmentDeadline) : null,
    });
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await staffCourseService.deleteCourse(courseId);
      if (response.success) {
        message.success('Course deleted successfully');
        fetchCourses();
      } else {
        message.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Failed to delete course');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const courseData = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        enrollmentDeadline: values.enrollmentDeadline ? values.enrollmentDeadline.toISOString() : null,
      };

      let response;
      if (editingCourse) {
        response = await staffCourseService.updateCourse(editingCourse.id, courseData);
      } else {
        response = await staffCourseService.createCourse(courseData);
      }

      if (response.success) {
        message.success(`Course ${editingCourse ? 'updated' : 'created'} successfully`);
        setModalVisible(false);
        fetchCourses();
        form.resetFields();
      } else {
        message.error(`Failed to ${editingCourse ? 'update' : 'create'} course`);
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      message.error(`Failed to ${editingCourse ? 'update' : 'create'} course`);
    } finally {
      setLoading(false);
    }
  };

  const showCourseDetail = (course) => {
    setSelectedCourse(course);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.instructor?.username || 'No instructor'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 120,
      render: (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? <Tag color="blue">{category.name}</Tag> : '-';
      },
    },
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
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    // HIDDEN: Participants column - no longer showing participant limits
    // {
    //   title: 'Participants',
    //   key: 'participants',
    //   width: 100,
    //   render: (_, record) => (
    //     <Text>{record.currentParticipants || 0}/{record.maxParticipants || 0}</Text>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'open' ? 'green' : status === 'closed' ? 'red' : 'orange';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showCourseDetail(record)}
            title="View Details"
          />
          <Button 
            icon={<BookOutlined />} 
            size="small" 
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
            onClick={() => navigate(`/course-management/${record.id}/lessons`)}
            title="Manage Lessons"
          >
            Lessons
          </Button>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            onClick={() => handleEditCourse(record)}
            title="Edit Course"
          />
          <Popconfirm
            title="Are you sure to delete this course?"
            onConfirm={() => handleDeleteCourse(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              title="Delete Course"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Debug Info for Development */}
      {process.env.NODE_ENV === 'development' && (
        <Card style={{ marginBottom: '16px', backgroundColor: '#f0f9ff' }}>
          <Space direction="vertical">
            <Text strong>🔧 Staff Course Management Debug</Text>
            <Text>Current User: {authService.getCurrentUser()?.userName}</Text>
            <Text>User Role: {authService.getUserRole()}</Text>
            <Text>Is Staff or Higher: {authService.isStaffOrHigher() ? 'YES' : 'NO'}</Text>
            <Button size="small" onClick={() => navigate('/staff-debug')}>
              Go to Debug Page
            </Button>
          </Space>
        </Card>
      )}
      
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={24}>
                <Card>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic
                        title="Total Courses"
                        value={courses.length}
                        prefix={<BookOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Statistic
                        title="Active Courses"
                        value={courses.filter(c => c.status === 'open').length}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                    <Col span={6}>
                      <Button 
                        type="primary" 
                        icon={<BookOutlined />}
                        onClick={handleTestAPI}
                      >
                        Test API
                      </Button>
                    </Col>
              <Col span={6}>
                <Statistic
                  title="Total Students"
                  value={courses.reduce((sum, c) => sum + (c.currentParticipants || 0), 0)}
                  prefix={<UserOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Categories"
                  value={categories.length}
                  prefix={<BookOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <BookOutlined />
            <span>Course Management</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateCourse}
          >
            Add New Course
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={courses}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} courses`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Create New Course'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input placeholder="Enter course title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Price (VNĐ)"
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration"
              >
                <Input placeholder="e.g., 4 weeks" />
              </Form.Item>
            </Col>
            <Col span={8}>
              {/* HIDDEN: Max Participants field - no longer using participant limits
              <Form.Item
                name="maxParticipants"
                label="Max Participants"
              >
                <InputNumber
                  placeholder="50"
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
              */}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Start Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="End Date"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="enrollmentDeadline"
                label="Enrollment Deadline"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="open">Open</Option>
                  <Option value="closed">Closed</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="difficultyLevel"
                label="Difficulty Level"
              >
                <Select placeholder="Select difficulty">
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCourse ? 'Update' : 'Create'} Course
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Course Detail Modal */}
      <Modal
        title="Course Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedCourse && (
          <div>
            <Title level={4}>{selectedCourse.title}</Title>
            <p><strong>Description:</strong> {selectedCourse.description}</p>
            <p><strong>Instructor:</strong> {selectedCourse.instructor?.username || 'Not assigned'}</p>
            <p><strong>Price:</strong> {selectedCourse.price ? `${selectedCourse.price.toLocaleString()} VNĐ` : 'Free'}</p>
            <p><strong>Start Date:</strong> {selectedCourse.startDate ? new Date(selectedCourse.startDate).toLocaleDateString() : 'Not set'}</p>
            <p><strong>End Date:</strong> {selectedCourse.endDate ? new Date(selectedCourse.endDate).toLocaleDateString() : 'Not set'}</p>
            <p><strong>Duration:</strong> {selectedCourse.duration || 'Not specified'}</p>
            {/* HIDDEN: Participants info - no longer showing participant limits
            <p><strong>Participants:</strong> {selectedCourse.currentParticipants || 0}/{selectedCourse.maxParticipants || 0}</p>
            */}
            <p><strong>Status:</strong> <Tag color={selectedCourse.status === 'open' ? 'green' : 'red'}>{selectedCourse.status || 'Unknown'}</Tag></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffCourseManagementPage; 