import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultantsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '80vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
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
          color: '#ff6b6b'
        }}>
          🚧
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#2d3748',
          marginBottom: '20px',
          lineHeight: '1.2'
        }}>
          UNDER MAINTENANCE
        </h1>
        
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#4a5568',
          marginBottom: '30px'
        }}>
          Consultant Directory & Profiles
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#718096',
          marginBottom: '40px'
        }}>
          We're currently improving our consultant directory system with enhanced 
          profiles, specialization filters, and advanced booking features. This page 
          will be available soon with a better user experience.
        </p>

        {/* Features Coming Soon */}
        <div style={{
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '40px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '15px'
          }}>
            🔄 Coming Soon:
          </h3>
          <ul style={{
            fontSize: '14px',
            color: '#4a5568',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '20px'
          }}>
            <li>👨‍⚕️ Detailed consultant profiles & credentials</li>
            <li>🔍 Advanced search & filtering by specialization</li>
            <li>⭐ Reviews & ratings system</li>
            <li>📅 Real-time availability calendar</li>
            <li>💬 Direct messaging with consultants</li>
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
              background: '#4299e1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.background = '#3182ce'}
            onMouseOut={(e) => e.target.style.background = '#4299e1'}
          >
            🏠 Back to Home
          </button>
          
          <button
            onClick={() => navigate('/appointments')}
            style={{
              background: '#48bb78',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.background = '#38a169'}
            onMouseOut={(e) => e.target.style.background = '#48bb78'}
          >
            📅 Book Appointment
          </button>
        </div>

        {/* Note */}
        <p style={{
          fontSize: '14px',
          color: '#a0aec0',
          marginTop: '30px',
          fontStyle: 'italic'
        }}>
          For immediate consultation needs, please use our appointment booking system.
        </p>
      </div>
    </div>
  );
};

export default ConsultantsPage; 