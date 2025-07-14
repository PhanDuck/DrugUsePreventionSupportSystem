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
  List,
  Divider,
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
import courseService from '../services/courseService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CourseManagementPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({});
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesResponse, categoriesResponse, statsResponse] = await Promise.all([
        courseService.getCourses(),
        courseService.getCategories(),
        courseService.getCourseStats()
      ]);

      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Cannot load data');
    } finally {
      setLoading(false);
    }
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
      startDate: course.startDate ? dayjs(course.startDate) : null,
      endDate: course.endDate ? dayjs(course.endDate) : null,
      syllabus: course.syllabus?.join('\n') || ''
    });
    setModalVisible(true);
  };

  const handleView = (course) => {
    setSelectedCourse(course);
    setDetailModalVisible(true);
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await courseService.deleteCourse(courseId);
      if (response.success) {
        message.success(response.message);
        loadData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Cannot delete course');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const courseData = {
        ...values,
        syllabus: values.syllabus ? values.syllabus.split('\n').filter(line => line.trim()) : [],
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD')
      };

      let response;
      if (editingCourse) {
        response = await courseService.updateCourse(editingCourse.id, courseData);
      } else {
        response = await courseService.createCourse(courseData);
      }

      if (response.success) {
        message.success(response.message);
        setModalVisible(false);
        loadData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      message.error('Cannot save course');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => (
        <Image
          width={60}
          height={40}
          src={imageUrl}
          fallback="https://via.placeholder.com/60x40"
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    {
      title: 'Course Name',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            <Link to={`/courses/${record.id}`} target="_blank" rel="noopener noreferrer">{title}</Link>
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.category}
          </Text>
        </div>
      ),
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Students',
      dataIndex: 'currentStudents',
      key: 'currentStudents',
      render: (current, record) => `${current}/${record.maxStudents}`,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>
          {status === 'ACTIVE' ? 'Active' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate, record) => (
        <div>
          <div>{dayjs(startDate).format('DD/MM/YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.duration}
          </Text>
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Course Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses || 0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Courses"
              value={stats.activeCourses || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={stats.totalRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              formatter={(value) => value.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card style={{ marginBottom: '24px' }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add New Course
          </Button>
          <Button icon={<CalendarOutlined />} onClick={loadData}>
            Refresh
          </Button>
        </Space>
      </Card>

      {/* Courses Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'DRAFT',
            maxStudents: 50,
            price: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Name"
                rules={[{ required: true, message: 'Please enter course name' }]}
              >
                <Input placeholder="Enter course name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.name}>{cat.name}</Option>
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
            <TextArea rows={3} placeholder="Enter course description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="instructor"
                label="Instructor"
                rules={[{ required: true, message: 'Please enter instructor name' }]}
              >
                <Input placeholder="Instructor name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input placeholder="e.g., 4 weeks" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxStudents"
                label="Max Students"
                rules={[{ required: true, message: 'Please enter max students' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Course Price (VND)"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[{ required: true, message: 'Please select start date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="End Date"
                rules={[{ required: true, message: 'Please select end date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="DRAFT">Draft</Option>
              <Option value="ACTIVE">Active</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="syllabus"
            label="Course Content (one line per lesson)"
          >
            <TextArea rows={6} placeholder="Lesson 1: Overview&#10;Lesson 2: Main Content&#10;Lesson 3: Practice" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? 'Update' : 'Create Course'}
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
        width={800}
      >
        {selectedCourse && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  width="100%"
                  src={selectedCourse.imageUrl}
                  fallback="https://via.placeholder.com/300x200"
                />
              </Col>
              <Col span={16}>
                <Title level={3}>{selectedCourse.title}</Title>
                <Text type="secondary">{selectedCourse.category}</Text>
                <Divider />
                <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                <p><strong>Duration:</strong> {selectedCourse.duration}</p>
                <p><strong>Students:</strong> {selectedCourse.currentStudents}/{selectedCourse.maxStudents}</p>
                <p><strong>Price:</strong> {selectedCourse.price.toLocaleString()} VNĐ</p>
                <p><strong>Time:</strong> {dayjs(selectedCourse.startDate).format('DD/MM/YYYY')} - {dayjs(selectedCourse.endDate).format('DD/MM/YYYY')}</p>
                <p><strong>Status:</strong> 
                  <Tag color={selectedCourse.status === 'ACTIVE' ? 'green' : 'orange'} style={{ marginLeft: '8px' }}>
                    {selectedCourse.status === 'ACTIVE' ? 'Active' : 'Draft'}
                  </Tag>
                </p>
              </Col>
            </Row>
            
            <Divider />
            
            <div>
              <Title level={4}>Description</Title>
              <p>{selectedCourse.description}</p>
            </div>

            {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
              <div>
                <Divider />
                <Title level={4}>Course Content</Title>
                <List
                  dataSource={selectedCourse.syllabus}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text>{index + 1}. {item}</Text>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseManagementPage; 