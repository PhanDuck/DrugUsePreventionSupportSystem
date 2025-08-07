import React from 'react';
import { useNavigate } from 'react-router-dom';

const SurveyPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '80vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        maxWidth: '650px',
        textAlign: 'center',
        background: '#fff',
        borderRadius: '16px',
        padding: '60px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: '1px solid #f0f0f0'
      }}>
        {/* Maintenance Icon */}
        <div style={{
          fontSize: '120px',
          marginBottom: '30px',
          display: 'inline-block',
          animation: 'pulse 2s infinite'
        }}>
          🔧
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
          Risk Assessment & Surveys
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '18px',
          color: '#595959',
          lineHeight: 1.6,
          marginBottom: '40px'
        }}>
          We are enhancing our assessment system to provide more accurate risk evaluation and personalized recommendations. 
          Our team is working on implementing advanced screening tools including CRAFFT, ASSIST, AUDIT, and DAST-10.
        </p>

        {/* Assessment tools being developed */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#262626',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Assessment Tools in Development:
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎯</span>
                <strong style={{ color: '#262626' }}>CRAFFT</strong>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Adolescent substance use screening (Ages 12-21)
              </p>
            </div>
            
            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <strong style={{ color: '#262626' }}>ASSIST</strong>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                WHO substance involvement screening (Adults 18+)
              </p>
            </div>
            
            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🍺</span>
                <strong style={{ color: '#262626' }}>AUDIT</strong>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Alcohol use disorders identification test
              </p>
            </div>
            
            <div style={{
              background: '#fff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>💊</span>
                <strong style={{ color: '#262626' }}>DAST-10</strong>
              </div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                Drug abuse screening test (10 questions)
              </p>
            </div>
          </div>
        </div>

        {/* Features coming */}
        <div style={{
          background: '#f6ffed',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '40px',
          textAlign: 'left',
          border: '1px solid #b7eb8f'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#52c41a',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚡ New Features Coming Soon:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '8px'
          }}>
            <li style={{ 
              padding: '4px 0', 
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>✓</span> Real-time risk calculation
            </li>
            <li style={{ 
              padding: '4px 0', 
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>✓</span> Personalized recommendations
            </li>
            <li style={{ 
              padding: '4px 0', 
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>✓</span> Progress tracking
            </li>
            <li style={{ 
              padding: '4px 0', 
              color: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <span>✓</span> Export assessment results
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
            onClick={() => navigate('/appointments')}
            style={{
              background: '#722ed1',
              border: '1px solid #722ed1',
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
              e.target.style.background = '#9254de';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#722ed1';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            💬 Book Consultation
          </button>
        </div>

        {/* Note */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#fff7e6',
          borderRadius: '8px',
          border: '1px solid #ffd591'
        }}>
          <p style={{
            color: '#fa8c16',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500',
            lineHeight: 1.5
          }}>
            🔬 Our clinical team is working with mental health professionals to ensure assessment accuracy and reliability. 
            In the meantime, you can book a consultation with our certified counselors.
          </p>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SurveyPage; 