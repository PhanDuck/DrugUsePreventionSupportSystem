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
      const response = await apiClient.get(`/staff/courses/${courseId}/lessons`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error getting course lessons:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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