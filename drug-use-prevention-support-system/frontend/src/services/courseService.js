import api from '../config/axios';
import paymentService from './paymentService';
import authService from './authService';

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

  async getCourseLessons(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/lessons`);
      
      // Handle new standardized response format
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getCourseStatus(courseId) {
    try {
      const response = await api.get(`/courses/${courseId}/status`);
      
      if (response.data.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error fetching course status:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async completeCourse(courseId) {
    try {
      const response = await api.post(`/courses/${courseId}/complete`);
      
      if (response.data.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error completing course:', error);
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

  // ===== VNPay Payment Integration =====
  
  async processVNPayPayment(paymentInfo) {
    try {
      // Create VNPay payment using correct method name
      const paymentResponse = await paymentService.createCoursePayment(
        paymentInfo.courseId,
        paymentInfo.price,
        `Payment for course: ${paymentInfo.courseName}`
      );
      
      if (paymentResponse.success) {
        // Redirect to VNPay payment URL
        window.location.href = paymentResponse.data.paymentUrl;
        
        return {
          success: true,
          paymentId: paymentResponse.data.paymentId,
          paymentUrl: paymentResponse.data.paymentUrl
        };
      } else {
        return {
          success: false,
          error: paymentResponse.error || 'Failed to create payment'
        };
      }
    } catch (error) {
      console.error('Error processing VNPay payment:', error);
      return {
        success: false,
        error: error.message
      };
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

  // ===== COURSE ENROLLMENT =====
  async checkEnrollment(courseId) {
    try {
      const response = await api.get(`/course-registrations/check/${courseId}`);
      return { success: true, isEnrolled: response.data.isRegistered };
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return { success: false, isEnrolled: false };
    }
  }

  async enrollInCourse(courseId) {
    try {
      const response = await api.post(`/course-registrations/register/${courseId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message 
      };
    }
  }

  async completeEnrollmentAfterPayment(courseId, paymentData) {
    try {
      const response = await api.post(`/course-registrations/complete-enrollment/${courseId}`, paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error completing enrollment after payment:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message 
      };
    }
  }

  // ===== CATEGORIES =====

  async getCategories() {
    try {
      const response = await api.get('/categories');
      
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
        // Fallback - assume it's the data itself
        else {
          return { success: true, data: response.data };
        }
      }
      
      return { success: false, error: 'No data received' };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.response?.data?.error || error.message };
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
      const response = await api.get('/courses/stats');
      
      // Handle different response formats
      if (response.data) {
        if (response.data.success !== undefined) {
          if (response.data.success) {
            return { success: true, data: response.data.data || {} };
          } else {
            return { success: false, error: response.data.error || 'Unknown error' };
          }
        }
        // Direct data format
        else {
          return { success: true, data: response.data };
        }
      }
      
      return { success: false, error: 'No data received' };
    } catch (error) {
      console.error('Error fetching course stats:', error);
      return { success: false, error: error.response?.data?.error || error.message };
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

  // ===== USER LESSON CONTENT APIs =====
  
  // Get published content for a lesson (enrolled users only)
  async getLessonContent(courseId, lessonId) {
    try {
      console.log('📚 Getting lesson content for user - courseId:', courseId, 'lessonId:', lessonId);
      const response = await api.get(`/courses/${courseId}/lessons/${lessonId}/content`);
      
      console.log('📥 RAW API Response:', response);
      console.log('📥 Response.data:', response.data);
      console.log('📥 Response.data type:', typeof response.data);
      console.log('📥 Response.data.success:', response.data?.success);
      console.log('📥 Response.data.data:', response.data?.data);
      console.log('📥 Response.data.data type:', typeof response.data?.data);
      console.log('📥 Response.data.data length:', response.data?.data?.length);
      console.log('📥 Response.data.count:', response.data?.count);
      
      if (response.data && response.data.success) {
        const extractedData = response.data.data || [];
        console.log('✅ Extracted data:', extractedData);
        console.log('✅ Extracted data length:', extractedData.length);
        console.log('✅ First item:', extractedData[0]);
        return {
          success: true,
          data: extractedData
        };
      } else {
        console.log('❌ Response not successful:', response.data);
        return {
          success: false,
          error: response.data?.error || 'Failed to load lesson content'
        };
      }
    } catch (error) {
      console.error('❌ ERROR getting lesson content:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message
      };
    }
  }
}

export default new CourseService(); 