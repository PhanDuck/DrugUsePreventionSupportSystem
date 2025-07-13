import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, Select, InputNumber, Button, Space, Divider, Typography, Row, Col, Alert, message } from 'antd';
import { SaveOutlined, ReloadOutlined, SecurityScanOutlined, BellOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      appointments: true,
      courses: true,
      assessments: true,
      blogs: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginNotifications: true,
      deviceManagement: true
    },
    display: {
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      compactMode: false
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Mock loading settings - replace with actual API call
      form.setFieldsValue(settings);
    } catch (error) {
      message.error('Unable to load settings');
    }
  };

  const handleSaveSettings = async (values) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      console.log('Saving settings:', values);
      setSettings(values);
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('An error occurred while saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    form.setFieldsValue(settings);
    message.info('Settings have been restored');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>⚙️ Settings</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveSettings}
        initialValues={settings}
      >
        {/* Notification Settings */}
        <Card 
          title={
            <Space>
              <BellOutlined />
              <span>Notification Settings</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Title level={4}>Notification Channels</Title>
              <Form.Item name={['notifications', 'email']} label="Email notifications">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'push']} label="Push notifications">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'sms']} label="SMS notifications">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>Notification Types</Title>
              <Form.Item name={['notifications', 'appointments']} label="Appointments">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'courses']} label="Courses">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'assessments']} label="Assessments">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'blogs']} label="Blog posts">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Privacy Settings */}
        <Card 
          title={
            <Space>
              <UserOutlined />
              <span>Privacy</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item 
                name={['privacy', 'profileVisibility']} 
                label="Profile visibility"
              >
                <Select>
                  <Option value="public">Public</Option>
                  <Option value="friends">Friends</Option>
                  <Option value="private">Private</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['privacy', 'showEmail']} label="Show email">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={['privacy', 'showPhone']} label="Show phone number">
                <Switch />
              </Form.Item>
              <Form.Item name={['privacy', 'allowMessages']} label="Allow messages">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Security Settings */}
        <Card 
          title={
            <Space>
              <SecurityScanOutlined />
              <span>Security</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name={['security', 'twoFactorAuth']} label="Two-factor authentication">
                <Switch />
              </Form.Item>
              <Form.Item name={['security', 'loginNotifications']} label="Login notifications">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name={['security', 'sessionTimeout']} 
                label="Session timeout (minutes)"
              >
                <InputNumber min={5} max={480} />
              </Form.Item>
              <Form.Item name={['security', 'deviceManagement']} label="Device management">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Display Settings */}
        <Card 
          title={
            <Space>
              <GlobalOutlined />
              <span>Display</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'theme']} label="Theme">
                <Select>
                  <Option value="light">Light</Option>
                  <Option value="dark">Dark</Option>
                  <Option value="auto">Auto</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'language']} label="Language">
                <Select>
                  <Option value="en">English</Option>
                  <Option value="vi">Tiếng Việt</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'fontSize']} label="Font size">
                <Select>
                  <Option value="small">Small</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="large">Large</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['display', 'compactMode']} label="Compact mode">
            <Switch />
          </Form.Item>
        </Card>

        {/* Data Management */}
        <Card title="Data Management" style={{ marginBottom: '24px' }}>
          <Alert
            message="Personal data management"
            description="You can export or delete your personal data"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Space>
            <Button type="default" icon={<ReloadOutlined />}>
              Export data
            </Button>
            <Button type="default" danger>
              Delete account
            </Button>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Card>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              Save settings
            </Button>
            <Button 
              onClick={handleResetSettings}
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default SettingsPage; 