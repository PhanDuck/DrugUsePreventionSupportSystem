import api from '../config/axios';

class PaymentService {
  
  // ===== HEALTH CHECK =====
  async healthCheck() {
    try {
      const response = await api.get('/payment/health');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error checking payment service health:', error);
      return {
        success: false,
        message: 'Payment service không khả dụng'
      };
    }
  }

  // ===== VNPAY INTEGRATION =====
  
  /**
   * Create VNPay payment URL
   */
  async createVNPayPayment(appointmentId, amount, description) {
    try {
      const paymentRequest = {
        appointmentId,
        amount,
        description,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/appointment`
      };

      const response = await api.post('/payment/vnpay/create', paymentRequest);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tạo thanh toán VNPay'
      };
    }
  }

  /**
   * Get payment status for an appointment
   */
  async getPaymentStatus(appointmentId) {
    try {
      const response = await api.get(`/payment/status/${appointmentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tải trạng thái thanh toán'
      };
    }
  }

  // ===== PAYMENT UTILITIES =====
  
  /**
   * Format amount for VNPay (VND, no decimal)
   */
  formatVNPayAmount(amount) {
    return Math.round(amount);
  }

  /**
   * Generate payment description
   */
  generatePaymentDescription(appointmentId, consultantName) {
    return `Thanh toan tu van - Appointment #${appointmentId} - ${consultantName}`;
  }

  /**
   * Redirect to VNPay payment page
   */
  redirectToVNPay(paymentUrl) {
    window.location.href = paymentUrl;
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplayName(method) {
    const methodMap = {
      'VNPAY': '🏧 VNPay',
      'BANK_TRANSFER': '🏦 Chuyển khoản',
      'CARD': '💳 Thẻ tín dụng'
    };
    return methodMap[method] || method;
  }

  /**
   * Get payment status color for UI
   */
  getPaymentStatusColor(status) {
    const colorMap = {
      'PAID': '#52c41a',      // Green
      'UNPAID': '#faad14',    // Orange
      'FAILED': '#f5222d',    // Red
      'PENDING': '#1890ff',   // Blue
      'REFUNDED': '#722ed1'   // Purple
    };
    return colorMap[status] || '#666666';
  }

  /**
   * Get payment status icon
   */
  getPaymentStatusIcon(status) {
    const iconMap = {
      'PAID': '✅',
      'UNPAID': '⏳',
      'FAILED': '❌',
      'PENDING': '🕐',
      'REFUNDED': '↩️'
    };
    return iconMap[status] || '❓';
  }
}

export default new PaymentService();