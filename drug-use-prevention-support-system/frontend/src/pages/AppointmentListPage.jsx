import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Table, Tag, Button, Space, Input, Select, DatePicker, Row, Col,
  Typography, message, Modal, Badge, Tooltip, Popconfirm, Statistic
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined,
  CalendarOutlined, ClockCircleOutlined, UserOutlined, FilterOutlined,
  DownloadOutlined, ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import authService from '../services/authService';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function AppointmentListPage() {
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
  }, [filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    setShowBulkActions(selectedAppointments.length > 0);
  }, [selectedAppointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockAppointments = [
        {
          id: 1,
          consultantName: 'Dr. Nguyễn Văn Học',
          appointmentDate: '2024-12-25T10:00:00',
          status: 'PENDING',
          appointmentType: 'ONLINE',
          clientNotes: 'Cần tư vấn về vấn đề tâm lý',
          fee: 200000
        },
        {
          id: 2,
          consultantName: 'Dr. Trần Thị Phòng',
          appointmentDate: '2024-12-26T14:30:00',
          status: 'CONFIRMED',
          appointmentType: 'IN_PERSON',
          clientNotes: 'Tư vấn về nghiện chất',
          fee: 250000
        }
      ];
      
      setAppointments(mockAppointments);
      setPagination(prev => ({ ...prev, total: mockAppointments.length }));
    } catch (error) {
      console.error('Error loading appointments:', error);
      message.error('Không thể tải danh sách lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
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
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'RESCHEDULED': 'Đã đổi lịch'
    };
    return texts[status] || status;
  };

  const getAppointmentTypeText = (type) => {
    return type === 'ONLINE' ? 'Trực tuyến' : 'Trực tiếp';
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

  const columns = [
    {
      title: 'Tư vấn viên',
      dataIndex: 'consultantName',
      key: 'consultantName',
      render: (name) => (
        <Space>
          <UserOutlined />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày giờ',
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
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Hình thức',
      dataIndex: 'appointmentType',
      key: 'appointmentType',
      render: (type) => (
        <Badge 
          status={type === 'ONLINE' ? 'processing' : 'default'} 
          text={getAppointmentTypeText(type)} 
        />
      ),
    },
    {
      title: 'Phí tư vấn',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => (
        <Text strong style={{ color: '#52c41a' }}>
          {fee?.toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => navigate(`/appointments/${record.id}`)}
            />
          </Tooltip>
          {record.status === 'PENDING' && (
            <Tooltip title="Đổi lịch">
              <Button 
                icon={<EditOutlined />} 
                size="small"
                onClick={() => navigate(`/appointments/${record.id}/reschedule`)}
              />
            </Tooltip>
          )}
          {['PENDING', 'CONFIRMED'].includes(record.status) && (
            <Popconfirm
              title="Bạn có chắc chắn muốn hủy lịch hẹn này?"
              onConfirm={() => handleCancelAppointment(record.id)}
              okText="Hủy lịch"
              cancelText="Không"
            >
              <Tooltip title="Hủy lịch">
                <Button 
                  danger 
                  icon={<DeleteOutlined />} 
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleCancelAppointment = async (appointmentId) => {
    try {
      // Mock cancel operation
      message.success('Đã hủy lịch hẹn thành công');
      loadAppointments();
    } catch (error) {
      message.error('Không thể hủy lịch hẹn');
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedAppointments,
    onChange: (selectedRowKeys) => {
      setSelectedAppointments(selectedRowKeys);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản Lý Lịch Hẹn
            </Title>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadAppointments}
              >
                Làm mới
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => message.info('Tính năng xuất file đang phát triển')}
              >
                Xuất file
              </Button>
              {/* BUTTON LỚN HƠN */}
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/book-appointment')}
                size="large"
                style={{ 
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  padding: '0 32px',
                  borderRadius: '8px'
                }}
              >
                + Đặt lịch tư vấn ngay bây giờ
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Tổng số"
              value={stats.total}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.pending}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={stats.confirmed}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              valueStyle={{ color: '#f5222d' }}
              prefix={<DeleteOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ xác nhận</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadAppointments}
              >
                Làm mới
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/appointments')}
              >
                Đặt lịch mới
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

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
              `${range[0]}-${range[1]} của ${total} lịch hẹn`
          }}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}

export default AppointmentListPage;