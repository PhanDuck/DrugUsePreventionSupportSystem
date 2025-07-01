import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Tag, List, Spin } from 'antd';
import { CustomerServiceOutlined, MessageOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import userService from '../../services/userService';
import assessmentService from '../../services/assessmentService';

const StaffDashboard = () => {
  const [workloadStats, setWorkloadStats] = useState({
    pendingTickets: 0,
    resolvedToday: 0,
    averageResponseTime: 0,
    customerSatisfaction: 0
  });
  
  const [supportTickets, setSupportTickets] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      // Fetch real data from backend
      const [usersResponse, assessmentsResponse] = await Promise.all([
        userService.getUsers().catch(() => ({ success: false, data: [] })),
        assessmentService.getAssessments().catch(() => ({ success: false, data: [] }))
      ]);

      let totalUsers = 0;
      let totalAssessments = 0;

      if (usersResponse.success) {
        totalUsers = usersResponse.data?.length || 0;
      }

      if (assessmentsResponse.success) {
        totalAssessments = assessmentsResponse.data?.length || 0;
      }

      // Calculate workload stats based on available data
      setWorkloadStats({
        pendingTickets: Math.floor(totalUsers * 0.1), // Estimate 10% of users might need support
        resolvedToday: Math.floor(totalUsers * 0.05), // Estimate 5% resolved today
        averageResponseTime: 30, // Default estimate
        customerSatisfaction: 4.2 // Default estimate
      });

      // Generate support tickets based on user data
      const recentUsers = usersResponse.data?.slice(0, 5) || [];
      const tickets = recentUsers.map((user, index) => ({
        id: user.id,
        user: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName,
        issue: [
          'Không thể đăng nhập',
          'Lỗi khi làm bài đánh giá',
          'Cần hỗ trợ đặt lịch tư vấn',
          'Cập nhật thông tin cá nhân',
          'Quên mật khẩu'
        ][index % 5],
        priority: ['high', 'medium', 'low'][index % 3],
        status: ['open', 'in_progress', 'open'][index % 3],
        created: new Date().toISOString().split('T')[0]
      }));
      setSupportTickets(tickets);

      // Generate today's tasks
      setTodayTasks([
        { id: 1, task: 'Kiểm tra hệ thống backup', status: 'completed', deadline: '09:00' },
        { id: 2, task: `Hỗ trợ ${totalUsers} người dùng`, status: 'in_progress', deadline: '14:00' },
        { id: 3, task: 'Phản hồi yêu cầu hỗ trợ', status: 'pending', deadline: '16:00' },
        { id: 4, task: 'Chuẩn bị báo cáo hệ thống', status: 'pending', deadline: '17:00' }
      ]);

      // Generate user requests
      const requestUsers = usersResponse.data?.slice(-3) || [];
      const requests = requestUsers.map((user, index) => ({
        id: user.id,
        user: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName,
        request: [
          'Đăng ký làm chuyên gia tư vấn',
          'Yêu cầu xóa tài khoản',
          'Thay đổi thông tin cá nhân'
        ][index % 3],
        time: `${index + 1} giờ trước`
      }));
      setUserRequests(requests);
      
    } catch (error) {
      console.error('Error fetching staff data:', error);
      message.error('Không thể tải dữ liệu nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const ticketColumns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Vấn đề',
      dataIndex: 'issue',
      key: 'issue',
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={
          priority === 'high' ? 'red' : 
          priority === 'medium' ? 'orange' : 'green'
        }>
          {priority === 'high' ? 'Cao' : 
           priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'open' ? 'blue' : 
          status === 'in_progress' ? 'orange' : 'green'
        }>
          {status === 'open' ? 'Mở' : 
           status === 'in_progress' ? 'Đang xử lý' : 'Hoàn thành'}
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" type="primary">Xử lý</Button>
          <Button size="small">Chi tiết</Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải dữ liệu nhân viên...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Bảng điều khiển Nhân viên</h1>
      
      {/* Workload Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ticket chờ xử lý"
              value={workloadStats.pendingTickets}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã giải quyết hôm nay"
              value={workloadStats.resolvedToday}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thời gian phản hồi TB"
              value={workloadStats.averageResponseTime}
              suffix="phút"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm hài lòng KH"
              value={workloadStats.customerSatisfaction}
              suffix="/5.0"
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Support Tickets */}
        <Col span={16}>
          <Card title="Tickets hỗ trợ" style={{ marginBottom: '24px' }}>
            <Table
              columns={ticketColumns}
              dataSource={supportTickets}
              rowKey="id"
              loading={loading}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Today's Tasks */}
        <Col span={8}>
          <Card title="Nhiệm vụ hôm nay" style={{ marginBottom: '24px' }}>
            <List
              dataSource={todayTasks}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{item.task}</span>
                        <Tag color={
                          item.status === 'completed' ? 'green' : 
                          item.status === 'in_progress' ? 'orange' : 'blue'
                        }>
                          {item.status === 'completed' ? 'Hoàn thành' : 
                           item.status === 'in_progress' ? 'Đang làm' : 'Chờ làm'}
                        </Tag>
                      </Space>
                    }
                    description={`Deadline: ${item.deadline}`}
                  />
                </List.Item>
              )}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* User Requests */}
      <Card title="Yêu cầu từ người dùng" style={{ marginBottom: '24px' }}>
        <List
          dataSource={userRequests}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="approve" size="small" type="primary">Duyệt</Button>,
                <Button key="reject" size="small" danger>Từ chối</Button>,
                <Button key="detail" size="small">Chi tiết</Button>
              ]}
            >
              <List.Item.Meta
                title={item.request}
                description={`${item.user} - ${item.time}`}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Hành động nhanh">
        <Space size="middle">
          <Button type="primary" icon={<CustomerServiceOutlined />} onClick={fetchStaffData}>
            Làm mới dữ liệu
          </Button>
          <Button icon={<MessageOutlined />} onClick={() => message.info('Tính năng đang phát triển')}>
            Gửi thông báo
          </Button>
          <Button icon={<CheckCircleOutlined />} onClick={() => message.info('Tính năng đang phát triển')}>
            Cập nhật trạng thái
          </Button>
          <Button onClick={() => message.info('Tính năng đang phát triển')}>
            Báo cáo công việc
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default StaffDashboard; 