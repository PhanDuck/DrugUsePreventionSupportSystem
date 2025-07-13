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
          <div>Loading...</div>
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
          }}>Drug Prevention Support System</h1>
          <p style={{ 
            fontSize: '20px',
            opacity: 0.9,
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Providing assessment tools, courses and professional consultation services 
            to support drug prevention and treatment
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
              📋 Take Assessment Now
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
              📚 View Courses
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
              📝 Read Blog
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
        }}>Our Services</h2>
        <p style={{ 
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          The system provides comprehensive services from assessment to consultation and treatment
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
              Risk Assessment
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Use international standard assessment tools like CRAFFT, ASSIST to determine addiction risk levels
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
              Free - No registration required
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
              Educational Courses
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Courses on drug prevention knowledge, life skills and health recovery
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
              Registration required to participate
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
              Expert Consultation
            </h3>
            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '20px' }}>
              Schedule direct consultation with psychology and addiction treatment specialists
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
              Login required to schedule
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
          }}>Ready to Get Started?</h3>
          <p style={{ 
            fontSize: '18px',
            color: '#666',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px auto'
          }}>
            Register an account to access all features and track your progress
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
              Register Now
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
              Login
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage; 