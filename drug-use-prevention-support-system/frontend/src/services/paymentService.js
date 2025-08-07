import apiClient from '../config/axios';
import authService from './authService';

const paymentService = {
  // Create VNPay payment for course enrollment
  createCoursePayment: async (courseId, amount, description = 'Course enrollment payment') => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const paymentData = {
        courseId: courseId,
        amount: amount,
        userId: currentUser.id,
        description: description,
        type: 'COURSE'
      };

      console.log('🔄 Creating VNPay payment:', paymentData);
      
      // For testing - use VNPay demo page
      const useVnPayDemo = true; // Set to false to use real VNPay
      
      if (useVnPayDemo) {
        console.log('🧪 Using VNPay Demo page for testing');
        const demoUrl = `/vnpay-demo?courseId=${courseId}&amount=${amount}&courseName=${encodeURIComponent(description)}`;
        return {
          success: true,
          data: {
            paymentUrl: demoUrl,
            paymentId: 'DEMO_' + Date.now()
          }
        };
      }
      
      const response = await apiClient.post('/payments/vnpay/create', paymentData);
      
      console.log('📦 Backend response:', response.data);
      
      // Backend returns direct object, not wrapped in success/data
      if (response.data && response.data.paymentUrl) {
        console.log('✅ Payment URL created:', response.data.paymentUrl);
        return {
          success: true,
          data: {
            paymentUrl: response.data.paymentUrl,
            paymentId: response.data.paymentId
          }
        };
      } else {
        throw new Error('Invalid payment response - no paymentUrl');
      }
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },

  // Redirect to VNPay payment page
  redirectToPayment: (paymentUrl) => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  },

  // Process payment return from VNPay
  processPaymentReturn: async (params) => {
    try {
      const response = await apiClient.post('/payments/vnpay/return', params);
      return response.data;
    } catch (error) {
      console.error('❌ Error processing payment return:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }
};

export default paymentService; 