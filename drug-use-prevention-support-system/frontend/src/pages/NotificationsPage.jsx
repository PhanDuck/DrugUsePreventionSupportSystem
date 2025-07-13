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
          title: 'New Appointment',
          message: 'You have an appointment with a consultant tomorrow at 14:00',
          type: 'appointment',
          isRead: false,
          createdAt: '2024-01-15T10:30:00Z',
          priority: 'high'
        },
        {
          id: 2,
          title: 'New Course',
          message: 'Course "Social Problem Prevention" is now open for registration',
          type: 'course',
          isRead: true,
          createdAt: '2024-01-14T15:20:00Z',
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Assessment Results',
          message: 'Your risk assessment results are ready',
          type: 'assessment',
          isRead: false,
          createdAt: '2024-01-13T09:15:00Z',
          priority: 'high'
        },
        {
          id: 4,
          title: 'New Article',
          message: 'Article "Signs of Social Problems" has been published',
          type: 'blog',
          isRead: true,
          createdAt: '2024-01-12T16:45:00Z',
          priority: 'low'
        },
        {
          id: 5,
          title: 'Reminder',
          message: 'Don\'t forget to complete the course "Prevention Skills"',
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
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    };
    return texts[priority] || priority;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US');
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
            <span>Notifications</span>
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
                Mark all as read
              </Button>
            )}
          </Space>
        }
      >
        <List
          loading={loading}
          dataSource={notifications}
          locale={{ emptyText: <Empty description="No notifications" /> }}
          renderItem={(notification) => (
            <List.Item
              key={notification.id}
              style={{
                backgroundColor: notification.isRead ? 'transparent' : '#f0f8ff',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleNotificationClick(notification)}
              actions={[
                !notification.isRead && (
                  <Button
                    type="text"
                    size="small"
                    icon={<CheckOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    Mark as read
                  </Button>
                ),
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  Delete
                </Button>
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={getNotificationIcon(notification.type)}
                    style={{ backgroundColor: notification.isRead ? '#d9d9d9' : '#1890ff' }}
                  />
                }
                title={
                  <Space>
                    <Text strong={!notification.isRead}>
                      {notification.title}
                    </Text>
                    <Tag color={getPriorityColor(notification.priority)} size="small">
                      {getPriorityText(notification.priority)}
                    </Tag>
                    {!notification.isRead && <Badge status="processing" />}
                  </Space>
                }
                description={
                  <div>
                    <Text>{notification.message}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <ClockCircleOutlined /> {formatDate(notification.createdAt)}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Notification Settings */}
      <Card title="Notification Settings" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Appointment notifications</Text>
          <br />
          <Text type="secondary">Receive notifications about new appointments and changes</Text>
        </div>
        
        <Divider />
        
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Course notifications</Text>
          <br />
          <Text type="secondary">Receive notifications about new courses and progress</Text>
        </div>
        
        <Divider />
        
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Assessment notifications</Text>
          <br />
          <Text type="secondary">Receive notifications about assessment results</Text>
        </div>
        
        <Divider />
        
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Article notifications</Text>
          <br />
          <Text type="secondary">Receive notifications about new articles</Text>
        </div>
      </Card>
    </div>
  );
};

export default NotificationsPage; 