import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles, user }) => {
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized or dashboard if role is not allowed
    // For this app, we'll just redirect to their default path
    const defaultPaths = {
      civilian: '/sos',
      responder: '/incidents',
      coordinator: '/dashboard'
    };
    return <Navigate to={defaultPaths[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
