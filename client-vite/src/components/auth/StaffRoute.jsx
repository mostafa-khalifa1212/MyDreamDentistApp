import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Loading from '../common/Loading';

const StaffRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useApp();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!['admin', 'dentist', 'receptionist'].includes(user?.role)) return <Navigate to="/" />;

  return children;
};

export default StaffRoute; 