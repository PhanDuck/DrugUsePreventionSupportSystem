import React, { useState, useEffect } from 'react';
import { Card, Empty, Row, Col, Statistic } from 'antd';
import { BarChartOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const CourseStatistics = ({ course }) => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={course.currentParticipants || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={85}
              suffix="%"
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Avg. Time Spent"
              value={120}
              suffix="minutes"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        <Empty
          image={<BarChartOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
          description="Detailed Statistics Coming Soon"
        />
      </Card>
    </div>
  );
};

export default CourseStatistics; 