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
        message.error('User information not found');
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
      message.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const result = await appointmentService.confirmAppointment(appointmentId, currentUser.id);
      if (result.success) {
        message.success('Appointment confirmed successfully');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Unable to confirm appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const result = await appointmentService.completeAppointment(appointmentId, currentUser.id, 'Completed consultation session');
      if (result.success) {
        message.success('Appointment completed successfully');
        fetchDashboardData(); // Refresh data
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Unable to complete appointment');
    }
  };

  const appointmentColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (_, record) => record.clientName || `Client ID: ${record.clientId}`,
    },
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
      render: (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A',
    },
    {
      title: 'Time',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'CONFIRMED' ? 'green' : 
          status === 'PENDING' ? 'orange' :
          status === 'COMPLETED' ? 'blue' : 'red'
        }>
          {status === 'CONFIRMED' ? 'Confirmed' : 
           status === 'PENDING' ? 'Pending' :
           status === 'COMPLETED' ? 'Completed' : status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <Button 
              size="small" 
              type="primary"
              onClick={() => handleConfirmAppointment(record.id)}
            >
              Confirm
            </Button>
          )}
          {record.status === 'CONFIRMED' && (
            <Button 
              size="small"
              onClick={() => handleCompleteAppointment(record.id)}
            >
              Complete
            </Button>
          )}
          <Button size="small">Details</Button>
        </Space>
      ),
    },
  ];

  const assessmentColumns = [
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Assessment Type',
      dataIndex: 'assessmentType',
      key: 'assessmentType',
    },
    {
      title: 'Score',
      dataIndex: 'totalScore',
      key: 'totalScore',
    },
    {
      title: 'Risk Level',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (riskLevel) => (
        <Tag color={
          riskLevel === 'HIGH' ? 'red' : 
          riskLevel === 'MODERATE' ? 'orange' : 'green'
        }>
          {riskLevel}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (date) => date ? new Date(date).toLocaleDateString('en-US') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              message.info(`View detailed assessment results for ${record.clientName}`);
              // TODO: Navigate to detailed view
            }}
          >
            View Results
          </Button>
          <Button 
            size="small"
            onClick={() => {
              message.info('Consultation feature under development');
              // TODO: Create consultation notes
            }}
          >
            Consult
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '16px' }}>Loading consultant data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Consultant Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Today's Appointments"
              value={stats.todayAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Assessments"
              value={stats.pendingAssessments}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Clients"
              value={stats.totalClients}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Sessions"
              value={stats.completedSessions}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Today's Appointments */}
      <Card title="My Appointments" style={{ marginBottom: '24px' }}>
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
      <Card title="Recent Assessment Results">
        <Table
          columns={assessmentColumns}
          dataSource={assessmentResults}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
          size="small"
          locale={{ emptyText: 'No assessment data available' }}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: '24px' }}>
        <Space size="middle">
          <Button type="primary" onClick={fetchDashboardData}>
            Refresh Data
          </Button>
          <Button onClick={() => message.info('Feature under development')}>
            View All Appointments
          </Button>
          <Button onClick={() => message.info('Feature under development')}>
            Weekly Report
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ConsultantDashboard; 