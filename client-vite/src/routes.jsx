import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard.jsx';
import AppointmentCalendar from './components/appointments/AppointmentCalendar.jsx';
import PatientsList from './components/patients/PatientsList.jsx';
import PatientDetails from './components/patients/PatientDetails.jsx';
import PatientRegistration from './components/patients/PatientRegistration.jsx';
import TreatmentsList from './components/treatments/TreatmentsList.jsx';
import UsersList from './components/users/UsersList.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import NotFound from './components/common/NotFound.jsx';
import { useApp } from './context/AppContext.jsx';

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
