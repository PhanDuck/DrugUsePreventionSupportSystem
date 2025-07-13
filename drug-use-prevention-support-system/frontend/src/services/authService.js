import api from '../config/axios';

class AuthService {
  
  // ===== LOGIN (MOCK) =====
  async login(username, password) {
    // Mock login cho frontend
    const mockUsers = [
      {
        username: 'consultant1',
        password: 'consultant123',
        role: 'CONSULTANT',
        user: {
          id: 101,
          username: 'consultant1',
          email: 'consultant1@example.com',
          firstName: 'Consultant',
          lastName: 'Test'
        }
      },
      {
        username: 'user1',
        password: 'user123',
        role: 'USER',
        user: {
          id: 201,
          username: 'user1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'Test'
        }
      }
    ];

    const found = mockUsers.find(
      u => u.username === username && u.password === password
    );
    if (found) {
      // Lưu vào localStorage như backend trả về
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(found.user));
      localStorage.setItem('role', found.role);
      return { success: true, data: { token: 'mock-token', user: found.user, role: found.role } };
    } else {
      return { success: false, message: 'Sai tài khoản hoặc mật khẩu (mock)' };
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
          message: error.response.data?.message || error.response.data || 'Đăng ký thất bại.'
        };
      } else {
        return {
          success: false,
          message: 'Không thể kết nối tới server.'
        };
      }
    }
  }

  // ===== LOGOUT =====
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    // TODO: Firebase signOut khi tích hợp sau
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
        return 'Quản trị viên';
      case 'MANAGER':
        return 'Quản lý';
      case 'CONSULTANT':
        return 'Chuyên gia tư vấn';
      case 'STAFF':
        return 'Nhân viên';
      case 'USER':
        return 'Người dùng';
      case 'GUEST':
        return 'Khách';
      default:
        return 'Không xác định';
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