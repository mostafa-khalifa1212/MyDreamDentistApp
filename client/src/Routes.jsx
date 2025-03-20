import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './App';
import Layout from './components/layout/Layout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Appointments
import AppointmentCalendar from './components/appointments/AppointmentCalendar';
import AppointmentList from './components/appointments/AppointmentList';

// Patients
import PatientList from './components/patients/PatientList';
import PatientDetails from './components/patients/PatientDetails';
import PatientRegistration from './components/patients/PatientRegistration';

// Profile and Settings
import UserProfile from './components/profile/UserProfile';
import UserSettings from './components/settings/UserSettings';

// Error Pages
import NotFound from './components/errors/NotFound';

// Protected Route Wrapper
const ProtectedRoute = ({ element, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If there are allowed roles specified and user doesn't have one
  if (allowedRoles.length > 0 && (!user.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  
  return element;
};

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - All authenticated users */}
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<UserSettings />} />} />
          <Route path="/appointments" element={<ProtectedRoute element={<AppointmentCalendar />} />} />
          
          {/* Staff Only Routes */}
          <Route 
            path="/patients" 
            element={
              <ProtectedRoute 
                element={<PatientList />} 
                allowedRoles={['admin', 'dentist', 'receptionist']} 
              />
            } 
          />
          <Route 
            path="/patients/:id" 
            element={
              <ProtectedRoute 
                element={<PatientDetails />} 
                allowedRoles={['admin', 'dentist', 'receptionist']} 
              />
            } 
          />
          <Route 
            path="/patients/register" 
            element={
              <ProtectedRoute 
                element={<PatientRegistration />} 
                allowedRoles={['admin', 'dentist', 'receptionist']} 
              />
            } 
          />
          <Route 
            path="/appointments/list" 
            element={
              <ProtectedRoute 
                element={<AppointmentList />} 
                allowedRoles={['admin', 'dentist', 'receptionist']} 
              />
            } 
          />
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;