import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Avatar, 
  Button, 
  Tag, 
  Space, 
  Typography, 
  Badge,
  Tooltip,
  message 
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BellOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../config/axios';
import authService from '../services/authService';

const { Text } = Typography;

const AppointmentNotifications = ({ appointments = [], onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();
  
  // Filter for pending appointments that need attention
  const pendingAppointments = appointments.filter(apt => 
    apt.status === 'PENDING' && 
    dayjs(apt.appointmentDate).isAfter(dayjs())
  ).slice(0, 5); // Show max 5 notifications

  // Filter for today's confirmed appointments
  const todayAppointments = appointments.filter(apt => 
    apt.status === 'CONFIRMED' && 
    dayjs(apt.appointmentDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  );

  const handleQuickAction = async (appointmentId, action) => {
    try {
      setLoading(true);
      
      if (action === 'confirm') {
        await api.put(`/appointments/${appointmentId}/confirm`, null, {
          params: { consultantId: currentUser.id }
        });
        message.success('Appointment confirmed');
      } else if (action === 'cancel') {
        await api.put(`/appointments/${appointmentId}/cancel`, null, {
          params: { 
            userId: currentUser.id,
            reason: 'Quick cancel from notification'
          }
        });
        message.success('Appointment cancelled');
      }
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      message.error(`Failed to ${action} appointment`);
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== 'CONSULTANT') {
    // Show client notifications
    return (
      <Card 
        title={
          <Space>
            <BellOutlined />
            Upcoming Appointments
            <Badge count={todayAppointments.length} />
          </Space>
        }
        size="small"
        style={{ height: '100%' }}
      >
        {todayAppointments.length > 0 ? (
          <List
            size="small"
            dataSource={todayAppointments}
            renderItem={item => (
              <List.Item>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>{item.consultantName}</Text>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {dayjs(item.appointmentDate).format('HH:mm')}
                  </Text>
                  <Tag color="blue" size="small">{item.appointmentType}</Tag>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No appointments today</Text>
        )}
      </Card>
    );
  }

  // Show consultant notifications
  return (
    <Card 
      title={
        <Space>
          <BellOutlined />
          Pending Actions
          <Badge count={pendingAppointments.length} />
        </Space>
      }
      size="small"
      style={{ height: '100%' }}
    >
      {pendingAppointments.length > 0 ? (
        <List
          size="small"
          dataSource={pendingAppointments}
          renderItem={item => (
            <List.Item
              actions={[
                <Tooltip title="Confirm">
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<CheckCircleOutlined />}
                    loading={loading}
                    onClick={() => handleQuickAction(item.id, 'confirm')}
                  />
                </Tooltip>,
                <Tooltip title="Cancel">
                  <Button 
                    danger 
                    size="small" 
                    icon={<CloseCircleOutlined />}
                    loading={loading}
                    onClick={() => handleQuickAction(item.id, 'cancel')}
                  />
                </Tooltip>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar size="small" icon={<UserOutlined />} />}
                title={<Text style={{ fontSize: '13px' }}>{item.clientName || 'New Client'}</Text>}
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <CalendarOutlined /> {dayjs(item.appointmentDate).format('MMM DD, HH:mm')}
                    </Text>
                    <br />
                    <Tag size="small" color="orange">Pending</Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
          <br />
          <Text type="secondary">All caught up!</Text>
        </div>
      )}
    </Card>
  );
};

export default AppointmentNotifications; 