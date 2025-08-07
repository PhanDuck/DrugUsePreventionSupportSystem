import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '80vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: '#fff',
        borderRadius: '16px',
        padding: '60px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0'
      }}>
        {/* Maintenance Icon */}
        <div style={{
          fontSize: '120px',
          marginBottom: '30px',
          display: 'inline-block',
          animation: 'bounce 2s infinite'
        }}>
          🚧
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#262626',
          marginBottom: '20px',
          lineHeight: 1.2
        }}>
          UNDER MAINTENANCE
        </h1>

        {/* Subtitle */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '500',
          color: '#666',
          marginBottom: '30px',
          lineHeight: 1.4
        }}>
          Blog & Articles Section
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '18px',
          color: '#595959',
          lineHeight: 1.6,
          marginBottom: '40px'
        }}>
          We are currently improving our blog system to provide you with better content and user experience. 
          Please check back later for insightful articles about drug prevention and mental health support.
        </p>

        {/* Features being developed */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#262626',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚙️ Coming Soon:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{ 
              padding: '8px 0', 
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: '#52c41a', fontSize: '16px' }}>✓</span>
              Expert articles on drug prevention
            </li>
            <li style={{ 
              padding: '8px 0', 
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: '#52c41a', fontSize: '16px' }}>✓</span>
              Mental health awareness content
            </li>
            <li style={{ 
              padding: '8px 0', 
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: '#52c41a', fontSize: '16px' }}>✓</span>
              Community success stories
            </li>
            <li style={{ 
              padding: '8px 0', 
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ color: '#52c41a', fontSize: '16px' }}>✓</span>
              Interactive comment system
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#1890ff',
              border: '1px solid #1890ff',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#40a9ff';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1890ff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🏠 Back to Home
          </button>

          <button
            onClick={() => navigate('/courses')}
            style={{
              background: '#52c41a',
              border: '1px solid #52c41a',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#73d13d';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#52c41a';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📚 View Courses
          </button>
        </div>

        {/* Timeline */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#e6f7ff',
          borderRadius: '8px',
          border: '1px solid #91d5ff'
        }}>
          <p style={{
            color: '#1890ff',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500'
          }}>
            🕒 Expected completion: Coming soon | Thank you for your patience!
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
};

export default BlogPage; 