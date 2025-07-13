import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Progress, List } from 'antd';
import { TeamOutlined, TrophyOutlined, BarChartOutlined, FileTextOutlined } from '@ant-design/icons';
import api from '../../config/axios';

const ManagerDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    activeUsers: 0,
    systemUptime: '99.9%',
    completionRate: 0,
    satisfactionScore: 0
  });
  
  const [departmentStats, setDepartmentStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      // Static data - these statistics should be replaced with real API calls to get actual metrics
      setSystemStats({
        activeUsers: 156,
        systemUptime: '99.9%',
        completionRate: 85,
        satisfactionScore: 4.6
      });

      // Static department data - should be replaced with real API calls
      setDepartmentStats([
        { department: 'Consultation', consultants: 8, activeClients: 45, satisfaction: 4.7 },
        { department: 'Education', trainers: 5, activeCourses: 12, completion: 78 },
        { department: 'Support', staff: 6, tickets: 23, resolved: 95 }
      ]);

      // Static activity data - should be replaced with real activity log API
      setRecentActivities([
        { id: 1, action: 'New user registered', user: 'Nguyen Van X', time: '10 minutes ago' },
        { id: 2, action: 'Completed CRAFFT assessment', user: 'Tran Thi Y', time: '25 minutes ago' },
        { id: 3, action: 'Scheduled consultation', user: 'Le Van Z', time: '1 hour ago' },
        { id: 4, action: 'Completed course', user: 'Pham Thi A', time: '2 hours ago' }
      ]);

      // Static performance metrics - should be replaced with real metrics API
      setPerformanceMetrics([
        { metric: 'Assessments completed', current: 234, target: 300, percent: 78 },
        { metric: 'Successful appointments', current: 189, target: 200, percent: 95 },
        { metric: 'Courses completed', current: 67, target: 80, percent: 84 },
        { metric: 'Active users', current: 156, target: 180, percent: 87 }
      ]);
      
    } catch (error) {
      console.error('Error fetching manager data:', error);
      message.error('Unable to load management data');
    } finally {
      setLoading(false);
    }
  };

  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Staff',
      dataIndex: 'consultants',
      key: 'consultants',
      render: (value, record) => record.consultants || record.trainers || record.staff,
    },
    {
      title: 'Activity',
      key: 'activity',
      render: (_, record) => record.activeClients || record.activeCourses || record.tickets,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <span>
          {record.satisfaction ? `${record.satisfaction} ⭐` : 
           record.completion ? `${record.completion}%` :
           `${record.resolved}%`}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Manager Dashboard</h1>
      
      {/* System Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={systemStats.activeUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="System Uptime"
              value={systemStats.systemUptime}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={systemStats.completionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Satisfaction Score"
              value={systemStats.satisfactionScore}
              suffix="/5.0"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Department Performance */}
        <Col span={12}>
          <Card title="Department Performance" style={{ marginBottom: '24px' }}>
            <Table
              columns={departmentColumns}
              dataSource={departmentStats}
              rowKey="department"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col span={12}>
          <Card title="Recent Activities" style={{ marginBottom: '24px' }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.action}
                    description={`${item.user} - ${item.time}`}
                  />
                </List.Item>
              )}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Card title="Performance Metrics" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          {performanceMetrics.map((metric, index) => (
            <Col span={6} key={index}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h4>{metric.metric}</h4>
                <Progress
                  type="circle"
                  percent={metric.percent}
                  format={() => `${metric.current}/${metric.target}`}
                  width={80}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Space size="middle">
          <Button type="primary">Generate Report</Button>
          <Button>Manage Staff</Button>
          <Button>View Statistics</Button>
          <Button>System Settings</Button>
        </Space>
      </Card>
    </div>
  );
};

export default ManagerDashboard; 