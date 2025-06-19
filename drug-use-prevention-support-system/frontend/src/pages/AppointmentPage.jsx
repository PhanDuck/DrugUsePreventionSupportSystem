import React from 'react';
import { Typography, Card, Form, Input, DatePicker, Button, Layout, Row, Col, message } from 'antd';
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function AppointmentPage() {
  const onFinish = (values) => {
    message.success('Đăng ký tư vấn thành công! Vui lòng chuẩn bị phí dịch vụ.');
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          padding: 'clamp(20px, 5vw, 40px)',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        <Row justify="center">
          <Col xs={24} md={16}>
            <Card
              style={{
                padding: 'clamp(24px, 4vw, 32px)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                width: '100%',
                margin: '40px auto 0 auto'
              }}
            >
              <Title level={3}>Đặt lịch tư vấn cùng chuyên gia</Title>
              <Paragraph type="secondary">
                Vui lòng điền thông tin để đặt lịch tư vấn (dịch vụ có tính phí).
              </Paragraph>
              <Form layout="vertical" onFinish={onFinish} size="large">
                <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}> <Input /> </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}> <Input /> </Form.Item>
                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}> <Input /> </Form.Item>
                <Form.Item name="date" label="Chọn ngày tư vấn" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
                <Form.Item name="note" label="Ghi chú thêm (nếu có)"> <Input.TextArea rows={3} /> </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>Đặt lịch tư vấn (có tính phí)</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 