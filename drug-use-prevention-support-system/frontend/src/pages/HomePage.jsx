import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AvailableConsultants from '../components/AvailableConsultants';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
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

  // Get user information for personalized content
  const user = authService.getCurrentUser();

  // Homepage content for guests and general users
  return (
    <div style={{ padding: '0', maxWidth: '100%' }}>
      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && user && (
        <section style={{
          background: '#1e40af',
          borderRadius: '12px',
          padding: '32px 40px',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#fff',
          border: '1px solid #1d4ed8'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ 
              fontSize: '32px',
              fontWeight: '600',
              margin: '0 0 16px 0'
            }}>
              Welcome back, {user.firstName || user.userName}! 👋
            </h2>
            <p style={{ 
              fontSize: '18px',
              opacity: 0.9,
              marginBottom: '32px'
            }}>
              You're logged in as {authService.getRoleDisplayName()}. 
              Access your dashboard to manage your activities.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                style={{ 
                  background: '#fff',
                  color: '#1e40af',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onClick={() => navigate(authService.getDashboardPath())}
              >
                📊 Go to Dashboard
              </button>
              <button 
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => navigate('/appointments')}
              >
                💬 My Appointments
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section style={{
        background: '#2c5530',
        borderRadius: '12px',
        padding: '60px 40px',
        textAlign: 'center',
        marginBottom: '40px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '32px'
            }}>🏥</span>
            <span style={{ fontSize: '28px', fontWeight: '600' }}>
              Drug Prevention Support System
            </span>
          </div>
          <p style={{ 
            fontSize: '18px',
            opacity: 0.95,
            marginBottom: '32px',
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 32px auto'
          }}>
            Professional support system providing comprehensive assessment tools, educational courses, 
            and expert consultation services for effective drug prevention and recovery support.
          </p>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <button 
              style={{ 
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              onClick={() => navigate('/surveys')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              📋 Take Assessment
            </button>
            <button 
              style={{ 
                background: '#fff',
                color: '#2c5530',
                border: '2px solid #fff',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => navigate('/courses')}
              onMouseEnter={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              📚 Browse Courses
            </button>
            <button
              style={{ 
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => navigate('/appointments')}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              💬 Get Consultation
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

      {/* Educational Video Section */}
      <section style={{
        marginBottom: '50px',
        background: '#fff',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{ 
            fontSize: '32px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '12px',
            margin: 0
          }}>Educational Video</h2>
          <p style={{ 
            fontSize: '16px',
            color: '#7f8c8d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Enhance awareness about drug harm and prevention methods
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto'
        }}>
          {/* Video */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <iframe
                src="https://www.youtube.com/embed/kP15q815Saw"
                title="Drug Awareness and Prevention Education"
                frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </div>

          {/* Video Description */}
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '16px'
            }}>
              Understanding Drug Abuse and Prevention
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#555',
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              Comprehensive educational video about drug awareness, helping to understand various types of addictive substances, their health and social impacts, as well as effective prevention measures.
            </p>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                <span style={{ marginRight: '8px' }}>✓</span>
                <span>Common types of drugs and their effects</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                <span style={{ marginRight: '8px' }}>✓</span>
                <span>Signs of drug use recognition</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                <span style={{ marginRight: '8px' }}>✓</span>
                <span>Prevention and early intervention methods</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '14px',
                color: '#7f8c8d'
              }}>
                <span style={{ marginRight: '8px' }}>✓</span>
                <span>Supporting addicts in recovery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section style={{
        marginBottom: '50px'
      }}>
        <div style={{ 
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h2 style={{ 
            fontSize: '32px',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '12px',
            margin: 0
          }}>Featured Articles</h2>
          <p style={{ 
            fontSize: '16px',
            color: '#7f8c8d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Latest insights and research on drug prevention and recovery
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Featured Blog 1 */}
          <article 
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/blogs')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              height: '180px',
              background: '#e74c3c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#fff'
            }}>
              🧠
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '12px', 
                color: '#2c3e50',
                lineHeight: 1.4
              }}>
                Early Signs of Drug Use: What Parents Should Know
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: 1.5, 
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                Learn to identify warning signs and behavioral changes that may indicate drug use in teenagers and young adults...
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span style={{ color: '#95a5a6' }}>Dec 15, 2024</span>
                <span style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  Prevention
                </span>
              </div>
            </div>
          </article>

          {/* Featured Blog 2 */}
          <article 
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/blogs')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              height: '180px',
              background: '#3498db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#fff'
            }}>
              🤝
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '12px', 
                color: '#2c3e50',
                lineHeight: 1.4
              }}>
                Supporting Family Members Through Recovery
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: 1.5, 
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                Practical guidance for families on how to provide emotional support and create a positive environment for recovery...
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span style={{ color: '#95a5a6' }}>Dec 12, 2024</span>
                <span style={{
                  background: '#dbeafe',
                  color: '#1d4ed8',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  Support
                </span>
              </div>
            </div>
          </article>

          {/* Featured Blog 3 */}
          <article 
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/blogs')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              height: '180px',
              background: '#27ae60',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#fff'
            }}>
              📊
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '12px', 
                color: '#2c3e50',
                lineHeight: 1.4
              }}>
              Drug Prevention Statistics Vietnam 2024
              </h3>
              <p style={{ 
                color: '#7f8c8d', 
                lineHeight: 1.5, 
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                Detailed report on drug abuse situation and effectiveness of intervention programs nationwide...
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '12px'
              }}>
                <span style={{ color: '#95a5a6' }}>Dec 08, 2024</span>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  Research
                </span>
              </div>
            </div>
          </article>
        </div>

        {/* View All Articles Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              background: '#fff',
              color: '#2c5530',
              border: '2px solid #2c5530',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => navigate('/blogs')}
            onMouseEnter={(e) => {
              e.target.style.background = '#2c5530';
              e.target.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#2c5530';
            }}
          >
            View All Articles →
          </button>
        </div>
      </section>

      {/* Available Consultants Section */}
      <section style={{
        padding: '80px 20px',
        background: '#f0f2f5',
        borderTop: '1px solid #e8e8e8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#262626'
          }}>
            Our Professional Consultants
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '50px',
            maxWidth: '600px',
            margin: '0 auto 50px auto'
          }}>
            Connect with experienced consultants for personalized support and guidance
          </p>
          
          {/* Available Consultants Component */}
          <AvailableConsultants />
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
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
              onClick={() => navigate('/consultants')}
            >
              View All Consultants
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 