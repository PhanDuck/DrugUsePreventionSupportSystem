import api from '../config/axios';

class ApiTestService {
  
  // ===== TEST API CONNECTIVITY =====
  async testApiConnectivity() {
    const results = {
      success: true,
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    try {
      // Test 1: Health Check
      await this.testHealthCheck(results);
      
      // Test 2: Authentication
      await this.testAuthentication(results);
      
      // Test 3: Appointment APIs
      await this.testAppointmentApis(results);
      
      // Test 4: User APIs
      await this.testUserApis(results);
      
      // Test 5: Consultant APIs
      await this.testConsultantApis(results);
      
      // Calculate summary
      results.summary.total = results.tests.length;
      results.summary.passed = results.tests.filter(test => test.status === 'PASSED').length;
      results.summary.failed = results.tests.filter(test => test.status === 'FAILED').length;
      
      if (results.summary.failed > 0) {
        results.success = false;
      }
      
      return results;
    } catch (error) {
      console.error('API Test Error:', error);
      return {
        success: false,
        error: error.message,
        tests: results.tests,
        summary: results.summary
      };
    }
  }

  // ===== INDIVIDUAL API TESTS =====

  async testHealthCheck(results) {
    try {
      const response = await api.get('/appointments/health');
      results.tests.push({
        name: 'Appointment Health Check',
        endpoint: '/api/appointments/health',
        status: 'PASSED',
        response: response.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.tests.push({
        name: 'Appointment Health Check',
        endpoint: '/api/appointments/health',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async testAuthentication(results) {
    try {
      // Test if we can access protected endpoint
      const response = await api.get('/appointments/user');
      results.tests.push({
        name: 'Authentication Test',
        endpoint: '/api/appointments/user',
        status: 'PASSED',
        response: 'Authenticated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.response?.status === 401) {
        results.tests.push({
          name: 'Authentication Test',
          endpoint: '/api/appointments/user',
          status: 'FAILED',
          error: 'Authentication required - Please login first',
          timestamp: new Date().toISOString()
        });
      } else {
        results.tests.push({
          name: 'Authentication Test',
          endpoint: '/api/appointments/user',
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testAppointmentApis(results) {
    const appointmentTests = [
      {
        name: 'Get Current User Appointments',
        endpoint: '/appointments/user',
        method: 'GET'
      },
      {
        name: 'Get Available Slots',
        endpoint: '/appointments/consultant/1/available-slots?date=2024-01-15',
        method: 'GET'
      },
      {
        name: 'Get Appointment by ID',
        endpoint: '/appointments/1',
        method: 'GET'
      }
    ];

    for (const test of appointmentTests) {
      try {
        const response = await api.request({
          method: test.method,
          url: test.endpoint
        });
        
        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          status: 'PASSED',
          response: 'API accessible',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testUserApis(results) {
    const userTests = [
      {
        name: 'Get Consultants',
        endpoint: '/consultants',
        method: 'GET'
      },
      {
        name: 'Get User Profile',
        endpoint: '/users/profile',
        method: 'GET'
      }
    ];

    for (const test of userTests) {
      try {
        const response = await api.request({
          method: test.method,
          url: test.endpoint
        });
        
        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          status: 'PASSED',
          response: 'API accessible',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          method: test.method,
          status: 'FAILED',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testConsultantApis(results) {
    try {
      const response = await api.get('/consultants');
      results.tests.push({
        name: 'Get Consultants List',
        endpoint: '/consultants',
        status: 'PASSED',
        response: `Found ${response.data?.length || 0} consultants`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      results.tests.push({
        name: 'Get Consultants List',
        endpoint: '/consultants',
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ===== TEST SPECIFIC FUNCTIONALITY =====

  async testAppointmentCreation() {
    try {
      const appointmentData = {
        clientId: 1,
        consultantId: 1,
        appointmentDate: "2024-01-15T14:30:00",
        durationMinutes: 60,
        appointmentType: "ONLINE",
        clientNotes: "Test appointment",
        paymentMethod: "VNPAY"
      };

      const response = await api.post('/appointments', appointmentData);
      return {
        success: true,
        data: response.data,
        message: 'Appointment creation test passed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Appointment creation test failed'
      };
    }
  }

  async testAvailableSlots() {
    try {
      const response = await api.get('/appointments/consultant/1/available-slots?date=2024-01-15');
      return {
        success: true,
        data: response.data,
        message: 'Available slots test passed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Available slots test failed'
      };
    }
  }

  async testUserAppointments() {
    try {
      const response = await api.get('/appointments/user');
      return {
        success: true,
        data: response.data,
        message: 'User appointments test passed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'User appointments test failed'
      };
    }
  }

  // ===== DIAGNOSTIC TOOLS =====

  async getApiStatus() {
    const status = {
      baseUrl: api.defaults.baseURL,
      timeout: api.defaults.timeout,
      headers: api.defaults.headers,
      authToken: localStorage.getItem('token') ? 'Present' : 'Missing',
      timestamp: new Date().toISOString()
    };

    try {
      // Test basic connectivity
      const healthResponse = await api.get('/appointments/health');
      status.healthCheck = {
        status: 'OK',
        response: healthResponse.data
      };
    } catch (error) {
      status.healthCheck = {
        status: 'FAILED',
        error: error.message
      };
    }

    return status;
  }

  async validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        valid: false,
        message: 'No token found'
      };
    }

    try {
      const response = await api.get('/appointments/user');
      return {
        valid: true,
        message: 'Token is valid',
        userData: response.data
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          valid: false,
          message: 'Token is invalid or expired'
        };
      }
      return {
        valid: false,
        message: error.message
      };
    }
  }

  // ===== UTILITY METHODS =====

  async pingBackend() {
    try {
      const startTime = Date.now();
      const response = await api.get('/appointments/health');
      const endTime = Date.now();
      const latency = endTime - startTime;

      return {
        success: true,
        latency: `${latency}ms`,
        response: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getApiConfiguration() {
    return {
      baseURL: api.defaults.baseURL,
      timeout: api.defaults.timeout,
      headers: api.defaults.headers,
      hasToken: !!localStorage.getItem('token'),
      tokenExpiry: this.getTokenExpiry()
    };
  }

  getTokenExpiry() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // ===== DEBUG METHODS =====

  async debugApiCall(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: endpoint
      };

      if (data) {
        config.data = data;
      }

      const response = await api.request(config);
      
      return {
        success: true,
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.message,
        response: error.response?.data
      };
    }
  }

  logApiCall(endpoint, method, data = null) {
    console.log(`🔗 API Call: ${method} ${endpoint}`);
    if (data) {
      console.log('📤 Request Data:', data);
    }
    console.log('🔑 Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
  }
}

export default new ApiTestService(); 