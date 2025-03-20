import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../App';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: appLoading } = useApp();
  
  // Get the redirect path from query params or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check for stored credentials and populate form if remember me was checked
  useEffect(() => {
    const storedUsername = localStorage.getItem('rememberedUsername');
    if (storedUsername) {
      setFormData(prevState => ({
        ...prevState,
        username: storedUsername,
        rememberMe: true
      }));
    }
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !appLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, appLoading, navigate, from]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (error) {
      setError('');
    }
  };
  
  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call login function from context
      const result = await login(formData.username, formData.password);
      
      // Handle "remember me" preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed. Please check your credentials.');
      }
      
      // Navigate after successful login handled by useEffect
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Special case: if we're already authenticated, show a message instead of the form
  if (isAuthenticated) {
    return (
      <div className="auth-container text-center">
        <div className="auth-card">
          <h3>You are already logged in!</h3>
          <p>Redirecting you to the dashboard...</p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-4">
          <i className="fas fa-tooth auth-icon"></i>
          <h2 className="auth-title">Dream Dentist</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="username"
              required
            />
            <label htmlFor="username">Username</label>
          </div>
          
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          
          <div className="d-flex justify-content-between mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="small">Forgot password?</Link>
          </div>
          
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p>
            Don't have an account? <Link to="/register" className="link-primary">Sign up</Link>
          </p>
        </div>
      </div>
      
      <div className="auth-features d-none d-lg-block">
        <h3>Dream Dentist Practice Management</h3>
        <div className="feature-cards">
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h4>Appointment Scheduling</h4>
            <p>Efficiently manage your dental appointments with our intuitive calendar system.</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-user-injured"></i>
            <h4>Patient Records</h4>
            <p>Keep track of patient information, medical history, and treatment plans.</p>
          </div>
          
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h4>Analytics Dashboard</h4>
            <p>Make data-driven decisions with comprehensive reports and analytics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
