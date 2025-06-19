import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Tag, Image, Button } from 'antd';


const { Title, Paragraph } = Typography;

const blogPosts = [
  {
    id: 1,
    title: 'Dấu hiệu nhận biết sớm sử dụng ma túy ở thanh thiếu niên',
    image: 'https://images.unsplash.com/photo-1627677387972-dd554a163ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Kinh nghiệm'],
    content: 'Các dấu hiệu sớm như thay đổi hành vi, học lực giảm sút, giao du với bạn xấu, v.v. Việc phát hiện sớm giúp gia đình và nhà trường can thiệp kịp thời, bảo vệ thanh thiếu niên khỏi nguy cơ nghiện ngập.',
  },
  {
    id: 2,
    title: 'Vai trò của giáo viên trong phòng ngừa ma túy học đường',
    image: 'https://images.unsplash.com/photo-1594256347468-5cd43df8fbaf?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['Chia sẻ'],
    content: 'Giáo viên không chỉ truyền đạt kiến thức mà còn là người định hướng, phát hiện và hỗ trợ học sinh có nguy cơ. Các hoạt động ngoại khóa, tuyên truyền giúp nâng cao nhận thức phòng chống ma túy.',
  },
  {
    id: 3,
    title: 'Tác hại lâu dài của ma túy đối với sức khỏe tâm thần',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1974&auto=format&fit=crop',
    tags: ['Sức khỏe'],
    content: 'Ma túy gây tổn thương não bộ, rối loạn tâm thần, trầm cảm, lo âu kéo dài. Việc sử dụng ma túy có thể để lại hậu quả suốt đời.',
  },
  {
    id: 4,
    title: 'Gia đình và cộng đồng cùng chung tay phòng chống ma túy',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1974&auto=format&fit=crop',
    tags: ['Gia đình', 'Cộng đồng'],
    content: 'Sự phối hợp giữa gia đình, nhà trường và cộng đồng là chìa khóa để phòng ngừa ma túy hiệu quả. Cần xây dựng môi trường sống lành mạnh, hỗ trợ lẫn nhau.',
  },
  {
    id: 5,
    title: 'Những lầm tưởng phổ biến về ma túy ở giới trẻ',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=1974&auto=format&fit=crop',
    tags: ['Giới trẻ'],
    content: 'Nhiều bạn trẻ cho rằng thử ma túy một lần sẽ không nghiện, hoặc ma túy giúp giảm stress. Đây là những quan niệm sai lầm nguy hiểm.',
  },
  {
    id: 6,
    title: 'Các biện pháp phòng tránh ma túy hiệu quả cho học sinh',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
    tags: ['Phòng tránh'],
    content: 'Học sinh cần được trang bị kỹ năng từ chối, nhận biết nguy cơ, tham gia các hoạt động lành mạnh để tránh xa ma túy.',
  },
  {
    id: 7,
    title: 'Vai trò của truyền thông trong phòng chống ma túy',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1974&auto=format&fit=crop',
    tags: ['Truyền thông'],
    content: 'Truyền thông giúp lan tỏa thông tin, nâng cao nhận thức cộng đồng, góp phần giảm thiểu nguy cơ sử dụng ma túy.',
  },
  {
    id: 8,
    title: 'Hỗ trợ người cai nghiện tái hòa nhập cộng đồng',
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1974&auto=format&fit=crop',
    tags: ['Hỗ trợ'],
    content: 'Việc hỗ trợ người cai nghiện tái hòa nhập cộng đồng giúp họ có cơ hội làm lại cuộc đời, giảm nguy cơ tái nghiện.',
  },
];

export default function BlogDetailPage() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) return <div style={{ padding: 32, textAlign: 'center' }}>Bài viết không tồn tại.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      <Link to="/blog"><Button type="link">← Quay lại Blog</Button></Link>
      <Image src={post.image} alt={post.title} width="100%" style={{ maxHeight: 340, objectFit: 'cover', borderRadius: 10, marginBottom: 24 }} preview={false} />
      <Title level={2}>{post.title}</Title>
      <div style={{ marginBottom: 16 }}>
        {post.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
      </div>
      <Paragraph style={{ fontSize: 18, lineHeight: 1.7 }}>{post.content}</Paragraph>
    </div>
  );
} 