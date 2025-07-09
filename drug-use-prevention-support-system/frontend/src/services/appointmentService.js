import api from '../config/axios';

class AppointmentService {
  
  // ===== HEALTH CHECK =====
  async healthCheck() {
    try {
      const response = await api.get('/appointments/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error checking appointment service health:', error);
      return {
        success: false,
        message: 'Service không khả dụng'
      };
    }
  }

  // ===== CREATE APPOINTMENT =====
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tạo cuộc hẹn'
      };
    }
  }

  // ===== GET APPOINTMENTS BY CLIENT =====
  async getAppointmentsByClient(clientId) {
    try {
      const response = await api.get(`/appointments/client/${clientId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching client appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải cuộc hẹn của khách hàng'
      };
    }
  }

  // ===== GET APPOINTMENTS BY CONSULTANT =====
  async getAppointmentsByConsultant(consultantId) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultant appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải lịch tư vấn'
      };
    }
  }

  // ===== GET UPCOMING APPOINTMENTS BY CLIENT =====
  async getUpcomingAppointmentsByClient(clientId) {
    try {
      const response = await api.get(`/appointments/client/${clientId}/upcoming`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching upcoming client appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải cuộc hẹn sắp tới'
      };
    }
  }

  // ===== GET UPCOMING APPOINTMENTS BY CONSULTANT =====
  async getUpcomingAppointmentsByConsultant(consultantId) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}/upcoming`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching upcoming consultant appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải lịch tư vấn sắp tới'
      };
    }
  }

  // ===== GET APPOINTMENT BY ID =====
  async getAppointmentById(appointmentId) {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải thông tin cuộc hẹn'
      };
    }
  }

  // ===== CONFIRM APPOINTMENT =====
  async confirmAppointment(appointmentId, consultantId) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/confirm?consultantId=${consultantId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error confirming appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể xác nhận cuộc hẹn'
      };
    }
  }

  // ===== CANCEL APPOINTMENT =====
  async cancelAppointment(appointmentId, userId, reason) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel?userId=${userId}&reason=${reason}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error canceling appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể hủy cuộc hẹn'
      };
    }
  }

  // ===== COMPLETE APPOINTMENT =====
  async completeAppointment(appointmentId, consultantId, notes) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/complete?consultantId=${consultantId}&notes=${notes || ''}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error completing appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể hoàn thành cuộc hẹn'
      };
    }
  }

  // ===== ADD MEETING LINK =====
  async addMeetingLink(appointmentId, consultantId, meetingLink) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/meeting-link?consultantId=${consultantId}&meetingLink=${meetingLink}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error adding meeting link:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể thêm link meeting'
      };
    }
  }

  // ===== ADMIN - GET ALL APPOINTMENTS =====
  async getAllAppointments() {
    try {
      const response = await api.get('/appointments/admin/all');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải danh sách cuộc hẹn'
      };
    }
  }

  // ===== ADMIN - GET APPOINTMENTS BY STATUS =====
  async getAppointmentsByStatus(status) {
    try {
      const response = await api.get(`/appointments/admin/status/${status}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointments by status:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải cuộc hẹn theo trạng thái'
      };
    }
  }

  // ===== GET CONSULTANT STATISTICS =====
  async getConsultantStats(consultantId, startDate, endDate) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}/stats/count?startDate=${startDate}&endDate=${endDate}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultant statistics:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải thống kê chuyên gia'
      };
    }
  }

  // ===== GET AVAILABLE TIME SLOTS =====
  async getAvailableSlots(consultantId, date) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}/available-slots?date=${date}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Không thể tải lịch trống',
        data: { availableSlots: [] }
      };
    }
  }
}

export default new AppointmentService(); 