import React, { useEffect } from 'react';
import { Result, Layout } from 'antd';
const { Content } = Layout;

export default function LogoutPage() {
  useEffect(() => {
    // Xử lý logout ở đây (xóa token, v.v.)
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result status="success" title="Đăng xuất thành công!" />
      </Content>
    </Layout>
  );
} 