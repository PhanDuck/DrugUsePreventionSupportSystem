import React from 'react';
import authService from '../services/authService';

const RoleBasedComponent = ({ allowedRoles, children, fallback = null }) => {
  const userRole = authService.getUserRole();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback;
  }
  
  return children;
};

export default RoleBasedComponent; 