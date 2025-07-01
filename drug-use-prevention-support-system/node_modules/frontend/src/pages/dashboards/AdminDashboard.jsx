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
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await userService.deleteUser(userId);
      if (result.success) {
        message.success('Xóa người dùng thành công');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể xóa người dùng');
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
      title: 'Tên đăng nhập',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Họ tên',
      key: 'fullName',
      render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}`.trim() || 'N/A',
    },
    {
      title: 'Vai trò',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="small">Chỉnh sửa</Button>
          <Button 
            size="small" 
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải dữ liệu dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Bảng điều khiển Quản trị viên</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng khóa học"
              value={stats.totalCourses}
              prefix={<BookOutlined />}
              suffix={<span style={{ fontSize: '12px', color: '#999' }}>(Chưa khả dụng)</span>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng cuộc hẹn"
              value={stats.totalAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng đánh giá"
              value={stats.totalAssessments}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Users Management */}
      <Card title="Quản lý người dùng" style={{ marginBottom: '24px' }}>
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
      <Card title="Hành động nhanh">
        <Space size="middle">
          <Button type="primary" onClick={fetchDashboardData}>
            Làm mới dữ liệu
          </Button>
          <Button onClick={() => message.info('Tính năng đang phát triển')}>
            Tạo báo cáo
          </Button>
          <Button onClick={() => message.info('Tính năng đang phát triển')}>
            Cài đặt hệ thống
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AdminDashboard; 