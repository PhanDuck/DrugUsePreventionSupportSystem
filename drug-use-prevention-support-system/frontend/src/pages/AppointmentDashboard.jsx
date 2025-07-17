import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Row, 
  Col, 
  Statistic, 
  Badge, 
  message, 
  Spin,
  Empty,
  Alert,
  Tabs,
  Tag,
  Progress,
  Divider,
  Drawer,
  Input,
  Select,
  List as AntList,
  Avatar,
  Modal,
  Form,
  DatePicker,
  TimePicker
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  BarChartOutlined,
  BellOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import authService from '../services/authService';
import userService from '../services/userService';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentStats from '../components/AppointmentStats';
import AppointmentNotifications from '../components/AppointmentNotifications';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AppointmentDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [consultantsLoading, setConsultantsLoading] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showConsultantDrawer, setShowConsultantDrawer] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [searchConsultant, setSearchConsultant] = useState('');
  // Booking form state
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingForm] = Form.useForm();
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadConsultants();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const result = await appointmentService.getCurrentUserAppointments();
      
      if (result.success) {
        setAppointments(result.data);
      } else {
        message.error(result.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      message.error('Unable to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadConsultants = async () => {
    setConsultantsLoading(true);
    const res = await userService.getConsultants();
    console.log('Consultants API response:', res); // DEBUG LOG
    if (res.success) setConsultants(res.data);
    setConsultantsLoading(false);
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

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'CONFIRMED' && dayjs(apt.appointmentDate).isAfter(dayjs())
  );

  const pendingAppointments = appointments.filter(apt => 
    apt.status === 'PENDING'
  );

  const completedAppointments = appointments.filter(apt => 
    apt.status === 'COMPLETED'
  );

  const todayAppointments = appointments.filter(apt => 
    dayjs(apt.appointmentDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  );

  const thisWeekAppointments = appointments.filter(apt => {
    const aptDate = dayjs(apt.appointmentDate);
    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');
    return aptDate.isAfter(startOfWeek) && aptDate.isBefore(endOfWeek);
  });

  // Filter/sort consultants
  const filteredConsultants = consultants.filter(c => {
    const matchSpecialty = filterSpecialty === 'all' || (c.expertise && c.expertise === filterSpecialty);
    const matchSearch = !searchConsultant || (c.firstName + ' ' + c.lastName).toLowerCase().includes(searchConsultant.toLowerCase());
    return matchSpecialty && matchSearch;
  });
  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
    return 0;
  });

  // Booking modal logic
  const openBookingModal = () => {
    setShowBookingModal(true);
    setBookingStep(0);
    setSelectedConsultant(null);
    bookingForm.resetFields();
    setBookingDate(null);
    setBookingTime(null);
  };
  const handleBookSession = async () => {
    try {
      setBookingLoading(true);
      const values = bookingForm.getFieldsValue();
      const appointmentData = {
        consultantId: selectedConsultant.id,
        clientId: authService.getCurrentUser().id,
        appointmentDate: bookingDate.format('YYYY-MM-DD') + 'T' + bookingTime.format('HH:mm:ss'),
        durationMinutes: 60,
        appointmentType: 'ONLINE',
        clientNotes: values.notes || ''
      };
      const result = await appointmentService.createAppointment(appointmentData);
      if (result.success) {
        message.success('Appointment booked successfully!');
        setShowBookingModal(false);
        setBookingStep(0);
        loadAppointments();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading your appointment dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <Card style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '20px',
        marginBottom: '32px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ padding: '40px 20px', color: '#fff' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📊</div>
          <Title level={1} style={{ color: '#fff', marginBottom: '16px', fontSize: '2.5rem' }}>
            Appointment Dashboard
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '32px', opacity: 0.9 }}>
            Manage and monitor all your consultation appointments in one place
          </Paragraph>
          
          {/* Quick Stats */}
          <Row gutter={[32, 16]} justify="center">
            <Col>
              <Statistic 
                title="Total Appointments" 
                value={appointments.length} 
                valueStyle={{ color: '#fff' }}
                prefix={<CalendarOutlined />}
              />
            </Col>
            <Col>
              <Statistic 
                title="Upcoming" 
                value={upcomingAppointments.length} 
                valueStyle={{ color: '#fff' }}
                prefix={<ClockCircleOutlined />}
              />
            </Col>
            <Col>
              <Statistic 
                title="Completed" 
                value={completedAppointments.length} 
                valueStyle={{ color: '#fff' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col>
              <Statistic 
                title="This Week" 
                value={thisWeekAppointments.length} 
                valueStyle={{ color: '#fff' }}
                prefix={<TeamOutlined />}
              />
            </Col>
          </Row>
        </div>
      </Card>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px' }}
            onClick={openBookingModal}
          >
            <BookOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={4}>Book New Session</Title>
            <Text type="secondary">Schedule a consultation with our experts</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px' }}
            onClick={() => navigate('/appointments/calendar')}
          >
            <CalendarOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={4}>Calendar View</Title>
            <Text type="secondary">View appointments in calendar format</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px' }}
            onClick={() => navigate('/appointments/list')}
          >
            <UnorderedListOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '16px' }} />
            <Title level={4}>List View</Title>
            <Text type="secondary">View all appointments in a list</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            hoverable
            style={{ textAlign: 'center', borderRadius: '12px' }}
            onClick={() => navigate('/search')}
          >
            <TeamOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '16px' }} />
            <Title level={4}>Find Consultants</Title>
            <Text type="secondary">Search and browse available consultants</Text>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card 
        title={
          <Space>
            <BarChartOutlined />
            <span>Dashboard Overview</span>
            <Badge count={appointments.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/appointments')}
            >
              Book New Appointment
            </Button>
            <Button 
              icon={<EyeOutlined />}
              onClick={() => navigate('/appointments/calendar')}
            >
              Calendar View
            </Button>
          </Space>
        }
        style={{ borderRadius: '12px' }}
      >
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <Space>
                  <BarChartOutlined />
                  Overview
                </Space>
              ),
              children: (
                <div>
                  {appointments.length === 0 ? (
                    <Empty 
                      description="No appointments found" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button 
                        type="primary" 
                        icon={<BookOutlined />}
                        onClick={() => navigate('/appointments')}
                      >
                        Book Your First Appointment
                      </Button>
                    </Empty>
                  ) : (
                    <Row gutter={[24, 24]}>
                      <Col xs={24} lg={16}>
                        <AppointmentStats appointments={appointments} />
                      </Col>
                      <Col xs={24} lg={8}>
                        <Space direction="vertical" size="16" style={{ width: '100%' }}>
                          <AppointmentNotifications appointments={appointments} />
                          
                          {/* Quick Actions */}
                          <Card title="⚡ Quick Actions" style={{ borderRadius: '12px' }}>
                            <Space direction="vertical" size="12" style={{ width: '100%' }}>
                              <Button 
                                type="primary" 
                                size="large" 
                                icon={<BookOutlined />}
                                block
                                onClick={() => navigate('/appointments')}
                              >
                                Book New Session
                              </Button>
                              <Button 
                                size="large" 
                                icon={<CalendarOutlined />}
                                block
                                onClick={() => navigate('/appointments/calendar')}
                              >
                                View Calendar
                              </Button>
                              <Button 
                                size="large" 
                                icon={<UnorderedListOutlined />}
                                block
                                onClick={() => navigate('/appointments/list')}
                              >
                                View List
                              </Button>
                            </Space>
                          </Card>

                          {/* Tips */}
                          <Card title="💡 Tips" style={{ borderRadius: '12px' }}>
                            <Space direction="vertical" size="12" style={{ width: '100%' }}>
                              <div>
                                <Text strong>📅 Calendar View</Text>
                                <br />
                                <Text type="secondary">Use calendar view to see all appointments at a glance</Text>
                              </div>
                              <div>
                                <Text strong>⏰ Reminders</Text>
                                <br />
                                <Text type="secondary">You'll receive notifications before your appointments</Text>
                              </div>
                              <div>
                                <Text strong>🔄 Rescheduling</Text>
                                <br />
                                <Text type="secondary">You can reschedule up to 24 hours before the appointment</Text>
                              </div>
                            </Space>
                          </Card>
                        </Space>
                      </Col>
                    </Row>
                  )}
                </div>
              )
            },
            {
              key: 'calendar',
              label: (
                <Space>
                  <CalendarOutlined />
                  Calendar View
                </Space>
              ),
              children: (
                <div>
                  {appointments.length === 0 ? (
                    <Empty 
                      description="No appointments found" 
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button 
                        type="primary" 
                        icon={<BookOutlined />}
                        onClick={() => navigate('/appointments')}
                      >
                        Book Your First Appointment
                      </Button>
                    </Empty>
                  ) : (
                    <AppointmentCalendar 
                      appointments={appointments}
                      onAppointmentClick={loadAppointments}
                    />
                  )}
                </div>
              )
            },
            {
              key: 'upcoming',
              label: (
                <Space>
                  <ClockCircleOutlined />
                  Upcoming
                  <Badge count={upcomingAppointments.length} style={{ backgroundColor: '#52c41a' }} />
                </Space>
              ),
              children: (
                <div>
                  {upcomingAppointments.length === 0 ? (
                    <Empty description="No upcoming appointments" />
                  ) : (
                    <div>
                      <Alert
                        message="Upcoming Appointments"
                        description="These are your confirmed appointments. Please be ready 5 minutes before the scheduled time."
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      {upcomingAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                          showActions={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'pending',
              label: (
                <Space>
                  <ExclamationCircleOutlined />
                  Pending
                  <Badge count={pendingAppointments.length} style={{ backgroundColor: '#faad14' }} />
                </Space>
              ),
              children: (
                <div>
                  {pendingAppointments.length === 0 ? (
                    <Empty description="No pending appointments" />
                  ) : (
                    <div>
                      <Alert
                        message="Pending Appointments"
                        description="These appointments are waiting for consultant confirmation. You will be notified once they are confirmed."
                        type="warning"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      {pendingAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                          showActions={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            },
            {
              key: 'completed',
              label: (
                <Space>
                  <CheckCircleOutlined />
                  Completed
                  <Badge count={completedAppointments.length} style={{ backgroundColor: '#52c41a' }} />
                </Space>
              ),
              children: (
                <div>
                  {completedAppointments.length === 0 ? (
                    <Empty description="No completed appointments" />
                  ) : (
                    <div>
                      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                        <Col span={12}>
                          <Progress 
                            percent={appointments.length > 0 ? Math.round((completedAppointments.length / appointments.length) * 100) : 0} 
                            status="success"
                            format={percent => `${completedAppointments.length}/${appointments.length} (${percent}%)`}
                          />
                        </Col>
                      </Row>
                      {completedAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                          showActions={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Available Consultants */}
      <Card 
        title={<Space><UserOutlined />Available Consultants<Badge count={sortedConsultants.length} style={{ backgroundColor: '#52c41a' }} /></Space>}
        extra={
          <Space>
            <Input.Search
              placeholder="Search consultants..."
              value={searchConsultant}
              onChange={e => setSearchConsultant(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={filterSpecialty}
              onChange={setFilterSpecialty}
              style={{ width: 150 }}
            >
              <Select.Option value="all">All Specialties</Select.Option>
              {/* Map specialties from consultants */}
              {[...new Set(consultants.map(c => c.expertise).filter(Boolean))].map(s => (
                <Select.Option key={s} value={s}>{s}</Select.Option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
            >
              <Select.Option value="rating">Top Rated</Select.Option>
              <Select.Option value="name">Name A-Z</Select.Option>
            </Select>
          </Space>
        }
        style={{ borderRadius: '12px', marginBottom: 24 }}
      >
        {consultantsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /><div>Loading consultants...</div></div>
        ) : sortedConsultants.length === 0 ? (
          <Empty description={<>
            No consultants found<br/>
            <span style={{color:'#888',fontSize:'14px'}}>Hãy kiểm tra lại dữ liệu backend hoặc tắt filter/search.</span>
          </>} />
        ) : (
          <AntList
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
            dataSource={sortedConsultants}
            renderItem={consultant => (
              <AntList.Item>
                <Card
                  hoverable
                  style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
                  onClick={() => { setSelectedConsultant(consultant); setShowConsultantDrawer(true); }}
                >
                  <Space>
                    <Avatar size={48} src={consultant.avatar} icon={<UserOutlined />} />
                    <div>
                      <Text strong>{consultant.firstName} {consultant.lastName}</Text><br />
                      <Text type="secondary">{consultant.expertise || 'General'}</Text><br />
                      <Tag color="blue">{consultant.role?.name || 'CONSULTANT'}</Tag>
                    </div>
                  </Space>
                </Card>
              </AntList.Item>
            )}
          />
        )}
      </Card>

      {/* Consultant Detail Drawer */}
      <Drawer
        title={selectedConsultant ? `${selectedConsultant.firstName} ${selectedConsultant.lastName}` : 'Consultant Details'}
        open={showConsultantDrawer}
        onClose={() => setShowConsultantDrawer(false)}
        width={400}
      >
        {selectedConsultant && (
          <div>
            <Avatar size={64} src={selectedConsultant.avatar} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
            <Title level={4}>{selectedConsultant.firstName} {selectedConsultant.lastName}</Title>
            <Tag color="blue">{selectedConsultant.role?.name || 'CONSULTANT'}</Tag>
            <div><Text strong>Email:</Text> {selectedConsultant.email}</div>
            <div><Text strong>Specialty:</Text> {selectedConsultant.expertise || 'General'}</div>
            <div><Text strong>Phone:</Text> {selectedConsultant.phone || 'N/A'}</div>
            <div><Text strong>Role ID:</Text> {selectedConsultant.role?.id || 'N/A'}</div>
            <div><Text strong>Experience:</Text> {selectedConsultant.experience || 'N/A'}</div>
            <div><Text strong>Rating:</Text> {selectedConsultant.rating || 'N/A'}</div>
            <div><Text strong>Sessions:</Text> {selectedConsultant.totalSessions || 'N/A'}</div>
            <Divider />
            <Button type="primary" block onClick={() => { setShowConsultantDrawer(false); setSelectedConsultant(selectedConsultant); setShowBookingModal(true); }}>Book Session</Button>
          </div>
        )}
      </Drawer>

      {/* Booking Modal */}
      <Modal
        title={bookingStep === 0 ? 'Select Consultant' : bookingStep === 1 ? 'Select Date & Time' : 'Confirm Booking'}
        open={showBookingModal}
        onCancel={() => setShowBookingModal(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={bookingForm} layout="vertical">
          {bookingStep === 0 && (
            <>
              <AntList
                dataSource={sortedConsultants}
                renderItem={consultant => (
                  <AntList.Item>
                    <Card
                      hoverable
                      onClick={() => { setSelectedConsultant(consultant); setBookingStep(1); }}
                      style={{ borderRadius: 8, marginBottom: 8 }}
                    >
                      <Space>
                        <Avatar src={consultant.avatar} icon={<UserOutlined />} />
                        <div>
                          <Text strong>{consultant.firstName} {consultant.lastName}</Text><br />
                          <Text type="secondary">{consultant.expertise || 'General'}</Text>
                        </div>
                      </Space>
                    </Card>
                  </AntList.Item>
                )}
              />
            </>
          )}
          {bookingStep === 1 && selectedConsultant && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Consultant:</Text> {selectedConsultant.firstName} {selectedConsultant.lastName}
              </div>
              <Form.Item label="Date" name="date" required>
                <DatePicker style={{ width: '100%' }} onChange={setBookingDate} />
              </Form.Item>
              <Form.Item label="Time" name="time" required>
                <TimePicker style={{ width: '100%' }} format="HH:mm" onChange={setBookingTime} />
              </Form.Item>
              <Form.Item label="Notes" name="notes">
                <Input.TextArea rows={2} placeholder="Any notes for the consultant?" />
              </Form.Item>
              <Button type="primary" block onClick={() => setBookingStep(2)} disabled={!bookingDate || !bookingTime}>Next</Button>
              <Button block style={{ marginTop: 8 }} onClick={() => setBookingStep(0)}>Back</Button>
            </>
          )}
          {bookingStep === 2 && selectedConsultant && (
            <>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Consultant:</Text> {selectedConsultant.firstName} {selectedConsultant.lastName}<br />
                <Text strong>Date:</Text> {bookingDate ? bookingDate.format('YYYY-MM-DD') : ''}<br />
                <Text strong>Time:</Text> {bookingTime ? bookingTime.format('HH:mm') : ''}
              </div>
              <Form.Item label="Notes" name="notes">
                <Input.TextArea rows={2} placeholder="Any notes for the consultant?" />
              </Form.Item>
              <Button type="primary" block loading={bookingLoading} onClick={handleBookSession}>Confirm & Book</Button>
              <Button block style={{ marginTop: 8 }} onClick={() => setBookingStep(1)}>Back</Button>
            </>
          )}
        </Form>
      </Modal>

      {/* Today's Appointments Alert */}
      {todayAppointments.length > 0 && (
        <Card 
          style={{ 
            marginTop: '24px', 
            borderRadius: '12px',
            border: '2px solid #52c41a',
            background: '#f6ffed'
          }}
        >
          <Alert
            message={`Today's Appointments (${todayAppointments.length})`}
            description={
              <div>
                <Text>You have {todayAppointments.length} appointment(s) today:</Text>
                <div style={{ marginTop: '8px' }}>
                  {todayAppointments.map(appointment => (
                    <Tag 
                      key={appointment.id} 
                      color={getStatusColor(appointment.status)}
                      style={{ marginBottom: '4px' }}
                    >
                      {dayjs(appointment.appointmentDate).format('HH:mm')} - {appointment.consultant?.firstName} {appointment.consultant?.lastName}
                    </Tag>
                  ))}
                </div>
              </div>
            }
            type="success"
            showIcon
            action={
              <Button 
                type="primary" 
                size="small"
                onClick={() => navigate('/appointments/calendar')}
              >
                View Calendar
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default AppointmentDashboard; 