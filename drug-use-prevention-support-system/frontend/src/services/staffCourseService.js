import apiClient from '../config/axios';

const staffCourseService = {
  // Get all courses for management
  getAllCourses: async () => {
    try {
      const response = await apiClient.get('/staff/courses');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting all courses:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Test API connectivity
  testAPI: async () => {
    try {
      console.log('🧪 Testing staff course API...');
      const response = await apiClient.get('/staff/courses/test');
      console.log('✅ Test API response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Test API error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Test database connectivity
  testDatabase: async () => {
    try {
      console.log('🗄️ Testing database connectivity...');
      const response = await apiClient.get('/staff/courses/test/db');
      console.log('✅ Database test response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Database test error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Test lesson endpoint directly
  testLessons: async (courseId = 1) => {
    try {
      console.log('📚 Testing lesson endpoint for course:', courseId);
      const response = await apiClient.get(`/staff/courses/lessons/${courseId}`);
      console.log('✅ Lessons test response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Lessons test error:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  },

  // Get course by ID for management
  getCourseById: async (courseId) => {
    try {
      const response = await apiClient.get(`/staff/courses/${courseId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting course by ID:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post('/staff/courses', courseData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating course:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await apiClient.put(`/staff/courses/${courseId}`, courseData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating course:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await apiClient.delete(`/staff/courses/${courseId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting course:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get course lessons
  getCourseLessons: async (courseId) => {
    try {
      console.log('📚 Getting lessons for course:', courseId);
      const response = await apiClient.get(`/staff/courses/lessons/${courseId}`);
      console.log('📚 Raw response:', response);
      
      // Handle new backend response format
      if (response.data && response.data.success) {
        console.log('✅ Lessons loaded:', response.data.data);
        return {
          success: true,
          data: response.data.data || []
        };
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback for direct array response
        console.log('✅ Lessons loaded (array):', response.data);
        return {
          success: true,
          data: response.data
        };
      } else {
        console.log('❌ Invalid response format:', response.data);
        return {
          success: false,
          error: 'Invalid response format',
          data: []
        };
      }
    } catch (error) {
      console.error('❌ Error getting course lessons:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // Create lesson
  createLesson: async (courseId, lessonData) => {
    try {
      const response = await apiClient.post(`/staff/courses/${courseId}/lessons`, lessonData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating lesson:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Update lesson
  updateLesson: async (courseId, lessonId, lessonData) => {
    try {
      const response = await apiClient.put(`/staff/courses/${courseId}/lessons/${lessonId}`, lessonData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating lesson:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete lesson
  deleteLesson: async (courseId, lessonId) => {
    try {
      const response = await apiClient.delete(`/staff/courses/${courseId}/lessons/${lessonId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get lesson content
  getLessonContent: async (lessonId) => {
    try {
      const response = await apiClient.get(`/staff/courses/lessons/${lessonId}/content`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting lesson content:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Create lesson content
  createLessonContent: async (lessonId, contentData) => {
    try {
      const response = await apiClient.post(`/staff/courses/lessons/${lessonId}/content`, contentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating lesson content:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Update lesson content
  updateLessonContent: async (contentId, contentData) => {
    try {
      const response = await apiClient.put(`/staff/courses/content/${contentId}`, contentData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating lesson content:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Delete lesson content
  deleteLessonContent: async (contentId) => {
    try {
      const response = await apiClient.delete(`/staff/courses/content/${contentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting lesson content:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default staffCourseService; 