import React from 'react';
import { Card, Tag, Space, Button, Avatar, Typography, Badge } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const AppointmentCard = ({ appointment, showActions = true, compact = false }) => {
  const navigate = useNavigate();

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

  const getTimeUntilAppointment = (appointmentDate) => {
    const now = dayjs();
    const appointment = dayjs(appointmentDate);
    const diff = appointment.diff(now, 'hour');
    
    if (diff < 0) {
      return 'Đã qua';
    } else if (diff < 24) {
      return `${diff} giờ nữa`;
    } else {
      const days = Math.floor(diff / 24);
      return `${days} ngày nữa`;
    }
  };

  if (compact) {
    return (
      <Card 
        size="small" 
        hoverable
        style={{ marginBottom: '8px' }}
        onClick={() => navigate(`/appointments/${appointment.id}`)}
      >
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <div>
              <Text strong>{appointment.consultant?.firstName} {appointment.consultant?.lastName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {dayjs(appointment.appointmentDate).format('DD/MM HH:mm')}
              </Text>
            </div>
          </Space>
          <Badge 
            status={appointment.status === 'COMPLETED' ? 'success' : 
                   appointment.status === 'CANCELLED' ? 'error' : 'processing'} 
            text={
              <Tag color={getStatusColor(appointment.status)} size="small">
                {getStatusText(appointment.status)}
              </Tag>
            }
          />
        </Space>
      </Card>
    );
  }

  return (
    <Card 
      hoverable
      style={{ 
        marginBottom: '16px',
        borderRadius: '12px',
        border: appointment.status === 'CONFIRMED' ? '2px solid #1890ff' : '1px solid #f0f0f0'
      }}
      actions={showActions ? [
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/appointments/${appointment.id}`)}
        >
          Xem chi tiết
        </Button>
      ] : undefined}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
        <Avatar 
          size={48} 
          icon={<UserOutlined />}
          style={{ marginRight: '12px', background: '#1890ff' }}
        />
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: 0, marginBottom: '4px' }}>
            {appointment.consultant?.firstName} {appointment.consultant?.lastName}
          </Title>
          <Space size="small" style={{ marginBottom: '8px' }}>
            <Tag color="blue">{appointment.consultant?.expertise || 'Tư vấn chung'}</Tag>
            <Tag color={getStatusColor(appointment.status)}>
              {getStatusText(appointment.status)}
            </Tag>
          </Space>
        </div>
      </div>

      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space>
          <CalendarOutlined style={{ color: '#666' }} />
          <Text>{dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}</Text>
        </Space>
        
        <Space>
          <ClockCircleOutlined style={{ color: '#666' }} />
          <Text>{dayjs(appointment.appointmentDate).format('HH:mm')}</Text>
          <Text type="secondary">({getTimeUntilAppointment(appointment.appointmentDate)})</Text>
        </Space>
        
        <Space>
          {getAppointmentTypeIcon(appointment.appointmentType)}
          <Text>{getAppointmentTypeText(appointment.appointmentType)}</Text>
        </Space>
        
        {appointment.clientNotes && (
          <div>
            <Text type="secondary">Ghi chú: {appointment.clientNotes}</Text>
          </div>
        )}
      </Space>

      {appointment.status === 'CONFIRMED' && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          background: '#f6ffed', 
          borderRadius: '6px',
          border: '1px solid #b7eb8f'
        }}>
          <Text type="success" style={{ fontSize: '12px' }}>
            ⏰ Buổi tư vấn sẽ bắt đầu trong {getTimeUntilAppointment(appointment.appointmentDate)}
          </Text>
        </div>
      )}

      {appointment.status === 'PENDING' && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          background: '#fff7e6', 
          borderRadius: '6px',
          border: '1px solid #ffd591'
        }}>
          <Text type="warning" style={{ fontSize: '12px' }}>
            ⏳ Đang chờ tư vấn viên xác nhận lịch hẹn
          </Text>
        </div>
      )}

      {appointment.status === 'COMPLETED' && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          background: '#f6ffed', 
          borderRadius: '6px',
          border: '1px solid #b7eb8f'
        }}>
          <Text type="success" style={{ fontSize: '12px' }}>
            ✅ Buổi tư vấn đã hoàn thành
          </Text>
        </div>
      )}
    </Card>
  );
};

export default AppointmentCard; 