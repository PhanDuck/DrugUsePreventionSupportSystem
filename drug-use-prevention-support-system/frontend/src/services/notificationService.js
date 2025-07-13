import axios from '../config/axios';

const API_BASE_URL = '/api/notifications';

const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async (params = {}) => {
    try {
      const response = await axios.get(API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/mark-all-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/unread-count`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Cập nhật cài đặt thông báo
  updateNotificationSettings: async (settings) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Lấy cài đặt thông báo
  getNotificationSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/settings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Tạo thông báo mới (cho admin)
  createNotification: async (notificationData) => {
    try {
      const response = await axios.post(API_BASE_URL, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Gửi thông báo cho user cụ thể
  sendNotificationToUser: async (userId, notificationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/send-to-user/${userId}`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw error;
    }
  },

  // Gửi thông báo cho tất cả users
  sendNotificationToAll: async (notificationData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/send-to-all`, notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification to all users:', error);
      throw error;
    }
  }
};

export default notificationService; 