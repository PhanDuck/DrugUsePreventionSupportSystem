import './App.css'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import LogoutPage from './LogoutPage'
import CoursesPage from './CoursesPage'
import SurveyPage from './SurveyPage'
import AppointmentPage from './AppointmentPage'
import { Layout, Menu } from 'antd'
import { HomeOutlined, BookOutlined, LoginOutlined, LogoutOutlined, BarChartOutlined, UserOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout;

const items = [
  { label: <Link to="/">Trang chủ</Link>, key: '/', icon: <HomeOutlined /> },
  { label: <Link to="/courses">Khóa học</Link>, key: '/courses', icon: <BookOutlined /> },
  { label: <Link to="/survey">Khảo sát</Link>, key: '/survey', icon: <BarChartOutlined /> },
  { label: <Link to="/appointment">Đặt lịch tư vấn</Link>, key: '/appointment', icon: <UserOutlined /> },
  { label: <Link to="/login">Đăng nhập</Link>, key: '/login', icon: <LoginOutlined /> },
  { label: <Link to="/logout">Đăng xuất</Link>, key: '/logout', icon: <LogoutOutlined /> },
];

export default function App() {
  const location = useLocation();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <div style={{ float: 'left', color: '#fff', fontWeight: 'bold', fontSize: 20, marginRight: 32 }}>
          Drug Use Prevention
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          style={{ lineHeight: '64px' }}
        />
      </Header>
      <Content style={{ padding: '24px 50px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Drug Use Prevention Support System ©2025 Created by Nhóm 1
      </Footer>
    </Layout>
  );
}
