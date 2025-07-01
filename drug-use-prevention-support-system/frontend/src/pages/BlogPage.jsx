import React from 'react';

const BlogPage = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#262626', marginBottom: '16px' }}>
          📝 Blog & Tin Tức
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Các bài viết, nghiên cứu và thông tin hữu ích về phòng chống tệ nạn xã hội
        </p>
      </div>

      {/* Static sample blog posts for demo - backend BlogController exists but frontend integration not complete */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {/* Blog Post 1 */}
        <article style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: '#fff'
          }}>
            🧠
          </div>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Hiểu về Nghiện Chất và Tác Động Tâm Lý
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Tìm hiểu về cơ chế hoạt động của nghiện chất, tác động lên não bộ và những ảnh hưởng tâm lý lâu dài...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#999' }}>15/12/2024</span>
              <span style={{
                background: '#e6f7ff',
                color: '#1890ff',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Giáo dục
              </span>
            </div>
          </div>
        </article>

        {/* Blog Post 2 */}
        <article style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: '#fff'
          }}>
            👨‍👩‍👧‍👦
          </div>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Vai Trò Của Gia Đình trong Phòng Chống Tệ Nạn
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Gia đình đóng vai trò quan trọng trong việc phòng ngừa và hỗ trợ điều trị nghiện chất...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#999' }}>12/12/2024</span>
              <span style={{
                background: '#fff7e6',
                color: '#fa8c16',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Hỗ trợ
              </span>
            </div>
          </div>
        </article>

        {/* Blog Post 3 */}
        <article style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: '#fff'
          }}>
            💪
          </div>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Kỹ Thuật Thiền và Quản Lý Stress
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Các phương pháp thiền định và quản lý stress hiệu quả giúp hỗ trợ quá trình phục hồi...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#999' }}>10/12/2024</span>
              <span style={{
                background: '#f6ffed',
                color: '#52c41a',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Phương pháp
              </span>
            </div>
          </div>
        </article>

        {/* Blog Post 4 */}
        <article style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div style={{
            height: '200px',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: '#fff'
          }}>
            📊
          </div>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Thống Kê Tệ Nạn Xã Hội tại Việt Nam 2024
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Báo cáo chi tiết về tình hình tệ nạn xã hội và hiệu quả các chương trình can thiệp...
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#999' }}>08/12/2024</span>
              <span style={{
                background: '#fff2f0',
                color: '#f5222d',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Nghiên cứu
              </span>
            </div>
          </div>
        </article>
      </div>

      {/* Coming Soon Section */}
      <div style={{
        textAlign: 'center',
        marginTop: '60px',
        padding: '40px',
        background: '#f8f9fa',
        borderRadius: '16px',
        border: '2px dashed #d9d9d9'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
        <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
          Tính Năng Blog Đang Phát Triển
        </h3>
        <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          Chúng tôi đang hoàn thiện hệ thống blog với nhiều bài viết chuyên sâu và tính năng tương tác. 
          Vui lòng quay lại sau!
        </p>
      </div>
    </div>
  );
};

export default BlogPage; 