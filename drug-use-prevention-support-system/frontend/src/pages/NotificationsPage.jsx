import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Space, Tag, Empty, Typography, Divider, Avatar, message } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import authService from '../services/authService';

const { Text, Title } = Typography;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        message.error('User not authenticated');
        return;
      }

      const response = await api.get('/notifications', {
        params: { userId: currentUser.id }
      });
      
      console.log('Notifications response:', response.data);
      
      // Handle both array and object responses
      const notificationsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Fallback to sample notifications if API fails
      const fallbackNotifications = [
        {
          id: 1,
          title: 'Welcome to the System',
          message: 'Welcome to our Drug Prevention Support System. Please complete your profile setup.',
          type: 'WELCOME',
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'medium'
        },
        {
          id: 2,
          title: 'Course Available',
          message: 'New course "Introduction to Drug Prevention" is now available for enrollment.',
          type: 'COURSE',
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: 'low'
        }
      ];
      
      setNotifications(fallbackNotifications);
      message.warning('Using sample notifications - API connection issue');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        return;
      }

      const response = await api.get('/notifications/unread-count', {
        params: { userId: currentUser.id }
      });
      
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Calculate unread count from current notifications
      const unread = notifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      
      if (response.status === 200) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        message.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      message.error('Failed to mark notification as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Backend doesn't have delete endpoint, so just remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      message.success('Notification removed');
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Failed to remove notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        await api.put(`/notifications/${notification.id}/read`);
      }
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
      message.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      message.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      APPOINTMENT_CONFIRMED: '📅',
      APPOINTMENT_CANCELLED: '❌',
      PAYMENT_SUCCESS: '💳',
      PAYMENT_FAILED: '❌',
      COURSE: '📚',
      ASSESSMENT: '📋',
      BLOG: '📝',
      WELCOME: '👋',
      REMINDER: '⏰',
      SYSTEM: '🔔'
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'APPOINTMENT_CONFIRMED':
      case 'APPOINTMENT_CANCELLED':
        navigate('/appointments');
        break;
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
        navigate('/courses');
        break;
      case 'COURSE':
        navigate('/courses');
        break;
      case 'ASSESSMENT':
        navigate('/survey');
        break;
      case 'BLOG':
        navigate('/blog');
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2}>
            <BellOutlined style={{ marginRight: '8px' }} />
            Notifications
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ marginLeft: '8px' }} />
            )}
          </Title>
          
          {notifications.length > 0 && unreadCount > 0 && (
            <Button type="primary" onClick={markAllAsRead}>
              <CheckOutlined /> Mark All as Read
            </Button>
          )}
        </div>

        <Divider />

        {notifications.length === 0 ? (
          <Empty 
            description="No notifications yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={notifications}
            loading={loading}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  backgroundColor: notification.isRead ? 'transparent' : '#f0f8ff',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  padding: '16px',
                  border: notification.isRead ? '1px solid #f0f0f0' : '1px solid #1890ff',
                  cursor: 'pointer'
                }}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  !notification.isRead && (
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      Mark as Read
                    </Button>
                  ),
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    Remove
                  </Button>
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong={!notification.isRead}>
                        {notification.title}
                      </Text>
                      <Tag color={getPriorityColor(notification.priority)}>
                        {(notification.priority || 'medium').toUpperCase()}
                      </Tag>
                      {!notification.isRead && (
                        <Badge status="processing" text="New" />
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        {notification.message}
                      </div>
                      <Space size="small">
                        <ClockCircleOutlined />
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
    </div>
  );
};

export default NotificationsPage; 