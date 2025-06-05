import React, { useEffect } from 'react';
import { Result, Layout } from 'antd';
const { Content } = Layout;

export default function LogoutPage() {
  useEffect(() => {
    // Xử lý logout ở đây (xóa token, v.v.)
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
          title="Đăng xuất thành công!" 
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