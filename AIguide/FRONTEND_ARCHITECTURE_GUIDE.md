# 🎨 Frontend Architecture Guide - Drug Prevention Support System

## 📌 Tổng Quan Frontend

### Tech Stack
- **Framework**: React 19 + Vite
- **UI Library**: Ant Design (antd)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **State Management**: Local React State + Context (nếu cần)
- **Styling**: CSS Modules + Ant Design
- **Notifications**: React Toastify

### Cấu Trúc Project
```
src/
├── components/          # Reusable Components
│   ├── staff/          # Staff-specific components
│   ├── AppointmentCard.jsx
│   ├── ProtectedRoute.jsx
│   ├── ErrorBoundary.jsx
│   └── ...
├── pages/              # Page Components (Routes)
│   ├── dashboards/     # Role-based dashboards
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── App.jsx         # Main App Router
│   └── ...
├── services/           # API Services
│   ├── authService.js
│   ├── appointmentService.js
│   ├── courseService.js
│   └── ...
├── config/             # Configuration
│   └── axios.js        # Axios configuration
├── styles/             # Global styles
└── assets/             # Static assets
```

---

## 🔐 Authentication Flow

### 1. Login Process (`authService.js`)
```javascript
const login = async (credentials) => {
  try {
    // 1. Gửi request đến backend
    const response = await axios.post('/api/auth/login', {
      userName: credentials.username,
      password: credentials.password
    });

    // 2. Lưu token và user info vào localStorage
    const { token, user, role } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', role);

    // 3. Setup axios header cho requests sau
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return { success: true, user, role };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Login failed' };
  }
};
```

### 2. Automatic Token Setup (`main.jsx`)
```javascript
// Setup axios interceptor khi app khởi động
authService.setupAxiosInterceptor();

// Trong authService.js
const setupAxiosInterceptor = () => {
  // Request interceptor - tự động thêm token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired hoặc invalid
        authService.logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
```

---

## 🛣️ Routing Architecture

### Main Router (`App.jsx`)
```javascript
function App() {
  return (
    <Routes>
      {/* Public routes - không cần layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes - có layout */}
      <Route element={<LayoutComponent />}>
        {/* Role-based Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        
        {/* Appointment routes */}
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['USER', 'CONSULTANT', 'ADMIN']}>
            <AppointmentPage />
          </ProtectedRoute>
        } />
        
        {/* Public content với optional authentication */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/consultants" element={<ConsultantsPage />} />
      </Route>
    </Routes>
  );
}
```

### Protected Route Component
```javascript
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  // Nếu chưa login → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không có quyền → redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

---

## 🏗️ Component Architecture

### 1. Layout Component (`Layout.jsx`)
```javascript
const LayoutComponent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check auth status
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      setIsAuthenticated(isAuth);
      setCurrentUser(user);
    };
    
    checkAuth();
    
    // Listen for auth changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="layout">
      <Header user={currentUser} isAuthenticated={isAuthenticated} />
      <main>
        <Outlet /> {/* React Router content */}
      </main>
      <Footer />
    </div>
  );
};
```

### 2. Role-based Component Rendering
```javascript
const RoleBasedComponent = ({ allowedRoles, children, fallback = null }) => {
  const userRole = authService.getUserRole();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback;
  }
  
  return children;
};

// Usage example
<RoleBasedComponent allowedRoles={['ADMIN', 'MANAGER']}>
  <AdminPanel />
</RoleBasedComponent>
```

---

## 📡 API Services Architecture

### Base API Configuration (`config/axios.js`)
```javascript
import axios from 'axios';

// Create axios instance với base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### Service Layer Pattern

#### 1. Auth Service (`services/authService.js`)
```javascript
const authService = {
  // Authentication
  login: async (credentials) => { /* implementation */ },
  logout: () => { /* clear localStorage, redirect */ },
  signup: async (userData) => { /* implementation */ },
  
  // Utility functions
  isAuthenticated: () => !!localStorage.getItem('token'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  getUserRole: () => localStorage.getItem('role'),
  
  // Dashboard routing
  getDashboardPath: () => {
    const role = authService.getUserRole();
    switch(role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'USER': return '/user/dashboard';
      case 'CONSULTANT': return '/consultant/dashboard';
      default: return '/';
    }
  }
};
```

#### 2. Appointment Service (`services/appointmentService.js`)
```javascript
const appointmentService = {
  // Get available consultants
  getConsultants: async () => {
    const response = await api.get('/consultants');
    return response.data;
  },

  // Get available time slots
  getAvailableSlots: async (consultantId, date) => {
    const response = await api.get(
      `/appointments/consultant/${consultantId}/available-slots`,
      { params: { date } }
    );
    return response.data;
  },

  // Create appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Get user's appointments
  getUserAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  }
};
```

---

## 🎯 Page Components Structure

### 1. Login Page (`LoginPage.jsx`)
```javascript
const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const result = await authService.login(values);
      
      if (result.success) {
        toast.success('Login successful!');
        // Redirect to appropriate dashboard
        const dashboardPath = authService.getDashboardPath();
        navigate(dashboardPath);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form form={form} onFinish={handleLogin}>
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input placeholder="Username" />
        </Form.Item>
        
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form>
    </div>
  );
};
```

### 2. Appointment Page (`AppointmentPage.jsx`)
```javascript
const AppointmentPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    // Load consultants khi component mount
    loadConsultants();
  }, []);

  const loadConsultants = async () => {
    try {
      const data = await appointmentService.getConsultants();
      setConsultants(data);
    } catch (error) {
      toast.error('Failed to load consultants');
    }
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (selectedConsultant && date) {
      // Load available slots
      const slots = await appointmentService.getAvailableSlots(
        selectedConsultant.id, 
        date.format('YYYY-MM-DD')
      );
      setAvailableSlots(slots);
    }
  };

  const handleBookAppointment = async (timeSlot) => {
    try {
      await appointmentService.createAppointment({
        consultantId: selectedConsultant.id,
        appointmentDate: selectedDate.format('YYYY-MM-DD'),
        appointmentTime: timeSlot,
        notes: form.getFieldValue('notes')
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/appointments/list');
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  return (
    <div className="appointment-page">
      {/* Consultant selection */}
      <ConsultantSelector 
        consultants={consultants}
        onSelect={setSelectedConsultant}
      />
      
      {/* Date picker */}
      <DatePicker onChange={handleDateChange} />
      
      {/* Available time slots */}
      <TimeSlots 
        slots={availableSlots}
        onSelect={handleBookAppointment}
      />
    </div>
  );
};
```

---

## 🏗️ Reusable Components

### 1. Loading Spinner (`components/LoadingSpinner.jsx`)
```javascript
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-container">
    <Spin size="large" />
    <p>{message}</p>
  </div>
);
```

### 2. Error Boundary (`components/ErrorBoundary.jsx`)
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="An error occurred"
          subTitle="Sorry, something went wrong."
          extra={
            <Button onClick={() => window.location.reload()}>
              Reload page
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}
```

### 3. Appointment Card (`components/AppointmentCard.jsx`)
```javascript
const AppointmentCard = ({ appointment, onCancel, onReschedule }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'orange';
      case 'CONFIRMED': return 'green';
      case 'COMPLETED': return 'blue';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  return (
    <Card className="appointment-card">
      <div className="appointment-header">
        <Title level={4}>{appointment.consultantName}</Title>
        <Tag color={getStatusColor(appointment.status)}>
          {appointment.status}
        </Tag>
      </div>
      
      <div className="appointment-details">
        <p><CalendarOutlined /> {appointment.appointmentDate}</p>
        <p><ClockCircleOutlined /> {appointment.appointmentTime}</p>
        {appointment.notes && <p><FileTextOutlined /> {appointment.notes}</p>}
      </div>
      
      <div className="appointment-actions">
        {appointment.status === 'PENDING' && (
          <>
            <Button onClick={() => onReschedule(appointment)}>
              Reschedule
            </Button>
            <Button danger onClick={() => onCancel(appointment)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
```

---

## 🎨 Styling Architecture

### 1. Global Styles (`styles/globals.css`)
```css
/* Reset và base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Layout classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Component-specific styles */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.appointment-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### 2. Component CSS Modules
```css
/* LoginPage.module.css */
.loginForm {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
}

.loginTitle {
  text-align: center;
  margin-bottom: 32px;
  color: #1890ff;
}
```

---

## 🚀 Build & Development

### 1. Development Setup
```bash
# Cài đặt dependencies
cd drug-use-prevention-support-system/frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 2. Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

## 🔧 Common Patterns & Best Practices

### 1. API Error Handling
```javascript
const handleApiCall = async (apiFunction, errorMessage = 'Operation failed') => {
  try {
    setLoading(true);
    const result = await apiFunction();
    return result;
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || errorMessage);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Usage
const loadData = () => handleApiCall(
  () => appointmentService.getUserAppointments(),
  'Failed to load appointments'
);
```

### 2. Form Validation with Ant Design
```javascript
const validateForm = {
  username: [
    { required: true, message: 'Please input username!' },
    { min: 3, message: 'Username must be at least 3 characters!' }
  ],
  email: [
    { required: true, message: 'Please input email!' },
    { type: 'email', message: 'Please enter valid email!' }
  ],
  phone: [
    { pattern: /^[0-9]{10}$/, message: 'Please enter valid phone number!' }
  ]
};
```

### 3. State Management Pattern
```javascript
// Custom hook for appointments
const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getUserAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return { appointments, loading, error, loadAppointments };
};
```

---

## 🐛 Debugging & Troubleshooting

### Common Issues

#### 1. CORS Issues
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: 
- Check Vite proxy configuration
- Verify backend CORS settings
- Use correct API base URL
```

#### 2. Authentication Issues
```
Error: 401 Unauthorized
Solution:
- Check if token exists in localStorage
- Verify token format in request headers
- Check token expiration
```

#### 3. Route Protection Issues
```
Error: User can access unauthorized pages
Solution:
- Verify ProtectedRoute implementation
- Check role validation logic
- Ensure proper navigation after auth changes
```

### Debug Tools
```javascript
// Add to components for debugging
console.log('Current user:', authService.getCurrentUser());
console.log('User role:', authService.getUserRole());
console.log('Is authenticated:', authService.isAuthenticated());
```

---

## 🎯 Kết Luận

Frontend được xây dựng với:
1. **React 19**: Modern React với hooks và functional components
2. **Vite**: Fast build tool và development server
3. **Ant Design**: Professional UI components
4. **React Router**: Declarative routing with protection
5. **Axios**: HTTP client với interceptors
6. **Service Layer**: Clean API abstraction
7. **Role-based Access**: Security-first approach

Architecture tập trung vào:
- **Reusability**: Components có thể tái sử dụng
- **Maintainability**: Code dễ maintain và extend
- **Security**: Proper authentication và authorization
- **User Experience**: Loading states, error handling, notifications 