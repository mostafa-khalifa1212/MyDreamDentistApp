import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Loading from '../common/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute; 