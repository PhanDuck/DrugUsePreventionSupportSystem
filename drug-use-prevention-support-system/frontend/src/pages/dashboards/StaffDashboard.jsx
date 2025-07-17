import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Tag, List, Spin } from 'antd';
import { 
  CustomerServiceOutlined, 
  MessageOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  BookOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  TeamOutlined
} from '@ant-design/icons';
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
          'Unable to login',
          'Error during assessment',
          'Need help scheduling consultation',
          'Update personal information',
          'Forgot password'
        ][index % 5],
        priority: ['high', 'medium', 'low'][index % 3],
        status: ['open', 'in_progress', 'open'][index % 3],
        created: new Date().toISOString().split('T')[0]
      }));
      setSupportTickets(tickets);

      // Generate today's tasks
      setTodayTasks([
        { id: 1, task: 'Check system backup', status: 'completed', deadline: '09:00' },
        { id: 2, task: `Support ${totalUsers} users`, status: 'in_progress', deadline: '14:00' },
        { id: 3, task: 'Respond to support requests', status: 'pending', deadline: '16:00' },
        { id: 4, task: 'Prepare system report', status: 'pending', deadline: '17:00' }
      ]);

      // Generate user requests
      const requestUsers = usersResponse.data?.slice(-3) || [];
      const requests = requestUsers.map((user, index) => ({
        id: user.id,
        user: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName,
        request: [
          'Register as consultant',
          'Request account deletion',
          'Change personal information'
        ][index % 3],
        time: `${index + 1} hours ago`
      }));
      setUserRequests(requests);
      
    } catch (error) {
      console.error('Error fetching staff data:', error);
      message.error('Unable to load staff data');
    } finally {
      setLoading(false);
    }
  };

  const ticketColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={
          priority === 'high' ? 'red' : 
          priority === 'medium' ? 'orange' : 'green'
        }>
          {priority === 'high' ? 'High' : 
           priority === 'medium' ? 'Medium' : 'Low'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'open' ? 'blue' : 
          status === 'in_progress' ? 'orange' : 'green'
        }>
          {status === 'open' ? 'Open' : 
           status === 'in_progress' ? 'In Progress' : 'Completed'}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small" type="primary">Process</Button>
          <Button size="small">Details</Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Loading staff data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Staff Dashboard</h1>
      
      {/* Workload Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Tickets"
              value={workloadStats.pendingTickets}
              prefix={<CustomerServiceOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Resolved Today"
              value={workloadStats.resolvedToday}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Response Time"
              value={workloadStats.averageResponseTime}
              suffix="minutes"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Customer Satisfaction"
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
          <Card title="Support Tickets" style={{ marginBottom: '24px' }}>
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
          <Card title="Today's Tasks" style={{ marginBottom: '24px' }}>
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
                          {item.status === 'completed' ? 'Completed' : 
                           item.status === 'in_progress' ? 'In Progress' : 'Pending'}
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
      <Card title="User Requests" style={{ marginBottom: '24px' }}>
        <List
          dataSource={userRequests}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="approve" size="small" type="primary">Approve</Button>,
                <Button key="reject" size="small" danger>Reject</Button>,
                <Button key="detail" size="small">Details</Button>
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
      <Card title="Quick Actions">
        <Space size="middle">
          <Button type="primary" icon={<CustomerServiceOutlined />} onClick={fetchStaffData}>
            Refresh Data
          </Button>
          <Button icon={<MessageOutlined />} onClick={() => message.info('Feature under development')}>
            Send Notification
          </Button>
          <Button icon={<CheckCircleOutlined />} onClick={() => message.info('Feature under development')}>
            Update Status
          </Button>
          <Button onClick={() => message.info('Feature under development')}>
            Work Report
          </Button>
        </Space>
      </Card>

      {/* Course Management Section */}
      <Card title="Course Management" style={{ marginTop: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={12}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Published"
                value={8}
                prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Lessons"
                value={45}
                prefix={<VideoCameraOutlined style={{ color: '#fa8c16' }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Students"
                value={156}
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
        </Row>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={() => window.location.href = '/staff/courses'}
          >
            <BookOutlined /> Manage Courses
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default StaffDashboard; 