import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, message, Steps } from 'antd';
import { CheckCircleOutlined, CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const MockPaymentPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get('courseId');
  const amount = searchParams.get('amount');
  const courseName = searchParams.get('courseName');
  const type = searchParams.get('type'); // 'course' or 'appointment'
  const consultantId = searchParams.get('consultantId');
  const description = searchParams.get('description');

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => {
        setCurrentStep(2);
        setPaymentStatus('success');
        message.success('Payment completed successfully!');
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePaymentSuccess = () => {
    if (type === 'appointment') {
      message.success('Appointment booking completed!');
      navigate('/appointments');
    } else {
      message.success('Course enrollment completed!');
      navigate('/courses');
    }
  };

  const handlePaymentFailure = () => {
    message.error('Payment failed. Please try again.');
    if (type === 'appointment') {
      navigate('/appointments');
    } else {
      navigate('/courses');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '600px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            🧪 Mock Payment Gateway
          </Title>
          <Text type="secondary">
            This is a test payment page for development purposes
          </Text>
        </div>

        <Divider />

        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>Payment Details</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Course:</Text>
              <Text strong>{courseName || 'Test Course'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Amount:</Text>
              <Text strong style={{ color: '#52c41a' }}>
                {amount ? `${parseInt(amount).toLocaleString()} VND` : '190,000 VND'}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Payment Method:</Text>
              <Text strong>Mock Payment Gateway</Text>
            </div>
          </Space>
        </div>

        <Divider />

        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="Processing" icon={<CreditCardOutlined />} />
          <Step title="Verifying" icon={<QrcodeOutlined />} />
          <Step title="Completed" icon={<CheckCircleOutlined />} />
        </Steps>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {paymentStatus === 'pending' && (
            <div>
              <Text type="secondary">Processing payment...</Text>
              <div style={{ marginTop: '16px' }}>
                <Button type="primary" loading>
                  Processing...
                </Button>
              </div>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div>
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={3} style={{ color: '#52c41a' }}>
                Payment Successful!
              </Title>
              <Paragraph>
                Your course enrollment has been completed successfully.
                You can now access the course content.
              </Paragraph>
              <Space>
                <Button type="primary" onClick={handlePaymentSuccess}>
                  Continue to Courses
                </Button>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </Space>
            </div>
          )}
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            This is a mock payment gateway for development and testing purposes only.
            No real money will be charged.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MockPaymentPage; 