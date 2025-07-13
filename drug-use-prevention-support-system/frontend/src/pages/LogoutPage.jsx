import React, { useEffect } from 'react';
import { Result, Layout } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { Content } = Layout;

export default function LogoutPage() {
  useEffect(() => {
    // Handle logout here (remove token, etc.)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout successful!');
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'clamp(20px, 5vw, 40px)',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <Result 
          status="success" 
          title="Logout successful!" 
          style={{
            padding: 'clamp(24px, 4vw, 32px)',
            textAlign: 'center'
          }}
          titleStyle={{
            fontSize: 'clamp(20px, 3vw, 24px)',
            marginBottom: 'clamp(16px, 2vw, 24px)'
          }}
        />
      </Content>
    </Layout>
  );
} 