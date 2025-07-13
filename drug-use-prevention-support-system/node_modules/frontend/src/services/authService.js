import api from '../config/axios';

class AuthService {
  
  // ===== LOGIN =====
  async login(username, password) {
    try {
      console.log('🔍 Login attempt:', { username, password: '***' });
      console.log('🔍 API base URL:', api.defaults.baseURL);
      
      const payload = {
        userName: username,
        password: password
      };
      console.log('🔍 Login payload:', payload);
      
      const response = await api.post('/auth/login', payload);
      console.log('🔍 Login response:', response);

      if (response.data && response.data.token) {
        console.log('✅ Login successful:', response.data);
        // Save token and user info to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('role', response.data.role);
        
        return {
          success: true,
          data: response.data
        };
      } else {
        console.error('❌ Invalid response structure:', response.data);
        return {
          success: false,
          message: 'Invalid response from server'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error request:', error.request);
      console.error('❌ Error message:', error.message);
      
      if (error.response) {
        console.error('❌ Error status:', error.response.status);
        console.error('❌ Error data:', error.response.data);
        console.error('❌ Error headers:', error.response.headers);
        // Server responded with error
        return {
          success: false,
          message: error.response.data?.message || error.response.data || 'Login failed. Please check your information.'
        };
      } else if (error.request) {
        console.error('❌ Network error - no response received');
        // Network error
        return {
          success: false,
          message: 'Unable to connect to server. Please try again.'
        };
      } else {
        console.error('❌ Request setup error');
        return {
          success: false,
          message: 'An error occurred. Please try again.'
        };
      }
    }
  }

  // ===== REGISTER =====
  async register(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Register error:', error);
      
      if (error.response) {
        return {
          success: false,
          message: error.response.data?.message || error.response.data || 'Registration failed.'
        };
      } else {
        return {
          success: false,
          message: 'Unable to connect to server.'
        };
      }
    }
  }

  // ===== LOGOUT =====
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // TODO: Firebase signOut when integrated later
    // await signOut(auth);
  }

  // ===== CHECK AUTHENTICATION =====
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // ===== GET CURRENT USER =====
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  // ===== GET USER ROLE =====
  getUserRole() {
    return localStorage.getItem('role');
  }

  // ===== GET TOKEN =====
  getToken() {
    return localStorage.getItem('token');
  }

  // ===== CHECK ROLE =====
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // ===== CHECK MULTIPLE ROLES =====
  hasAnyRole(roles) {
    const userRole = this.getUserRole();
    return roles.includes(userRole);
  }

  // ===== ROLE CHECKERS =====
  isAdmin() {
    return this.hasRole('ADMIN');
  }

  isManager() {
    return this.hasRole('MANAGER');
  }

  isConsultant() {
    return this.hasRole('CONSULTANT');
  }

  isStaff() {
    return this.hasRole('STAFF');
  }

  isUser() {
    return this.hasRole('USER');
  }

  isGuest() {
    return this.hasRole('GUEST');
  }

  // ===== ROLE HIERARCHY CHECKS =====
  isAdminOrManager() {
    return this.hasAnyRole(['ADMIN', 'MANAGER']);
  }

  isStaffOrHigher() {
    return this.hasAnyRole(['ADMIN', 'MANAGER', 'STAFF']);
  }

  isConsultantOrHigher() {
    return this.hasAnyRole(['ADMIN', 'MANAGER', 'CONSULTANT']);
  }

  // ===== GET DASHBOARD PATH =====
  getDashboardPath() {
    const role = this.getUserRole();
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'CONSULTANT':
        return '/consultant/dashboard';
      case 'STAFF':
        return '/staff/dashboard';
      case 'USER':
        return '/user/dashboard';
      case 'GUEST':
        return '/';
      default:
        return '/';
    }
  }

  // ===== GET ROLE DISPLAY NAME =====
  getRoleDisplayName() {
    const role = this.getUserRole();
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager';
      case 'CONSULTANT':
        return 'Consultant';
      case 'STAFF':
        return 'Staff';
      case 'USER':
        return 'User';
      case 'GUEST':
        return 'Guest';
      default:
        return 'Undetermined';
    }
  }

  // ===== SETUP AXIOS INTERCEPTOR =====
  setupAxiosInterceptor() {
    // Add token to all requests
    api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Handle 401 responses
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ===== FUTURE: FIREBASE INTEGRATION METHODS (COMMENTED OUT) =====
  // async enableFirebaseFeatures() {
  //   // Implement real-time features
  // }
  
  // async syncWithFirebase() {
  //   // Sync backend user with Firebase
  // }
}

export default new AuthService(); 