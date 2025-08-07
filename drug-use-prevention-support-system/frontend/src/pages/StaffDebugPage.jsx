import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import staffCourseService from '../services/staffCourseService';

const { Title, Text, Paragraph } = Typography;

const StaffDebugPage = () => {
  const navigate = useNavigate();
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    loadAuthInfo();
  }, []);

  const loadAuthInfo = () => {
    const info = {
      isAuthenticated: authService.isAuthenticated(),
      currentUser: authService.getCurrentUser(),
      userRole: authService.getUserRole(),
      token: authService.getToken(),
      isStaff: authService.isStaff(),
      isStaffOrHigher: authService.isStaffOrHigher(),
      dashboardPath: authService.getDashboardPath(),
      roleDisplayName: authService.getRoleDisplayName()
    };
    setAuthInfo(info);
    console.log('🔍 Auth Debug Info:', info);
  };

  const testLogin = async (username, password) => {
    try {
      const result = await authService.login(username, password);
      console.log('Login result:', result);
      if (result.success) {
        loadAuthInfo();
        alert('Login successful! Check console for details.');
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error: ' + error.message);
    }
  };

  const testLogout = () => {
    authService.logout();
    loadAuthInfo();
    alert('Logged out successfully!');
  };

  const testStaffAPI = async () => {
    try {
      const result = await staffCourseService.testAPI();
      if (result.success) {
        alert('✅ Staff API Test Successful!\n' + JSON.stringify(result.data, null, 2));
      } else {
        alert('❌ Staff API Test Failed:\n' + result.error);
      }
    } catch (error) {
      alert('❌ API Test Error:\n' + error.message);
    }
  };

  const testDatabase = async () => {
    try {
      const result = await staffCourseService.testDatabase();
      if (result.success) {
        alert('✅ Database Test Successful!\n' + JSON.stringify(result.data, null, 2));
      } else {
        alert('❌ Database Test Failed:\n' + result.error);
      }
    } catch (error) {
      alert('❌ Database Test Error:\n' + error.message);
    }
  };

  const testLessons = async () => {
    try {
      const result = await staffCourseService.testLessons(15); // Test with course ID 15 (stab's course)
      if (result.success) {
        alert('✅ Lessons Test Successful!\n' + JSON.stringify(result.data, null, 2));
      } else {
        alert(`❌ Lessons Test Failed (${result.status}):\n${result.error}`);
      }
    } catch (error) {
      alert('❌ Lessons Test Error:\n' + error.message);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>🔧 Staff Authentication Debug</Title>
      
      <Alert
        message="Debug Mode"
        description="This page helps debug staff authentication and navigation issues."
        type="info"
        style={{ marginBottom: '24px' }}
      />

      {/* Current Auth Status */}
      <Card title="📊 Current Authentication Status" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Authenticated:</Text> 
            <Tag color={authInfo.isAuthenticated ? 'green' : 'red'}>
              {authInfo.isAuthenticated ? 'YES' : 'NO'}
            </Tag>
          </div>
          
          <div>
            <Text strong>User Role:</Text> 
            <Tag color={authInfo.userRole ? 'blue' : 'default'}>
              {authInfo.userRole || 'No Role'}
            </Tag>
          </div>

          <div>
            <Text strong>Is Staff:</Text> 
            <Tag color={authInfo.isStaff ? 'green' : 'red'}>
              {authInfo.isStaff ? 'YES' : 'NO'}
            </Tag>
          </div>

          <div>
            <Text strong>Is Staff or Higher:</Text> 
            <Tag color={authInfo.isStaffOrHigher ? 'green' : 'red'}>
              {authInfo.isStaffOrHigher ? 'YES' : 'NO'}
            </Tag>
          </div>

          <div>
            <Text strong>Role Display:</Text> 
            <Tag color="purple">{authInfo.roleDisplayName}</Tag>
          </div>

          <div>
            <Text strong>Dashboard Path:</Text> 
            <Tag color="geekblue">{authInfo.dashboardPath}</Tag>
          </div>

          <div>
            <Text strong>Has Token:</Text> 
            <Tag color={authInfo.token ? 'green' : 'red'}>
              {authInfo.token ? 'YES' : 'NO'}
            </Tag>
          </div>

          {authInfo.currentUser && (
            <div>
              <Text strong>Current User:</Text>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                marginTop: '4px'
              }}>
                {JSON.stringify(authInfo.currentUser, null, 2)}
              </pre>
            </div>
          )}
        </Space>
      </Card>

      {/* Quick Login Tests */}
      <Card title="🧪 Quick Login Tests" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button 
            type="primary" 
            onClick={() => testLogin('staff1', '123123')}
          >
            Login as STAFF (staff1/123123)
          </Button>
          
          <Button 
            type="primary" 
            onClick={() => testLogin('admin', '123123')}
          >
            Login as ADMIN (admin/123123)
          </Button>
          
          <Button 
            type="primary" 
            onClick={() => testLogin('manager1', '123123')}
          >
            Login as MANAGER (manager1/123123)
          </Button>

          <Button 
            onClick={() => testLogin('user1', '123123')}
          >
            Login as USER (user1/123123)
          </Button>

          <Button 
            danger 
            onClick={testLogout}
          >
            Logout
          </Button>
        </Space>
      </Card>

      {/* Navigation Tests */}
      <Card title="🧭 Navigation Tests" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button 
            type="default"
            onClick={() => navigate('/course-management')}
            disabled={!authInfo.isStaffOrHigher}
          >
            Go to Course Management
          </Button>

          <Button 
            type="default"
            onClick={() => navigate('/staff/courses')}
            disabled={!authInfo.isStaffOrHigher}
          >
            Go to Staff Course Manager
          </Button>

          <Button 
            type="default"
            onClick={() => navigate(authInfo.dashboardPath)}
          >
            Go to Dashboard
          </Button>

          <Button 
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Space>
      </Card>

      {/* API Tests */}
      <Card title="🔌 API Tests" style={{ marginBottom: '24px' }}>
        <Space wrap>
          <Button 
            type="primary"
            onClick={testStaffAPI}
            disabled={!authInfo.isStaffOrHigher}
          >
            🧪 Test Staff API
          </Button>

          <Button 
            type="default"
            onClick={testDatabase}
            disabled={!authInfo.isStaffOrHigher}
          >
            🗄️ Test Database
          </Button>

          <Button 
            type="default"
            onClick={testLessons}
            disabled={!authInfo.isStaffOrHigher}
          >
            📚 Test Lessons
          </Button>
          
          <Button 
            onClick={() => window.open('http://localhost:8080/swagger-ui/index.html', '_blank')}
          >
            📖 Open Swagger UI
          </Button>
        </Space>
      </Card>

      {/* Instructions */}
      <Card title="📋 Instructions">
        <Paragraph>
          <strong>How to test staff functionality:</strong>
        </Paragraph>
        <ol>
          <li>Click "Login as STAFF" or "Login as ADMIN" button above</li>
          <li>Check that "Is Staff or Higher" shows "YES"</li>
          <li>Check console logs for navigation debugging info</li>
          <li>Try navigating to Course Management (should work)</li>
          <li>Look for "Manage Courses" in the top navigation menu</li>
          <li>Check user dropdown menu for staff-specific items</li>
        </ol>

        <Divider />

        <Paragraph>
          <strong>Common Issues:</strong>
        </Paragraph>
        <ul>
          <li>If navigation items don't show up, try refreshing the page after login</li>
          <li>Check browser console for any JavaScript errors</li>
          <li>Make sure backend is running on localhost:8080</li>
          <li>Clear localStorage and try login again if issues persist</li>
        </ul>
      </Card>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button 
          size="large"
          onClick={loadAuthInfo}
        >
          🔄 Refresh Auth Info
        </Button>
      </div>
    </div>
  );
};

export default StaffDebugPage; 