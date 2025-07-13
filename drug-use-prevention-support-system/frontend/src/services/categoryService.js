import api from '../config/axios';

class CategoryService {
  
  // ===== GET ALL CATEGORIES =====
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load categories'
      };
    }
  }

  // ===== GET CATEGORY BY ID =====
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to load category information'
      };
    }
  }

  // ===== CREATE CATEGORY =====
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to create category'
      };
    }
  }

  // ===== UPDATE CATEGORY =====
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to update category'
      };
    }
  }

  // ===== DELETE CATEGORY =====
  async deleteCategory(categoryId) {
    try {
      await api.delete(`/categories/${categoryId}`);
      return {
        success: true,
        message: 'Category deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to delete category'
      };
    }
  }

  // ===== SEARCH CATEGORIES =====
  async searchCategories(keyword) {
    try {
      const response = await api.get(`/categories/search?keyword=${keyword}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error searching categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to search categories'
      };
    }
  }
}

export default new CategoryService(); 