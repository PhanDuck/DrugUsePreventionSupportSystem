import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import HomePage from './HomePage';
import CoursesPage from './CoursesPage';
import CourseManagementPage from './CourseManagementPage';
import AppointmentPage from './AppointmentPage';
import SurveyPage from './SurveyPage';
import BlogPage from './BlogPage';
import UnauthorizedPage from './UnauthorizedPage';
import LayoutComponent from './Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Dashboard imports
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import ConsultantDashboard from './dashboards/ConsultantDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import UserDashboard from './dashboards/UserDashboard';

import authService from '../services/authService';
import '../App.css';
import CoursePage from './CoursePage';

function App() {
  // Initialize axios interceptor
  React.useEffect(() => {
    authService.setupAxiosInterceptor();
  }, []);

  return (
    <Routes>
      {/* Public routes - without layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected routes - with layout */}
      <Route element={<LayoutComponent />}>
        {/* Home page - accessible to all users (public) */}
        <Route path="/" element={<HomePage />} />

        {/* Role-based Dashboard Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/consultant/dashboard" element={
          <ProtectedRoute allowedRoles={['CONSULTANT']}>
            <ConsultantDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Courses - public viewing, login required for registration */}
        <Route path="/courses" element={<CoursesPage />} />
        
        {/* Course detail - public */}
        <Route path="/courses/:courseId" element={<CoursePage />} />
        
        {/* Course Management - Staff only */}
        <Route path="/staff/courses" element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>
            <CourseManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentPage />
          </ProtectedRoute>
        } />
        
        {/* Surveys - accessible to all users (public) */}
        <Route path="/surveys" element={<SurveyPage />} />
        
        {/* Blog - accessible to all users (public) */}
        <Route path="/blogs" element={<BlogPage />} />

        {/* Dashboard redirect based on role */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } />
      </Route>

      {/* Redirect to appropriate dashboard or login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Component to redirect to appropriate dashboard based on user role
const DashboardRedirect = () => {
  const dashboardPath = authService.getDashboardPath();
  return <Navigate to={dashboardPath} replace />;
};

export default App;
