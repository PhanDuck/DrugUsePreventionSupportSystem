import React from 'react';
import { Typography, Layout, Card, Row, Col, Button, Space, List, Image, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Ảnh online miễn phí, đúng chủ đề
const featuredCourses = [
  {
    title: 'Nhận thức về ma túy',
    image: 'https://images.unsplash.com/photo-1558010089-ff6fd29ea39a?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '6h18p',
    ageGroup: 'Học sinh, sinh viên',
    description: 'Khóa học giúp nhận biết các loại ma túy, tác hại và cách phòng tránh.',
    link: '/courses/1',
  },
  {
    title: 'Kỹ năng phòng tránh',
    image: 'https://images.unsplash.com/photo-1580836618305-605c32623ae0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '4h30p',
    ageGroup: 'Thanh thiếu niên',
    description: 'Trang bị kỹ năng từ chối, ứng phó với nguy cơ sử dụng ma túy.',
    link: '/courses/2',
  },
  {
    title: 'Hỗ trợ gia đình',
    image: 'https://plus.unsplash.com/premium_photo-1664373232872-e1301e6e610b?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    duration: '3h45p',
    ageGroup: 'Phụ huynh, giáo viên',
    description: 'Hướng dẫn phụ huynh, giáo viên hỗ trợ người trẻ phòng ngừa ma túy.',
    link: '/courses/3',
  },
];

const featuredPosts = [
  {
    id: 1,
    title: "Dấu hiệu nhận biết sớm sử dụng ma túy ở thanh thiếu niên",
    image: "https://images.unsplash.com/photo-1627677387972-dd554a163ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Teenager
    tags: ["Kinh nghiệm"],
    link: "/blog/1",
  },
  {
    id: 2,
    title: "Vai trò của giáo viên trong phòng ngừa ma túy học đường",
    image: "https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Teacher
    tags: ["Chia sẻ"],
    link: "/blog/2",
  },
];

const featuredVideos = [
  {
    id: 1,
    title: "Video: Câu chuyện thật về vượt qua cám dỗ ma túy",
    image: "https://plus.unsplash.com/premium_photo-1723600889165-6be7aded1f3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Hành trình vượt qua
    link: "/videos/1",
  },
  {
    id: 2,
    title: "Tư vấn nhanh: Kỹ năng từ chối khi bị rủ rê",
    image: "https://plus.unsplash.com/premium_photo-1663089533037-9a99d0c93129?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Tư vấn, giao tiếp
    link: "/videos/2",
  },
];

export default function HomePage() {
  return (
      <Layout style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Content style={{ padding: 0 }}>
          {/* Banner đầu trang */}
          <div style={{
            background: 'linear-gradient(120deg, #1f7c83 60%, #6edcc1 100%)',
            color: '#fff', padding: '60px 0 40px 0', textAlign: 'center'
          }}>
            <Title style={{ color: '#fff', fontWeight: 700 }}>
              Cùng Cộng Đồng Đẩy Lùi Ma Túy
            </Title>
            <Paragraph style={{ color: '#fff', fontSize: 18, maxWidth: 550, margin: '0 auto 24px auto' }}>
              Hỗ trợ, giáo dục, phòng ngừa và xây dựng môi trường lành mạnh cho thế hệ trẻ.
            </Paragraph>
            <Space>
              <Link to="/courses">
                <Button size="large" type="primary" style={{ fontWeight: 600 }}>Khóa học nổi bật</Button>
              </Link>
              <Link to="/survey">
                <Button size="large">Làm khảo sát nguy cơ</Button>
              </Link>
              <Link to="/appointment">
                <Button size="large" type="default">Tư vấn cùng chuyên gia</Button>
              </Link>
            </Space>
          </div>

          {/* Khóa học nổi bật */}
          <div style={{ marginTop: 64 }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>Khóa học nổi bật</Title>
            <Row gutter={[24, 24]} justify="center">
              {featuredCourses.map((course, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                  <Card
                    hoverable
                    cover={<img alt={course.title} src={course.image} style={{ height: 180, objectFit: 'cover' }} />}
                    style={{ textAlign: 'center', minHeight: 300 }}
                  >
                    <span style={{ display: 'block', marginBottom: 8 }}>
                      <Tag color="blue">{course.ageGroup}</Tag>
                    </span>
                    <Title level={4}>{course.title}</Title>
                    <Paragraph style={{ minHeight: 48 }}>{course.description}</Paragraph>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, marginBottom: 16 }}>
                      <ClockCircleOutlined style={{ fontSize: 18, color: '#888' }} />
                      <span style={{ fontWeight: 500 }}>{course.duration}</span>
                    </div>
                    <Link to={course.link}>
                      <Button size="small" type="primary">Xem chi tiết</Button>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Bài viết & Video nổi bật */}
          <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
            <Row gutter={32}>
              <Col xs={24} md={12}>
                <Title level={4} style={{ margin: '16px 0' }}>Bài viết nổi bật</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={featuredPosts}
                    renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                              avatar={
                                <Image
                                    preview={false}
                                    src={item.image}
                                    width={80}
                                    height={60}
                                    style={{ objectFit: 'cover', borderRadius: 7 }}
                                />
                              }
                              title={<Link to={item.link}>{item.title}</Link>}
                              description={
                                <div>
                                  {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </div>
                              }
                          />
                        </List.Item>
                    )}
                />
                <Link to="/blog"><Button type="link">Xem tất cả bài viết</Button></Link>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4} style={{ margin: '16px 0' }}>Video nổi bật</Title>
                <Row gutter={[16, 16]}>
                  {featuredVideos.map(video => (
                      <Col xs={24} sm={12} key={video.id}>
                        <Card
                            hoverable
                            cover={
                              <Image
                                  preview={false}
                                  height={80}
                                  src={video.image}
                                  alt={video.title}
                                  style={{ objectFit: 'cover' }}
                              />
                            }
                            bodyStyle={{ padding: 12 }}
                            style={{ borderRadius: 10 }}
                        >
                          <Title level={5} style={{ marginBottom: 4 }}>
                            <Link to={video.link}>{video.title}</Link>
                          </Title>
                        </Card>
                      </Col>
                  ))}
                </Row>
                <Link to="/videos"><Button type="link">Xem tất cả video</Button></Link>
              </Col>
            </Row>
          </div>

          {/* Giới thiệu nhanh & liên kết chính */}
          <div style={{ background: '#fff', marginTop: 30, padding: 32 }}>
            <Row gutter={32} align="middle">
              <Col xs={24} md={16}>
                <Title level={4}>Về chúng tôi</Title>
                <Paragraph>
                  <b>Tổ chức Tình nguyện 3 chữ</b> cam kết đồng hành cùng cộng đồng trong công tác phòng ngừa và giảm tác hại của ma túy. Chúng tôi cung cấp các chương trình giáo dục, khảo sát đánh giá, tư vấn và nhiều hoạt động truyền thông hiệu quả.
                </Paragraph>
                <Space size="middle">
                  <Link to="/blog">Chia sẻ kinh nghiệm</Link>
                  <Link to="/survey">Khảo sát đánh giá nguy cơ</Link>
                  <Link to="/appointment">Đặt lịch hẹn tư vấn</Link>
                </Space>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <img src="https://plus.unsplash.com/premium_photo-1675865396004-c7b86406affe?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="community support" width={100} />
                <Paragraph>
                  <Text strong>Hotline hỗ trợ:</Text> <a href="tel:0123456789">0123 456 789</a>
                </Paragraph>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
  );
}