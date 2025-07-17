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
      message.error('Unable to load appointment information');
      navigate('/appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      await appointmentService.cancelAppointment(id);
      message.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      message.error('Unable to cancel appointment');
    }
  };

  const handleRescheduleAppointment = async (values) => {
    try {
      const newDateTime = values.newDateTime.format('YYYY-MM-DDTHH:mm:ss');
      await appointmentService.rescheduleAppointment(id, { newDateTime });
      message.success('Appointment rescheduled successfully');
      setShowRescheduleModal(false);
      form.resetFields();
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      message.error('Unable to reschedule appointment');
    }
  };

  const handleSubmitReview = async (values) => {
    try {
      await appointmentService.submitReview(id, values);
      message.success('Review submitted successfully');
      setShowReviewModal(false);
      reviewForm.resetFields();
      loadAppointmentDetail();
    } catch (error) {
      console.error('Error submitting review:', error);
      message.error('Unable to submit review');
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
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'RESCHEDULED': 'Rescheduled'
    };
    return texts[status] || status;
  };

  const getAppointmentTypeIcon = (type) => {
    return type === 'ONLINE' ? <VideoCameraOutlined /> : <EnvironmentOutlined />;
  };

  const getAppointmentTypeText = (type) => {
    return type === 'ONLINE' ? 'Online consultation' : 'In-person consultation';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading appointment information...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Appointment not found</Title>
        <Button type="primary" onClick={() => navigate('/appointments')}>
          Back to list
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
              📅 Appointment Details
            </Title>
            <Text type="secondary">
              ID: {appointment.id} • Created: {dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}
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
          <Card title="📋 Appointment Information" style={{ marginBottom: '24px' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Consultant">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <Text strong>{appointment.consultant?.firstName} {appointment.consultant?.lastName}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Date & Time">
                <Space>
                  <CalendarOutlined />
                  <Text>{dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}</Text>
                  <ClockCircleOutlined />
                  <Text>{dayjs(appointment.appointmentDate).format('HH:mm')}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Space>
                  {getAppointmentTypeIcon(appointment.appointmentType)}
                  <Text>{getAppointmentTypeText(appointment.appointmentType)}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                <Text>{appointment.durationMinutes || 60} minutes</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color="purple">{appointment.paymentMethod}</Tag>
              </Descriptions.Item>
              {appointment.clientNotes && (
                <Descriptions.Item label="Notes">
                  <Text>{appointment.clientNotes}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Status Timeline */}
          <Card title="📊 Status Timeline" style={{ marginBottom: '24px' }}>
            <Timeline>
              <Timeline.Item color="green">
                <Text strong>Created</Text>
                <br />
                <Text type="secondary">{dayjs(appointment.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Timeline.Item>
              {appointment.status === 'CONFIRMED' && (
                <Timeline.Item color="blue">
                  <Text strong>Confirmed</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
              {appointment.status === 'COMPLETED' && (
                <Timeline.Item color="green">
                  <Text strong>Completed</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
              {appointment.status === 'CANCELLED' && (
                <Timeline.Item color="red">
                  <Text strong>Cancelled</Text>
                  <br />
                  <Text type="secondary">{dayjs(appointment.updatedAt).format('DD/MM/YYYY HH:mm')}</Text>
                </Timeline.Item>
              )}
            </Timeline>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Actions */}
          <Card title="⚡ Actions" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {appointment.status === 'PENDING' && (
                <>
                  <Button 
                    type="primary" 
                    block 
                    icon={<EditOutlined />}
                    onClick={() => setShowRescheduleModal(true)}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    danger 
                    block 
                    icon={<DeleteOutlined />}
                    onClick={() => setShowCancelModal(true)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              
              {appointment.status === 'CONFIRMED' && appointment.appointmentType === 'ONLINE' && (
                <div>
                  {appointment.meetingLink ? (
                    <Button 
                      type="primary" 
                      block 
                      size="large"
                      icon={<VideoCameraOutlined />}
                      onClick={() => window.open(appointment.meetingLink, '_blank')}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        height: '48px',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        marginBottom: '8px'
                      }}
                    >
                      🎥 Join Google Meet
                    </Button>
                  ) : (
                    <Alert
                      message="Meeting Link Pending"
                      description="Your consultant will add the meeting link before the appointment time."
                      type="info"
                      showIcon
                      style={{ marginBottom: '8px' }}
                    />
                  )}
                </div>
              )}
              
              {appointment.status === 'CONFIRMED' && appointment.appointmentType === 'IN_PERSON' && (
                <Alert
                  message="In-Person Meeting"
                  description={
                    appointment.meetingLink ? 
                    `Location: ${appointment.meetingLink}` : 
                    "Location details will be provided by your consultant."
                  }
                  type="info"
                  icon={<EnvironmentOutlined />}
                  style={{ marginBottom: '8px' }}
                />
              )}
              
              {appointment.status === 'COMPLETED' && !appointment.review && (
                <Button 
                  block 
                  icon={<StarOutlined />}
                  onClick={() => setShowReviewModal(true)}
                >
                  Write Review
                </Button>
              )}
              
              <Button 
                block 
                onClick={() => navigate('/appointments')}
              >
                Back to List
              </Button>
            </Space>
          </Card>

          {/* Consultant Info */}
          <Card title="👨‍⚕️ Consultant Information" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <Title level={4} style={{ marginTop: '8px' }}>
                  {appointment.consultant?.firstName} {appointment.consultant?.lastName}
                </Title>
                <Text type="secondary">{appointment.consultant?.expertise || 'General Consultation'}</Text>
              </div>
              <Divider />
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  icon={<PhoneOutlined />} 
                  block
                  onClick={() => window.open(`tel:${appointment.consultant?.phone}`)}
                >
                  Call
                </Button>
                <Button 
                  icon={<MailOutlined />} 
                  block
                  onClick={() => window.open(`mailto:${appointment.consultant?.email}`)}
                >
                  Email
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        title="Cancel Appointment"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowCancelModal(false)}>
            No
          </Button>,
          <Button key="confirm" danger onClick={handleCancelAppointment}>
            Cancel Appointment
          </Button>
        ]}
      >
        <Alert
          message="Warning"
          description="Appointment cannot be restored after cancellation."
          type="warning"
          showIcon
        />
      </Modal>

      <Modal
        title="Reschedule Appointment"
        open={showRescheduleModal}
        onCancel={() => setShowRescheduleModal(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleRescheduleAppointment}>
          <Form.Item
            name="newDateTime"
            label="New Date & Time"
            rules={[{ required: true, message: 'Please select new date and time!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Reschedule
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Write Review"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        footer={null}
      >
        <Form form={reviewForm} onFinish={handleSubmitReview}>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating!' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: 'Please provide a comment!' }]}
          >
            <Input.TextArea rows={4} placeholder="Share your experience..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentDetailPage; 