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
        message: error.response?.data?.message || 'Không thể tải danh mục'
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
        message: error.response?.data?.message || 'Không thể tải thông tin danh mục'
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
        message: error.response?.data?.message || 'Không thể tạo danh mục'
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
        message: error.response?.data?.message || 'Không thể cập nhật danh mục'
      };
    }
  }

  // ===== DELETE CATEGORY =====
  async deleteCategory(categoryId) {
    try {
      await api.delete(`/categories/${categoryId}`);
      return {
        success: true,
        message: 'Xóa danh mục thành công'
      };
    } catch (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể xóa danh mục'
      };
    }
  }

  // ===== SEARCH CATEGORIES =====
  async searchCategories(name) {
    try {
      const response = await api.get(`/categories/search?name=${name}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error searching categories:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể tìm kiếm danh mục'
      };
    }
  }
}

export default new CategoryService(); 