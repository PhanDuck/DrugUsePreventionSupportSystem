import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Spin } from 'antd';
import { UserOutlined, BookOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import userService from '../../services/userService';
import assessmentService from '../../services/assessmentService';
import appointmentService from '../../services/appointmentService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalAppointments: 0,
    totalAssessments: 0
  });
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersResponse = await userService.getUsers();
      if (usersResponse.success) {
        setUsers(usersResponse.data || []);
        setStats(prev => ({ ...prev, totalUsers: usersResponse.data?.length || 0 }));
      } else {
        message.error(usersResponse.message);
      }

      // Fetch assessments count
      try {
        const assessmentsResponse = await assessmentService.getAssessments();
        if (assessmentsResponse && Array.isArray(assessmentsResponse)) {
          setStats(prev => ({ ...prev, totalAssessments: assessmentsResponse.length }));
        }
      } catch (error) {
        console.log('Assessments count not available:', error);
      }

      // Fetch appointments
      try {
        const appointmentsResponse = await appointmentService.getAllAppointments();
        if (appointmentsResponse.success) {
          setStats(prev => ({ ...prev, totalAppointments: appointmentsResponse.data?.length || 0 }));
        }
      } catch (error) {
        console.log('Appointments not available:', error);
      }

      // Note: Course count will be 0 as CourseController is disabled
      setStats(prev => ({ ...prev, totalCourses: 0 }));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        message.success('User deleted successfully');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Unable to delete user');
    }
  };

  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}`.trim() || 'N/A',
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      render: (role) => (
        <span style={{ 
          color: role === 'ADMIN' ? 'red' : 
                role === 'MANAGER' ? 'orange' :
                role === 'CONSULTANT' ? 'blue' : 'green'
        }}>
          {role}
        </span>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small">Edit</Button>
          <Button 
            size="small" 
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Administrator Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              suffix={<span style={{ fontSize: '12px', color: '#999' }}>(Not available)</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Assessments"
              value={stats.totalAssessments}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Users Management */}
      <Card title="User Management" style={{ marginBottom: '24px' }}>
        <Table
          columns={userColumns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Space size="middle">
          <Button type="primary" onClick={fetchDashboardData}>
            Refresh Data
          </Button>
          <Button onClick={() => message.info('Feature under development')}>
            Generate Report
          </Button>
          <Button onClick={() => message.info('Feature under development')}>
            System Settings
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AdminDashboard; 