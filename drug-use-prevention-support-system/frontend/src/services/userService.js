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
        message: error.response?.data?.message || 'Unable to load user list'
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
        message: error.response?.data?.message || 'Unable to load user information'
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
        message: error.response?.data?.message || 'Unable to update user information'
      };
    }
  }

  // ===== DELETE USER =====
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to delete user'
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
        message: error.response?.data?.message || 'Unable to load personal information'
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
        message: error.response?.data?.message || 'Unable to update personal information'
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
        message: error.response?.data?.message || 'Unable to change password'
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
        message: error.response?.data?.message || 'Unable to load user list by role'
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
        message: error.response?.data?.message || 'Unable to assign role'
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
        message: error.response?.data?.message || 'Unable to deactivate user'
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
        message: error.response?.data?.message || 'Unable to activate user'
      };
    }
  }

  // ===== GET ALL CONSULTANTS =====
  async getConsultants() {
    try {
      const response = await api.get('/consultants/public/list');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultants:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load consultant list'
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
        message: error.response?.data?.message || 'Unable to search users'
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
        message: error.response?.data?.message || 'Unable to load user statistics'
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
        message: error.response?.data?.message || 'Unable to load statistics by role'
      };
    }
  }
}

export default new UserService(); 