import api from '../config/axios';

// Mock data for development
const mockCourses = [
  {
    id: 1,
    title: 'Basic drug prevention course',
    description: 'This course provides basic knowledge about various drugs, their harms, and ways to prevent them',
    duration: '4 weeks',
    price: 500000,
    maxStudents: 50,
    currentStudents: 23,
    instructor: 'Nguyen Van A',
    category: 'Basic',
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Lesson 1: Overview of drugs',
      'Lesson 2: The harms of drugs',
      'Lesson 3: Ways to prevent',
      'Lesson 4: Rejection skills'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 2,
    title: 'Advanced drug prevention course',
    description: 'This course is for those who want to learn more deeply about drug-related issues',
    duration: '6 weeks',
    price: 800000,
    maxStudents: 30,
    currentStudents: 15,
    instructor: 'Tran Thi B',
    category: 'Advanced',
    status: 'ACTIVE',
    startDate: '2024-02-01',
    endDate: '2024-03-15',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Lesson 1: Analysis of new drug types',
      'Lesson 2: Impact on the brain',
      'Lesson 3: Treatment methods',
      'Lesson 4: Support for addicts',
      'Lesson 5: Prevention of relapse',
      'Lesson 6: Counseling skills'
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    title: 'Professional drug prevention consultation course',
    description: 'This course is for specialists, who are deeply involved in consultation and support for drug prevention',
    duration: '8 weeks',
    price: 1200000,
    maxStudents: 20,
    currentStudents: 8,
    instructor: 'Le Van C',
    category: 'Professional',
    status: 'ACTIVE',
    startDate: '2024-03-01',
    endDate: '2024-04-26',
    imageUrl: 'https://via.placeholder.com/300x200',
    syllabus: [
      'Lesson 1: Deep consultation',
      'Lesson 2: Developing support programs',
      'Lesson 3: Evaluating intervention effectiveness',
      'Lesson 4: Multi-sector collaboration'
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  }
];

const mockCategories = [
  { id: 1, name: 'Basic', description: 'Course for beginners' },
  { id: 2, name: 'Advanced', description: 'Course for experienced individuals' },
  { id: 3, name: 'Professional', description: 'Course for specialists' }
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
      message: course ? null : 'Course not found'
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
      message: 'Course created successfully (Mock)'
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
        message: 'Course updated successfully (Mock)'
      };
    }
    return {
      success: false,
      message: 'Course not found'
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
        message: 'Course deleted successfully (Mock)'
      };
    }
    return {
      success: false,
      message: 'Course not found'
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