import api from '../config/axios';

class UserService {
  
  // ===== GET ALL USERS =====
  async getUsers() {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách người dùng'
      };
    }
  }

  // ===== GET USER BY ID =====
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin người dùng'
      };
    }
  }

  // ===== UPDATE USER =====
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin người dùng'
      };
    }
  }

  // ===== DELETE USER =====
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: 'Xóa người dùng thành công'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa người dùng'
      };
    }
  }

  // ===== GET USER PROFILE =====
  async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thông tin cá nhân'
      };
    }
  }

  // ===== UPDATE USER PROFILE =====
  async updateUserProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể cập nhật thông tin cá nhân'
      };
    }
  }

  // ===== CHANGE PASSWORD =====
  async changePassword(userId, newPassword) {
    try {
      const response = await api.put(`/users/${userId}/password?newPassword=${newPassword}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể thay đổi mật khẩu'
      };
    }
  }

  // ===== GET USERS BY ROLE =====
  async getUsersByRole(roleId) {
    try {
      const response = await api.get(`/users/role/${roleId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách người dùng theo vai trò'
      };
    }
  }

  // ===== ASSIGN ROLE =====
  async assignRole(userId, role) {
    try {
      const response = await api.post(`/users/${userId}/assign-role`, { role });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error assigning role:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể gán vai trò'
      };
    }
  }

  // ===== DEACTIVATE USER =====
  async deactivateUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/deactivate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể vô hiệu hóa người dùng'
      };
    }
  }

  // ===== ACTIVATE USER =====
  async activateUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/activate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error activating user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể kích hoạt người dùng'
      };
    }
  }

  // ===== GET ALL CONSULTANTS =====
  async getConsultants() {
    try {
      const response = await api.get('/users/consultants');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultants:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải danh sách chuyên gia tư vấn'
      };
    }
  }

  // ===== SEARCH USERS =====
  async searchUsers(keyword) {
    try {
      const response = await api.get(`/users/search?keyword=${keyword}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tìm kiếm người dùng'
      };
    }
  }

  // ===== GET USER STATISTICS =====
  async getUserCount() {
    try {
      const response = await api.get('/users/statistics/count');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user count:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thống kê người dùng'
      };
    }
  }

  // ===== GET USER COUNT BY ROLE =====
  async getUserCountByRole() {
    try {
      const response = await api.get('/users/statistics/by-role');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching user count by role:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải thống kê theo vai trò'
      };
    }
  }
}

export default new UserService(); 