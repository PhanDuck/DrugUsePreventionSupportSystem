import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import HomePage from './HomePage';
import CoursesPage from './CoursesPage';
import AppointmentPage from './AppointmentPage';
import SurveyPage from './SurveyPage';
import LayoutComponent from './Layout';
import BlogPage from './BlogPage';
import BlogDetailPage from './BlogDetailPage';
import '../App.css';

function App() {
  return (
    <Routes>
      {/* Auth routes - without layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes - with layout */}
      <Route element={<LayoutComponent />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/surveys" element={<SurveyPage />} />
          <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      </Route>

   

      {/* Redirect to home if route not found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
