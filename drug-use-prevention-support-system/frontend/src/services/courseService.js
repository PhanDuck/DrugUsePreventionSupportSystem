// CourseService is temporarily disabled because CourseController is disabled in backend
// Will be re-enabled when backend course management is ready

/*
import api from '../config/axios';

class CourseService {
  // Course service methods will be implemented when backend is ready
}

export default new CourseService();
*/

// Temporary placeholder service
class CourseService {
  async getCourses() {
    console.warn('Course service not available - backend CourseController is disabled');
    return {
      success: false,
      message: 'Dịch vụ khóa học hiện không khả dụng'
    };
  }

  async getCourseById(courseId) {
    console.warn('Course service not available - backend CourseController is disabled');
    return {
      success: false,
      message: 'Dịch vụ khóa học hiện không khả dụng'
    };
  }

  async createCourse(courseData) {
    console.warn('Course service not available - backend CourseController is disabled');
    return {
      success: false,
      message: 'Dịch vụ khóa học hiện không khả dụng'
    };
  }

  // Other methods return similar disabled responses...
}

export default new CourseService(); 