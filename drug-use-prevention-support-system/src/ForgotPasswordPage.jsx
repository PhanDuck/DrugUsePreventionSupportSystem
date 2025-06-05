import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Layout, Row, Col, message, Space, Steps } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const { Content } = Layout;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const steps = [
    {
      title: 'Nhập email',
      description: 'Nhập email đã đăng ký',
    },
    {
      title: 'Xác thực',
      description: 'Nhập mã xác thực',
    },
    {
      title: 'Đặt lại mật khẩu',
      description: 'Tạo mật khẩu mới',
    },
  ];

  const handleSendVerificationCode = async (values) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error('Không thể gửi mã xác thực');
      }

      setEmail(values.email);
      setCurrentStep(1);
      message.success('Mã xác thực đã được gửi đến email của bạn!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (values) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: values.code,
        }),
      });

      if (!response.ok) {
        throw new Error('Mã xác thực không đúng');
      }

      setVerificationCode(values.code);
      setCurrentStep(2);
      message.success('Xác thực thành công!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
          newPassword: values.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể đặt lại mật khẩu');
      }

      message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập mật khẩu mới!');
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
    if (value !== form.getFieldValue('newPassword')) {
      return Promise.reject('Mật khẩu xác nhận không khớp!');
    }
    return Promise.resolve();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form
            form={form}
            onFinish={handleSendVerificationCode}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#1f7c83' }} />}
                placeholder="Email đã đăng ký"
                type="email"
              />
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
                Gửi mã xác thực
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form
            form={form}
            onFinish={handleVerifyCode}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="code"
              rules={[
                { required: true, message: 'Vui lòng nhập mã xác thực!' },
                { len: 6, message: 'Mã xác thực phải có 6 ký tự!' }
              ]}
            >
              <Input
                placeholder="Nhập mã xác thực 6 ký tự"
                maxLength={6}
              />
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
                Xác thực
              </Button>
            </Form.Item>
          </Form>
        );

      case 2:
        return (
          <Form
            form={form}
            onFinish={handleResetPassword}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="newPassword"
              rules={[
                { validator: validatePassword }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1f7c83' }} />}
                placeholder="Mật khẩu mới"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { validator: validateConfirmPassword }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1f7c83' }} />}
                placeholder="Xác nhận mật khẩu mới"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
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
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1f7c83 0%, #6edcc1 100%)'
    }}>
      <Content style={{ 
        padding: 'clamp(16px, 3vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Row style={{ width: '100%', maxWidth: '500px' }}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={3} style={{ color: '#1f7c83', marginBottom: '8px' }}>
                    Quên mật khẩu
                  </Title>
                  <Text type="secondary">
                    Vui lòng làm theo các bước để đặt lại mật khẩu
                  </Text>
                </div>

                <Steps
                  current={currentStep}
                  items={steps}
                  style={{ marginBottom: '32px' }}
                />

                {renderStepContent()}

                <div style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                  <Text type="secondary">
                    Đã nhớ mật khẩu?{' '}
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
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 