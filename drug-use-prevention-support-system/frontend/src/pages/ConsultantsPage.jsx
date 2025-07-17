import React from 'react';
import { Layout, Typography } from 'antd';
import AvailableConsultants from '../components/AvailableConsultants';

const { Content } = Layout;
const { Title } = Typography;

const ConsultantsPage = () => {
  return (
    <Content style={{ padding: '40px 20px', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Professional Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '48px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          padding: '60px 40px',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍⚕️</div>
          <Title level={1} style={{ 
            color: 'white', 
            marginBottom: '16px',
            fontSize: '42px',
            fontWeight: '700'
          }}>
            Professional Consultation Services
          </Title>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Connect with licensed therapists and counselors specializing in substance abuse treatment and mental health support
          </p>
        </div>
        
        <AvailableConsultants />
      </div>
    </Content>
  );
};

export default ConsultantsPage; 