import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Image,
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Badge,
  Progress
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  StarOutlined
} from '@ant-design/icons';
import staffCourseService from '../../services/staffCourseService';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const CourseList = ({ courses, onEdit, onDelete, onSelect, loading }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (courseId) => {
    setDeletingId(courseId);
    try {
      const response = await staffCourseService.deleteCourse(courseId);
      if (response.success) {
        onDelete(courseId);
      } else {
        message.error('Không thể xóa khóa học: ' + response.error);
      }
    } catch (error) {
      message.error('Lỗi khi xóa khóa học: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'green';
      case 'closed': return 'orange';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Đang mở';
      case 'closed': return 'Đã đóng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return level;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      {courses.map((course) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
          <Card
            hoverable
            loading={loading}
            cover={
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <Image
                  alt={course.title}
                  src={course.thumbnailUrl || course.imageUrl || 'https://via.placeholder.com/300x200?text=Course'}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  preview={false}
                />
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <Tag color={getStatusColor(course.status)}>
                    {getStatusText(course.status)}
                  </Tag>
                  {course.difficultyLevel && (
                    <Tag color={getDifficultyColor(course.difficultyLevel)}>
                      {getDifficultyText(course.difficultyLevel)}
                    </Tag>
                  )}
                </div>
                {course.isFeatured && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px'
                  }}>
                    <Tag color="gold" icon={<StarOutlined />}>
                      Nổi bật
                    </Tag>
                  </div>
                )}
              </div>
            }
            actions={[
              <Tooltip title="Xem chi tiết">
                <Button 
                  type="text" 
                  icon={<EyeOutlined />} 
                  onClick={() => onSelect(course)}
                />
              </Tooltip>,
              <Tooltip title="Chỉnh sửa">
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => onEdit(course)}
                />
              </Tooltip>,
              <Tooltip title="Cài đặt">
                <Button 
                  type="text" 
                  icon={<SettingOutlined />} 
                  onClick={() => onSelect(course)}
                />
              </Tooltip>,
              <Popconfirm
                title="Xóa khóa học"
                description="Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác."
                onConfirm={() => handleDelete(course.id)}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
              >
                <Tooltip title="Xóa">
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    loading={deletingId === course.id}
                  />
                </Tooltip>
              </Popconfirm>
            ]}
          >
            <Meta
              title={
                <Tooltip title={course.title}>
                  <div style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {course.title}
                  </div>
                </Tooltip>
              }
              description={
                <Paragraph 
                  ellipsis={{ rows: 2, expandable: false }}
                  style={{ marginBottom: '12px', minHeight: '40px' }}
                >
                  {course.description}
                </Paragraph>
              }
            />

            {/* Course Statistics */}
            <div style={{ marginTop: '12px' }}>
              <Row gutter={8} style={{ marginBottom: '8px' }}>
                <Col span={12}>
                  <Space size="small">
                    <BookOutlined style={{ color: '#1890ff' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {course.totalLessons || 0} bài học
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space size="small">
                    <UserOutlined style={{ color: '#52c41a' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {course.currentParticipants || 0}/{course.maxParticipants || 0}
                    </Text>
                  </Space>
                </Col>
              </Row>

              <Row gutter={8} style={{ marginBottom: '8px' }}>
                <Col span={12}>
                  <Space size="small">
                    <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {staffCourseService.formatDuration(course.totalDurationMinutes)}
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space size="small">
                    <PlayCircleOutlined style={{ color: '#722ed1' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {course.price === 0 || course.price === null ? 'Miễn phí' : `${course.price?.toLocaleString()} VNĐ`}
                    </Text>
                  </Space>
                </Col>
              </Row>

              {/* Enrollment Progress */}
              {course.maxParticipants > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Tỷ lệ đăng ký
                  </Text>
                  <Progress 
                    percent={Math.round((course.currentParticipants || 0) / course.maxParticipants * 100)}
                    size="small"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    showInfo={false}
                  />
                </div>
              )}

              {/* Rating */}
              {course.averageRating > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <Space size="small">
                    <StarOutlined style={{ color: '#faad14' }} />
                    <Text style={{ fontSize: '12px' }}>
                      {course.averageRating?.toFixed(1)}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      ({course.totalReviews} đánh giá)
                    </Text>
                  </Space>
                </div>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CourseList; 