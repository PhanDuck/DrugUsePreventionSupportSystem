import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  message, 
  Avatar,
  Tag,
  Space,
  Modal,
  Spin,
  Radio,
  TimePicker,
  Alert,
  Statistic,
  Select
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from '../config/axios';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

export default function AppointmentPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    checkAuthentication();
    loadConsultants();
    loadAppointments();
  }, []);

  const checkAuthentication = () => {
    if (!authService.isAuthenticated()) {
      message.warning('Vui lòng đăng nhập để đặt lịch tư vấn');
      navigate('/login');
      return;
    }
    setCurrentUser(authService.getCurrentUser());
  };

  const loadConsultants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/consultants');
      const consultantData = response.data.map(consultant => ({
        id: consultant.id,
        name: `${consultant.firstName} ${consultant.lastName}`,
        specialty: consultant.expertise || 'Tư vấn chung',
        experience: 'Nhiều năm kinh nghiệm',
        rating: 4.8,
        price: 500000,
        avatar: null,
        bio: `Chuyên gia tư vấn với chuyên môn về ${consultant.expertise || 'tư vấn tâm lý'}`
      }));
      setConsultants(consultantData);
    } catch (error) {
      console.error('Error loading consultants:', error);
      message.error('Không thể tải danh sách tư vấn viên');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      if (authService.isAuthenticated()) {
        const response = await axios.get('/api/appointments/user');
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const loadAvailableSlots = async (consultantId, date) => {
    try {
      setLoadingSlots(true);
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axios.get(`/api/appointments/consultant/${consultantId}/available-slots?date=${formattedDate}`);
      setAvailableSlots(response.data.availableSlots || []);
      
      if (response.data.availableSlots.length === 0) {
        message.warning('Không có lịch trống trong ngày này. Vui lòng chọn ngày khác.');
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      const errorMessage = error.response?.data?.error || 'Không thể tải lịch trống';
      message.error(errorMessage);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    if (date && selectedConsultant) {
      loadAvailableSlots(selectedConsultant.id, date);
      // Clear time selection when date changes
      form.setFieldsValue({ appointmentTime: null });
    }
  };

  const handleBooking = async (values) => {
    try {
      setLoading(true);
      
      // Combine date and time into LocalDateTime format
      const appointmentDateTime = values.appointmentDate.format('YYYY-MM-DD') + 'T' + values.appointmentTime + ':00';
      
      const appointmentData = {
        clientId: currentUser.id,
        consultantId: selectedConsultant.id,
        appointmentDate: appointmentDateTime,
        durationMinutes: 60,
        appointmentType: values.appointmentType,
        clientNotes: values.notes || '',
        paymentMethod: values.paymentMethod
      };

      await axios.post('/api/appointments', appointmentData);
      message.success('Đặt lịch tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      
      setShowBookingModal(false);
      form.resetFields();
      loadAppointments();
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (consultant) => {
    setSelectedConsultant(consultant);
    setShowBookingModal(true);
    setAvailableSlots([]);
    form.resetFields();
  };

  return (
    <div style={{ minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <Card style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '16px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ padding: '40px 20px', color: '#fff' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>💬</div>
          <Title level={2} style={{ color: '#fff', marginBottom: '16px' }}>
            Tư Vấn Chuyên Nghiệp
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', opacity: 0.9 }}>
            Đặt lịch hẹn với các chuyên gia tâm lý và tư vấn viên giàu kinh nghiệm
          </Paragraph>
        </div>
      </Card>

      {/* User Stats (if has appointments) */}
      {appointments.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Tổng Buổi Tư Vấn"
                value={appointments.length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Buổi Sắp Tới"
                value={appointments.filter(apt => apt.status === 'CONFIRMED').length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Hoàn Thành"
                value={appointments.filter(apt => apt.status === 'COMPLETED').length}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Consultants List */}
      <Card title="👥 Đội Ngũ Chuyên Gia" style={{ marginBottom: '24px' }}>
        <Spin spinning={loading}>
          <Row gutter={[24, 24]}>
            {consultants.map((consultant) => (
              <Col xs={24} md={12} key={consultant.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '12px',
                    height: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <Avatar 
                      size={64} 
                      icon={<UserOutlined />}
                      style={{ marginRight: '16px', background: '#1890ff' }}
                    />
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                        {consultant.name}
                      </Title>
                      <Tag color="blue" style={{ marginBottom: '8px' }}>
                        {consultant.specialty}
                      </Tag>
                      <div>
                        <Text type="secondary">
                          Kinh nghiệm: {consultant.experience} • ⭐ {consultant.rating}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  <Paragraph style={{ color: '#666', marginBottom: '16px' }}>
                    {consultant.bio}
                  </Paragraph>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                        {consultant.price.toLocaleString()} VNĐ
                      </Text>
                      <Text type="secondary"> / buổi</Text>
                    </div>
                  </div>
                  
                  <Button 
                    type="primary" 
                    block 
                    size="large"
                    onClick={() => openBookingModal(consultant)}
                    style={{
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}
                  >
                    📅 Đặt Lịch Ngay
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </Card>

      {/* Emergency Contact */}
      <Card style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: 'none',
        borderRadius: '16px'
      }}>
        <Row align="middle">
          <Col xs={24} md={16}>
            <Title level={4} style={{ marginBottom: '8px' }}>
              🆘 Cần Hỗ Trợ Khẩn Cấp?
            </Title>
            <Paragraph style={{ marginBottom: '16px' }}>
              Nếu bạn đang gặp tình huống khẩn cấp, vui lòng liên hệ hotline 24/7
            </Paragraph>
            <Space>
              <Button 
                type="primary" 
                danger
                size="large"
                icon={<PhoneOutlined />}
                onClick={() => window.open('tel:113')}
              >
                Hotline: 113
              </Button>
              <Button 
                size="large"
                icon={<MailOutlined />}
                onClick={() => window.open('mailto:support@drugprevention.com')}
              >
                Email Hỗ Trợ
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '80px' }}>🚑</div>
          </Col>
        </Row>
      </Card>

      {/* Booking Modal */}
      <Modal
        title={`Đặt lịch tư vấn - ${selectedConsultant?.name}`}
        open={showBookingModal}
        onCancel={() => setShowBookingModal(false)}
        footer={null}
        width={600}
      >
        {selectedConsultant && (
          <div>
            <Alert
              message={`Phí tư vấn: ${selectedConsultant.price.toLocaleString()} VNĐ / buổi`}
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleBooking}
              initialValues={{
                appointmentType: 'ONLINE',
                paymentMethod: 'CASH'
              }}
            >
              <Form.Item
                name="appointmentDate"
                label="Chọn ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf('day');
                  }}
                  onChange={handleDateChange}
                />
              </Form.Item>

              <Form.Item
                name="appointmentTime"
                label="Chọn giờ"
                rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
              >
                <Select
                  style={{ width: '100%' }}
                  placeholder={loadingSlots ? "Đang tải..." : "Vui lòng chọn ngày trước"}
                  disabled={!availableSlots.length}
                  loading={loadingSlots}
                  options={availableSlots.map(slot => ({
                    value: slot,
                    label: slot
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="appointmentType"
                label="Hình thức tư vấn"
                rules={[{ required: true, message: 'Vui lòng chọn hình thức!' }]}
              >
                <Radio.Group>
                  <Radio value="ONLINE">💻 Tư vấn online</Radio>
                  <Radio value="IN_PERSON">🏢 Tư vấn trực tiếp</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
              >
                <Radio.Group>
                  <Radio value="CASH">💵 Thanh toán tiền mặt</Radio>
                  <Radio value="VNPAY">🏧 Thanh toán VNPay (sắp có)</Radio>
                  <Radio value="BANK_TRANSFER">🏦 Chuyển khoản ngân hàng</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="notes"
                label="Ghi chú (tùy chọn)"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Mô tả vấn đề hoặc ghi chú đặc biệt..."
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setShowBookingModal(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Xác Nhận Đặt Lịch
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
} 