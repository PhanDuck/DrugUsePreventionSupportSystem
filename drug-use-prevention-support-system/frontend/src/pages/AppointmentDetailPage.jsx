import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Row, 
  Col, 
  Statistic, 
  Avatar, 
  Divider, 
  Modal, 
  Form, 
  Input, 
  Rate, 
  message, 
  Spin,
  Alert,
  Timeline,
  Descriptions,
  Badge
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  MessageOutlined,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import authService from '../services/authService';
import appointmentService from '../services/appointmentService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();

  useEffect(() => {
    loadAppointmentDetail();
  }, [id]);

  const loadAppointmentDetail = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentById(id);
      setAppointment(response.data);
    } catch (error) {
      console.error('Error loading appointment:', error);
      message.error('Không thể tải thông tin lịch hẹn');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await appointmentService.cancelAppointment(id);
      message.success('Đã hủy lịch hẹn thành công');
      setShowCancelModal(false);
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      message.error('Không thể hủy lịch hẹn');
    }
  };

  const handleRescheduleAppointment = async (values) => {
    try {
      const newDateTime = values.newDateTime.format('YYYY-MM-DDTHH:mm:ss');
      await appointmentService.rescheduleAppointment(id, { newDateTime });
      message.success('Đã đổi lịch hẹn thành công');
      setShowRescheduleModal(false);
      form.resetFields();
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      message.error('Không thể đổi lịch hẹn');
    }
  };

  const handleSubmitReview = async (values) => {
    try {
      await appointmentService.submitReview(id, values);
      message.success('Đánh giá đã được gửi thành công');
      setShowReviewModal(false);
      reviewForm.resetFields();
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Không thể gửi đánh giá');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'COMPLETED': 'green',
      'CANCELLED': 'red',
      'RESCHEDULED': 'purple'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'RESCHEDULED': 'Đã đổi lịch'
    };
    return texts[status] || status;
  };

  const getAppointmentTypeIcon = (type) => {
    return type === 'ONLINE' ? <VideoCameraOutlined /> : <EnvironmentOutlined />;
  };

  const getAppointmentTypeText = (type) => {
    return type === 'ONLINE' ? 'Tư vấn online' : 'Tư vấn trực tiếp';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Đang tải thông tin lịch hẹn...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Không tìm thấy lịch hẹn</Title>
        <Button type="primary" onClick={() => navigate('/appointments')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              📅 Chi Tiết Lịch Hẹn
            </Title>
            <Text type="secondary">
              ID: {appointment.id} • Tạo lúc: {dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>
          </Col>
          <Col>
            <Badge 
              status={appointment.status === 'COMPLETED' ? 'success' : 
                     appointment.status === 'CANCELLED' ? 'error' : 'processing'} 
              text={
                <Tag color={getStatusColor(appointment.status)} size="large">
                  {getStatusText(appointment.status)}
                </Tag>
              }
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Main Information */}
        <Col xs={24} lg={16}>
          <Card title="📋 Thông Tin Lịch Hẹn" style={{ marginBottom: '24px' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tư vấn viên">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{appointment.consultant?.firstName} {appointment.consultant?.lastName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giờ">
                <Space>
                  <CalendarOutlined />
                  <Text>{dayjs(appointment.appointmentDate).format('DD/MM/YYYY HH:mm')}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Hình thức">
                <Space>
                  {getAppointmentTypeIcon(appointment.appointmentType)}
                  <Text>{getAppointmentTypeText(appointment.appointmentType)}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                <Space>
                  <ClockCircleOutlined />
                  <Text>{appointment.durationMinutes} phút</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                <Text>{appointment.paymentMethod}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                <Text>{appointment.clientNotes || 'Không có'}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Consultant Information */}
          <Card title="👨‍⚕️ Thông Tin Tư Vấn Viên" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: '16px' }} />
                  <Title level={4} style={{ margin: 0 }}>
                    {appointment.consultant?.firstName} {appointment.consultant?.lastName}
                  </Title>
                  <Tag color="blue">{appointment.consultant?.expertise || 'Tư vấn chung'}</Tag>
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Kinh nghiệm:</Text> Nhiều năm trong lĩnh vực tư vấn
                  </div>
                  <div>
                    <Text strong>Đánh giá:</Text> ⭐ 4.8/5.0
                  </div>
                  <div>
                    <Text strong>Chuyên môn:</Text> {appointment.consultant?.expertise || 'Tư vấn tâm lý, phòng chống tệ nạn'}
                  </div>
                  <Space>
                    <Button type="primary" icon={<MessageOutlined />}>
                      Nhắn tin
                    </Button>
                    <Button icon={<PhoneOutlined />}>
                      Gọi điện
                    </Button>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Meeting Details */}
          {appointment.status === 'CONFIRMED' && (
            <Card title="🎥 Thông Tin Buổi Tư Vấn" style={{ marginBottom: '24px' }}>
              {appointment.appointmentType === 'ONLINE' ? (
                <Alert
                  message="Tư vấn online"
                  description={
                    <div>
                      <p>Link meeting sẽ được gửi qua email 15 phút trước buổi tư vấn</p>
                      <p>Vui lòng kiểm tra email và chuẩn bị thiết bị có camera, microphone</p>
                    </div>
                  }
                  type="info"
                  showIcon
                  action={
                    <Button size="small" type="primary">
                      Tham gia ngay
                    </Button>
                  }
                />
              ) : (
                <Alert
                  message="Tư vấn trực tiếp"
                  description={
                    <div>
                      <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                      <p>Vui lòng đến trước 10 phút để làm thủ tục</p>
                    </div>
                  }
                  type="info"
                  showIcon
                  action={
                    <Button size="small" type="primary">
                      Xem bản đồ
                    </Button>
                  }
                />
              )}
            </Card>
          )}

          {/* Review Section */}
          {appointment.status === 'COMPLETED' && (
            <Card title="⭐ Đánh Giá Buổi Tư Vấn">
              {appointment.review ? (
                <div>
                  <Rate disabled value={appointment.review.rating} />
                  <Paragraph style={{ marginTop: '8px' }}>
                    {appointment.review.comment}
                  </Paragraph>
                  <Text type="secondary">
                    Đánh giá lúc: {dayjs(appointment.review.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </div>
              ) : (
                <div>
                  <Paragraph>Bạn chưa đánh giá buổi tư vấn này</Paragraph>
                  <Button 
                    type="primary" 
                    onClick={() => setShowReviewModal(true)}
                    icon={<StarOutlined />}
                  >
                    Viết đánh giá
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Actions */}
          <Card title="⚡ Hành Động" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {appointment.status === 'PENDING' && (
                <>
                  <Button 
                    type="primary" 
                    block 
                    icon={<EditOutlined />}
                    onClick={() => setShowRescheduleModal(true)}
                  >
                    Đổi lịch
                  </Button>
                  <Button 
                    danger 
                    block 
                    icon={<CloseCircleOutlined />}
                    onClick={() => setShowCancelModal(true)}
                  >
                    Hủy lịch
                  </Button>
                </>
              )}
              
              {appointment.status === 'CONFIRMED' && (
                <>
                  <Button 
                    type="primary" 
                    block 
                    icon={<VideoCameraOutlined />}
                  >
                    Tham gia tư vấn
                  </Button>
                  <Button 
                    block 
                    icon={<MessageOutlined />}
                  >
                    Nhắn tin cho tư vấn viên
                  </Button>
                </>
              )}

              {appointment.status === 'COMPLETED' && !appointment.review && (
                <Button 
                    type="primary" 
                    block 
                    icon={<StarOutlined />}
                    onClick={() => setShowReviewModal(true)}
                  >
                    Viết đánh giá
                  </Button>
              )}

              <Button 
                block 
                onClick={() => navigate('/appointments')}
              >
                Quay lại danh sách
              </Button>
            </Space>
          </Card>

          {/* Timeline */}
          <Card title="📅 Lịch Sử">
            <Timeline>
              <Timeline.Item color="green">
                <Text strong>Đặt lịch</Text>
                <br />
                <Text type="secondary">{dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Timeline.Item>
              
              {appointment.status === 'CONFIRMED' && (
                <Timeline.Item color="blue">
                  <Text strong>Xác nhận</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
              
              {appointment.status === 'COMPLETED' && (
                <Timeline.Item color="green">
                  <Text strong>Hoàn thành</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.completedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
              
              {appointment.status === 'CANCELLED' && (
                <Timeline.Item color="red">
                  <Text strong>Đã hủy</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.cancelledAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Cancel Modal */}
      <Modal
        title="Hủy lịch hẹn"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onOk={handleCancelAppointment}
        okText="Hủy lịch"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
        <p>Lịch hẹn sẽ không thể khôi phục sau khi hủy.</p>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        title="Đổi lịch hẹn"
        open={showRescheduleModal}
        onCancel={() => setShowRescheduleModal(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRescheduleAppointment}
        >
          <Form.Item
            name="newDateTime"
            label="Thời gian mới"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian mới!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="Lý do đổi lịch"
          >
            <Input.TextArea rows={3} placeholder="Nhập lý do đổi lịch..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowRescheduleModal(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Xác nhận đổi lịch
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Review Modal */}
      <Modal
        title="Đánh giá buổi tư vấn"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={null}
        width={500}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
        >
          <Form.Item
            name="rating"
            label="Đánh giá"
            rules={[{ required: true, message: 'Vui lòng chọn đánh giá!' }]}
          >
            <Rate />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="Nhận xét"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
          >
            <Input.TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowReviewModal(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Gửi đánh giá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentDetailPage; 