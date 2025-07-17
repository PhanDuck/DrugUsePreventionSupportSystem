import api from '../config/axios';

class CourseService {
  // ===== PUBLIC COURSE APIs =====
  
  async getCourses() {
    try {
      const response = await api.get('/courses');
      
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      
      // Handle different response formats
      if (response.data) {
        // Check if it's backend format {message: "...", data: [...]}
        if (response.data.data && Array.isArray(response.data.data)) {
          return { success: true, data: response.data.data };
        }
        // Check if it's standardized format {success: true, data: [...]}
        else if (response.data.success !== undefined) {
          if (response.data.success) {
            return { success: true, data: response.data.data || [] };
          } else {
            return { success: false, error: response.data.error || 'Unknown error' };
          }
        }
        // Check if it's direct array format [...]
        else if (Array.isArray(response.data)) {
          return { success: true, data: response.data };
        }
        // Check if it's object with courses property
        else if (response.data.courses) {
          return { success: true, data: response.data.courses };
        }
        // Fallback - assume it's the data itself
        else {
          return { success: true, data: response.data };
        }
      }
      
      return { success: false, error: 'No data received' };
    } catch (error) {
      console.error('Error fetching courses:', error);
      console.error('Error details:', error.response?.data);
      return { success: false, error: error.response?.data?.message || error.response?.data?.error || error.message };
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}`);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getCoursesByCategory(categoryId) {
    try {
      const response = await api.get(`/courses/category/${categoryId}`);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // ===== COURSE REGISTRATION =====
  
  async registerForCourse(courseId) {
    try {
      const response = await api.post(`/course-registrations/register/${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error registering for course:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async confirmPayment(courseId, paymentData) {
    try {
      const response = await api.post(`/course-registrations/confirm-payment/${courseId}`, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // Helper method to handle enrollment flow (free vs paid)
  async handleCourseEnrollment(courseId) {
    try {
      // First, try to register
      const registrationResponse = await this.registerForCourse(courseId);
      
      if (!registrationResponse.success) {
        return registrationResponse;
      }

      const data = registrationResponse.data;

      // Check if payment is required
      if (data.requiresPayment) {
        return {
          success: true,
          requiresPayment: true,
          paymentInfo: {
            courseId: data.courseId,
            courseName: data.courseName,
            price: data.price,
            currency: data.currency,
            message: data.message
          }
        };
      } else {
        // Free course - registration completed
        return {
          success: true,
          requiresPayment: false,
          registration: data.registration,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Error in course enrollment:', error);
      return { success: false, error: error.message };
    }
  }

  // Mock VNPay payment process (will be replaced with real integration)
  async processVNPayPayment(paymentInfo) {
    try {
      // TODO: Replace with real VNPay integration
      console.log('Processing VNPay payment for:', paymentInfo);
      
      // Simulate payment process
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock successful payment
          resolve({
            success: true,
            paymentStatus: 'SUCCESS',
            transactionId: 'TXN_' + Date.now(),
            message: 'Payment processed successfully (mock)'
          });
        }, 2000); // Simulate 2s payment processing
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserRegistrations(userId) {
    try {
      const response = await api.get(`/courses/registrations/user/${userId}`);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async cancelCourseRegistration(courseId) {
    try {
      const response = await api.delete(`/course-registrations/cancel/${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error cancelling registration:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // ===== CATEGORIES =====

  async getCategories() {
    try {
      // For now, return static categories that match our database
      return { 
        success: true, 
        data: [
          { id: 1, name: 'Basic', description: 'Basic level courses' },
          { id: 2, name: 'Advanced', description: 'Advanced level courses' },
          { id: 3, name: 'Professional', description: 'Professional level courses' }
        ]
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== ADMIN FUNCTIONS (for staff/admin) =====
  
  async createCourse(courseData) {
    try {
      const response = await api.post('/courses', courseData);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error creating course:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error updating course:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error deleting course:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  // ===== COURSE STATISTICS =====
  
  async getCourseStats() {
    try {
      // Mock stats for now - can be replaced with real API later
      return {
        success: true,
        data: {
          totalCourses: 0,
          activeCourses: 0,
          totalStudents: 0,
          completedCourses: 0
        }
      };
    } catch (error) {
      console.error('Error fetching course stats:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== HEALTH CHECK =====
  
  async healthCheck() {
    try {
      const response = await api.get('/courses/health');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Course service health check failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CourseService(); 