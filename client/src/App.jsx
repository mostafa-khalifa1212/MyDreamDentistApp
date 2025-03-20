import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
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
import Loading from './components/common/Loading';
import './App.css';

// Import Login component (assumed to exist as per instructions)
// import Login from './components/auth/Login';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
};

// Action types
const ActionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  AUTH_ERROR: 'AUTH_ERROR',
  USER_LOADED: 'USER_LOADED',
  LOADING: 'LOADING',
  TOGGLE_THEME: 'TOGGLE_THEME'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case ActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
      };
    case ActionTypes.AUTH_ERROR:
    case ActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case ActionTypes.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode);
      return {
        ...state,
        darkMode: newDarkMode,
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: ActionTypes.AUTH_ERROR });
        return;
      }

      try {
        // Set auth token in headers
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        dispatch({
          type: ActionTypes.USER_LOADED,
          payload: data.user
        });
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: ActionTypes.AUTH_ERROR });
      }
    };

    loadUser();
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (state.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [state.darkMode]);

  // Authentication actions
  const login = async (username, password) => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.AUTH_ERROR });
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const data = await response.json();
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.AUTH_ERROR });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const toggleTheme = () => {
    dispatch({ type: ActionTypes.TOGGLE_THEME });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Route guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const StaffRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useApp();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin' && user?.role !== 'dentist' && user?.role !== 'receptionist') {
    return <Navigate to="/" />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useApp();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

// Main App component
const App = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/appointments" 
              element={
                <PrivateRoute>
                  <AppointmentCalendar />
                </PrivateRoute>
              } 
            />

            {/* Staff Only Routes */}
            <Route 
              path="/patients" 
              element={
                <StaffRoute>
                  <PatientsList />
                </StaffRoute>
              } 
            />
            <Route 
              path="/patients/new" 
              element={
                <StaffRoute>
                  <PatientRegistration />
                </StaffRoute>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <StaffRoute>
                  <PatientDetails />
                </StaffRoute>
              } 
            />
            <Route 
              path="/treatments" 
              element={
                <StaffRoute>
                  <TreatmentsList />
                </StaffRoute>
              } 
            />

            {/* Admin Only Routes */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UsersList />
                </AdminRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;