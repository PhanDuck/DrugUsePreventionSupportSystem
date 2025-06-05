import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  FormOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const LayoutComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
      onClick: () => navigate('/'),
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: 'Khóa học',
      onClick: () => navigate('/courses'),
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn',
      onClick: () => navigate('/appointments'),
    },
    {
      key: '/surveys',
      icon: <FormOutlined />,
      label: 'Khảo sát',
      onClick: () => navigate('/surveys'),
    },
    {
      key: isAuthenticated ? 'logout' : '/login',
      icon: isAuthenticated ? <LogoutOutlined /> : <LoginOutlined />,
      label: isAuthenticated ? 'Đăng xuất' : 'Đăng nhập',
      onClick: isAuthenticated ? handleLogout : () => navigate('/login'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        background: colorBgContainer,
        padding: '0 clamp(16px, 3vw, 24px)',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        width: '100vw',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: 'clamp(18px, 2.5vw, 24px)', 
            fontWeight: 'bold',
            color: '#1f7c83'
          }}>
            Drug Prevention
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ 
              flex: 1, 
              justifyContent: 'flex-end',
              border: 'none',
              background: 'transparent',
              width: '100%'
            }}
          />
        </div>
      </Header>
      <Content style={{ 
        padding: 'clamp(20px, 5vw, 40px)',
        width: '100vw',
        minHeight: 'calc(100vh - 64px - 64px)',
        background: '#f9fafb'
      }}>
        <div
          style={{
            padding: 'clamp(24px, 4vw, 32px)',
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            width: '100%'
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ 
        textAlign: 'center',
        background: colorBgContainer,
        padding: 'clamp(16px, 3vw, 24px)',
        width: '100vw'
      }}>
        Drug Prevention Support System ©{new Date().getFullYear()} Created by Your Team
      </Footer>
    </Layout>
  );
};

export default LayoutComponent; 