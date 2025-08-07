import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  message, 
  Modal,
  Form,
  Input,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Popconfirm,
  Avatar,
  Divider,
  Alert,
  Timeline,
  Descriptions,
  InputNumber
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  VideoCameraOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PhoneOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import api from '../../config/axios';
import authService from '../../services/authService';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [notesForm] = Form.useForm();
  const [meetingLinkForm] = Form.useForm();
  const [feeForm] = Form.useForm();
  const [consultationFee, setConsultationFee] = useState(100000);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    todayAppointments: 0
  });

  useEffect(() => {
    checkAuthentication();
    loadDashboardData();
    loadConsultationFee();
  }, []);

  const checkAuthentication = () => {
    const user = authService.getCurrentUser();
    const userRole = authService.getUserRole(); // Use authService method instead
    if (!user || userRole !== 'CONSULTANT') {
      message.error('Access denied. Consultant role required.');
      navigate('/unauthorized');
      return;
    }
    setCurrentUser(user);
  };

  const loadConsultationFee = async () => {
    try {
      const user = authService.getCurrentUser();
      const response = await userService.getUserProfile(user.id);
      if (response.success && response.data.consultationFee) {
        setConsultationFee(response.data.consultationFee);
      }
    } catch (error) {
      console.error('Error loading consultation fee:', error);
    }
  };

  const handleUpdateConsultationFee = async (values) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      const updateData = {
        consultationFee: values.consultationFee
      };
      
      const response = await userService.updateUserProfile(updateData);
      
      if (response.success) {
        setConsultationFee(values.consultationFee);
        setShowFeeModal(false);
        message.success('Consultation fee updated successfully!');
        feeForm.resetFields();
      } else {
        message.error(response.message || 'Failed to update consultation fee');
      }
    } catch (error) {
      console.error('Error updating consultation fee:', error);
      message.error('Unable to update consultation fee');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      // Load pending appointments
      const pendingResponse = await api.get(`/appointments/pending?consultantId=${user.id}`);
      if (pendingResponse.data) {
        setPendingAppointments(pendingResponse.data);
      }

      // Load all consultant appointments
      const appointmentsResponse = await api.get(`/appointments/consultant/${user.id}`);
      if (appointmentsResponse.data) {
        setAppointments(appointmentsResponse.data);
        calculateStats(appointmentsResponse.data);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appointmentsList) => {
    const today = dayjs().format('YYYY-MM-DD');
    const stats = {
      total: appointmentsList.length,
      pending: appointmentsList.filter(apt => apt.status === 'PENDING').length,
      confirmed: appointmentsList.filter(apt => apt.status === 'CONFIRMED').length,
      completed: appointmentsList.filter(apt => apt.status === 'COMPLETED').length,
      todayAppointments: appointmentsList.filter(apt => 
        dayjs(apt.appointmentDate).format('YYYY-MM-DD') === today
      ).length
    };
    setStats(stats);
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      await api.put(`/appointments/${appointmentId}/confirm`, null, {
        params: { consultantId: user.id }
      });
      
      message.success('Appointment confirmed successfully');
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error confirming appointment:', error);
      message.error(error.response?.data?.error || 'Failed to confirm appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId, reason) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      await api.put(`/appointments/${appointmentId}/cancel`, null, {
        params: { 
          userId: user.id,
          reason: reason || 'Cancelled by consultant'
        }
      });
      
      message.success('Appointment cancelled successfully');
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      message.error(error.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (appointmentId) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      await api.put(`/appointments/${appointmentId}/mark-paid`, null, {
        params: { consultantId: user.id }
      });
      
      message.success('Payment status updated successfully');
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error updating payment status:', error);
      message.error(error.response?.data?.error || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (values) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      await api.put(`/appointments/${selectedAppointment.id}/complete`, null, {
        params: { 
          consultantId: user.id,
          notes: values.consultantNotes
        }
      });
      
      message.success('Appointment completed successfully');
      setShowNotesModal(false);
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Error completing appointment:', error);
      message.error(error.response?.data?.error || 'Failed to complete appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleMeetingLinkSubmit = async (values) => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      const { meetingLink } = values;
      
      let result;
      if (selectedAppointment.meetingLink) {
        // Update existing link
        result = await appointmentService.updateMeetingLink(
          selectedAppointment.id, 
          user.id, 
          meetingLink
        );
      } else {
        // Add new link
        result = await appointmentService.addMeetingLink(
          selectedAppointment.id, 
          user.id, 
          meetingLink
        );
      }
      
      if (result.success) {
        message.success(result.message);
        setShowMeetingLinkModal(false);
        meetingLinkForm.resetFields();
        loadDashboardData(); // Reload data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error managing meeting link:', error);
      message.error('Failed to save meeting link');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMeetingLink = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      const result = await appointmentService.removeMeetingLink(
        selectedAppointment.id, 
        user.id
      );
      
      if (result.success) {
        message.success(result.message);
        setShowMeetingLinkModal(false);
        loadDashboardData(); // Reload data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error removing meeting link:', error);
      message.error('Failed to remove meeting link');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'orange',
      'CONFIRMED': 'blue',
      'COMPLETED': 'green',
      'CANCELLED': 'red'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': <ClockCircleOutlined />,
      'CONFIRMED': <CheckCircleOutlined />,
      'COMPLETED': <CheckCircleOutlined />,
      'CANCELLED': <CloseCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const appointmentColumns = [
    {
      title: 'Client',
      key: 'client',
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <Text strong>{record.clientName || 'Unknown Client'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.clientEmail}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <Text strong>{dayjs(record.appointmentDate).format('MMM DD, YYYY')}</Text>
          <br />
          <Text type="secondary">{dayjs(record.appointmentDate).format('HH:mm')}</Text>
        </div>
      )
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag icon={record.appointmentType === 'ONLINE' ? <VideoCameraOutlined /> : <EnvironmentOutlined />}>
          {record.appointmentType}
        </Tag>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'durationMinutes',
      key: 'duration',
      render: (duration) => `${duration} min`
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
          {record.status}
        </Tag>
      )
    },
    {
      title: 'Fee',
      key: 'fee',
      render: (_, record) => (
        <div>
          <Text strong>${record.fee}</Text>
          <br />
          <Tag color={record.paymentStatus === 'PAID' ? 'green' : 'orange'} size="small">
            {record.paymentStatus}
          </Tag>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedAppointment(record);
                setShowDetailsModal(true);
              }}
            />
          </Tooltip>
          
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Confirm">
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleConfirmAppointment(record.id)}
                  loading={loading}
                />
              </Tooltip>
              <Popconfirm
                title="Cancel Appointment"
                description="Are you sure you want to cancel this appointment?"
                onConfirm={() => handleCancelAppointment(record.id)}
                okText="Yes, Cancel"
                cancelText="No"
              >
                <Button 
                  danger 
                  size="small" 
                  icon={<CloseCircleOutlined />}
                  loading={loading}
                />
              </Popconfirm>
            </>
          )}
          
          {record.paymentStatus === 'UNPAID' && (
            <Tooltip title="Mark as Paid">
              <Button 
                type="primary"
                size="small" 
                icon={<DollarOutlined />}
                onClick={() => handleMarkAsPaid(record.id)}
                loading={loading}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              />
            </Tooltip>
          )}
          
          {(record.status === 'CONFIRMED' || record.status === 'PENDING') && record.appointmentType === 'ONLINE' && (
            <Tooltip title={record.meetingLink ? "Edit Meeting Link" : "Add Meeting Link"}>
              <Button 
                size="small" 
                icon={<LinkOutlined />}
                onClick={() => {
                  setSelectedAppointment(record);
                  meetingLinkForm.setFieldsValue({ 
                    meetingLink: record.meetingLink || '' 
                  });
                  setShowMeetingLinkModal(true);
                }}
                style={{ 
                  color: record.meetingLink ? '#52c41a' : '#1890ff',
                  borderColor: record.meetingLink ? '#52c41a' : '#1890ff'
                }}
              />
            </Tooltip>
          )}
          
          {record.status === 'CONFIRMED' && (
            <Tooltip title="Mark Complete">
              <Button 
                type="primary" 
                size="small" 
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedAppointment(record);
                  setShowNotesModal(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>
          <CalendarOutlined /> Consultant Dashboard
        </Title>
        <Text type="secondary">
          Manage your appointments and client consultations
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {[
          { title: "Total Appointments", value: stats.total, icon: <CalendarOutlined />, color: "#1890ff" },
          { title: "Pending", value: stats.pending, icon: <ClockCircleOutlined />, color: "#faad14" },
          { title: "Confirmed", value: stats.confirmed, icon: <CheckCircleOutlined />, color: "#52c41a" },
          { title: "Today's Sessions", value: stats.todayAppointments, icon: <CalendarOutlined />, color: "#722ed1" }
        ].map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={React.cloneElement(stat.icon, { style: { color: stat.color } })}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Consultation Fee Management */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card 
            title={
              <span>
                <DollarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                Consultation Fee Management
              </span>
            }
            extra={
              <Button 
                type="primary" 
                icon={<SettingOutlined />}
                onClick={() => {
                  feeForm.setFieldsValue({ consultationFee: consultationFee });
                  setShowFeeModal(true);
                }}
              >
                Update Fee
              </Button>
            }
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12}>
                <Statistic
                  title="Current Consultation Fee"
                  value={consultationFee}
                  suffix="VNĐ"
                  precision={0}
                  prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a', fontSize: '28px' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ textAlign: 'left' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    💡 <strong>Pricing Tips:</strong>
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    • Standard rate: 100,000 - 200,000 VNĐ/hour<br/>
                    • Premium specialists: 200,000 - 500,000 VNĐ/hour<br/>
                    • Update anytime to match your expertise
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Pending Appointments Alert */}
      {pendingAppointments.length > 0 && (
        <Alert
          message="Pending Appointments Require Action"
          description={`You have ${pendingAppointments.length} appointment(s) waiting for confirmation.`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" type="primary">
              Review Now
            </Button>
          }
        />
      )}

      {/* Appointments Table */}
      <Card title="All Appointments" style={{ marginBottom: '24px' }}>
        <Table
          columns={appointmentColumns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} appointments`
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Appointment Details Modal */}
      <Modal
        title="Appointment Details"
        open={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        footer={null}
        width={600}
      >
        {selectedAppointment && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="Client Information">
                  <Space direction="vertical" size="small">
                    <Text><UserOutlined /> {selectedAppointment.clientName}</Text>
                    <Text><MailOutlined /> {selectedAppointment.clientEmail}</Text>
                    <Text><PhoneOutlined /> {selectedAppointment.clientPhone || 'N/A'}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Appointment Info">
                  <Space direction="vertical" size="small">
                    <Text><CalendarOutlined /> {dayjs(selectedAppointment.appointmentDate).format('MMMM DD, YYYY HH:mm')}</Text>
                    <Text><ClockCircleOutlined /> {selectedAppointment.durationMinutes} minutes</Text>
                    <Tag color={getStatusColor(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Tag>
                  </Space>
                </Card>
              </Col>
            </Row>
            
            {selectedAppointment.clientNotes && (
              <Card size="small" title="Client Notes" style={{ marginTop: '16px' }}>
                <Text>{selectedAppointment.clientNotes}</Text>
              </Card>
            )}
            
            {selectedAppointment.consultantNotes && (
              <Card size="small" title="Consultant Notes" style={{ marginTop: '16px' }}>
                <Text>{selectedAppointment.consultantNotes}</Text>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* Complete Appointment Modal */}
      <Modal
        title="Complete Appointment"
        open={showNotesModal}
        onCancel={() => setShowNotesModal(false)}
        onOk={() => notesForm.submit()}
        confirmLoading={loading}
      >
        <Form
          form={notesForm}
          layout="vertical"
          onFinish={handleCompleteAppointment}
        >
          <Form.Item
            label="Session Notes"
            name="consultantNotes"
            rules={[{ required: true, message: 'Please add session notes' }]}
          >
            <TextArea
              rows={4}
              placeholder="Add notes about the session, recommendations, follow-up actions..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Meeting Link Management Modal */}
      <Modal
        title={
          <Space>
            <LinkOutlined />
            {selectedAppointment?.meetingLink ? 'Edit Meeting Link' : 'Add Meeting Link'}
          </Space>
        }
        open={showMeetingLinkModal}
        onCancel={() => {
          setShowMeetingLinkModal(false);
          meetingLinkForm.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => setShowMeetingLinkModal(false)}>
            Cancel
          </Button>,
          selectedAppointment?.meetingLink && (
            <Popconfirm
              key="remove"
              title="Remove Meeting Link"
              description="Are you sure you want to remove the meeting link?"
              onConfirm={handleRemoveMeetingLink}
              okText="Remove"
              okType="danger"
              cancelText="Cancel"
            >
              <Button danger loading={loading}>
                Remove Link
              </Button>
            </Popconfirm>
          ),
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => meetingLinkForm.submit()}
            loading={loading}
          >
            {selectedAppointment?.meetingLink ? 'Update Link' : 'Add Link'}
          </Button>
        ]}
        width={600}
      >
        <div style={{ marginBottom: '16px' }}>
          <Alert
            message="Meeting Link Information"
            description="Add or edit the Google Meet link for this online consultation. Clients will be able to join the meeting using this link."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          {selectedAppointment && (
            <Descriptions size="small" column={1} bordered style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="Client">
                {selectedAppointment.clientName}
              </Descriptions.Item>
              <Descriptions.Item label="Date & Time">
                {dayjs(selectedAppointment.appointmentDate).format('MMMM DD, YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedAppointment.status)}>
                  {selectedAppointment.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>

        <Form
          form={meetingLinkForm}
          layout="vertical"
          onFinish={handleMeetingLinkSubmit}
        >
          <Form.Item
            name="meetingLink"
            label="Google Meet Link"
            rules={[
              { required: true, message: 'Please enter the meeting link' },
              { type: 'url', message: 'Please enter a valid URL' },
              {
                pattern: /^https:\/\/meet\.google\.com\/.+/,
                message: 'Please enter a valid Google Meet link (https://meet.google.com/...)'
              }
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              prefix={<LinkOutlined />}
            />
          </Form.Item>
          
          <Form.Item>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              💡 Tip: Create a new Google Meet link in your calendar or directly at meet.google.com/new
            </Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* Consultation Fee Update Modal */}
      <Modal
        title={
          <span>
            <DollarOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            Update Consultation Fee
          </span>
        }
        open={showFeeModal}
        onCancel={() => {
          setShowFeeModal(false);
          feeForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={feeForm}
          layout="vertical"
          onFinish={handleUpdateConsultationFee}
          initialValues={{ consultationFee: consultationFee }}
        >
          <Alert
            message="Set Your Consultation Fee"
            description="This will be the hourly rate displayed to clients when they book appointments with you."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Form.Item
            label="Consultation Fee (per hour)"
            name="consultationFee"
            rules={[
              { required: true, message: 'Please enter your consultation fee' },
              { type: 'number', min: 10000, max: 1000000, message: 'Fee must be between 10,000 and 1,000,000 VNĐ' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter fee amount"
              suffix="VNĐ"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              size="large"
              min={10000}
              max={1000000}
              step={10000}
            />
          </Form.Item>

          <div style={{ marginBottom: '16px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <strong>Pricing Guidelines:</strong><br/>
              • 🥉 Basic: 50,000 - 100,000 VNĐ/hour<br/>
              • 🥈 Standard: 100,000 - 200,000 VNĐ/hour<br/>
              • 🥇 Premium: 200,000 - 500,000 VNĐ/hour<br/>
              • 💎 Expert: 500,000+ VNĐ/hour
            </Text>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={() => {
                  setShowFeeModal(false);
                  feeForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Fee
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsultantDashboard; 