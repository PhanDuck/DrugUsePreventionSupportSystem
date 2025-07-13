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
import appointmentService from '../services/appointmentService';
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
      message.warning('Please login to schedule a consultation');
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
        specialty: consultant.expertise || 'General Consultation',
        experience: 'Years of experience',
        rating: 4.8,
        price: 500000,
        avatar: null,
        bio: `Professional consultant with expertise in ${consultant.expertise || 'psychological counseling'}`,
        email: consultant.email,
        phone: consultant.phone
      }));
      setConsultants(consultantData);
    } catch (error) {
      console.error('Error loading consultants:', error);
      message.error('Unable to load consultant list');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      if (authService.isAuthenticated()) {
        const result = await appointmentService.getCurrentUserAppointments();
        if (result.success) {
          setAppointments(result.data);
        } else {
          console.error('Error loading appointments:', result.message);
          setAppointments([]);
        }
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
      const result = await appointmentService.getAvailableSlots(consultantId, formattedDate);
      
      if (result.success) {
        setAvailableSlots(result.data.availableSlots || []);
        
        if (result.data.availableSlots.length === 0) {
          message.warning('No available slots on this date. Please select another date.');
        }
      } else {
        message.error(result.message);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      message.error('Unable to load available slots');
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

      const result = await appointmentService.createAppointment(appointmentData);
      
      if (result.success) {
        message.success('Consultation appointment scheduled successfully! We will contact you soon.');
        setShowBookingModal(false);
        form.resetFields();
        loadAppointments();
      } else {
        message.error(result.message);
      }
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      message.error('An error occurred while scheduling. Please try again!');
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
            Professional Consultation
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '16px', opacity: 0.9 }}>
            Schedule appointments with experienced psychologists and counselors
          </Paragraph>
        </div>
      </Card>

      {/* User Stats (if has appointments) */}
      {appointments.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={6}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Total Consultations"
                value={appointments.length}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Upcoming"
                value={appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED').length}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Completed"
                value={appointments.filter(a => a.status === 'COMPLETED').length}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card style={{ textAlign: 'center' }}>
              <Statistic
                title="Cancelled"
                value={appointments.filter(a => a.status === 'CANCELLED').length}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Consultants Section */}
      <Title level={3} style={{ marginBottom: '24px' }}>
        Available Consultants
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading consultants...</div>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {consultants.map((consultant) => (
            <Col xs={24} sm={12} lg={8} key={consultant.id}>
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button 
                    type="primary" 
                    onClick={() => openBookingModal(consultant)}
                    icon={<CalendarOutlined />}
                  >
                    Book Appointment
                  </Button>
                ]}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Avatar 
                    size={64} 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </div>
                
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {consultant.name}
                  </Title>
                  <Text type="secondary">{consultant.specialty}</Text>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <MailOutlined /> {consultant.email}
                    </div>
                    {consultant.phone && (
                      <div>
                        <PhoneOutlined /> {consultant.phone}
                      </div>
                    )}
                    <div>
                      <Tag color="blue">{consultant.experience}</Tag>
                      <Tag color="green">{consultant.rating} ⭐</Tag>
                    </div>
                  </Space>
                </div>

                <Paragraph style={{ fontSize: '12px', color: '#666' }}>
                  {consultant.bio}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Booking Modal */}
      <Modal
        title="Schedule Consultation"
        open={showBookingModal}
        onCancel={() => setShowBookingModal(false)}
        footer={null}
        width={600}
      >
        {selectedConsultant && (
          <div style={{ marginBottom: '24px' }}>
            <Alert
              message={`Booking with ${selectedConsultant.name}`}
              description={`Specialty: ${selectedConsultant.specialty}`}
              type="info"
              showIcon
            />
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleBooking}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="appointmentDate"
                label="Appointment Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => {
                    // Disable weekends and past dates
                    const day = current.day();
                    return day === 0 || day === 6 || current.isBefore(dayjs(), 'day');
                  }}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="appointmentTime"
                label="Appointment Time"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <Select
                  placeholder="Select time slot"
                  loading={loadingSlots}
                  disabled={!selectedConsultant || availableSlots.length === 0}
                >
                  {availableSlots.map((slot) => (
                    <Select.Option key={slot} value={slot}>
                      {slot}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="appointmentType"
            label="Appointment Type"
            initialValue="ONLINE"
          >
            <Radio.Group>
              <Radio value="ONLINE">Online Consultation</Radio>
              <Radio value="IN_PERSON">In-Person Consultation</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            initialValue="CASH"
          >
            <Radio.Group>
              <Radio value="CASH">Cash</Radio>
              <Radio value="VNPAY">VNPay</Radio>
              <Radio value="BANK_TRANSFER">Bank Transfer</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes (Optional)"
          >
            <Input.TextArea
              rows={3}
              placeholder="Please describe your concerns or any specific topics you'd like to discuss..."
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Schedule Appointment
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 