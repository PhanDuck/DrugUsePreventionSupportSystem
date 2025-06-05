import React from 'react';
import { Typography, Card, Button, Layout, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function SurveyPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '40px' }}>
        <Row justify="center">
          <Col xs={24} md={16}>
            <Card>
              <Title level={3}>Khảo sát phòng ngừa ma túy</Title>
              <Paragraph>
                Tham gia khảo sát giúp bạn:
                <ul>
                  <li>Đánh giá mức độ nguy cơ sử dụng ma túy của bản thân.</li>
                  <li>Nhận được khuyến nghị phù hợp từ hệ thống.</li>
                  <li>Bảo mật thông tin cá nhân, hoàn toàn ẩn danh.</li>
                  <li>Góp phần xây dựng cộng đồng an toàn, lành mạnh.</li>
                </ul>
              </Paragraph>
              <Button type="primary" size="large">Làm khảo sát</Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 