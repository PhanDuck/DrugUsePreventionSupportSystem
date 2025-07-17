import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space, Badge, Tag } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  TeamOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const AppointmentStats = ({ appointments = [] }) => {
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'CONFIRMED' && dayjs(apt.appointmentDate).isAfter(dayjs())
  );
  const pendingAppointments = appointments.filter(apt => apt.status === 'PENDING');
  const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED');
  const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED');
  
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

  const successRate = totalAppointments > 0 ? Math.round((completedAppointments.length / totalAppointments) * 100) : 0;
  const completionRate = totalAppointments > 0 ? Math.round(((completedAppointments.length + cancelledAppointments.length) / totalAppointments) * 100) : 0;

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

  return (
    <div>
      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Total Appointments" 
              value={totalAppointments} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Upcoming" 
              value={upcomingAppointments.length} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Completed" 
              value={completedAppointments.length} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Success Rate" 
              value={successRate} 
              suffix="%" 
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Time-based Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="Today's Appointments" 
              value={todayAppointments.length} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            {todayAppointments.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary">
                  {todayAppointments.filter(apt => apt.status === 'CONFIRMED').length} confirmed
                </Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="This Week" 
              value={thisWeekAppointments.length} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                {thisWeekAppointments.filter(apt => apt.status === 'CONFIRMED').length} confirmed
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
            <Statistic 
              title="This Month" 
              value={thisMonthAppointments.length} 
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                {thisMonthAppointments.filter(apt => apt.status === 'CONFIRMED').length} confirmed
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Status Breakdown */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="📊 Status Breakdown" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="16" style={{ width: '100%' }}>
              <div>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text>Pending</Text>
                  <Badge count={pendingAppointments.length} style={{ backgroundColor: '#faad14' }} />
                </Space>
                <Progress 
                  percent={totalAppointments > 0 ? Math.round((pendingAppointments.length / totalAppointments) * 100) : 0} 
                  strokeColor="#faad14"
                  size="small"
                />
              </div>
              
              <div>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text>Confirmed</Text>
                  <Badge count={upcomingAppointments.length} style={{ backgroundColor: '#1890ff' }} />
                </Space>
                <Progress 
                  percent={totalAppointments > 0 ? Math.round((upcomingAppointments.length / totalAppointments) * 100) : 0} 
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
              
              <div>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text>Completed</Text>
                  <Badge count={completedAppointments.length} style={{ backgroundColor: '#52c41a' }} />
                </Space>
                <Progress 
                  percent={totalAppointments > 0 ? Math.round((completedAppointments.length / totalAppointments) * 100) : 0} 
                  strokeColor="#52c41a"
                  size="small"
                />
              </div>
              
              <div>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text>Cancelled</Text>
                  <Badge count={cancelledAppointments.length} style={{ backgroundColor: '#ff4d4f' }} />
                </Space>
                <Progress 
                  percent={totalAppointments > 0 ? Math.round((cancelledAppointments.length / totalAppointments) * 100) : 0} 
                  strokeColor="#ff4d4f"
                  size="small"
                />
              </div>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="📈 Performance Metrics" style={{ borderRadius: '12px' }}>
            <Space direction="vertical" size="16" style={{ width: '100%' }}>
              <div>
                <Text strong>Success Rate</Text>
                <Progress 
                  percent={successRate} 
                  status="success"
                  format={percent => `${completedAppointments.length}/${totalAppointments} (${percent}%)`}
                />
              </div>
              
              <div>
                <Text strong>Completion Rate</Text>
                <Progress 
                  percent={completionRate} 
                  status="normal"
                  format={percent => `${completedAppointments.length + cancelledAppointments.length}/${totalAppointments} (${percent}%)`}
                />
              </div>
              
              <div>
                <Text strong>Active Appointments</Text>
                <Progress 
                  percent={totalAppointments > 0 ? Math.round(((pendingAppointments.length + upcomingAppointments.length) / totalAppointments) * 100) : 0} 
                  status="active"
                  format={percent => `${pendingAppointments.length + upcomingAppointments.length}/${totalAppointments} (${percent}%)`}
                />
              </div>
              
              <div>
                <Text strong>Average Response Time</Text>
                <div style={{ padding: '8px', background: '#f6ffed', borderRadius: '6px' }}>
                  <Text type="success">Within 2 hours</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card title="📅 Recent Activity" style={{ borderRadius: '12px' }}>
        {appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Text type="secondary">No appointments yet. Book your first consultation!</Text>
          </div>
        ) : (
          <div>
            {appointments.slice(0, 5).map((appointment, index) => (
              <div 
                key={appointment.id} 
                style={{ 
                  padding: '12px', 
                  borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space>
                  <UserOutlined style={{ color: '#1890ff' }} />
                  <div>
                    <Text strong>{appointment.consultant?.firstName} {appointment.consultant?.lastName}</Text>
                    <br />
                    <Text type="secondary">
                      {dayjs(appointment.appointmentDate).format('DD/MM/YYYY HH:mm')}
                    </Text>
                  </div>
                </Space>
                <Tag color={getStatusColor(appointment.status)}>
                  {getStatusText(appointment.status)}
                </Tag>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AppointmentStats; 