import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import AppointmentCalendar from './components/appointments/AppointmentCalendar';
import PatientsList from './components/patients/PatientsList';
import PatientDetails from './components/patients/PatientDetails';
import PatientRegistration from './components/patients/PatientRegistration';
import TreatmentsList from './components/treatments/TreatmentsList';
import UsersList from './components/users/UsersList';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import NotFound from './components/common/NotFound';
import { useApp } from './context/AppContext';

const AppRoutes = () => {
  const { user } = useApp();

  const routes = [
    {
      path: '/',
      element: user ? <Dashboard /> : <Navigate to="/login" replace />
    },
    {
      path: '/login',
      element: !user ? <Login /> : <Navigate to="/" replace />
    },
    {
      path: '/register',
      element: !user ? <Register /> : <Navigate to="/" replace />
    },
    {
      path: '/patients',
      element: user ? <PatientsList /> : <Navigate to="/login" replace />
    },
    {
      path: '/patients/:id',
      element: user ? <PatientDetails /> : <Navigate to="/login" replace />
    },
    {
      path: '/treatments',
      element: user ? <TreatmentsList /> : <Navigate to="/login" replace />
    },
    {
      path: '/users',
      element: user ? <UsersList /> : <Navigate to="/login" replace />
    },
    {
      path: '/appointments',
      element: user ? <AppointmentCalendar /> : <Navigate to="/login" replace />
    },
    {
      path: '/patients/new',
      element: user ? <PatientRegistration /> : <Navigate to="/login" replace />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ];

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
