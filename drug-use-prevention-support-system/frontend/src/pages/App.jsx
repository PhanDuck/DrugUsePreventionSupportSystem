import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Layout from './Layout';
import CoursesPage from './CoursesPage';
import CoursePage from './CoursePage';
import CourseManagementPage from './CourseManagementPage';
import StaffCourseManagementPage from './StaffCourseManagementPage';
import ConsultantsPage from './ConsultantsPage';
import ProfilePage from './ProfilePage';
import LogoutPage from './LogoutPage';
import AppointmentPage from './AppointmentPage';
import AppointmentListPage from './AppointmentListPage';
import AppointmentCalendarPage from './AppointmentCalendarPage';
import AppointmentDetailPage from './AppointmentDetailPage';
import AppointmentDashboard from './AppointmentDashboard';
import ApiTestPage from './ApiTestPage';
import SurveyPage from './SurveyPage';
import BlogPage from './BlogPage';
import NotificationsPage from './NotificationsPage';
import SearchPage from './SearchPage';
import SettingsPage from './SettingsPage';
import UnauthorizedPage from './UnauthorizedPage';
import ForgotPasswordPage from './ForgotPasswordPage';

// Import dashboard components
import AdminDashboard from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import ConsultantDashboard from './dashboards/ConsultantDashboard';
import StaffDashboard from './dashboards/StaffDashboard';
import UserDashboard from './dashboards/UserDashboard';

// Import components
import ProtectedRoute from '../components/ProtectedRoute';
import StaffCourseManager from '../components/staff/StaffCourseManager';

const LayoutComponent = Layout;

function App() {
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
        
        <Route path="/consultant/appointments" element={
          <ProtectedRoute allowedRoles={['CONSULTANT']}>
            <ConsultantDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/staff/dashboard" element={
          <ProtectedRoute allowedRoles={['STAFF']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/staff/courses" element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'MANAGER']}>
            <StaffCourseManager />
          </ProtectedRoute>
        } />
        
        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Courses - public viewing, login required for registration */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        
        {/* Course Management - staff only */}
        <Route path="/course-management" element={
          <ProtectedRoute allowedRoles={['STAFF', 'ADMIN', 'MANAGER']}>
            <StaffCourseManagementPage />
          </ProtectedRoute>
        } />
        
        {/* Consultants - public viewing */}
        <Route path="/consultants" element={<ConsultantsPage />} />
        
        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments-old" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments/list" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentListPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments/calendar" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentCalendarPage />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <AppointmentDetailPage />
          </ProtectedRoute>
        } />
        
        {/* Surveys - accessible to all users (public) */}
        <Route path="/surveys" element={<SurveyPage />} />
        
        {/* Blog - accessible to all users (public) */}
        <Route path="/blogs" element={<BlogPage />} />
        
        {/* Search - accessible to all users (public) */}
        <Route path="/search" element={<SearchPage />} />
        
        {/* Notifications - login required */}
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <NotificationsPage />
          </ProtectedRoute>
        } />
        
        {/* Profile - login required */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Settings - login required */}
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'USER', 'CONSULTANT', 'STAFF']}>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        {/* API Test - admin only */}
        <Route path="/api-test" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ApiTestPage />
          </ProtectedRoute>
        } />
        
        {/* Logout */}
        <Route path="/logout" element={<LogoutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
