import api from '../config/axios';

class PaymentService {
  
  // ===== CREATE VNPAY PAYMENT =====
  async createVNPayPayment(paymentData) {
    try {
      const response = await api.post('/payments/vnpay/create', paymentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to create VNPay payment'
      };
    }
  }

  // ===== GET PAYMENT STATUS =====
  async getPaymentStatus(paymentId) {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load payment status'
      };
    }
  }

  // ===== GET PAYMENT HISTORY =====
  async getPaymentHistory(userId) {
    try {
      const response = await api.get(`/payments/history/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load payment history'
      };
    }
  }

  // ===== REFUND PAYMENT =====
  async refundPayment(paymentId, reason) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, { reason });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to refund payment'
      };
    }
  }

  // ===== GET PAYMENT STATISTICS =====
  async getPaymentStatistics(period = 'month') {
    try {
      const response = await api.get(`/payments/statistics?period=${period}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load payment statistics'
      };
    }
  }
}

export default new PaymentService(); 