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
      title: 'Enter email',
      description: 'Enter registered email',
    },
    {
      title: 'Verify',
      description: 'Enter verification code',
    },
    {
      title: 'Reset password',
      description: 'Create new password',
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
        throw new Error('Unable to send verification code');
      }

      setEmail(values.email);
      setCurrentStep(1);
      message.success('Verification code has been sent to your email!');
    } catch (error) {
      message.error(error.message || 'An error occurred. Please try again!');
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
        throw new Error('Invalid verification code');
      }

      setVerificationCode(values.code);
      setCurrentStep(2);
      message.success('Verification successful!');
    } catch (error) {
      message.error(error.message || 'An error occurred. Please try again!');
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
        throw new Error('Unable to reset password');
      }

      message.success('Password reset successful! Please login again.');
      navigate('/login');
    } catch (error) {
      message.error(error.message || 'An error occurred. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject('Please enter new password!');
    }
    if (value.length < 6) {
      return Promise.reject('Password must be at least 6 characters!');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return Promise.reject('Password must contain at least 1 uppercase, 1 lowercase and 1 number!');
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject('Please confirm password!');
    }
    if (value !== form.getFieldValue('newPassword')) {
      return Promise.reject('Password confirmation does not match!');
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
                { required: true, message: 'Please enter email!' },
                { type: 'email', message: 'Invalid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#1f7c83' }} />}
                placeholder="Registered email"
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
                Send verification code
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
                { required: true, message: 'Please enter verification code!' },
                { len: 6, message: 'Verification code must be 6 characters!' }
              ]}
            >
              <Input
                placeholder="Enter 6-digit verification code"
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
                Verify
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
                placeholder="New password"
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
                placeholder="Confirm new password"
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
                Reset password
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
                    Forgot Password
                  </Title>
                  <Text type="secondary">
                    Please follow the steps to reset your password
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
                    Remember your password?{' '}
                    <Button
                      type="link"
                      onClick={() => navigate('/login')}
                      style={{ padding: 0, color: '#1f7c83' }}
                    >
                      Login now
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