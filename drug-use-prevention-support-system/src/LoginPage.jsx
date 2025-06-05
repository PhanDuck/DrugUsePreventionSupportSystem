import React from 'react';
import { Form, Input, Button, Card, Typography, Layout, Row, Col } from 'antd';
const { Title } = Typography;
const { Content } = Layout;

export default function LoginPage() {
  const onFinish = (values) => {
    // Xử lý đăng nhập ở đây
    alert('Đăng nhập thành công!');
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '40px' }}>
        <Row justify="center">
          <Col xs={24} md={8}>
            <Card>
              <Title level={3}>Đăng nhập</Title>
              <Form name="login" onFinish={onFinish} layout="vertical">
                <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}> <Input /> </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> <Input.Password /> </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 