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
  InputNumber, 
  message, 
  Tag, 
  Popconfirm, 
  Row, 
  Col, 
  Statistic,
  Image,
  Typography,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  BookOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import staffCourseService from '../services/staffCourseService';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CourseManagementPage = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await staffCourseService.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
        calculateStats(response.data || []);
      } else {
        message.error('Không thể tải danh sách khóa học');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Lỗi khi tải dữ liệu');
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
        language: values.language || 'vi',
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
        message.success(editingCourse ? 'Cập nhật khóa học thành công!' : 'Tạo khóa học thành công!');
        setModalVisible(false);
        setEditingCourse(null);
        form.resetFields();
        await loadData();
      } else {
        message.error(response.error || 'Không thể lưu khóa học');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      message.error('Lỗi khi lưu khóa học');
    }
  };

  const handleDelete = async (courseId) => {
    try {
      const response = await staffCourseService.deleteCourse(courseId);
      if (response.success) {
        message.success('Xóa khóa học thành công!');
        await loadData();
      } else {
        message.error(response.error || 'Không thể xóa khóa học');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Lỗi khi xóa khóa học');
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
      title: 'Tên khóa học',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'open' ? 'Đang mở' : 
           status === 'closed' ? 'Đã đóng' :
           status === 'completed' ? 'Hoàn thành' : 
           status === 'cancelled' ? 'Đã hủy' : status}
        </Tag>
      ),
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      render: (level) => (
        <Tag color={getDifficultyColor(level)}>
          {level === 'BEGINNER' ? 'Cơ bản' :
           level === 'INTERMEDIATE' ? 'Trung bình' :
           level === 'ADVANCED' ? 'Nâng cao' : level}
        </Tag>
      ),
    },
    {
      title: 'Học viên',
      dataIndex: 'currentParticipants',
      key: 'participants',
      render: (current, record) => (
        <Text>{current || 0}/{record.maxParticipants || 'N/A'}</Text>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong>{price === 0 ? 'Miễn phí' : `${price?.toLocaleString()} VNĐ`}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/courses/${record.id}`)}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Quản lý khóa học</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số khóa học"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Khóa học đang mở"
              value={stats.publishedCourses}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng học viên"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${value.toLocaleString()} VNĐ`}
            />
          </Card>
        </Col>
      </Row>

      {/* Main content */}
      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4}>Danh sách khóa học</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo khóa học mới
          </Button>
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
            showTotal: (total) => `Tổng ${total} khóa học`,
          }}
        />
      </Card>

      {/* Course Editor Modal */}
      <Modal
        title={editingCourse ? "Sửa khóa học" : "Tạo khóa học mới"}
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
                label="Tên khóa học"
                rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                initialValue="open"
              >
                <Select>
                  <Option value="open">Đang mở</Option>
                  <Option value="closed">Đã đóng</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficultyLevel"
                label="Độ khó"
                initialValue="BEGINNER"
              >
                <Select>
                  <Option value="BEGINNER">Cơ bản</Option>
                  <Option value="INTERMEDIATE">Trung bình</Option>
                  <Option value="ADVANCED">Nâng cao</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxParticipants"
                label="Số học viên tối đa"
                initialValue={50}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Thời lượng"
              >
                <Input placeholder="VD: 4 tuần, 20 giờ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Ngôn ngữ"
                initialValue="vi"
              >
                <Select>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Kích hoạt"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="certificateEnabled"
                label="Cấp chứng chỉ"
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
                {editingCourse ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingCourse(null);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagementPage; 