import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import authService from '../services/authService';
import 'react-toastify/dist/ReactToastify.css';

const LayoutComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập và lấy thông tin user
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      setIsAuthenticated(isAuth);
      setCurrentUser(user);
    };
    
    checkAuth();

    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    try {
      console.log('=== LOGOUT CLICKED ===');
      
      // Clear all auth data immediately
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      
      // Update state
      setIsAuthenticated(false);
      setCurrentUser(null);
      setShowUserMenu(false);
      
      console.log('Auth data cleared, redirecting...');
      
      // Show success message and redirect
      toast.success('Đăng xuất thành công!');
      
      // Immediate redirect
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect anyway
      window.location.href = '/login';
    }
  };

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/blogs', label: 'Blog', icon: '📝' },
    { path: '/courses', label: 'Khóa học', icon: '📚' },
    { path: '/surveys', label: 'Đánh giá', icon: '📋' },
    { path: '/appointments', label: 'Tư vấn', icon: '💬' },
  ];

  // Get user display name
  const getUserDisplayName = () => {
    if (!currentUser) return 'User';
    return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.userName;
  };

  // Get user role display
  const getUserRoleDisplay = () => {
    const role = authService.getUserRole();
    switch(role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'CONSULTANT': return 'Tư vấn viên';
      case 'MANAGER': return 'Quản lý';
      case 'USER': return 'Người dùng';
      default: return 'Guest';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '100vw',
      overflowX: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo & Brand */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '18px',
              color: '#fff'
            }}>
              🏥
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1890ff',
                lineHeight: '1.2',
                margin: 0
              }}>Drug Prevention</h1>
              <p style={{
                fontSize: '12px',
                color: '#666',
                lineHeight: 1,
                margin: 0
              }}>Hỗ trợ phòng chống tệ nạn</p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href="#"
                style={{
                  color: location.pathname === item.path ? '#1890ff' : '#595959',
                  textDecoration: 'none',
                  fontWeight: '500',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  background: location.pathname === item.path ? 'rgba(24, 144, 255, 0.1)' : 'transparent'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.color = '#1890ff';
                    e.target.style.background = 'rgba(24, 144, 255, 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.color = '#595959';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button style={{
                  position: 'relative',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
                >
                  <span style={{ fontSize: '16px' }}>🔔</span>
                  <span style={{ 
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff2f0',
                    color: '#f5222d',
                    border: '1px solid #ffccc7'
                  }}>
                    3
                  </span>
                </button>

                {/* User Dropdown */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease',
                    position: 'relative'
                  }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '16px'
                  }}>
                    👤
                  </div>
                  <div style={{
                    textAlign: 'left',
                    marginLeft: '8px',
                    marginRight: '4px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#262626',
                      lineHeight: '1.2',
                      margin: 0
                    }}>{getUserDisplayName()}</p>
                    <p style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      lineHeight: 1,
                      margin: 0
                    }}>{getUserRoleDisplay()}</p>
                  </div>
                  <span style={{ fontSize: '10px', color: '#8c8c8c' }}>⌄</span>
                </div>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '64px',
                    right: '20px',
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    zIndex: 1001,
                    minWidth: '200px'
                  }}>
                    <button
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#262626',
                        background: '#fff',
                        border: 'none',
                        borderBottom: '1px solid #f0f0f0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.background = '#fff'}
                    >
                      👤 Thông tin cá nhân
                    </button>
                    <button
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#262626',
                        background: '#fff',
                        border: 'none',
                        borderBottom: '1px solid #f0f0f0',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.background = '#fff'}
                    >
                      ⚙️ Cài đặt
                    </button>
                    <button
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        textDecoration: 'none',
                        color: '#f5222d',
                        background: '#fff',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s ease'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Logout button clicked!'); // Debug log
                        handleLogout();
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fff2f0'}
                      onMouseLeave={(e) => e.target.style.background = '#fff'}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{
                    background: '#fff',
                    border: '1px solid #d9d9d9',
                    color: '#595959',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate('/login')}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#1890ff';
                    e.target.style.borderColor = '#1890ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#595959';
                    e.target.style.borderColor = '#d9d9d9';
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  style={{
                    background: '#1890ff',
                    border: '1px solid #1890ff',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => navigate('/register')}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#40a9ff';
                    e.target.style.borderColor = '#40a9ff';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#1890ff';
                    e.target.style.borderColor = '#1890ff';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1,
        padding: 0,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        padding: '20px',
        background: '#f5f5f5'
      }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '24px',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <p style={{
          color: '#8c8c8c',
          fontSize: '14px',
          margin: 0
        }}>
          Drug Prevention Support System ©{new Date().getFullYear()} 
          <span style={{ margin: '0 8px' }}>•</span>
          Được phát triển bởi Nhóm 1
        </p>
      </footer>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LayoutComponent; 