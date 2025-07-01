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
        { department: 'Tư vấn', consultants: 8, activeClients: 45, satisfaction: 4.7 },
        { department: 'Giáo dục', trainers: 5, activeCourses: 12, completion: 78 },
        { department: 'Hỗ trợ', staff: 6, tickets: 23, resolved: 95 }
      ]);

      // Static activity data - should be replaced with real activity log API
      setRecentActivities([
        { id: 1, action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn X', time: '10 phút trước' },
        { id: 2, action: 'Hoàn thành đánh giá CRAFFT', user: 'Trần Thị Y', time: '25 phút trước' },
        { id: 3, action: 'Đặt lịch tư vấn', user: 'Lê Văn Z', time: '1 giờ trước' },
        { id: 4, action: 'Hoàn thành khóa học', user: 'Phạm Thị A', time: '2 giờ trước' }
      ]);

      // Static performance metrics - should be replaced with real metrics API
      setPerformanceMetrics([
        { metric: 'Đánh giá được thực hiện', current: 234, target: 300, percent: 78 },
        { metric: 'Cuộc hẹn thành công', current: 189, target: 200, percent: 95 },
        { metric: 'Khóa học hoàn thành', current: 67, target: 80, percent: 84 },
        { metric: 'Người dùng hoạt động', current: 156, target: 180, percent: 87 }
      ]);
      
    } catch (error) {
      console.error('Error fetching manager data:', error);
      message.error('Không thể tải dữ liệu quản lý');
    } finally {
      setLoading(false);
    }
  };

  const departmentColumns = [
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'consultants',
      key: 'consultants',
      render: (value, record) => record.consultants || record.trainers || record.staff,
    },
    {
      title: 'Hoạt động',
      key: 'activity',
      render: (_, record) => record.activeClients || record.activeCourses || record.tickets,
    },
    {
      title: 'Hiệu suất',
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
      <h1>Bảng điều khiển Quản lý</h1>
      
      {/* System Overview */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={systemStats.activeUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thời gian hoạt động"
              value={systemStats.systemUptime}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={systemStats.completionRate}
              suffix="%"
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm hài lòng"
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
          <Card title="Hiệu suất phòng ban" style={{ marginBottom: '24px' }}>
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
          <Card title="Hoạt động gần đây" style={{ marginBottom: '24px' }}>
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
      <Card title="Chỉ số hiệu suất" style={{ marginBottom: '24px' }}>
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
      <Card title="Hành động nhanh">
        <Space size="middle">
          <Button type="primary">Tạo báo cáo</Button>
          <Button>Quản lý nhân sự</Button>
          <Button>Xem thống kê</Button>
          <Button>Cài đặt hệ thống</Button>
        </Space>
      </Card>
    </div>
  );
};

export default ManagerDashboard; 