import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Row, Col, message, Space, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Content } = Layout;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Đăng ký thất bại');
      }

      const data = await response.json();
      
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      message.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập mật khẩu!');
    }
    if (value.length < 6) {
      return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự!');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!');
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject('Vui lòng xác nhận mật khẩu!');
    }
    if (value !== form.getFieldValue('password')) {
      return Promise.reject('Mật khẩu xác nhận không khớp!');
    }
    return Promise.resolve();
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #1f7c83 0%, #6edcc1 100%)' }}>
      <Content style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}>
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.97)',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ color: '#1f7c83', marginBottom: '8px' }}>
                Đăng ký tài khoản
              </Title>
              <Text type="secondary">
                Tạo tài khoản mới để bắt đầu
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="fullName"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Họ và tên"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Email"
                  type="email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Tên đăng nhập"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { validator: validatePassword }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Mật khẩu"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { validator: validateConfirmPassword }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1f7c83' }} />}
                  placeholder="Xác nhận mật khẩu"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  { validator: (_, value) => 
                    value ? Promise.resolve() : Promise.reject('Vui lòng đồng ý với điều khoản sử dụng!')
                  }
                ]}
              >
                <Checkbox>
                  Tôi đồng ý với <a href="/terms" style={{ color: '#1f7c83' }}>điều khoản sử dụng</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    height: '40px',
                    background: '#1f7c83',
                    border: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <Text type="secondary">
                Đã có tài khoản?{' '}
                <Button
                  type="link"
                  onClick={() => navigate('/login')}
                  style={{ padding: 0, color: '#1f7c83' }}
                >
                  Đăng nhập ngay
                </Button>
              </Text>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
} 