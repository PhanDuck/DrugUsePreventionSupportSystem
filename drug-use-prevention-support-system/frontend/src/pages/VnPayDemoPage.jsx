import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, message, Steps, Form, Input, Select, Radio } from 'antd';
import { CreditCardOutlined, QrcodeOutlined, CheckCircleOutlined, BankOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;

const VnPayDemoPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const courseId = searchParams.get('courseId');
  const amount = searchParams.get('amount');
  const courseName = searchParams.get('courseName');
  const type = 'course'; // Only handle course payments now

  const testCards = [
    { 
      name: 'Thẻ thành công (NCB)', 
      number: '9704198526191432198', 
      bank: 'NCB',
      type: 'ATM',
      result: 'success'
    },
    { 
      name: 'Thẻ không đủ số dư (NCB)', 
      number: '9704195798459170488', 
      bank: 'NCB',
      type: 'ATM',
      result: 'insufficient'
    },
    { 
      name: 'Thẻ quốc tế VISA', 
      number: '4456530000001005', 
      bank: 'VISA',
      type: 'INTERNATIONAL',
      result: 'success'
    }
  ];

  const handlePaymentSubmit = async (values) => {
    setCurrentStep(1);
    
    // 🐛 DEBUG: Log để check card validation
    console.log('🔍 DEBUG - Payment Values:', values);
    console.log('🔍 DEBUG - Card Number entered:', values.cardNumber);
    console.log('🔍 DEBUG - Available test cards:', testCards);
    
    // Simulate payment processing
    setTimeout(() => {
      const selectedCard = testCards.find(card => card.number === values.cardNumber);
      
      // 🐛 DEBUG: Log selected card result
      console.log('🔍 DEBUG - Selected card:', selectedCard);
      console.log('🔍 DEBUG - Card result:', selectedCard?.result);
      console.log('🔍 DEBUG - Payment type:', type);
      
      if (selectedCard && selectedCard.result === 'success') {
        console.log('✅ SUCCESS - Navigating to success page');
        setCurrentStep(2); // SUCCESS STEP
        message.success('Thanh toán thành công!');
        setTimeout(() => {
          navigate(`/payment/return?success=true&courseId=${courseId}&vnp_ResponseCode=00&vnp_TxnRef=DEMO_${Date.now()}&vnp_Amount=${amount || 190000}&vnp_TransactionNo=DEMO_TXN_${Date.now()}`);
        }, 2000);
      } else {
        console.log('❌ FAILED - Navigating to fail page');
        setCurrentStep(3); // FAIL STEP
        message.error('Thanh toán thất bại - Thẻ không đủ số dư');
        setTimeout(() => {
          navigate(`/payment/return?success=false&courseId=${courseId}&vnp_ResponseCode=99&vnp_TxnRef=DEMO_FAIL_${Date.now()}`);
        }, 2000);
      }
    }, 3000);
  };

  const fillTestCard = (card) => {
    form.setFieldsValue({
      cardNumber: card.number,
      cardHolder: 'NGUYEN VAN A',
      expiryDate: '07/15',
      cvv: '123'
    });
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
          maxWidth: '800px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            <BankOutlined /> CỔNG THANH TOÁN VNPAY
          </Title>
          <Text type="secondary">
            VNPay Sandbox Demo - Thanh toán an toàn
          </Text>
        </div>

        <Divider />

        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>Thông tin thanh toán</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Khóa học:</Text>
              <Text strong>{courseName || 'Test Course'}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Số tiền:</Text>
              <Text strong style={{ color: '#52c41a', fontSize: '18px' }}>
                {amount ? `${parseInt(amount).toLocaleString()} VND` : '190,000 VND'}
              </Text>
            </div>
          </Space>
        </div>

        <Divider />

        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="Nhập thông tin" icon={<CreditCardOutlined />} />
          <Step title="Xử lý" icon={<QrcodeOutlined />} />
          <Step title="Hoàn tất" icon={<CheckCircleOutlined />} />
        </Steps>

        {currentStep === 0 && (
          <div>
            <Radio.Group 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ marginBottom: '16px' }}
            >
              <Radio.Button value="card">
                <CreditCardOutlined /> Thẻ ATM/Thẻ quốc tế
              </Radio.Button>
              <Radio.Button value="qr">
                <QrcodeOutlined /> QR Code
              </Radio.Button>
            </Radio.Group>

            {paymentMethod === 'card' && (
              <Form form={form} onFinish={handlePaymentSubmit} layout="vertical">
                <Form.Item label="Thẻ test nhanh:" style={{ marginBottom: '8px' }}>
                  <Space wrap>
                    {testCards.map((card, index) => (
                      <Button 
                        key={index} 
                        size="small" 
                        onClick={() => fillTestCard(card)}
                        type={card.result === 'success' ? 'primary' : 'default'}
                      >
                        {card.name}
                      </Button>
                    ))}
                  </Space>
                </Form.Item>

                <Form.Item 
                  name="cardNumber" 
                  label="Số thẻ" 
                  rules={[{ required: true, message: 'Vui lòng nhập số thẻ!' }]}
                >
                  <Input placeholder="Nhập số thẻ" maxLength={19} />
                </Form.Item>

                <Form.Item 
                  name="cardHolder" 
                  label="Tên chủ thẻ" 
                  rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ!' }]}
                >
                  <Input placeholder="NGUYEN VAN A" />
                </Form.Item>

                <Space>
                  <Form.Item 
                    name="expiryDate" 
                    label="Ngày hết hạn" 
                    rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn!' }]}
                  >
                    <Input placeholder="MM/YY" maxLength={5} />
                  </Form.Item>

                  <Form.Item 
                    name="cvv" 
                    label="CVV" 
                    rules={[{ required: true, message: 'Vui lòng nhập CVV!' }]}
                  >
                    <Input placeholder="123" maxLength={3} />
                  </Form.Item>
                </Space>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Thanh toán ngay
                  </Button>
                </Form.Item>
              </Form>
            )}

            {paymentMethod === 'qr' && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <QrcodeOutlined style={{ fontSize: '120px', color: '#1890ff' }} />
                <Title level={4} style={{ marginTop: '16px' }}>
                  Quét mã QR để thanh toán
                </Title>
                <Text type="secondary">
                  Sử dụng ứng dụng ngân hàng để quét mã QR này
                </Text>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <QrcodeOutlined style={{ fontSize: '48px', color: '#1890ff' }} spin />
            <Title level={3} style={{ marginTop: '16px' }}>
              Đang xử lý thanh toán...
            </Title>
            <Text type="secondary">
              Vui lòng chờ trong giây lát
            </Text>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <Title level={3} style={{ color: '#52c41a' }}>
              Thanh toán thành công!
            </Title>
            <Text>
              Khóa học đã được đăng ký thành công
            </Text>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
            <Title level={3} style={{ color: '#ff4d4f' }}>
              Thanh toán thất bại!
            </Title>
            <Text>
              Đăng ký khóa học không thành công - Thẻ không đủ số dư
            </Text>
          </div>
        )}

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Đây là trang demo VNPay sandbox. Không có giao dịch thật nào được thực hiện.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default VnPayDemoPage; 