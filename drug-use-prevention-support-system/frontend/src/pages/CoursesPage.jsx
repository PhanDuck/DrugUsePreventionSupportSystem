import React from 'react';
import { List, Card, Typography, Layout, Row, Col, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
const { Title, Paragraph } = Typography;
const { Content } = Layout;

const courses = [
  {
    title: 'Nhận thức về ma túy',
    description: 'Khóa học giúp nhận biết các loại ma túy, tác hại và cách phòng tránh.',
    image: 'https://images.unsplash.com/photo-1558010089-ff6fd29ea39a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '6h18p',
  },
  {
    title: 'Kỹ năng phòng tránh',
    description: 'Trang bị kỹ năng từ chối, ứng phó với nguy cơ sử dụng ma túy.',
    image: 'https://images.unsplash.com/photo-1580836618305-605c32623ae0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '4h30p',
  },
  {
    title: 'Hỗ trợ gia đình',
    description: 'Hướng dẫn phụ huynh, giáo viên hỗ trợ người trẻ phòng ngừa ma túy.',
    image: 'https://plus.unsplash.com/premium_photo-1664373232872-e1301e6e610b?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '3h45p',
  }
];

export default function CoursesPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        padding: 'clamp(20px, 5vw, 40px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Row justify="center">
          <Col xs={24} md={20}>
            <Title level={3} style={{ 
              fontSize: 'clamp(20px, 3vw, 24px)',
              marginBottom: 'clamp(24px, 4vw, 32px)'
            }}>Các khóa học về phòng ngừa ma túy</Title>
            <Row gutter={[24, 24]}>
              {courses.map((item, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <Card
                    hoverable
                    cover={<img alt={item.title} src={item.image} style={{ 
                      height: 'clamp(160px, 25vw, 180px)', 
                      objectFit: 'cover' 
                    }} />}
                    actions={[
                      <Button type="primary" block>ĐĂNG KÝ HỌC</Button>
                    ]}
                    style={{ height: '100%' }}
                  >
                    <Title level={4} style={{ 
                      fontSize: 'clamp(16px, 2vw, 18px)',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>{item.title}</Title>
                    <Paragraph style={{ 
                      fontSize: 'clamp(14px, 1.5vw, 16px)',
                      marginBottom: 'clamp(8px, 1.5vw, 12px)'
                    }}>{item.description}</Paragraph>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      marginTop: 'clamp(8px, 1.5vw, 12px)'
                    }}>
                      <ClockCircleOutlined style={{ 
                        fontSize: 'clamp(16px, 1.5vw, 18px)', 
                        color: '#888' 
                      }} />
                      <span style={{ 
                        fontWeight: 500,
                        fontSize: 'clamp(14px, 1.5vw, 16px)'
                      }}>{item.duration}</span>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 