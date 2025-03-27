import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/App';
import Spinner from './Spinner';

// Route that requires authentication
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useApp();
  const location = useLocation();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

// Route that requires admin role
export const AdminRoute = () => {
  const { user, loading } = useApp();
  const location = useLocation();
  
  // Show loading spinner while checking authorization
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  
  // Redirect to dashboard if not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  // Render child routes if authorized
  return <Outlet />;
};

export default { PrivateRoute, AdminRoute };