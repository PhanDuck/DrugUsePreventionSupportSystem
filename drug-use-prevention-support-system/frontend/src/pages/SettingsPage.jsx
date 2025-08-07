import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Select, message, Row, Col, Divider, Typography, Alert } from 'antd';
import { UserOutlined, BellOutlined, SecurityScanOutlined, SettingOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import userService from '../services/userService';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    appointmentReminders: true,
    courseUpdates: true,
    systemNotifications: false,
    
    // Privacy settings  
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    
    // System preferences
    language: 'en',
    timezone: 'UTC',
    theme: 'light'
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        message.error('User not authenticated');
        return;
      }

      setCurrentUser(user);

      // Try to get user profile with detailed settings
      try {
        const profileResponse = await userService.getUserProfile(user.id);
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data;
          
          // Update form with user data
          form.setFieldsValue({
            firstName: profile.firstName || user.firstName,
            lastName: profile.lastName || user.lastName,
            email: profile.email || user.email,
            phone: profile.phone || '',
            bio: profile.bio || ''
          });

          // Load user preferences (would come from user settings API)
          setSettings(prevSettings => ({
            ...prevSettings,
            profileVisibility: profile.profileVisibility || 'public',
            showEmail: profile.showEmail !== false,
            showPhone: profile.showPhone !== false
          }));
        }
      } catch (error) {
        console.log('Could not load detailed profile, using basic user data');
        // Fallback to basic user data
        form.setFieldsValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          bio: user.bio || ''
        });
      }

      message.success('Settings loaded successfully');
    } catch (error) {
      console.error('Error loading user settings:', error);
      message.error('Failed to load user settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (values) => {
    setLoading(true);
    try {
      if (!currentUser) {
        message.error('User not authenticated');
        return;
      }

      // Update user profile
      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        bio: values.bio,
        profileVisibility: settings.profileVisibility,
        showEmail: settings.showEmail,
        showPhone: settings.showPhone
      };

      const response = await userService.updateUserProfile(currentUser.id, updateData);
      
      if (response.success) {
        message.success('Profile updated successfully');
        
        // Update current user in auth service
        const updatedUser = { ...currentUser, ...updateData };
        authService.updateCurrentUser(updatedUser);
        setCurrentUser(updatedUser);
      } else {
        message.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = async (settingKey, value) => {
    try {
      const newSettings = { ...settings, [settingKey]: value };
      setSettings(newSettings);

      // In a real app, this would save to backend
      // For now, we'll just show a success message
      message.success('Setting updated');
      
      // TODO: Implement settings save API
      // await userService.updateUserSettings(currentUser.id, newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      message.error('Failed to update setting');
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!currentUser?.email) {
        message.error('Email not found');
        return;
      }

      // This would typically call a password reset API
      message.info('Password reset instructions have been sent to your email');
      
      // TODO: Implement password reset API
      // await authService.requestPasswordReset(currentUser.email);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      message.error('Failed to send password reset email');
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>
        <SettingOutlined /> Settings
      </Title>

      {/* Profile Settings */}
      <Card 
        title={
          <span>
            <UserOutlined style={{ marginRight: '8px' }} />
            Profile Information
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleProfileSave}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Bio"
          >
            <Input.TextArea rows={3} placeholder="Tell us about yourself..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Privacy Settings */}
      <Card 
        title={
          <span>
            <SecurityScanOutlined style={{ marginRight: '8px' }} />
            Privacy Settings
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Profile Visibility</Text>
          <br />
          <Select
            value={settings.profileVisibility}
            onChange={(value) => handleSettingsChange('profileVisibility', value)}
            style={{ width: '200px', marginTop: '8px' }}
          >
            <Option value="public">Public</Option>
            <Option value="private">Private</Option>
            <Option value="consultants">Consultants Only</Option>
          </Select>
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text strong>Show Email Address</Text>
            <br />
            <Text type="secondary">Allow others to see your email address</Text>
          </div>
          <Switch
            checked={settings.showEmail}
            onChange={(checked) => handleSettingsChange('showEmail', checked)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>Show Phone Number</Text>
            <br />
            <Text type="secondary">Allow others to see your phone number</Text>
          </div>
          <Switch
            checked={settings.showPhone}
            onChange={(checked) => handleSettingsChange('showPhone', checked)}
          />
        </div>
      </Card>

      {/* Notification Settings */}
      <Card 
        title={
          <span>
            <BellOutlined style={{ marginRight: '8px' }} />
            Notification Preferences
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text strong>Email Notifications</Text>
            <br />
            <Text type="secondary">Receive notifications via email</Text>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onChange={(checked) => handleSettingsChange('emailNotifications', checked)}
          />
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text strong>Appointment Reminders</Text>
            <br />
            <Text type="secondary">Get notified about upcoming appointments</Text>
          </div>
          <Switch
            checked={settings.appointmentReminders}
            onChange={(checked) => handleSettingsChange('appointmentReminders', checked)}
          />
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text strong>Course Updates</Text>
            <br />
            <Text type="secondary">Notifications about new courses and progress</Text>
          </div>
          <Switch
            checked={settings.courseUpdates}
            onChange={(checked) => handleSettingsChange('courseUpdates', checked)}
          />
        </div>

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>System Notifications</Text>
            <br />
            <Text type="secondary">System maintenance and update notifications</Text>
          </div>
          <Switch
            checked={settings.systemNotifications}
            onChange={(checked) => handleSettingsChange('systemNotifications', checked)}
          />
        </div>
      </Card>

      {/* System Preferences */}
      <Card 
        title={
          <span>
            <SettingOutlined style={{ marginRight: '8px' }} />
            System Preferences
          </span>
        }
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Language</Text>
              <br />
              <Select
                value={settings.language}
                onChange={(value) => handleSettingsChange('language', value)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="en">English</Option>
                <Option value="vi">Tiếng Việt</Option>
              </Select>
            </div>
          </Col>
          
          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Timezone</Text>
              <br />
              <Select
                value={settings.timezone}
                onChange={(value) => handleSettingsChange('timezone', value)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="UTC">UTC</Option>
                <Option value="Asia/Ho_Chi_Minh">Ho Chi Minh</Option>
                <Option value="America/New_York">New York</Option>
              </Select>
            </div>
          </Col>

          <Col span={8}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Theme</Text>
              <br />
              <Select
                value={settings.theme}
                onChange={(value) => handleSettingsChange('theme', value)}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
                <Option value="auto">Auto</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Security Actions */}
      <Card title="Security Actions">
        <Alert
          message="Password Security"
          description="If you need to change your password, we'll send reset instructions to your email."
          type="info"
          style={{ marginBottom: '16px' }}
        />
        
        <Button onClick={handlePasswordReset}>
          Send Password Reset Email
        </Button>
      </Card>
    </div>
  );
};

export default SettingsPage; 