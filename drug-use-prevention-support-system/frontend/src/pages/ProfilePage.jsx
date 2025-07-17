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
      message.error('Unable to load user information');
    }
  };

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const response = await userService.updateProfile(values);
      if (response.success) {
        message.success('Profile updated successfully');
        setEditing(false);
        fetchUserProfile();
      } else {
        message.error(response.message || 'Update failed');
      }
    } catch (error) {
      message.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'ADMIN': 'Administrator',
      'MANAGER': 'Manager',
      'CONSULTANT': 'Consultant',
      'STAFF': 'Staff',
      'USER': 'User'
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
        <div>Loading information...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card title="Personal Information" style={{ marginBottom: '24px' }}>
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
                <Tag color={getRoleColor(authService.getUserRole())} style={{ fontSize: '14px' }}>
                  {getRoleDisplayName(authService.getUserRole())}
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
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Enter last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Invalid email format' }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
              >
                <Input.TextArea rows={3} placeholder="Enter address" />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
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
                        Save Changes
                      </Button>
                      <Button onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="primary" 
                      onClick={() => setEditing(true)}
                      icon={<EditOutlined />}
                    >
                      Edit
                    </Button>
                  )}
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* Account Statistics */}
      <Card title="Account Statistics" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>5</div>
              <div style={{ color: '#666' }}>Courses</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>12</div>
              <div style={{ color: '#666' }}>Appointments</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>8</div>
              <div style={{ color: '#666' }}>Assessments</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>3</div>
              <div style={{ color: '#666' }}>Certificates</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="default" block>
            Change Password
          </Button>
          <Button type="default" block>
            Two-Factor Authentication
          </Button>
          <Button type="default" block>
            Login Device Management
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage; 