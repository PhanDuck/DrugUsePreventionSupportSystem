import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Button, 
  Row, 
  Col, 
  Statistic, 
  Badge, 
  message, 
  Spin,
  Alert,
  Table,
  Tag,
  Progress,
  Descriptions,
  Divider,
  Collapse,
  List,
  Tooltip
} from 'antd';
import { 
  ApiOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  BugOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  WifiOutlined
} from '@ant-design/icons';
import apiTestService from '../services/apiTestService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const ApiTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [tokenValidation, setTokenValidation] = useState(null);
  const [pingResult, setPingResult] = useState(null);

  useEffect(() => {
    runInitialTests();
  }, []);

  const runInitialTests = async () => {
    setLoading(true);
    try {
      // Run all tests
      const results = await apiTestService.testApiConnectivity();
      setTestResults(results);

      // Get API status
      const status = await apiTestService.getApiStatus();
      setApiStatus(status);

      // Validate token
      const tokenValid = await apiTestService.validateToken();
      setTokenValidation(tokenValid);

      // Ping backend
      const ping = await apiTestService.pingBackend();
      setPingResult(ping);

    } catch (error) {
      console.error('Test Error:', error);
      message.error('Error running API tests');
    } finally {
      setLoading(false);
    }
  };

  const runSpecificTest = async (testFunction) => {
    setLoading(true);
    try {
      const result = await testFunction();
      message.success(result.message || 'Test completed successfully');
      return result;
    } catch (error) {
      message.error('Test failed: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASSED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'FAILED':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <LoadingOutlined />;
    }
  };

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {getStatusIcon(record.status)}
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => text ? <Tag color="blue">{text}</Tag> : null
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={getStatusColor(status)} 
          text={status}
        />
      )
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      render: (text, record) => (
        <Tooltip title={text}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {record.status === 'FAILED' ? record.error : text}
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleTimeString()
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <Card style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '20px',
        marginBottom: '32px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ padding: '40px 20px', color: '#fff' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔗</div>
          <Title level={1} style={{ color: '#fff', marginBottom: '16px', fontSize: '2.5rem' }}>
            API Connectivity Test
          </Title>
          <Paragraph style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '32px', opacity: 0.9 }}>
            Test and monitor API connectivity between frontend and backend
          </Paragraph>
          
          <Button 
            type="primary" 
            size="large"
            icon={<ReloadOutlined />}
            onClick={runInitialTests}
            loading={loading}
            style={{ background: '#fff', color: '#667eea', border: 'none' }}
          >
            Run All Tests
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      {testResults && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Statistic 
                title="Total Tests" 
                value={testResults.summary?.total || 0} 
                prefix={<ApiOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Statistic 
                title="Passed" 
                value={testResults.summary?.passed || 0} 
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Statistic 
                title="Failed" 
                value={testResults.summary?.failed || 0} 
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ textAlign: 'center', borderRadius: '12px' }}>
              <Statistic 
                title="Success Rate" 
                value={testResults.summary?.total > 0 ? 
                  Math.round((testResults.summary.passed / testResults.summary.total) * 100) : 0} 
                suffix="%" 
                prefix={<SafetyCertificateOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* API Status */}
      {apiStatus && (
        <Card title="🔧 API Configuration" style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Base URL">
              <Text code>{apiStatus.baseUrl}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Timeout">
              <Text>{apiStatus.timeout}ms</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Authentication Token">
              <Badge 
                status={apiStatus.authToken === 'Present' ? 'success' : 'error'} 
                text={apiStatus.authToken}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Health Check">
              <Badge 
                status={apiStatus.healthCheck?.status === 'OK' ? 'success' : 'error'} 
                text={apiStatus.healthCheck?.status || 'Unknown'}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Token Validation */}
      {tokenValidation && (
        <Card title="🔐 Token Validation" style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Alert
            message={tokenValidation.message}
            type={tokenValidation.valid ? 'success' : 'error'}
            showIcon
            icon={tokenValidation.valid ? <SafetyCertificateOutlined /> : <CloseCircleOutlined />}
            description={
              tokenValidation.valid ? 
                'Your authentication token is valid and working correctly.' :
                'Please login to get a valid authentication token.'
            }
          />
        </Card>
      )}

      {/* Ping Result */}
      {pingResult && (
        <Card title="🌐 Backend Ping" style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic 
                title="Response Time" 
                value={pingResult.latency} 
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: pingResult.success ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="Connection Status" 
                value={pingResult.success ? 'Connected' : 'Failed'} 
                prefix={<WifiOutlined />}
                valueStyle={{ color: pingResult.success ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card title="📊 Test Results" style={{ marginBottom: '24px', borderRadius: '12px' }}>
          <Table 
            dataSource={testResults.tests} 
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record, index) => index}
          />
        </Card>
      )}

      {/* Specific Tests */}
      <Card title="🧪 Specific Tests" style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              size="small" 
              title="Appointment Creation"
              extra={
                <Button 
                  size="small" 
                  onClick={() => runSpecificTest(apiTestService.testAppointmentCreation)}
                  loading={loading}
                >
                  Test
                </Button>
              }
            >
              <Text type="secondary">
                Test creating a new appointment
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              size="small" 
              title="Available Slots"
              extra={
                <Button 
                  size="small" 
                  onClick={() => runSpecificTest(apiTestService.testAvailableSlots)}
                  loading={loading}
                >
                  Test
                </Button>
              }
            >
              <Text type="secondary">
                Test getting available time slots
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              size="small" 
              title="User Appointments"
              extra={
                <Button 
                  size="small" 
                  onClick={() => runSpecificTest(apiTestService.testUserAppointments)}
                  loading={loading}
                >
                  Test
                </Button>
              }
            >
              <Text type="secondary">
                Test getting user appointments
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Debug Tools */}
      <Card title="🔍 Debug Tools" style={{ borderRadius: '12px' }}>
        <Collapse>
          <Panel header="API Configuration" key="1">
            <pre style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
              {JSON.stringify(apiTestService.getApiConfiguration(), null, 2)}
            </pre>
          </Panel>
          <Panel header="Token Information" key="2">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Token Present">
                {localStorage.getItem('token') ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Token Expiry">
                {apiTestService.getTokenExpiry()?.toLocaleString() || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Token Preview">
                <Text code style={{ fontSize: '10px' }}>
                  {localStorage.getItem('token')?.substring(0, 50) + '...' || 'No token'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Panel>
          <Panel header="Manual API Test" key="3">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>Test a specific API endpoint:</Text>
              <Button 
                onClick={() => runSpecificTest(() => apiTestService.debugApiCall('/appointments/health'))}
                loading={loading}
              >
                Test Health Endpoint
              </Button>
              <Button 
                onClick={() => runSpecificTest(() => apiTestService.debugApiCall('/consultants'))}
                loading={loading}
              >
                Test Consultants Endpoint
              </Button>
            </Space>
          </Panel>
        </Collapse>
      </Card>

      {/* Troubleshooting */}
      <Card title="🛠️ Troubleshooting" style={{ marginTop: '24px', borderRadius: '12px' }}>
        <List
          dataSource={[
            {
              title: 'Backend not running',
              description: 'Make sure the Spring Boot backend is running on port 8080',
              solution: 'Start the backend server: ./mvnw spring-boot:run'
            },
            {
              title: 'CORS issues',
              description: 'Cross-origin requests might be blocked',
              solution: 'Check CORS configuration in SecurityConfig.java'
            },
            {
              title: 'Authentication failed',
              description: 'JWT token is missing or invalid',
              solution: 'Login again to get a fresh token'
            },
            {
              title: 'Network connectivity',
              description: 'Cannot connect to backend server',
              solution: 'Check if backend is accessible at http://localhost:8080'
            }
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <Text type="secondary">{item.description}</Text>
                    <br />
                    <Text strong>Solution: </Text>
                    <Text code>{item.solution}</Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ApiTestPage; 