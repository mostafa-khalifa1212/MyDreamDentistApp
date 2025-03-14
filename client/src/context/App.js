// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Layout Components
import Layout from './layouts/MainLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Private Pages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Financials from './pages/Financials';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Public Routes */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          
          {/* Private Routes */}
          <PrivateRoute exact path="/" component={() => <Redirect to="/dashboard" />} />
          <PrivateRoute exact path="/dashboard">
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/appointments">
            <Layout>
              <Appointments />
            </Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/financials">
            <Layout>
              <Financials />
            </Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/profile">
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
          
          {/* Admin Routes */}
          <AdminRoute exact path="/users">
            <Layout>
              <UserManagement />
            </Layout>
          </AdminRoute>
          
          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;

// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setAuthToken, removeAuthToken } from '../utils/authToken';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        try {
          const res = await api.get('/api/auth/profile');
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          removeAuthToken();
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  // Login user
  const login = async (username, password) => {
    try {
      setError(null);
      const res = await api.post('/api/auth/login', { username, password });
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      throw error;
    }
  };
  
  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await api.post('/api/auth/register', userData);
      return res.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// client/src/components/routing/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return <Spinner />;
        }
        
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        
        return rest.children || <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;

// client/src/components/routing/AdminRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  
  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return <Spinner />;
        }
        
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        
        if (user && user.role !== 'admin') {
          return <Redirect to="/dashboard" />;
        }
        
        return rest.children || <Component {...props} />;
      }}
    />
  );
};

export default AdminRoute;
