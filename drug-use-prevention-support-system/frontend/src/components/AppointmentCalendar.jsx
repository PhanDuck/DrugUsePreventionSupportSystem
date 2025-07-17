import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Typography, Space, Button, Modal, Tag, Avatar, Tooltip, message } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import appointmentService from '../services/appointmentService';

const { Text, Title } = Typography;

const AppointmentCalendar = ({ appointments = [], onAppointmentClick, onEditAppointment, onDeleteAppointment }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
    return type === 'ONLINE' ? 'Online' : 'In-person';
  };

  const getDateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(apt => 
      dayjs(apt.appointmentDate).format('YYYY-MM-DD') === date
    );

    return (
      <div style={{ height: '100%', padding: '4px' }}>
        {dayAppointments.map((appointment, index) => (
          <Tooltip
            key={appointment.id}
            title={
              <div>
                <div><strong>{appointment.consultant?.firstName} {appointment.consultant?.lastName}</strong></div>
                <div>{dayjs(appointment.appointmentDate).format('HH:mm')}</div>
                <div>{getAppointmentTypeText(appointment.appointmentType)}</div>
                <div>{getStatusText(appointment.status)}</div>
              </div>
            }
          >
            <Badge
              key={appointment.id}
              color={getStatusColor(appointment.status)}
              text={
                <div
                  style={{
                    fontSize: '10px',
                    padding: '2px 4px',
                    margin: '1px 0',
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(appointment.status) === 'green' ? '#f6ffed' :
                                   getStatusColor(appointment.status) === 'blue' ? '#e6f7ff' :
                                   getStatusColor(appointment.status) === 'orange' ? '#fff7e6' :
                                   getStatusColor(appointment.status) === 'red' ? '#fff2f0' : '#f5f5f5',
                    border: `1px solid ${getStatusColor(appointment.status) === 'green' ? '#b7eb8f' :
                               getStatusColor(appointment.status) === 'blue' ? '#91d5ff' :
                               getStatusColor(appointment.status) === 'orange' ? '#ffd591' :
                               getStatusColor(appointment.status) === 'red' ? '#ffccc7' : '#d9d9d9'}`,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <Space size={2}>
                    {getAppointmentTypeIcon(appointment.appointmentType)}
                    <span style={{ fontSize: '9px' }}>
                      {dayjs(appointment.appointmentDate).format('HH:mm')}
                    </span>
                  </Space>
                </div>
              }
            />
          </Tooltip>
        ))}
      </div>
    );
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleDateSelect = (value) => {
    setSelectedDate(value);
    const date = value.format('YYYY-MM-DD');
    const dayAppointments = appointments.filter(apt => 
      dayjs(apt.appointmentDate).format('YYYY-MM-DD') === date
    );
    
    if (dayAppointments.length > 0) {
      // Show appointments for selected date
      console.log('Appointments for', date, dayAppointments);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const response = await appointmentService.cancelAppointment(appointmentId, currentUser.id, 'Cancelled via calendar');
      
      if (response.success) {
        message.success('Appointment cancelled successfully');
        setShowDetailModal(false);
        // Refresh appointments
        if (onAppointmentClick) {
          onAppointmentClick();
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      message.error('Unable to cancel appointment');
    }
  };

  const getMonthCellRender = (value) => {
    const month = value.format('YYYY-MM');
    const monthAppointments = appointments.filter(apt => 
      dayjs(apt.appointmentDate).format('YYYY-MM') === month
    );

    if (monthAppointments.length === 0) {
      return null;
    }

    return (
      <div style={{ textAlign: 'center', padding: '8px' }}>
        <Badge count={monthAppointments.length} style={{ backgroundColor: '#52c41a' }}>
          <CalendarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
        </Badge>
      </div>
    );
  };

  return (
    <div>
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            <span>Appointment Calendar</span>
            <Badge count={appointments.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              size="small"
              onClick={() => navigate('/appointments')}
            >
              Book New Appointment
            </Button>
            <Button 
              size="small"
              onClick={() => navigate('/appointments/list')}
            >
              View List
            </Button>
          </Space>
        }
        style={{ borderRadius: '12px' }}
      >
        <Calendar
          fullscreen={true}
          dateCellRender={getDateCellRender}
          monthCellRender={getMonthCellRender}
          onSelect={handleDateSelect}
          headerRender={({ value, onChange }) => {
            const start = 0;
            const current = value.month();
            const months = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];

            return (
              <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  size="small"
                  onClick={() => {
                    const now = value.clone().month(current - 1);
                    onChange(now);
                  }}
                >
                  Previous
                </Button>
                <Title level={4} style={{ margin: 0 }}>
                  {months[current]} {value.year()}
                </Title>
                <Button
                  size="small"
                  onClick={() => {
                    const now = value.clone().month(current + 1);
                    onChange(now);
                  }}
                >
                  Next
                </Button>
              </div>
            );
          }}
        />
      </Card>

      {/* Appointment Detail Modal */}
      <Modal
        title={
          <Space>
            <CalendarOutlined />
            <span>Appointment Details</span>
          </Space>
        }
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="back" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>,
          <Button 
            key="view" 
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setShowDetailModal(false);
              navigate(`/appointments/${selectedAppointment?.id}`);
            }}
          >
            View Full Details
          </Button>
        ]}
        width={600}
        destroyOnClose
      >
        {selectedAppointment && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />}
                style={{ marginBottom: '16px', background: '#1890ff' }}
              />
              <Title level={3}>{selectedAppointment.consultant?.firstName} {selectedAppointment.consultant?.lastName}</Title>
              <Tag color={getStatusColor(selectedAppointment.status)} size="large">
                {getStatusText(selectedAppointment.status)}
              </Tag>
            </div>

            <Space direction="vertical" size="16" style={{ width: '100%' }}>
              <Card size="small" title="📅 Appointment Information">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Date:</Text>
                    <br />
                    <Text>{dayjs(selectedAppointment.appointmentDate).format('dddd, DD/MM/YYYY')}</Text>
                  </div>
                  <div>
                    <Text strong>Time:</Text>
                    <br />
                    <Text>{dayjs(selectedAppointment.appointmentDate).format('HH:mm')}</Text>
                  </div>
                  <div>
                    <Text strong>Type:</Text>
                    <br />
                    <Space>
                      {getAppointmentTypeIcon(selectedAppointment.appointmentType)}
                      <Text>{getAppointmentTypeText(selectedAppointment.appointmentType)}</Text>
                    </Space>
                  </div>
                  <div>
                    <Text strong>Duration:</Text>
                    <br />
                    <Text>{selectedAppointment.durationMinutes || 60} minutes</Text>
                  </div>
                </Space>
              </Card>

              {selectedAppointment.clientNotes && (
                <Card size="small" title="📝 Notes">
                  <Text>{selectedAppointment.clientNotes}</Text>
                </Card>
              )}

              {selectedAppointment.status === 'PENDING' && (
                <Card size="small" title="⚠️ Actions" style={{ borderColor: '#faad14' }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="warning">
                      <ExclamationCircleOutlined /> This appointment is pending confirmation
                    </Text>
                    <Space>
                      <Button 
                        type="primary" 
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setShowDetailModal(false);
                          navigate(`/appointments/${selectedAppointment.id}`);
                        }}
                      >
                        Edit Appointment
                      </Button>
                      <Button 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Space>
                </Card>
              )}

              {selectedAppointment.status === 'CONFIRMED' && (
                <Card size="small" title="✅ Confirmed" style={{ borderColor: '#52c41a' }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="success">
                      <CheckCircleOutlined /> Your appointment has been confirmed
                    </Text>
                    <Text type="secondary">
                      Please be ready 5 minutes before the scheduled time
                    </Text>
                    <Space>
                      <Button 
                        type="primary" 
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setShowDetailModal(false);
                          navigate(`/appointments/${selectedAppointment.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleCancelAppointment(selectedAppointment.id)}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Space>
                </Card>
              )}

              {selectedAppointment.status === 'COMPLETED' && (
                <Card size="small" title="✅ Completed" style={{ borderColor: '#52c41a' }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text type="success">
                      <CheckCircleOutlined /> This consultation has been completed
                    </Text>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={() => {
                        setShowDetailModal(false);
                        navigate(`/appointments/${selectedAppointment.id}`);
                      }}
                    >
                      View Details & Review
                    </Button>
                  </Space>
                </Card>
              )}

              {selectedAppointment.status === 'CANCELLED' && (
                <Card size="small" title="❌ Cancelled" style={{ borderColor: '#ff4d4f' }}>
                  <Text type="danger">
                    This appointment has been cancelled
                  </Text>
                </Card>
              )}
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentCalendar; 