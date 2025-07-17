import React, { useState, useEffect } from 'react';
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
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const StaffCourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await staffCourseService.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
      } else {
        message.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setModalVisible(true);
    form.resetFields();
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
      width: 100,
      render: (price) => price ? `${price.toLocaleString()} VNĐ` : 'Free',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: 'Participants',
      key: 'participants',
      width: 100,
      render: (_, record) => (
        <Text>{record.currentParticipants || 0}/{record.maxParticipants || 0}</Text>
      ),
    },
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
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showCourseDetail(record)}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            type="primary"
            onClick={() => handleEditCourse(record)}
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
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
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
            <p><strong>Duration:</strong> {selectedCourse.duration || 'Not specified'}</p>
            <p><strong>Participants:</strong> {selectedCourse.currentParticipants || 0}/{selectedCourse.maxParticipants || 0}</p>
            <p><strong>Status:</strong> <Tag color={selectedCourse.status === 'open' ? 'green' : 'red'}>{selectedCourse.status?.toUpperCase()}</Tag></p>
            {selectedCourse.startDate && <p><strong>Start Date:</strong> {dayjs(selectedCourse.startDate).format('DD/MM/YYYY')}</p>}
            {selectedCourse.endDate && <p><strong>End Date:</strong> {dayjs(selectedCourse.endDate).format('DD/MM/YYYY')}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffCourseManagementPage; 