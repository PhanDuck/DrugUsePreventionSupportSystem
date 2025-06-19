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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Header, Content, Footer } = Layout;

const LayoutComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount và khi token thay đổi
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.success('Đăng xuất thành công!');
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
      key: '/blog',
      icon: <BookOutlined />,
      label: 'Blog',
      onClick: () => navigate('/blog'),
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
    <Layout style={{ minHeight: '100vh', width: '100vw'}}>
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
        padding: 'clamp(8px, 2vw, 16px)',
        paddingTop: 64,
        minHeight: 0,
        background: '#f9fafb',
      }}>
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(8px, 2vw, 16px)',
            minHeight: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
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
        Drug Prevention Support System ©{new Date().getFullYear()} Created by Nhom1
      </Footer>
    </Layout>
  );
};

export default LayoutComponent; 