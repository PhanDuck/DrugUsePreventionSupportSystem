import React from 'react';
import { List, Card, Tag, Typography, Image } from 'antd';
import { Link } from 'react-router-dom';


const { Title, Paragraph } = Typography;

const blogPosts = [
  {
    id: 1,
    title: 'Dấu hiệu nhận biết sớm sử dụng ma túy ở thanh thiếu niên',
    image: 'https://images.unsplash.com/photo-1627677387972-dd554a163ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Kinh nghiệm'],
    description: 'Nhận biết các dấu hiệu sớm giúp phòng ngừa và can thiệp kịp thời.',
    link: '/blog/1',
  },
  {
    id: 2,
    title: 'Vai trò của giáo viên trong phòng ngừa ma túy học đường',
    image: 'https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Chia sẻ'],
    description: 'Giáo viên là lực lượng nòng cốt trong giáo dục phòng chống ma túy.',
    link: '/blog/2',
  },
  {
    id: 3,
    title: 'Tác hại lâu dài của ma túy đối với sức khỏe tâm thần',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1974&auto=format&fit=crop',
    tags: ['Sức khỏe'],
    description: 'Phân tích các ảnh hưởng tiêu cực của ma túy đến não bộ và tâm lý.',
    link: '/blog/3',
  },
  {
    id: 4,
    title: 'Gia đình và cộng đồng cùng chung tay phòng chống ma túy',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1974&auto=format&fit=crop',
    tags: ['Gia đình', 'Cộng đồng'],
    description: 'Sức mạnh của sự phối hợp giữa gia đình và cộng đồng trong phòng ngừa.',
    link: '/blog/4',
  },
  {
    id: 5,
    title: 'Những lầm tưởng phổ biến về ma túy ở giới trẻ',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1974&auto=format&fit=crop',
    tags: ['Giới trẻ'],
    description: 'Giải đáp các quan niệm sai lầm thường gặp về ma túy.',
    link: '/blog/5',
  },
  {
    id: 6,
    title: 'Các biện pháp phòng tránh ma túy hiệu quả cho học sinh',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
    tags: ['Phòng tránh'],
    description: 'Những biện pháp thực tiễn giúp học sinh tránh xa ma túy.',
    link: '/blog/6',
  },
  {
    id: 7,
    title: 'Vai trò của truyền thông trong phòng chống ma túy',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1974&auto=format&fit=crop',
    tags: ['Truyền thông'],
    description: 'Truyền thông góp phần nâng cao nhận thức cộng đồng về ma túy.',
    link: '/blog/7',
  },
  {
    id: 8,
    title: 'Hỗ trợ người cai nghiện tái hòa nhập cộng đồng',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1974&auto=format&fit=crop',
    tags: ['Hỗ trợ'],
    description: 'Các chương trình giúp người cai nghiện trở lại cuộc sống bình thường.',
    link: '/blog/8',
  },
];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 0' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>Blog - Bài viết về phòng chống ma túy</Title>
      <List
        grid={{ gutter: 24, column: 2 }}
        dataSource={blogPosts}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={<Image src={item.image} alt={item.title} height={180} style={{ objectFit: 'cover', borderRadius: 8 }} preview={false} />}
              style={{ minHeight: 320 }}
            >
              <Title level={4}><Link to={item.link}>{item.title}</Link></Title>
              <Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>
              <div style={{ marginTop: 8 }}>
                {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
} 