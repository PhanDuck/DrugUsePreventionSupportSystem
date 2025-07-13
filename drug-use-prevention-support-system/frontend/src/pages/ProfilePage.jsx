import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Divider, Row, Col, Tag, Space } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import userService from '../services/userService';

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        form.setFieldsValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
        });
      }
    } catch (error) {
      message.error('Không thể tải thông tin người dùng');
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const response = await userService.updateProfile(values);
      if (response.success) {
        message.success('Cập nhật thông tin thành công');
        setEditing(false);
        fetchUserProfile();
      } else {
        message.error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'ADMIN': 'Quản trị viên',
      'MANAGER': 'Quản lý',
      'CONSULTANT': 'Tư vấn viên',
      'STAFF': 'Nhân viên',
      'USER': 'Người dùng'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'ADMIN': 'red',
      'MANAGER': 'blue',
      'CONSULTANT': 'green',
      'STAFF': 'orange',
      'USER': 'default'
    };
    return colors[role] || 'default';
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card title="Thông Tin Cá Nhân" style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <div>
                <h3>{user.firstName} {user.lastName}</h3>
                <Tag color={getRoleColor(user.role)} style={{ fontSize: '14px' }}>
                  {getRoleDisplayName(user.role)}
                </Tag>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editing}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nhập tên" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nhập họ" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Địa chỉ"
              >
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
              >
                <Input placeholder="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item>
                <Space>
                  {editing ? (
                    <>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        icon={<SaveOutlined />}
                      >
                        Lưu thay đổi
                      </Button>
                      <Button onClick={() => setEditing(false)}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="primary" 
                      onClick={() => setEditing(true)}
                      icon={<EditOutlined />}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* Account Statistics */}
      <Card title="Thống Kê Tài Khoản" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {user.appointmentCount || 0}
              </div>
              <div style={{ color: '#666' }}>Lịch hẹn</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {user.courseCount || 0}
              </div>
              <div style={{ color: '#666' }}>Khóa học</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {user.assessmentCount || 0}
              </div>
              <div style={{ color: '#666' }}>Đánh giá</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                {user.blogCount || 0}
              </div>
              <div style={{ color: '#666' }}>Bài viết</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Security Settings */}
      <Card title="Bảo Mật">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="default" block>
            Đổi mật khẩu
          </Button>
          <Button type="default" block>
            Bật xác thực 2 yếu tố
          </Button>
          <Button type="default" block>
            Quản lý thiết bị đăng nhập
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage; 