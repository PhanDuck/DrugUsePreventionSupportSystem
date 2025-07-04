import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      // Only redirect if user is authenticated
      if (isAuth) {
        const dashboardPath = authService.getDashboardPath();
        if (dashboardPath !== '/') {
          navigate(dashboardPath, { replace: true });
          return;
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏥</div>
          <div>Đang tải...</div>
        </div>
      </div>
    );
  }

  // Homepage content for guests and general users
  return (
    <div style={{ padding: '0', maxWidth: '100%' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '80px 40px',
        textAlign: 'center',
        marginBottom: '40px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏥</div>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            margin: 0
          }}>Hệ Thống Hỗ Trợ Phòng Chống Tệ Nạn</h1>
          <p style={{ 
            fontSize: '20px',
            opacity: 0.9,
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Cung cấp các công cụ đánh giá, khóa học và dịch vụ tư vấn chuyên nghiệp 
            để hỗ trợ phòng chống và điều trị tệ nạn xã hội
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              style={{ 
                background: '#fff',
                color: '#667eea',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onClick={() => navigate('/surveys')}
            >
              📋 Đánh Giá Ngay
            </button>
            <button 
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '2px solid #fff',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/courses')}
            >
              📚 Xem Khóa Học
            </button>
            <button
              style={{ 
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate('/blogs')}
            >
              📝 Đọc Blog
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          textAlign: 'center',
          fontSize: '36px',
          fontWeight: '700',
          color: '#262626',
          marginBottom: '16px'
        }}>Dịch Vụ Của Chúng Tôi</h2>
        <p style={{ 
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Hệ thống cung cấp các dịch vụ toàn diện từ đánh giá, tư vấn đến điều trị
        </p>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Assessment Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/surveys')}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Đánh Giá Nguy Cơ
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Sử dụng các công cụ đánh giá chuẩn quốc tế như CRAFFT, ASSIST để xác định mức độ nguy cơ nghiện
            </p>
            <div style={{ 
              background: '#e6f7ff',
              color: '#1890ff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Miễn phí - Không cần đăng ký
            </div>
          </div>

          {/* Courses Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/courses')}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Khóa Học Giáo Dục
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Các khóa học về kiến thức phòng chống tệ nạn, kỹ năng sống và phục hồi sức khỏe
            </p>
            <div style={{
              background: '#fff7e6',
              color: '#fa8c16',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Cần đăng ký để tham gia
            </div>
          </div>

          {/* Consultation Card */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (authService.isAuthenticated()) {
              navigate('/appointments');
            } else {
              navigate('/login');
            }
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
              Tư Vấn Chuyên Gia
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Đặt lịch tư vấn trực tiếp với các chuyên gia tâm lý và điều trị nghiện chất
            </p>
            <div style={{ 
              background: '#f6ffed',
              color: '#52c41a',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Cần đăng nhập để đặt lịch
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for guests */}
      {!isAuthenticated && (
        <section style={{
          background: '#fff',
          border: '2px dashed #d9d9d9',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#262626'
          }}>Sẵn Sàng Bắt Đầu?</h3>
          <p style={{ 
            fontSize: '18px',
            color: '#666',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px auto'
          }}>
            Đăng ký tài khoản để truy cập đầy đủ các tính năng và theo dõi tiến trình của bạn
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/register')}
            >
              Đăng Ký Ngay
            </button>
            <button 
              style={{
                background: '#fff',
                color: '#1890ff',
                border: '2px solid #1890ff',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/login')}
            >
              Đăng Nhập
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage; 