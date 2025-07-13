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
      language: 'vi',
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
      message.error('Không thể tải cài đặt');
    }
  };

  const handleSaveSettings = async (values) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      console.log('Saving settings:', values);
      setSettings(values);
      message.success('Cài đặt đã được lưu thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    form.setFieldsValue(settings);
    message.info('Cài đặt đã được khôi phục');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Title level={2}>⚙️ Cài Đặt</Title>
      
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
              <span>Cài Đặt Thông Báo</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Title level={4}>Kênh thông báo</Title>
              <Form.Item name={['notifications', 'email']} label="Email thông báo">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'push']} label="Thông báo đẩy">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'sms']} label="SMS thông báo">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>Loại thông báo</Title>
              <Form.Item name={['notifications', 'appointments']} label="Lịch hẹn">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'courses']} label="Khóa học">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'assessments']} label="Đánh giá">
                <Switch />
              </Form.Item>
              <Form.Item name={['notifications', 'blogs']} label="Bài viết">
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
              <span>Quyền Riêng Tư</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item 
                name={['privacy', 'profileVisibility']} 
                label="Hiển thị hồ sơ"
              >
                <Select>
                  <Option value="public">Công khai</Option>
                  <Option value="friends">Bạn bè</Option>
                  <Option value="private">Riêng tư</Option>
                </Select>
              </Form.Item>
              <Form.Item name={['privacy', 'showEmail']} label="Hiển thị email">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name={['privacy', 'showPhone']} label="Hiển thị số điện thoại">
                <Switch />
              </Form.Item>
              <Form.Item name={['privacy', 'allowMessages']} label="Cho phép nhận tin nhắn">
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
              <span>Bảo Mật</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name={['security', 'twoFactorAuth']} label="Xác thực 2 yếu tố">
                <Switch />
              </Form.Item>
              <Form.Item name={['security', 'loginNotifications']} label="Thông báo đăng nhập">
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name={['security', 'sessionTimeout']} 
                label="Thời gian phiên làm việc (phút)"
              >
                <InputNumber min={5} max={480} />
              </Form.Item>
              <Form.Item name={['security', 'deviceManagement']} label="Quản lý thiết bị">
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
              <span>Hiển Thị</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'theme']} label="Giao diện">
                <Select>
                  <Option value="light">Sáng</Option>
                  <Option value="dark">Tối</Option>
                  <Option value="auto">Tự động</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'language']} label="Ngôn ngữ">
                <Select>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name={['display', 'fontSize']} label="Cỡ chữ">
                <Select>
                  <Option value="small">Nhỏ</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="large">Lớn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['display', 'compactMode']} label="Chế độ thu gọn">
            <Switch />
          </Form.Item>
        </Card>

        {/* Data Management */}
        <Card title="Quản Lý Dữ Liệu" style={{ marginBottom: '24px' }}>
          <Alert
            message="Quản lý dữ liệu cá nhân"
            description="Bạn có thể xuất hoặc xóa dữ liệu cá nhân của mình"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Space>
            <Button type="default" icon={<ReloadOutlined />}>
              Xuất dữ liệu
            </Button>
            <Button type="default" danger>
              Xóa tài khoản
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
              Lưu cài đặt
            </Button>
            <Button 
              onClick={handleResetSettings}
              icon={<ReloadOutlined />}
            >
              Khôi phục
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default SettingsPage; 