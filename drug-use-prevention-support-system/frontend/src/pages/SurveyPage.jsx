import React from 'react';
import { Typography, Card, Button, Layout, Row, Col } from 'antd';
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function SurveyPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        padding: 'clamp(20px, 5vw, 40px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Row justify="center">
          <Col xs={24} md={16}>
            <Card style={{ 
              padding: 'clamp(24px, 4vw, 32px)'
            }}>
              <Title level={3} style={{ 
                fontSize: 'clamp(20px, 3vw, 24px)',
                marginBottom: 'clamp(16px, 2vw, 24px)'
              }}>Khảo sát phòng ngừa ma túy</Title>
              <Paragraph style={{ 
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                marginBottom: 'clamp(24px, 4vw, 32px)'
              }}>
                Tham gia khảo sát giúp bạn:
                <ul style={{ 
                  marginTop: 'clamp(12px, 2vw, 16px)',
                  paddingLeft: 'clamp(20px, 3vw, 24px)'
                }}>
                  <li style={{ 
                    marginBottom: 'clamp(8px, 1.5vw, 12px)',
                    fontSize: 'clamp(14px, 1.5vw, 16px)'
                  }}>Đánh giá mức độ nguy cơ sử dụng ma túy của bản thân.</li>
                  <li style={{ 
                    marginBottom: 'clamp(8px, 1.5vw, 12px)',
                    fontSize: 'clamp(14px, 1.5vw, 16px)'
                  }}>Nhận được khuyến nghị phù hợp từ hệ thống.</li>
                  <li style={{ 
                    marginBottom: 'clamp(8px, 1.5vw, 12px)',
                    fontSize: 'clamp(14px, 1.5vw, 16px)'
                  }}>Bảo mật thông tin cá nhân, hoàn toàn ẩn danh.</li>
                  <li style={{ 
                    marginBottom: 'clamp(8px, 1.5vw, 12px)',
                    fontSize: 'clamp(14px, 1.5vw, 16px)'
                  }}>Góp phần xây dựng cộng đồng an toàn, lành mạnh.</li>
                </ul>
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                style={{ 
                  height: 'clamp(40px, 5vw, 48px)',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  padding: '0 clamp(24px, 4vw, 32px)'
                }}
              >
                Làm khảo sát
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 
/////////