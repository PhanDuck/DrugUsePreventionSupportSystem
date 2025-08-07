import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Row,
  Col,
  DatePicker,
  Upload,
  message,
  Divider,
  Typography
} from 'antd';
import {
  UploadOutlined,
  LinkOutlined,
  BookOutlined,
  DollarOutlined
} from '@ant-design/icons';
import staffCourseService from '../../services/staffCourseService';
import categoryService from '../../services/categoryService';
import userService from '../../services/userService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const CourseEditor = ({ visible, course, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    if (visible) {
      loadFormData();
      if (course) {
        // Populate form with course data
        form.setFieldsValue({
          ...course,
          enrollmentDeadline: course.enrollmentDeadline ? dayjs(course.enrollmentDeadline) : null
        });
      } else {
        // Reset form for new course
        form.resetFields();
      }
    }
  }, [visible, course, form]);

  const loadFormData = async () => {
    try {
      // Load categories
      const categoriesResponse = await categoryService.getCategories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      // Load instructors (staff/admin users)
      const usersResponse = await userService.getUsers();
      if (usersResponse.success) {
        const instructorUsers = usersResponse.data.filter(user => 
          ['STAFF', 'ADMIN', 'CONSULTANT'].includes(user.role?.name)
        );
        setInstructors(instructorUsers);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Process form data
      const courseData = {
        ...values,
        enrollmentDeadline: values.enrollmentDeadline?.format('YYYY-MM-DD HH:mm:ss'),
        price: values.price || 0,
        maxParticipants: values.maxParticipants || 50,
        difficultyLevel: values.difficultyLevel || 'BEGINNER',
        language: values.language || 'vi',
        isActive: values.isActive !== false,
        isFeatured: values.isFeatured === true,
        certificateEnabled: values.certificateEnabled === true
      };

      let response;
      if (course) {
        // Update existing course
        response = await staffCourseService.updateCourse(course.id, courseData);
      } else {
        // Create new course
        response = await staffCourseService.createCourse(courseData);
      }

      if (response.success) {
        message.success(course ? 'Cập nhật khóa học thành công!' : 'Tạo khóa học thành công!');
        onSuccess(response.data);
        form.resetFields();
      } else {
        message.error('Lỗi: ' + response.error);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleThumbnailChange = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const url = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      form.setFieldsValue({ thumbnailUrl: url });
      message.success('Upload thumbnail thành công!');
    }
  };

  const handlePreviewVideoChange = (e) => {
    const url = e.target.value;
    if (url) {
      const thumbnail = staffCourseService.generateVideoThumbnail(url);
      if (thumbnail) {
        form.setFieldsValue({ previewVideoUrl: url });
      }
    }
  };

  return (
    <Modal
      title={
        <div>
          <BookOutlined /> {course ? 'Chỉnh Sửa Khóa Học' : 'Tạo Khóa Học Mới'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'open',
          difficultyLevel: 'BEGINNER',
          language: 'vi',
          price: 0,
          maxParticipants: 50,
          isActive: true,
          isFeatured: false,
          certificateEnabled: false
        }}
      >
        <Row gutter={16}>
          {/* Basic Information */}
          <Col span={24}>
            <Title level={4}>Thông Tin Cơ Bản</Title>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tên Khóa Học"
              rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="categoryId"
              label="Danh Mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea rows={4} placeholder="Mô tả chi tiết về khóa học" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="instructorId"
              label="Giảng Viên"
              rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
            >
              <Select placeholder="Chọn giảng viên">
                {instructors.map(instructor => (
                  <Option key={instructor.id} value={instructor.id}>
                    {instructor.firstName} {instructor.lastName} ({instructor.role?.name})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="difficultyLevel"
              label="Độ Khó"
            >
              <Select>
                <Option value="BEGINNER">Cơ bản</Option>
                <Option value="INTERMEDIATE">Trung cấp</Option>
                <Option value="ADVANCED">Nâng cao</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Course Settings */}
          <Col span={24}>
            <Divider />
            <Title level={4}>Cài Đặt Khóa Học</Title>
          </Col>

          <Col span={8}>
            <Form.Item
              name="price"
              label="Giá (VNĐ)"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0 = Miễn phí"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

          {/* HIDDEN: Max Participants field - no longer using participant limits
          <Col span={12}>
            <Form.Item
              name="maxParticipants"
              label="Max Participants"
              rules={[{ required: true, message: 'Please enter maximum participants!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          */}
          
          <Col span={8}>
            <Form.Item
              name="language"
              label="Ngôn Ngữ"
            >
              <Select>
                <Option value="vi">Tiếng Việt</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng Thái"
            >
              <Select>
                <Option value="open">Đang mở</Option>
                <Option value="closed">Đã đóng</Option>
                <Option value="completed">Hoàn thành</Option>
                <Option value="cancelled">Đã hủy</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="enrollmentDeadline"
              label="Hạn Đăng Ký"
            >
              <DatePicker 
                showTime 
                style={{ width: '100%' }}
                placeholder="Chọn hạn đăng ký"
              />
            </Form.Item>
          </Col>

          {/* Media */}
          <Col span={24}>
            <Divider />
            <Title level={4}>Hình Ảnh & Video</Title>
          </Col>

          <Col span={12}>
            <Form.Item
              name="thumbnailUrl"
              label="Ảnh Thumbnail"
            >
              <Input 
                placeholder="URL ảnh thumbnail"
                prefix={<LinkOutlined />}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="previewVideoUrl"
              label="Video Preview"
            >
              <Input 
                placeholder="URL video preview (YouTube)"
                prefix={<LinkOutlined />}
                onChange={handlePreviewVideoChange}
              />
            </Form.Item>
          </Col>

          {/* Additional Details */}
          <Col span={24}>
            <Divider />
            <Title level={4}>Chi Tiết Bổ Sung</Title>
          </Col>

          <Col span={12}>
            <Form.Item
              name="prerequisites"
              label="Yêu Cầu Trước Khi Học"
            >
              <TextArea rows={3} placeholder="Các kiến thức cần có trước khi học khóa này" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="learningOutcomes"
              label="Kết Quả Học Tập"
            >
              <TextArea rows={3} placeholder="Những gì học viên sẽ đạt được" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="tags"
              label="Tags"
            >
              <Input placeholder="Các tag cách nhau bởi dấu phẩy" />
            </Form.Item>
          </Col>

          {/* Toggles */}
          <Col span={24}>
            <Divider />
            <Title level={4}>Tùy Chọn</Title>
          </Col>

          <Col span={8}>
            <Form.Item
              name="isActive"
              label="Kích Hoạt"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="isFeatured"
              label="Nổi Bật"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="certificateEnabled"
              label="Cấp Chứng Chỉ"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        {/* Form Actions */}
        <Row justify="end" gutter={8} style={{ marginTop: '24px' }}>
          <Col>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={loading}>
              {course ? 'Cập Nhật' : 'Tạo Khóa Học'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CourseEditor; 