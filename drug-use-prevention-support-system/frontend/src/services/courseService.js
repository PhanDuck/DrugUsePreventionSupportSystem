import api from '../config/axios';

// Mock data for development
const mockCourses = [
  {
    id: 1,
    title: 'Khóa học phòng chống ma túy cơ bản',
    description: 'Khóa học cung cấp kiến thức cơ bản về các loại ma túy, tác hại và cách phòng tránh',
    duration: '4 tuần',
    price: 500000,
    maxStudents: 50,
    currentStudents: 23,
    instructor: 'Nguyễn Văn A',
    category: 'Cơ bản',
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Bài 1: Tổng quan về ma túy',
      'Bài 2: Tác hại của ma túy',
      'Bài 3: Cách phòng tránh',
      'Bài 4: Kỹ năng từ chối'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 2,
    title: 'Khóa học nâng cao về phòng chống ma túy',
    description: 'Khóa học dành cho những người muốn tìm hiểu sâu hơn về các vấn đề liên quan đến ma túy',
    duration: '6 tuần',
    price: 800000,
    maxStudents: 30,
    currentStudents: 15,
    instructor: 'Trần Thị B',
    category: 'Nâng cao',
    status: 'ACTIVE',
    startDate: '2024-02-01',
    endDate: '2024-03-15',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Bài 1: Phân tích các loại ma túy mới',
      'Bài 2: Tác động lên não bộ',
      'Bài 3: Phương pháp điều trị',
      'Bài 4: Hỗ trợ người nghiện',
      'Bài 5: Phòng ngừa tái nghiện',
      'Bài 6: Kỹ năng tư vấn'
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    title: 'Khóa học cho phụ huynh',
    description: 'Hướng dẫn phụ huynh cách nhận biết và phòng ngừa ma túy cho con em',
    duration: '3 tuần',
    price: 300000,
    maxStudents: 100,
    currentStudents: 67,
    instructor: 'Lê Văn C',
    category: 'Gia đình',
    status: 'ACTIVE',
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Bài 1: Dấu hiệu nhận biết',
      'Bài 2: Cách trò chuyện với con',
      'Bài 3: Xây dựng môi trường an toàn'
    ],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 4,
    title: 'Khóa học cho giáo viên',
    description: 'Đào tạo giáo viên về cách giáo dục học sinh phòng chống ma túy',
    duration: '5 tuần',
    price: 600000,
    maxStudents: 40,
    currentStudents: 28,
    instructor: 'Phạm Thị D',
    category: 'Giáo dục',
    status: 'DRAFT',
    startDate: '2024-03-01',
    endDate: '2024-04-05',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Bài 1: Tâm lý học sinh',
      'Bài 2: Phương pháp giảng dạy',
      'Bài 3: Xử lý tình huống',
      'Bài 4: Phối hợp với phụ huynh',
      'Bài 5: Đánh giá hiệu quả'
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  }
];

const mockCategories = [
  { id: 1, name: 'Cơ bản', description: 'Khóa học cơ bản cho người mới bắt đầu' },
  { id: 2, name: 'Nâng cao', description: 'Khóa học nâng cao cho người có kinh nghiệm' },
  { id: 3, name: 'Gia đình', description: 'Khóa học dành cho phụ huynh' },
  { id: 4, name: 'Giáo dục', description: 'Khóa học dành cho giáo viên' },
  { id: 5, name: 'Chuyên nghiệp', description: 'Khóa học dành cho chuyên gia' }
];

// Helper functions for localStorage
const STORAGE_KEY = 'courses_mock_data';
function getCoursesFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  // If not in storage, initialize with mockCourses
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));
  return [...mockCourses];
}
function saveCoursesToStorage(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

class CourseService {
  // Get all courses
  async getCourses() {
    return {
      success: true,
      data: getCoursesFromStorage()
    };
  }

  // Get course by ID
  async getCourseById(courseId) {
    const courses = getCoursesFromStorage();
    const course = courses.find(c => c.id === parseInt(courseId));
    return {
      success: !!course,
      data: course,
      message: course ? null : 'Không tìm thấy khóa học'
    };
  }

  // Create new course
  async createCourse(courseData) {
    const courses = getCoursesFromStorage();
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const newCourse = {
      id: newId,
      ...courseData,
      currentStudents: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    courses.push(newCourse);
    saveCoursesToStorage(courses);
    return {
      success: true,
      data: newCourse,
      message: 'Tạo khóa học thành công (Mock)'
    };
  }

  // Update course
  async updateCourse(courseId, courseData) {
    const courses = getCoursesFromStorage();
    const index = courses.findIndex(c => c.id === parseInt(courseId));
    if (index !== -1) {
      courses[index] = {
        ...courses[index],
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      saveCoursesToStorage(courses);
      return {
        success: true,
        data: courses[index],
        message: 'Cập nhật khóa học thành công (Mock)'
      };
    }
    return {
      success: false,
      message: 'Không tìm thấy khóa học'
    };
  }

  // Delete course
  async deleteCourse(courseId) {
    let courses = getCoursesFromStorage();
    const index = courses.findIndex(c => c.id === parseInt(courseId));
    if (index !== -1) {
      courses.splice(index, 1);
      saveCoursesToStorage(courses);
      return {
        success: true,
        message: 'Xóa khóa học thành công (Mock)'
      };
    }
    return {
      success: false,
      message: 'Không tìm thấy khóa học'
    };
  }

  // Get categories (giữ nguyên mock)
  async getCategories() {
    return {
      success: true,
      data: mockCategories
    };
  }

  // Upload course image (giữ nguyên mock)
  async uploadCourseImage(file) {
    return {
      success: true,
      data: 'https://via.placeholder.com/300x200'
    };
  }

  // Get course statistics (giữ nguyên mock)
  async getCourseStats() {
    const courses = getCoursesFromStorage();
    const stats = {
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.status === 'ACTIVE').length,
      draftCourses: courses.filter(c => c.status === 'DRAFT').length,
      totalStudents: courses.reduce((sum, c) => sum + c.currentStudents, 0),
      totalRevenue: courses.reduce((sum, c) => sum + (c.currentStudents * c.price), 0)
    };
    return {
      success: true,
      data: stats
    };
  }
}

export default new CourseService(); 