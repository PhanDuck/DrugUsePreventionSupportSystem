import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Tag, Spin } from 'antd';
import { CalendarOutlined, FileTextOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import appointmentService from '../../services/appointmentService';
import assessmentService from '../../services/assessmentService';
import authService from '../../services/authService';

const ConsultantDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAssessments: 0,
    totalClients: 0,
    completedSessions: 0
  });
  
  const [appointments, setAppointments] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser?.id) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (!currentUser?.id) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }

      // Fetch consultant's appointments
      const appointmentsResponse = await appointmentService.getAppointmentsByConsultant(currentUser.id);
      if (appointmentsResponse.success) {
        const appointmentData = appointmentsResponse.data || [];
        setAppointments(appointmentData);
        
        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointmentData.filter(apt => 
          apt.appointmentDate?.startsWith(today)
        );
        
        setStats(prev => ({
          ...prev,
          todayAppointments: todayAppts.length,
          completedSessions: appointmentData.filter(apt => apt.status === 'COMPLETED').length,
          totalClients: new Set(appointmentData.map(apt => apt.clientId)).size
        }));
        
        // Load assessment results for recent clients
        const recentClients = [...new Set(appointmentData
          .filter(apt => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED')
          .map(apt => apt.clientId)
          .slice(0, 5))]; // Get 5 recent clients
          
        const assessmentPromises = recentClients.map(async (clientId) => {
          const result = await assessmentService.getLatestClientAssessmentForConsultant(clientId);
          if (result.success && result.data && result.data.id) {
            // Find client name from appointments
            const clientAppointment = appointmentData.find(apt => apt.clientId === clientId);
            return {
              ...result.data,
              clientName: clientAppointment?.clientName || `Client #${clientId}`,
              clientId: clientId
            };
          }
          return null;
        });
        
        const assessmentResults = await Promise.all(assessmentPromises);
        setAssessmentResults(assessmentResults.filter(result => result !== null));
        setStats(prev => ({ ...prev, pendingAssessments: assessmentResults.filter(r => r !== null).length }));
        
      } else {
        console.log('No appointments found:', appointmentsResponse.message);
      }
      
    } catch (error) {
      console.error('Error fetching consultant dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const result = await appointmentService.confirmAppointment(appointmentId, currentUser.id);
      if (result.success) {
        message.success('Xác nhận cuộc hẹn thành công');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể xác nhận cuộc hẹn');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const result = await appointmentService.completeAppointment(appointmentId, currentUser.id, 'Completed consultation session');
      if (result.success) {
        message.success('Hoàn thành cuộc hẹn thành công');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Không thể hoàn thành cuộc hẹn');
    }
  };

  const appointmentColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (_, record) => record.clientName || `Client ID: ${record.clientId}`,
    },
    {
      title: 'Ngày',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Giờ',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'CONFIRMED' ? 'green' : 
          status === 'PENDING' ? 'orange' :
          status === 'COMPLETED' ? 'blue' : 'red'
        }>
          {status === 'CONFIRMED' ? 'Đã xác nhận' : 
           status === 'PENDING' ? 'Chờ xác nhận' :
           status === 'COMPLETED' ? 'Hoàn thành' : status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleConfirmAppointment(record.id)}
            >
              Xác nhận
            </Button>
          )}
          {record.status === 'CONFIRMED' && (
            <Button 
              size="small"
              onClick={() => handleCompleteAppointment(record.id)}
            >
              Hoàn thành
            </Button>
          )}
          <Button size="small">Chi tiết</Button>
        </Space>
      ),
    },
  ];

  const assessmentColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Loại đánh giá',
      dataIndex: 'assessmentType',
      key: 'assessmentType',
    },
    {
      title: 'Điểm số',
      dataIndex: 'totalScore',
      key: 'totalScore',
    },
    {
      title: 'Mức độ rủi ro',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (riskLevel) => (
        <Tag color={
          riskLevel === 'CAO' ? 'red' : 
          riskLevel === 'TRUNG BÌNH' ? 'orange' : 'green'
        }>
          {riskLevel}
        </Tag>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              message.info(`Xem chi tiết kết quả đánh giá của ${record.clientName}`);
              // TODO: Navigate to detailed view
            }}
          >
            Xem kết quả
          </Button>
          <Button 
            size="small"
            onClick={() => {
              message.info('Tính năng tư vấn đang phát triển');
              // TODO: Create consultation notes
            }}
          >
            Tư vấn
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Đang tải dữ liệu chuyên gia tư vấn...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Bảng điều khiển Chuyên gia tư vấn</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cuộc hẹn hôm nay"
              value={stats.todayAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đánh giá chờ xử lý"
              value={stats.pendingAssessments}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={stats.totalClients}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Phiên hoàn thành"
              value={stats.completedSessions}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card title="Lịch hẹn của tôi" style={{ marginBottom: '24px' }}>
        <Table
          columns={appointmentColumns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Card>

      {/* Recent Assessment Results */}
      <Card title="Kết quả đánh giá gần đây">
        <Table
          columns={assessmentColumns}
          dataSource={assessmentResults}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          size="small"
          locale={{ emptyText: 'Chưa có dữ liệu đánh giá' }}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Hành động nhanh" style={{ marginTop: '24px' }}>
        <Space size="middle">
          <Button type="primary" onClick={fetchDashboardData}>
            Làm mới dữ liệu
          </Button>
          <Button onClick={() => message.info('Tính năng đang phát triển')}>
            Xem tất cả cuộc hẹn
          </Button>
          <Button onClick={() => message.info('Tính năng đang phát triển')}>
            Báo cáo tuần
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ConsultantDashboard; 