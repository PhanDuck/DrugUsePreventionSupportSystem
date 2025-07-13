import React from 'react';

const BlogPage = () => {
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#262626', marginBottom: '16px' }}>
          📝 Blog & News
        </h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Articles, research and useful information about social problem prevention
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
              Understanding Substance Addiction and Psychological Impact
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Learn about the mechanism of substance addiction, its effects on the brain and long-term psychological impacts...
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
                Education
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
              Family Role in Social Problem Prevention
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Family plays an important role in prevention and supporting substance addiction treatment...
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
                Support
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
              Meditation Techniques and Stress Management
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Effective meditation and stress management methods to support recovery process...
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
                Methods
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
              Social Problem Statistics in Vietnam 2024
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '16px' }}>
              Detailed report on social problem situation and effectiveness of intervention programs...
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
                Research
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
          Blog Feature Under Development
        </h3>
        <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
          We are completing the blog system with in-depth articles and interactive features. 
          Please check back later!
        </p>
      </div>
    </div>
  );
};

export default BlogPage; 