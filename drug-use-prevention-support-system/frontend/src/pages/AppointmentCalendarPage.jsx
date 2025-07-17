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
  Progress
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
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import authService from '../services/authService';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AppointmentCard from '../components/AppointmentCard';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const AppointmentCalendarPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadAppointments();
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

  const cancelledAppointments = appointments.filter(apt => 
    apt.status === 'CANCELLED'
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

  const thisMonthAppointments = appointments.filter(apt => {
    const aptDate = dayjs(apt.appointmentDate);
    const startOfMonth = dayjs().startOf('month');
    const endOfMonth = dayjs().endOf('month');
    return aptDate.isAfter(startOfMonth) && aptDate.isBefore(endOfMonth);
  });

  const handleAppointmentClick = () => {
    loadAppointments();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const selectedDateStr = date.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(apt => 
      dayjs(apt.appointmentDate).format('YYYY-MM-DD') === selectedDateStr
    );
    
    if (dayAppointments.length > 0) {
      message.info(`${dayAppointments.length} appointment(s) on ${date.format('DD/MM/YYYY')}`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>Loading your appointments...</div>
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
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📅</div>
          <Title level={1} style={{ color: '#fff', marginBottom: '16px', fontSize: '2.5rem' }}>
            Appointment Calendar
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '32px', opacity: 0.9 }}>
            Manage and view all your consultation appointments
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
                title="This Month" 
                value={thisMonthAppointments.length} 
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
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Today's Appointments" 
              value={todayAppointments.length} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="This Week" 
              value={thisWeekAppointments.length} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Pending" 
              value={pendingAppointments.length} 
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Success Rate" 
              value={appointments.length > 0 ? Math.round((completedAppointments.length / appointments.length) * 100) : 0} 
              suffix="%" 
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            <span>Your Appointments</span>
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
              icon={<UnorderedListOutlined />}
              onClick={() => navigate('/appointments/list')}
            >
              View List
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
                      onAppointmentClick={handleAppointmentClick}
                      onDateSelect={handleDateSelect}
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
            },
            {
              key: 'cancelled',
              label: (
                <Space>
                  <ExclamationCircleOutlined />
                  Cancelled
                  <Badge count={cancelledAppointments.length} style={{ backgroundColor: '#ff4d4f' }} />
                </Space>
              ),
              children: (
                <div>
                  {cancelledAppointments.length === 0 ? (
                    <Empty description="No cancelled appointments" />
                  ) : (
                    <div>
                      <Alert
                        message="Cancelled Appointments"
                        description="These appointments have been cancelled. You can book new appointments at any time."
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      {cancelledAppointments.map(appointment => (
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

      {/* Quick Tips */}
      <Card 
        title="💡 Tips for Managing Appointments" 
        style={{ marginTop: '24px', borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="📅 Calendar View">
              <Text type="secondary">
                Use the calendar view to see all your appointments at a glance. Click on any appointment to view details.
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="⏰ Reminders">
              <Text type="secondary">
                You'll receive notifications before your appointments. Make sure to check your email and notifications.
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card size="small" title="🔄 Rescheduling">
              <Text type="secondary">
                Need to change your appointment? You can reschedule up to 24 hours before the scheduled time.
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AppointmentCalendarPage; 