import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Space, Tag, Empty, Typography, Divider, Avatar } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          title: 'Lịch hẹn mới',
          message: 'Bạn có lịch hẹn với tư vấn viên vào ngày mai lúc 14:00',
          type: 'appointment',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Khóa học mới',
          message: 'Khóa học "Phòng chống tệ nạn xã hội" đã được mở đăng ký',
          type: 'course',
          isRead: true,
          createdAt: '2024-01-14T15:20:00Z',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Kết quả đánh giá',
          message: 'Kết quả đánh giá nguy cơ của bạn đã sẵn sàng',
          type: 'assessment',
          isRead: false,
          createdAt: '2024-01-13T09:15:00Z',
          priority: 'high'
        },
        {
          id: 4,
          title: 'Bài viết mới',
          message: 'Bài viết "Dấu hiệu nhận biết tệ nạn xã hội" đã được đăng',
          type: 'blog',
          isRead: true,
          createdAt: '2024-01-12T16:45:00Z',
          priority: 'low'
        },
        {
          id: 5,
          title: 'Nhắc nhở',
          message: 'Đừng quên hoàn thành khóa học "Kỹ năng phòng chống"',
          type: 'reminder',
          isRead: false,
          createdAt: '2024-01-11T11:00:00Z',
          priority: 'medium'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Mock API call
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Mock API call
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mock API call
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      course: '📚',
      assessment: '📋',
      blog: '📝',
      reminder: '⏰'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'green'
    };
    return colors[priority] || 'default';
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return texts[priority] || priority;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'appointment':
        navigate('/appointments');
        break;
      case 'course':
        navigate('/courses');
        break;
      case 'assessment':
        navigate('/surveys');
        break;
      case 'blog':
        navigate('/blogs');
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card 
        title={
          <Space>
            <BellOutlined />
            <span>Thông Báo</span>
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ backgroundColor: '#1890ff' }} />
            )}
          </Space>
        }
        extra={
          <Space>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                onClick={markAllAsRead}
                icon={<CheckOutlined />}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </Space>
        }
      >
        {notifications.length === 0 ? (
          <Empty 
            description="Không có thông báo nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            loading={loading}
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                style={{
                  backgroundColor: notification.isRead ? 'transparent' : '#f0f8ff',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  padding: '16px',
                  cursor: 'pointer',
                  border: notification.isRead ? '1px solid #f0f0f0' : '1px solid #1890ff'
                }}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  !notification.isRead && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      icon={<CheckOutlined />}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  ),
                  <Button 
                    type="link" 
                    size="small"
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      size={40}
                      style={{ 
                        backgroundColor: notification.isRead ? '#d9d9d9' : '#1890ff',
                        fontSize: '16px'
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong={!notification.isRead}>
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <Badge status="processing" />
                      )}
                      <Tag color={getPriorityColor(notification.priority)} size="small">
                        {getPriorityText(notification.priority)}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        {notification.message}
                      </div>
                      <Space size="small">
                        <ClockCircleOutlined style={{ color: '#999' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatDate(notification.createdAt)}
                        </Text>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Notification Settings */}
      <Card title="Cài Đặt Thông Báo" style={{ marginTop: '24px' }}>
        <List>
          <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <Text strong>Thông báo lịch hẹn</Text>
                <br />
                <Text type="secondary">Nhận thông báo về lịch hẹn mới và thay đổi</Text>
              </div>
              <Button type="primary" size="small">Bật</Button>
            </div>
          </List.Item>
          <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <Text strong>Thông báo khóa học</Text>
                <br />
                <Text type="secondary">Nhận thông báo về khóa học mới và tiến độ</Text>
              </div>
              <Button type="primary" size="small">Bật</Button>
            </div>
          </List.Item>
          <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <Text strong>Thông báo đánh giá</Text>
                <br />
                <Text type="secondary">Nhận thông báo về kết quả đánh giá</Text>
              </div>
              <Button type="primary" size="small">Bật</Button>
            </div>
          </List.Item>
          <List.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <Text strong>Thông báo bài viết</Text>
                <br />
                <Text type="secondary">Nhận thông báo về bài viết mới</Text>
              </div>
              <Button type="default" size="small">Tắt</Button>
            </div>
          </List.Item>
        </List>
      </Card>
    </div>
  );
};

export default NotificationsPage; 