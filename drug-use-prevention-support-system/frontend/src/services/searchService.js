import axios from '../config/axios';

const API_BASE_URL = '/api/search';

const searchService = {
  // Tìm kiếm tổng hợp
  searchAll: async (query, filters = {}) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  },

  // Tìm kiếm khóa học
  searchCourses: async (query, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`, {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  },

  // Tìm kiếm bài viết
  searchBlogs: async (query, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`, {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching blogs:', error);
      throw error;
    }
  },

  // Tìm kiếm tư vấn viên
  searchConsultants: async (query, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/consultants`, {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching consultants:', error);
      throw error;
    }
  },

  // Tìm kiếm đánh giá
  searchAssessments: async (query, filters = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessments`, {
        params: {
          q: query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching assessments:', error);
      throw error;
    }
  },

  // Lấy gợi ý tìm kiếm
  getSearchSuggestions: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggestions`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      throw error;
    }
  },

  // Lấy lịch sử tìm kiếm
  getSearchHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      return response.data;
    } catch (error) {
      console.error('Error getting search history:', error);
      throw error;
    }
  },

  // Xóa lịch sử tìm kiếm
  clearSearchHistory: async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/history`);
      return response.data;
    } catch (error) {
      console.error('Error clearing search history:', error);
      throw error;
    }
  },

  // Lấy từ khóa phổ biến
  getPopularKeywords: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/popular-keywords`);
      return response.data;
    } catch (error) {
      console.error('Error getting popular keywords:', error);
      throw error;
    }
  },

  // Lưu tìm kiếm vào lịch sử
  saveSearchToHistory: async (query, results) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/history`, {
        query,
        results
      });
      return response.data;
    } catch (error) {
      console.error('Error saving search to history:', error);
      throw error;
    }
  },

  // Tìm kiếm nâng cao
  advancedSearch: async (searchParams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/advanced`, searchParams);
      return response.data;
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  },

  // Lọc kết quả tìm kiếm
  filterSearchResults: async (results, filters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/filter`, {
        results,
        filters
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering search results:', error);
      throw error;
    }
  }
};

export default searchService; 