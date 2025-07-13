import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Card, Form, Input, DatePicker, Button, Row, Col, message,
  Avatar, Tag, Space, Modal, Spin, Radio, Select, Alert, Calendar, Badge
} from 'antd';
import {
  CalendarOutlined, ClockCircleOutlined, UserOutlined, PhoneOutlined, 
  MailOutlined, CheckCircleOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import authService from '../services/authService';
import { mockConsultants, mockAvailableSlots } from '../services/mockData';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

function BookAppointmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [result, setResult] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    checkAuthentication();
    loadConsultants();
  }, []);

  const checkAuthentication = () => {
    // Mock authentication for demo
    const mockUser = { id: 1, name: 'Demo User', email: 'demo@example.com' };
    setCurrentUser(mockUser);
  };

  const loadConsultants = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data and add additional details
      const consultantsWithDetails = mockConsultants.map(consultant => ({
        ...consultant,
        specialty: consultant.expertise || 'Tư vấn tâm lý',
        experience: getExperienceYears(consultant.createdAt),
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        price: 200000 + (consultant.id * 50000), // Different prices
        bio: generateBio(consultant.expertise),
        description: generateDescription(consultant.expertise)
      }));
      
      setConsultants(consultantsWithDetails);
    } catch (error) {
      console.error('Error loading consultants:', error);
      message.error('Không thể tải danh sách tư vấn viên');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (consultantId, date) => {
    if (!consultantId || !date) return;
    
    try {
      setLoadingSlots(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const consultantSlots = mockAvailableSlots[consultantId];
      const slotsForDate = consultantSlots ? consultantSlots[formattedDate] || [] : [];
      
      setAvailableSlots(slotsForDate);
      
      if (slotsForDate.length === 0) {
        message.warning('Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.');
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      message.error('Không thể tải khung giờ trống');
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    form.setFieldsValue({ appointmentDate: date, appointmentTime: null });
    
    if (selectedConsultant && date) {
      loadAvailableSlots(selectedConsultant.id, date);
    }
  };

  const handleSelectConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    form.setFieldsValue({ consultantId: consultant.id });
    setAvailableSlots([]);
    setSelectedDate(null);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success response
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setResult('Đặt lịch thành công!');
        message.success('Đặt lịch hẹn thành công!');
      } else {
        setResult('Đặt lịch thất bại! Vui lòng thử lại sau.');
        message.error('Đặt lịch thất bại!');
      }
      
      setStep(2);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setResult('Đặt lịch thất bại! ' + error.message);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getExperienceYears = (createdAt) => {
    const years = dayjs().diff(dayjs(createdAt), 'year');
    return Math.max(1, years + 2);
  };

  const generateBio = (expertise) => {
    const bios = {
      'Tâm lý học': 'Chuyên gia tâm lý với nhiều năm kinh nghiệm trong lĩnh vực tư vấn và điều trị các vấn đề tâm lý.',
      'Nghiện chất': 'Bác sĩ chuyên khoa về nghiện chất, có kinh nghiệm điều trị và phục hồi cho người nghiện.',
      'Tư vấn gia đình': 'Chuyên gia tư vấn gia đình, giúp giải quyết các vấn đề trong mối quan hệ gia đình.',
      'default': 'Chuyên gia tư vấn với nhiều năm kinh nghiệm trong lĩnh vực phòng chống tệ nạn xã hội.'
    };
    return bios[expertise] || bios['default'];
  };

  const generateDescription = (expertise) => {
    const descriptions = {
      'Tâm lý học': 'Chuyên về tâm lý học lâm sàng, tư vấn tâm lý cho thanh thiếu niên và người trưởng thành',
      'Nghiện chất': 'Chuyên môn sâu về điều trị nghiện chất, phục hồi chức năng và tái hòa nhập xã hội',
      'Tư vấn gia đình': 'Chuyên gia về tư vấn hôn nhân gia đình, giải quyết xung đột và cải thiện mối quan hệ',
      'default': 'Tư vấn chuyên sâu về phòng chống tệ nạn xã hội và hỗ trợ tâm lý'
    };
    return descriptions[expertise] || descriptions['default'];
  };

  // Disable past dates and weekends
  const disabledDate = (current) => {
    const today = dayjs().startOf('day');
    const maxDate = dayjs().add(30, 'day');
    const isWeekend = current && (current.day() === 0 || current.day() === 6);
    
    return current && (
      current.isBefore(today) || 
      current.isAfter(maxDate) || 
      isWeekend
    );
  };

  // Generate time slots for selection
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          value: timeString,
          label: timeString,
          disabled: !availableSlots.some(slot => slot.startTime === timeString)
        });
      }
    }
    return slots;
  };

  if (loading && consultants.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải danh sách tư vấn viên...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/appointments')}
          style={{ position: 'absolute', left: '24px', top: '24px' }}
        >
          Quay lại
        </Button>
        
        <Title level={1} style={{ marginBottom: '8px' }}>
          Đặt Lịch Hẹn Tư Vấn
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Chọn tư vấn viên và thời gian phù hợp với bạn
        </Paragraph>
        
        {/* Demo Notice */}
        <Alert
          message="🎭 Chế độ Demo"
          description="Đây là phiên bản demo với dữ liệu mẫu. Tất cả thông tin đều là giả lập."
          type="info"
          showIcon
          style={{ marginBottom: '16px', maxWidth: '600px', margin: '0 auto 16px auto' }}
        />
      </div>

      {step === 1 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* Step 1: Select Consultant */}
          <Card title="🔍 Chọn Tư Vấn Viên" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              {consultants.map(consultant => (
                <Col xs={24} sm={12} lg={8} key={consultant.id}>
                  <Card
                    hoverable
                    style={{ 
                      height: '100%',
                      border: selectedConsultant?.id === consultant.id ? '2px solid #1890ff' : '1px solid #d9d9d9'
                    }}
                    onClick={() => handleSelectConsultant(consultant)}
                    cover={
                      <div style={{ padding: '16px', textAlign: 'center', background: '#f8f9fa' }}>
                        <Avatar size={64} src={consultant.avatar} icon={<UserOutlined />} />
                      </div>
                    }
                  >
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <Title level={5} style={{ margin: '8px 0' }}>
                        {consultant.firstName} {consultant.lastName}
                      </Title>
                      <Tag color="blue">{consultant.specialty}</Tag>
                      <div style={{ margin: '8px 0', color: '#666' }}>
                        <Text>⭐ {consultant.rating}/5.0</Text>
                        <Text style={{ margin: '0 8px' }}>•</Text>
                        <Text>{consultant.experience} năm kinh nghiệm</Text>
                      </div>
                    </div>
                    
                    {/* Consultant Description */}
                    <div style={{ marginBottom: '12px' }}>
                      <Text strong style={{ color: '#1890ff' }}>Chuyên môn:</Text>
                      <br />
                      <Text style={{ fontSize: '14px', color: '#666' }}>
                        {consultant.description}
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                      <Text strong>Email:</Text> <Text>{consultant.email}</Text>
                    </div>
                    
                    <div style={{ marginBottom: '12px' }}>
                      <Text strong>Kinh nghiệm:</Text> <Text>{consultant.experience} năm</Text>
                    </div>
                    
                    <div style={{ 
                      background: '#f6ffed', 
                      padding: '8px', 
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <Text strong style={{ color: '#52c41a' }}>
                        {consultant.price?.toLocaleString('vi-VN')}đ/buổi
                      </Text>
                    </div>
                    
                    {selectedConsultant?.id === consultant.id && (
                      <div style={{ 
                        marginTop: '8px',
                        padding: '8px',
                        background: '#e6f7ff',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                          ✓ Đã chọn
                        </Text>
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Step 2: Select Date and Time */}
          {selectedConsultant && (
            <Card title="📅 Chọn Ngày và Giờ" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="appointmentDate"
                    label="Chọn ngày"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày tư vấn"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                  
                  {/* Calendar View */}
                  {selectedDate && (
                    <div style={{ marginTop: '16px' }}>
                      <Button 
                        type="link" 
                        onClick={() => setShowCalendar(!showCalendar)}
                        style={{ padding: 0 }}
                      >
                        {showCalendar ? 'Ẩn lịch' : 'Xem lịch tháng'}
                      </Button>
                      
                      {showCalendar && (
                        <div style={{ marginTop: '8px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                          <Calendar
                            fullscreen={false}
                            value={selectedDate}
                            onSelect={handleDateChange}
                            disabledDate={disabledDate}
                            dateCellRender={(date) => {
                              const isSelected = selectedDate && date.isSame(selectedDate, 'day');
                              const isDisabled = disabledDate(date);
                              
                              return (
                                <div style={{
                                  height: '100%',
                                  background: isSelected ? '#1890ff' : 'transparent',
                                  color: isSelected ? 'white' : isDisabled ? '#ccc' : 'inherit',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {date.date()}
                                </div>
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item
                    name="appointmentTime"
                    label="Chọn giờ"
                    rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
                  >
                    <Select
                      placeholder="Chọn khung giờ"
                      loading={loadingSlots}
                      disabled={!selectedDate}
                      style={{ width: '100%' }}
                    >
                      {generateTimeSlots().map(slot => (
                        <Option 
                          key={slot.label} 
                          value={slot.value} 
                          disabled={slot.disabled}
                        >
                          <Space>
                            <span>{slot.label}</span>
                            {slot.disabled && <Badge status="error" text="Đã đặt" />}
                            {!slot.disabled && <Badge status="success" text="Trống" />}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  {/* Available Slots Display */}
                  {selectedDate && availableSlots.length > 0 && (
                    <div style={{ 
                      background: '#f6ffed', 
                      padding: '12px', 
                      borderRadius: '6px',
                      marginTop: '8px'
                    }}>
                      <Text strong style={{ color: '#52c41a' }}>
                        Khung giờ trống: {availableSlots.length} slot
                      </Text>
                      <div style={{ marginTop: '8px' }}>
                        {availableSlots.slice(0, 6).map((slot, index) => (
                          <Tag key={index} color="green" style={{ margin: '2px' }}>
                            {slot.startTime}
                          </Tag>
                        ))}
                        {availableSlots.length > 6 && (
                          <Tag style={{ margin: '2px' }}>+{availableSlots.length - 6} khác</Tag>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedDate && availableSlots.length === 0 && !loadingSlots && (
                    <Alert
                      message="Không có khung giờ trống"
                      description="Vui lòng chọn ngày khác hoặc liên hệ trực tiếp với tư vấn viên"
                      type="warning"
                      showIcon
                      style={{ marginTop: '8px' }}
                    />
                  )}
                </Col>
              </Row>
            </Card>
          )}

          {/* Step 3: Appointment Details */}
          {selectedConsultant && selectedDate && (
            <Card title="📝 Thông Tin Cuộc Hẹn" style={{ marginBottom: '24px' }}>
              <Form.Item
                name="appointmentType"
                label="Hình thức tư vấn"
                rules={[{ required: true, message: 'Vui lòng chọn hình thức tư vấn!' }]}
                initialValue="ONLINE"
              >
                <Radio.Group>
                  <Radio value="ONLINE">💻 Tư vấn online qua google meet</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Phương thức thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
              >
                <Radio.Group>
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

              <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  style={{ minWidth: '200px' }}
                >
                  Đặt lịch hẹn
                </Button>
              </Form.Item>
            </Card>
          )}
        </Form>
      )}

      {/* Step 2: Result */}
      {step === 2 && (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>
            {result.includes('thành công') ? '🎉' : '😞'}
          </div>
          
          <Title level={2} style={{ 
            color: result.includes('thành công') ? '#52c41a' : '#f5222d',
            marginBottom: '16px'
          }}>
            {result}
          </Title>
          
          {result.includes('thành công') && (
            <div style={{ marginBottom: '32px' }}>
              <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                Lịch hẹn của bạn đã được gửi đến tư vấn viên. 
                Bạn sẽ nhận được xác nhận qua email trong thời gian sớm nhất.
              </Paragraph>
              
              <Alert
                message="Thông tin quan trọng"
                description={
                  <div>
                    <p>• Tư vấn viên sẽ xác nhận lịch hẹn trong vòng 24 giờ</p>
                    <p>• Bạn sẽ nhận được email thông báo khi lịch hẹn được xác nhận</p>
                    <p>• Có thể hủy hoặc đổi lịch trước 2 giờ</p>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginTop: '16px', textAlign: 'left' }}
              />
            </div>
          )}  
          
          <Space size="large">
            <Button 
              type="primary" 
              onClick={() => navigate('/appointments')}
              size="large"
            >
              Xem lịch hẹn của tôi
            </Button>
            
            <Button 
              onClick={() => {
                setStep(1);
                setSelectedConsultant(null);
                setSelectedDate(null);
                setAvailableSlots([]);
                setResult('');
                form.resetFields();
              }}
              size="large"
            >
              Đặt lịch khác
            </Button>
          </Space>
        </Card>
      )}

      {/* Emergency Contact */}
      <Card 
        title="🚨 Liên Hệ Khẩn Cấp" 
        style={{ marginTop: '32px', background: '#fff2f0', border: '1px solid #ffccc7' }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Space>
              <PhoneOutlined style={{ color: '#f5222d' }} />
              <div>
                <Text strong>Hotline 24/7:</Text>
                <br />
                <Text copyable style={{ fontSize: '18px', color: '#f5222d' }}>1900 1234</Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space>
              <MailOutlined style={{ color: '#f5222d' }} />
              <div>
                <Text strong>Email khẩn cấp:</Text>
                <br />
                <Text copyable>emergency@drugprevention.vn</Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default BookAppointmentPage;