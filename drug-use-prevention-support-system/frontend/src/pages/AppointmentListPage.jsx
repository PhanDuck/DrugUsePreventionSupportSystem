import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  Typography, 
  message, 
  Modal,
  Badge,
  Tooltip,
  Popconfirm,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import authService from '../services/authService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AppointmentListPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    consultant: 'all',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [filters, pagination.current]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      const response = await appointmentService.getAppointmentsByClient(currentUser.id);
      
      if (response.success) {
        let filteredData = response.data;
        
        // Apply filters
        if (filters.status !== 'all') {
          filteredData = filteredData.filter(apt => apt.status === filters.status);
        }
        
        if (filters.dateRange) {
          const [startDate, endDate] = filters.dateRange;
          filteredData = filteredData.filter(apt => {
            const aptDate = dayjs(apt.appointmentDate);
            return aptDate.isAfter(startDate) && aptDate.isBefore(endDate);
          });
        }
        
        if (filters.consultant !== 'all') {
          filteredData = filteredData.filter(apt => 
            apt.consultant?.id === parseInt(filters.consultant)
          );
        }
        
        if (filters.search) {
          filteredData = filteredData.filter(apt => 
            apt.consultant?.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            apt.consultant?.lastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            apt.clientNotes?.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setAppointments(filteredData);
        setPagination(prev => ({ ...prev, total: filteredData.length }));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      message.error('Unable to load appointment list');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const currentUser = authService.getCurrentUser();
      const response = await appointmentService.cancelAppointment(appointmentId, currentUser.id, 'Cancelled by client');
      
      if (response.success) {
        message.success('Appointment cancelled successfully');
        loadAppointments();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      message.error('Unable to cancel appointment');
    }
  };

  const handleBulkCancel = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const promises = selectedAppointments.map(id => 
        appointmentService.cancelAppointment(id, currentUser.id, 'Bulk cancellation')
      );
      
      await Promise.all(promises);
      message.success(`Cancelled ${selectedAppointments.length} appointments`);
      setSelectedAppointments([]);
      setShowBulkActions(false);
      loadAppointments();
    } catch (error) {
      console.error('Error bulk canceling appointments:', error);
      message.error('Unable to bulk cancel appointments');
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

  const getAppointmentTypeText = (type) => {
    return type === 'ONLINE' ? 'Online' : 'In-person';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => <Text code>{id}</Text>
    },
    {
      title: 'Consultant',
      dataIndex: 'consultant',
      key: 'consultant',
      render: (consultant) => (
        <Space>
          <UserOutlined />
          <Text>{consultant?.firstName} {consultant?.lastName}</Text>
        </Space>
      )
    },
    {
      title: 'Date & Time',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => (
        <Space direction="vertical" size="small">
          <Space>
            <CalendarOutlined />
            <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <Text>{dayjs(date).format('HH:mm')}</Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'appointmentType',
      key: 'appointmentType',
      render: (type) => (
        <Tag color={type === 'ONLINE' ? 'blue' : 'green'}>
          {getAppointmentTypeText(type)}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'COMPLETED' ? 'success' : 
                 status === 'CANCELLED' ? 'error' : 'processing'} 
          text={
            <Tag color={getStatusColor(status)}>
              {getStatusText(status)}
            </Tag>
          }
        />
      )
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Tag color="purple">{method}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View details">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/appointments/${record.id}`)}
            />
          </Tooltip>
          
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Reschedule">
                <Button 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/appointments/${record.id}?action=reschedule`)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to cancel this appointment?"
                onConfirm={() => handleCancelAppointment(record.id)}
                okText="Cancel"
                cancelText="No"
              >
                <Tooltip title="Cancel appointment">
                  <Button 
                    danger 
                    size="small" 
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
          
          {record.status === 'CONFIRMED' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => navigate(`/appointments/${record.id}`)}
            >
              Join
            </Button>
          )}
          
          {record.status === 'COMPLETED' && !record.review && (
            <Button 
              size="small"
              onClick={() => navigate(`/appointments/${record.id}?action=review`)}
            >
              Review
            </Button>
          )}
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedAppointments,
    onChange: (selectedRowKeys) => {
      setSelectedAppointments(selectedRowKeys);
      setShowBulkActions(selectedRowKeys.length > 0);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status === 'COMPLETED' || record.status === 'CANCELLED'
    })
  };

  const getStatistics = () => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === 'PENDING').length;
    const confirmed = appointments.filter(apt => apt.status === 'CONFIRMED').length;
    const completed = appointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelled = appointments.filter(apt => apt.status === 'CANCELLED').length;

    return { total, pending, confirmed, completed, cancelled };
  };

  const stats = getStatistics();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>📅 Appointment Management</Title>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Confirmed"
              value={stats.confirmed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card title="🔍 Filters" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">All</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="COMPLETED">Completed</Option>
              <Option value="CANCELLED">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['From date', 'To date']}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadAppointments}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/appointments')}
              >
                New Appointment
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card style={{ marginBottom: '16px', background: '#f0f8ff' }}>
          <Space>
            <Text strong>Selected {selectedAppointments.length} appointments</Text>
            <Popconfirm
              title={`Are you sure you want to cancel ${selectedAppointments.length} appointments?`}
              onConfirm={handleBulkCancel}
              okText="Cancel"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />}>
                Bulk Cancel
              </Button>
            </Popconfirm>
            <Button onClick={() => setSelectedAppointments([])}>
              Clear Selection
            </Button>
          </Space>
        </Card>
      )}

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`
          }}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AppointmentListPage; 