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
        message: 'Service unavailable'
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
        message: error.response?.data?.error || 'Unable to create appointment'
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
        message: error.response?.data?.error || 'Unable to load client appointments'
      };
    }
  }

  // ===== GET CURRENT USER APPOINTMENTS =====
  async getCurrentUserAppointments() {
    try {
      const response = await api.get('/appointments/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching current user appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load your appointments'
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
        message: error.response?.data?.error || 'Unable to load consultant schedule'
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
        message: error.response?.data?.error || 'Unable to load upcoming appointments'
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
        message: error.response?.data?.error || 'Unable to load upcoming consultant schedule'
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
        message: error.response?.data?.error || 'Unable to load appointment information'
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
        message: error.response?.data?.error || 'Unable to confirm appointment'
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
        message: error.response?.data?.error || 'Unable to cancel appointment'
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
        message: error.response?.data?.error || 'Unable to complete appointment'
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
        message: error.response?.data?.error || 'Unable to add meeting link'
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
        message: error.response?.data?.error || 'Unable to load appointment list'
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
        message: error.response?.data?.error || 'Unable to load appointments by status'
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
        message: error.response?.data?.error || 'Unable to load consultant statistics'
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
        message: error.response?.data?.error || 'Unable to load available slots'
      };
    }
  }

  // ===== RESCHEDULE APPOINTMENT =====
  async rescheduleAppointment(appointmentId, rescheduleData) {
    try {
      const response = await api.put(`/appointments/${appointmentId}/reschedule`, rescheduleData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to reschedule appointment'
      };
    }
  }

  // ===== SUBMIT REVIEW =====
  async submitReview(appointmentId, reviewData) {
    try {
      const response = await api.post(`/appointments/${appointmentId}/review`, reviewData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to submit review'
      };
    }
  }

  // ===== GET APPOINTMENT REVIEWS =====
  async getAppointmentReviews(appointmentId) {
    try {
      const response = await api.get(`/appointments/${appointmentId}/reviews`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointment reviews:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load reviews'
      };
    }
  }

  // ===== GET CONSULTANT REVIEWS =====
  async getConsultantReviews(consultantId) {
    try {
      const response = await api.get(`/appointments/consultant/${consultantId}/reviews`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching consultant reviews:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load consultant reviews'
      };
    }
  }

  // ===== SEND APPOINTMENT REMINDER =====
  async sendAppointmentReminder(appointmentId) {
    try {
      const response = await api.post(`/appointments/${appointmentId}/reminder`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to send reminder'
      };
    }
  }

  // ===== GET APPOINTMENT STATISTICS =====
  async getAppointmentStatistics(userId, period = 'month') {
    try {
      const response = await api.get(`/appointments/statistics?userId=${userId}&period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching appointment statistics:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to load appointment statistics'
      };
    }
  }

  // ===== EXPORT APPOINTMENTS =====
  async exportAppointments(userId, format = 'pdf') {
    try {
      const response = await api.get(`/appointments/export?userId=${userId}&format=${format}`, {
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error exporting appointments:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Unable to export appointments'
      };
    }
  }
}

export default new AppointmentService(); 