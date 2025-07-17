import React, { useState, useEffect } from 'react';
import { Card, Empty, Button } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';

const LessonManager = ({ course, onCourseUpdate }) => {
  return (
    <Card>
      <Empty
        image={<FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
        description="Lesson Manager Coming Soon"
      >
        <Button type="primary" icon={<PlusOutlined />}>
          Add Lesson
        </Button>
      </Empty>
    </Card>
  );
};

export default LessonManager; 