import React, { useState, useEffect } from 'react';
import { Card, Empty, Button } from 'antd';
import { PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';

const ContentManager = ({ course, onCourseUpdate }) => {
  return (
    <Card>
      <Empty
        image={<VideoCameraOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
        description="Content Manager Coming Soon"
      >
        <Button type="primary" icon={<PlusOutlined />}>
          Add Content
        </Button>
      </Empty>
    </Card>
  );
};

export default ContentManager; 