# 🟡 FRONTEND - HƯỚNG DẪN CHI TIẾT

## 🎯 TRÁCH NHIỆM CỦA BẠN

Bạn chịu trách nhiệm về **toàn bộ giao diện người dùng** của hệ thống, bao gồm:
- Tất cả các **React Pages** (đăng nhập, dashboard, khóa học, đặt lịch)
- Tất cả **React Components** (form, button, card, table...)
- **API Integration** với backend
- **Responsive Design** cho mobile và desktop
- **User Experience** và **User Interface**

## 🏗️ KIẾN TRÚC FRONTEND

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT + VITE FRONTEND                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    PAGES    │  │ COMPONENTS  │  │      SERVICES       │ │
│  │             │  │             │  │                     │ │
│  │ • LoginPage │  │ • Calendar  │  │ • authService.js    │ │
│  │ • Dashboard │  │ • Forms     │  │ • appointmentSvc.js │ │ 
│  │ • CoursePage│  │ • Cards     │  │ • courseService.js  │ │
│  │ • Appointment│ │ • Tables    │  │ • userService.js    │ │
│  │ • ProfilePg │  │ • Modals    │  │ • paymentSvc.js     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   CONFIG    │  │   STYLES    │  │       UTILS         │ │
│  │             │  │             │  │                     │ │
│  │ • axios.js  │  │ • globals.css│ │ • auth helpers     │ │
│  │ • routes    │  │ • components│  │ • date formatters  │ │
│  │ • constants │  │ • pages     │  │ • validators       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 CẤU TRÚC THƯ MỤC FRONTEND

```
frontend/src/
├── pages/                    # Tất cả các trang chính
│   ├── App.jsx              # Main app component
│   ├── Layout.jsx           # Layout wrapper với header/sidebar
│   ├── HomePage.jsx         # Trang chủ
│   ├── LoginPage.jsx        # Đăng nhập
│   ├── RegisterPage.jsx     # Đăng ký
│   ├── ProfilePage.jsx      # Trang cá nhân
│   ├── CoursesPage.jsx      # Danh sách khóa học
│   ├── CourseDetailPage.jsx # Chi tiết khóa học
│   ├── AppointmentPage.jsx  # Đặt lịch tư vấn
│   ├── AppointmentListPage.jsx # Danh sách lịch hẹn
│   ├── BlogPage.jsx         # Blog/Tin tức
│   ├── SearchPage.jsx       # Tìm kiếm
│   ├── SettingsPage.jsx     # Cài đặt
│   └── dashboards/          # Dashboard theo role
│       ├── UserDashboard.jsx
│       ├── ConsultantDashboard.jsx
│       ├── StaffDashboard.jsx
│       ├── AdminDashboard.jsx
│       └── ManagerDashboard.jsx
│
├── components/              # Reusable components
│   ├── AppointmentCalendar.jsx
│   ├── AppointmentCard.jsx
│   ├── AppointmentStats.jsx
│   ├── AvailableConsultants.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorBoundary.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleBasedComponent.jsx
│   └── staff/              # Components cho staff
│       ├── CourseEditor.jsx
│       ├── CourseList.jsx
│       ├── ContentManager.jsx
│       └── StaffCourseManager.jsx
│
├── services/               # API calling services
│   ├── appointmentService.js
│   ├── authService.js
│   ├── courseService.js
│   ├── userService.js
│   ├── paymentService.js
│   ├── notificationService.js
│   └── searchService.js
│
├── config/                # Configuration
│   └── axios.js           # Axios setup với interceptors
│
├── styles/                # CSS files
│   ├── globals.css        # Global styles
│   ├── LoginPage.css      # Page-specific styles
│   └── RegisterPage.css
│
├── utils/                 # Utility functions
│   ├── dateUtils.js
│   ├── authUtils.js
│   └── validators.js
│
└── main.jsx              # Entry point
```

## 🔑 CÁC SERVICE QUAN TRỌNG

### **1. authService.js**
**Đường dẫn:** `frontend/src/services/authService.js`

**Chức năng:** Xử lý toàn bộ authentication

```javascript
import axios from '../config/axios';

const authService = {
    // Đăng nhập
    login: async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            const { token, user } = response.data;
            
            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set default header cho axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return { token, user };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    },

    // Đăng ký
    register: async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Kiểm tra role
    hasRole: (role) => {
        const user = authService.getCurrentUser();
        return user?.role?.name === role;
    },

    // Refresh token (nếu có)
    refreshToken: async () => {
        try {
            const response = await axios.post('/api/auth/refresh');
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            return token;
        } catch (error) {
            authService.logout();
            throw error;
        }
    }
};

export default authService;
```

### **2. appointmentService.js**
**Đường dẫn:** `frontend/src/services/appointmentService.js`

**Chức năng:** Xử lý toàn bộ appointment operations

```javascript
import axios from '../config/axios';

const appointmentService = {
    // Lấy danh sách appointments
    getAppointments: async (params = {}) => {
        try {
            const response = await axios.get('/api/appointments', { params });
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải danh sách lịch hẹn');
        }
    },

    // Tạo appointment mới
    createAppointment: async (appointmentData) => {
        try {
            const response = await axios.post('/api/appointments', appointmentData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể tạo lịch hẹn';
            throw new Error(message);
        }
    },

    // Lấy chi tiết appointment
    getAppointmentById: async (id) => {
        try {
            const response = await axios.get(`/api/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải thông tin lịch hẹn');
        }
    },

    // Cập nhật appointment
    updateAppointment: async (id, updateData) => {
        try {
            const response = await axios.put(`/api/appointments/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error('Không thể cập nhật lịch hẹn');
        }
    },

    // Reschedule appointment
    rescheduleAppointment: async (id, newTime) => {
        try {
            const response = await axios.put(`/api/appointments/${id}/reschedule`, {
                appointmentTime: newTime
            });
            return response.data;
        } catch (error) {
            throw new Error('Không thể đổi lịch hẹn');
        }
    },

    // Hoàn thành appointment (cho consultant)
    completeAppointment: async (id) => {
        try {
            const response = await axios.post(`/api/appointments/${id}/complete`);
            return response.data;
        } catch (error) {
            throw new Error('Không thể hoàn thành lịch hẹn');
        }
    },

    // Hủy appointment
    cancelAppointment: async (id, reason) => {
        try {
            const response = await axios.delete(`/api/appointments/${id}`, {
                data: { reason }
            });
            return response.data;
        } catch (error) {
            throw new Error('Không thể hủy lịch hẹn');
        }
    },

    // Lấy available time slots
    getAvailableTimeSlots: async (consultantId, date) => {
        try {
            const response = await axios.get(`/api/consultants/${consultantId}/availability`, {
                params: { date }
            });
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải lịch trống');
        }
    },

    // Lấy danh sách consultants
    getConsultants: async () => {
        try {
            const response = await axios.get('/api/consultants');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải danh sách chuyên gia');
        }
    }
};

export default appointmentService;
```

### **3. courseService.js**
**Đường dẫn:** `frontend/src/services/courseService.js`

**Chức năng:** Xử lý toàn bộ course operations

```javascript
import axios from '../config/axios';

const courseService = {
    // Lấy danh sách khóa học
    getCourses: async (params = {}) => {
        try {
            const response = await axios.get('/api/courses', { params });
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải danh sách khóa học');
        }
    },

    // Tìm kiếm khóa học
    searchCourses: async (searchParams) => {
        try {
            const response = await axios.get('/api/courses/search', { 
                params: searchParams 
            });
            return response.data;
        } catch (error) {
            throw new Error('Không thể tìm kiếm khóa học');
        }
    },

    // Lấy chi tiết khóa học
    getCourseById: async (id) => {
        try {
            const response = await axios.get(`/api/courses/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải thông tin khóa học');
        }
    },

    // Tạo khóa học mới (staff only)
    createCourse: async (courseData) => {
        try {
            const response = await axios.post('/api/courses', courseData);
            return response.data;
        } catch (error) {
            throw new Error('Không thể tạo khóa học');
        }
    },

    // Cập nhật khóa học (staff only)
    updateCourse: async (id, updateData) => {
        try {
            const response = await axios.put(`/api/courses/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw new Error('Không thể cập nhật khóa học');
        }
    },

    // Xóa khóa học (admin only)
    deleteCourse: async (id) => {
        try {
            await axios.delete(`/api/courses/${id}`);
        } catch (error) {
            throw new Error('Không thể xóa khóa học');
        }
    },

    // Đăng ký khóa học
    registerForCourse: async (courseId) => {
        try {
            const response = await axios.post(`/api/course-registrations/register/${courseId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Không thể đăng ký khóa học';
            throw new Error(message);
        }
    },

    // Lấy khóa học đã đăng ký
    getMyRegisteredCourses: async () => {
        try {
            const response = await axios.get('/api/course-registrations/my-courses');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải khóa học đã đăng ký');
        }
    },

    // Cập nhật tiến độ học tập
    updateProgress: async (registrationId, progress) => {
        try {
            const response = await axios.put(`/api/course-registrations/${registrationId}/progress`, {
                progress
            });
            return response.data;
        } catch (error) {
            throw new Error('Không thể cập nhật tiến độ');
        }
    },

    // Lấy khóa học nổi bật
    getFeaturedCourses: async () => {
        try {
            const response = await axios.get('/api/courses/featured');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải khóa học nổi bật');
        }
    },

    // Lấy categories
    getCategories: async () => {
        try {
            const response = await axios.get('/api/categories');
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải danh mục');
        }
    }
};

export default courseService;
```

## 🎨 MAJOR PAGES BREAKDOWN

### **1. LoginPage.jsx**
**Đường dẫn:** `frontend/src/pages/LoginPage.jsx`

**Chức năng:** Trang đăng nhập với form validation

```jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error khi user gõ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { user } = await authService.login(formData);
            
            // Redirect dựa trên role
            switch (user.role.name) {
                case 'ADMIN':
                case 'MANAGER':
                    navigate('/admin-dashboard');
                    break;
                case 'STAFF':
                    navigate('/staff-dashboard');
                    break;
                case 'CONSULTANT':
                    navigate('/consultant-dashboard');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Đăng nhập</h2>
                    <p>Hệ thống hỗ trợ phòng chống tệ nạn xã hội</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                    <p><Link to="/forgot-password">Quên mật khẩu?</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
```

### **2. CoursesPage.jsx**
**Đường dẫn:** `frontend/src/pages/CoursesPage.jsx`

**Chức năng:** Hiển thị danh sách khóa học với tìm kiếm, filter

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';
import LoadingSpinner from '../components/LoadingSpinner';
import './CoursesPage.css';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: '',
        maxPrice: '',
        page: 0,
        size: 12
    });

    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourses(filters);
            setCourses(response.content || response);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories for filter
    const fetchCategories = async () => {
        try {
            const categoriesData = await courseService.getCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Không thể tải categories:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 0 // Reset page khi filter thay đổi
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    const formatPrice = (price) => {
        if (price === 0) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading && courses.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="courses-page">
            <div className="courses-header">
                <h1>Khóa học</h1>
                <p>Khám phá các khóa học phòng chống tệ nạn xã hội</p>
            </div>

            {/* Search & Filter Section */}
            <div className="courses-filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        Tìm kiếm
                    </button>
                </form>

                <div className="filter-row">
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.level}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Tất cả cấp độ</option>
                        <option value="BEGINNER">Cơ bản</option>
                        <option value="INTERMEDIATE">Trung cấp</option>
                        <option value="ADVANCED">Nâng cao</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Giá tối đa"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {/* Courses Grid */}
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <div className="course-image">
                            <img 
                                src={course.imageUrl || '/default-course.jpg'} 
                                alt={course.title}
                                onError={(e) => {
                                    e.target.src = '/default-course.jpg';
                                }}
                            />
                            {course.isFeatured && (
                                <div className="featured-badge">Nổi bật</div>
                            )}
                        </div>

                        <div className="course-content">
                            <h3 className="course-title">
                                <Link to={`/courses/${course.id}`}>
                                    {course.title}
                                </Link>
                            </h3>
                            
                            <p className="course-description">
                                {course.description?.substring(0, 100)}...
                            </p>

                            <div className="course-meta">
                                <span className="course-level">{course.level}</span>
                                <span className="course-duration">
                                    {course.durationWeeks} tuần
                                </span>
                            </div>

                            <div className="course-stats">
                                <span className="course-participants">
                                    {course.currentParticipants}/{course.maxParticipants} học viên
                                </span>
                                {course.averageRating && (
                                    <span className="course-rating">
                                        ⭐ {course.averageRating.toFixed(1)}
                                    </span>
                                )}
                            </div>

                            <div className="course-footer">
                                <span className="course-price">
                                    {formatPrice(course.price)}
                                </span>
                                <Link 
                                    to={`/courses/${course.id}`}
                                    className="view-course-btn"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && !loading && (
                <div className="no-courses">
                    <p>Không tìm thấy khóa học nào.</p>
                </div>
            )}

            {loading && (
                <div className="loading-more">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
```

### **3. AppointmentPage.jsx**
**Đường dẫn:** `frontend/src/pages/AppointmentPage.jsx`

**Chức năng:** Trang đặt lịch tư vấn

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import authService from '../services/authService';
import AppointmentCalendar from '../components/AppointmentCalendar';
import AvailableConsultants from '../components/AvailableConsultants';
import LoadingSpinner from '../components/LoadingSpinner';

const AppointmentPage = () => {
    const [step, setStep] = useState(1); // 1: Chọn consultant, 2: Chọn thời gian, 3: Xác nhận
    const [consultants, setConsultants] = useState([]);
    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [appointmentData, setAppointmentData] = useState({
        appointmentType: 'ONLINE',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch consultants on mount
    useEffect(() => {
        fetchConsultants();
    }, []);

    const fetchConsultants = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getConsultants();
            setConsultants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async (consultantId, date) => {
        try {
            setLoading(true);
            const slots = await appointmentService.getAvailableTimeSlots(consultantId, date);
            setAvailableSlots(slots);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConsultantSelect = (consultant) => {
        setSelectedConsultant(consultant);
        setStep(2);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (selectedConsultant) {
            fetchAvailableSlots(selectedConsultant.id, date);
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setStep(3);
    };

    const handleCreateAppointment = async () => {
        if (!selectedConsultant || !selectedDate || !selectedTime) {
            setError('Vui lòng chọn đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const appointmentDateTime = new Date(selectedDate);
            const [hours, minutes] = selectedTime.split(':');
            appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

            const newAppointment = {
                consultantId: selectedConsultant.id,
                appointmentTime: appointmentDateTime.toISOString(),
                appointmentType: appointmentData.appointmentType,
                notes: appointmentData.notes
            };

            await appointmentService.createAppointment(newAppointment);
            
            // Redirect to success page or appointment list
            navigate('/appointments', { 
                state: { 
                    message: 'Đặt lịch thành công!' 
                }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = () => {
        if (!selectedDate || !selectedTime) return '';
        const date = new Date(selectedDate).toLocaleDateString('vi-VN');
        return `${date} - ${selectedTime}`;
    };

    if (loading && consultants.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="appointment-page">
            <div className="appointment-header">
                <h1>Đặt lịch tư vấn</h1>
                <div className="step-indicator">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Chọn chuyên gia</div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Chọn thời gian</div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Xác nhận</div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {/* Step 1: Chọn Consultant */}
            {step === 1 && (
                <div className="step-content">
                    <h2>Chọn chuyên gia tư vấn</h2>
                    <AvailableConsultants 
                        consultants={consultants}
                        onConsultantSelect={handleConsultantSelect}
                    />
                </div>
            )}

            {/* Step 2: Chọn thời gian */}
            {step === 2 && (
                <div className="step-content">
                    <h2>Chọn thời gian</h2>
                    <div className="selected-consultant">
                        <p>Chuyên gia: <strong>{selectedConsultant?.fullName}</strong></p>
                        <button 
                            onClick={() => setStep(1)}
                            className="change-consultant-btn"
                        >
                            Thay đổi
                        </button>
                    </div>

                    <AppointmentCalendar
                        consultantId={selectedConsultant?.id}
                        onDateSelect={handleDateSelect}
                        onTimeSelect={handleTimeSelect}
                        availableSlots={availableSlots}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                    />

                    {selectedDate && selectedTime && (
                        <button 
                            onClick={() => setStep(3)}
                            className="continue-btn"
                        >
                            Tiếp tục
                        </button>
                    )}
                </div>
            )}

            {/* Step 3: Xác nhận */}
            {step === 3 && (
                <div className="step-content">
                    <h2>Xác nhận thông tin</h2>
                    
                    <div className="appointment-summary">
                        <div className="summary-item">
                            <label>Chuyên gia:</label>
                            <span>{selectedConsultant?.fullName}</span>
                        </div>
                        <div className="summary-item">
                            <label>Thời gian:</label>
                            <span>{formatDateTime()}</span>
                        </div>
                        
                        <div className="form-group">
                            <label>Hình thức tư vấn:</label>
                            <select
                                value={appointmentData.appointmentType}
                                onChange={(e) => setAppointmentData(prev => ({
                                    ...prev,
                                    appointmentType: e.target.value
                                }))}
                                className="appointment-type-select"
                            >
                                <option value="ONLINE">Trực tuyến</option>
                                <option value="OFFLINE">Trực tiếp</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Ghi chú:</label>
                            <textarea
                                value={appointmentData.notes}
                                onChange={(e) => setAppointmentData(prev => ({
                                    ...prev,
                                    notes: e.target.value
                                }))}
                                placeholder="Mô tả vấn đề cần tư vấn..."
                                rows="4"
                                className="notes-textarea"
                            />
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            onClick={() => setStep(2)}
                            className="back-btn"
                            disabled={loading}
                        >
                            Quay lại
                        </button>
                        <button 
                            onClick={handleCreateAppointment}
                            className="confirm-btn"
                            disabled={loading}
                        >
                            {loading ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentPage;
```

## 🛡️ PROTECTED ROUTES & ROLE-BASED ACCESS

### **ProtectedRoute.jsx**
**Đường dẫn:** `frontend/src/components/ProtectedRoute.jsx`

```jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Check authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if specified
    if (requiredRole && !authService.hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check allowed roles if specified
    if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => authService.hasRole(role));
        if (!hasAllowedRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
```

### **RoleBasedComponent.jsx**
**Đường dẫn:** `frontend/src/components/RoleBasedComponent.jsx`

```jsx
import React from 'react';
import authService from '../services/authService';

const RoleBasedComponent = ({ 
    allowedRoles = [], 
    requiredRole = null, 
    children, 
    fallback = null 
}) => {
    const currentUser = authService.getCurrentUser();
    
    if (!currentUser) {
        return fallback;
    }

    // Check specific role
    if (requiredRole && !authService.hasRole(requiredRole)) {
        return fallback;
    }

    // Check allowed roles
    if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => authService.hasRole(role));
        if (!hasAllowedRole) {
            return fallback;
        }
    }

    return children;
};

export default RoleBasedComponent;
```

## ⚙️ AXIOS CONFIGURATION

### **axios.js**
**Đường dẫn:** `frontend/src/config/axios.js`

```javascript
import axios from 'axios';
import authService from '../services/authService';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý token expired
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                await authService.refreshToken();
                
                // Retry original request với token mới
                const token = localStorage.getItem('token');
                originalRequest.headers.Authorization = `Bearer ${token}`;
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (error.response?.status === 403) {
            // Forbidden - redirect to unauthorized page
            window.location.href = '/unauthorized';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
```

## 🎨 STYLING GUIDELINES

### **globals.css**
**Đường dẫn:** `frontend/src/styles/globals.css`

```css
/* Global Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* CSS Variables cho consistent theming */
:root {
    /* Colors */
    --primary-color: #007bff;
    --primary-dark: #0056b3;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    
    /* Background colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-dark: #343a40;
    
    /* Text colors */
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --text-light: #ffffff;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 3rem;
    
    /* Border radius */
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.375rem;
    --border-radius-lg: 0.5rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
}

/* Base styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background-color: var(--bg-secondary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Common component styles */
.btn {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
    text-decoration: none;
    transition: all var(--transition-fast);
}

.btn-primary {
    color: var(--text-light);
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-primary:hover {
    background-color: var(--primary-dark);
    border-color: var(--primary-dark);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Form styles */
.form-group {
    margin-bottom: var(--spacing-md);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--text-primary);
}

.form-control {
    display: block;
    width: 100%;
    padding: var(--spacing-sm);
    font-size: 14px;
    line-height: 1.42857143;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    border: 1px solid #ddd;
    border-radius: var(--border-radius-md);
    transition: border-color var(--transition-fast);
}

.form-control:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Card styles */
.card {
    background-color: var(--bg-primary);
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: var(--spacing-md);
}

.card-header {
    padding: var(--spacing-md);
    background-color: var(--bg-secondary);
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
}

.card-body {
    padding: var(--spacing-md);
}

/* Grid system */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 calc(-1 * var(--spacing-sm));
}

.col {
    flex: 1;
    padding: 0 var(--spacing-sm);
}

.col-1 { flex: 0 0 8.333333%; max-width: 8.333333%; }
.col-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
.col-3 { flex: 0 0 25%; max-width: 25%; }
.col-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
.col-6 { flex: 0 0 50%; max-width: 50%; }
.col-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
.col-12 { flex: 0 0 100%; max-width: 100%; }

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
.mt-3 { margin-top: var(--spacing-md); }
.mt-4 { margin-top: var(--spacing-lg); }

.mb-1 { margin-bottom: var(--spacing-xs); }
.mb-2 { margin-bottom: var(--spacing-sm); }
.mb-3 { margin-bottom: var(--spacing-md); }
.mb-4 { margin-bottom: var(--spacing-lg); }

.p-1 { padding: var(--spacing-xs); }
.p-2 { padding: var(--spacing-sm); }
.p-3 { padding: var(--spacing-md); }
.p-4 { padding: var(--spacing-lg); }

/* Loading spinner */
.loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 123, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Alert messages */
.alert {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
}

.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}

.alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeaa7;
}

.alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 0 var(--spacing-sm);
    }
    
    .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
    }
    
    .btn {
        width: 100%;
        margin-bottom: var(--spacing-sm);
    }
}
```

## 🧪 TESTING GUIDELINES

### **Component Testing với React Testing Library:**

```javascript
// Example test file: LoginPage.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import authService from '../services/authService';

// Mock services
jest.mock('../services/authService');

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form correctly', () => {
        renderWithRouter(<LoginPage />);
        
        expect(screen.getByLabelText(/tên đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
    });

    test('shows error message on login failure', async () => {
        authService.login.mockRejectedValue(new Error('Invalid credentials'));
        
        renderWithRouter(<LoginPage />);
        
        fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), {
            target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByLabelText(/mật khẩu/i), {
            target: { value: 'wrongpassword' }
        });
        
        fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
        
        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    test('redirects to dashboard on successful login', async () => {
        const mockUser = { id: 1, username: 'testuser', role: { name: 'USER' } };
        authService.login.mockResolvedValue({ user: mockUser, token: 'fake-token' });
        
        const mockNavigate = jest.fn();
        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }));
        
        renderWithRouter(<LoginPage />);
        
        fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), {
            target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByLabelText(/mật khẩu/i), {
            target: { value: 'password' }
        });
        
        fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
        
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password'
            });
        });
    });
});
```

## 📱 RESPONSIVE DESIGN PRINCIPLES

### **Mobile-First Approach:**

```css
/* Mobile first (default) */
.courses-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
    .courses-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-lg);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .courses-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-xl);
    }
}

/* Large Desktop */
@media (min-width: 1200px) {
    .courses-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

## 🎯 NEXT STEPS & IMPROVEMENTS

1. **PWA Support** - Service worker cho offline functionality
2. **Dark Mode** - Theme switching capability  
3. **Internationalization** - Multi-language support
4. **Real-time Updates** - WebSocket integration
5. **Performance Optimization** - Code splitting, lazy loading
6. **Accessibility** - ARIA labels, keyboard navigation
7. **Advanced Animations** - Framer Motion integration

---

**🔥 LỜI KHUYÊN QUAN TRỌNG:**
- Luôn handle loading và error states
- Implement proper form validation
- Optimize bundle size với code splitting
- Test trên nhiều devices và browsers
- Maintain consistent UI/UX patterns
- Document component APIs và props clearly 