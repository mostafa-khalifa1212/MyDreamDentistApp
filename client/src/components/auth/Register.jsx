import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../App';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // Default role
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: 'Very Weak',
    color: 'danger'
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Check password strength if password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };
  
  // Evaluate password strength
  const checkPasswordStrength = (password) => {
    // Empty password
    if (!password) {
      setPasswordStrength({
        score: 0,
        message: 'Very Weak',
        color: 'danger'
      });
      return;
    }
    
    let score = 0;
    
    // Length check
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Set message and color based on score
    let message, color;
    
    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak';
        color = 'danger';
        break;
      case 2:
        message = 'Weak';
        color = 'warning';
        break;
      case 3:
        message = 'Medium';
        color = 'warning';
        break;
      case 4:
        message = 'Strong';
        color = 'success';
        break;
      case 5:
        message = 'Very Strong';
        color = 'success';
        break;
      default:
        message = 'Very Weak';
        color = 'danger';
    }
    
    setPasswordStrength({ score, message, color });
  };
  
  // Validate form before submission
  const validateForm = () => {
    // Reset error
    setError(null);
    
    // Check if all required fields are filled
    if (!formData.name || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate username (only alphanumeric and underscore, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username must be 3-20 characters and can only contain letters, numbers, and underscores');
      return false;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check password strength
    if (passwordStrength.score < 3) {
      setError('Please use a stronger password');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't proceed if already loading
    if (loading) return;
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Call registration API
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
      
      const data = await response.json();
      
      // Handle error response
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Registration successful
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient'
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="alert alert-info">
            You are already logged in. <Link to="/">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="fas fa-tooth"></i>
        </div>
        
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join Dream Dentist</p>
        
        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle me-2"></i>
            Registration successful! Redirecting to login...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={loading || success}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-at"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                disabled={loading || success}
                required
              />
            </div>
            <small className="form-text text-muted">
              3-20 characters, letters, numbers, and underscores only
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={loading || success}
                required
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                disabled={loading || success}
                required
              />
            </div>
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="password-strength">
                  <div className="progress">
                    <div 
                      className={`progress-bar bg-${passwordStrength.color}`}
                      role="progressbar"
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      aria-valuenow={passwordStrength.score}
                      aria-valuemin="0"
                      aria-valuemax="5"
                    ></div>
                  </div>
                  <small className={`text-${passwordStrength.color}`}>
                    {passwordStrength.message}
                  </small>
                </div>
                <ul className="password-requirements">
                  <li className={formData.password.length > 8 ? 'text-success' : 'text-muted'}>
                    <i className={`fas fa-${formData.password.length > 8 ? 'check' : 'times'} me-1`}></i>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-success' : 'text-muted'}>
                    <i className={`fas fa-${/[A-Z]/.test(formData.password) ? 'check' : 'times'} me-1`}></i>
                    At least one uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-success' : 'text-muted'}>
                    <i className={`fas fa-${/[0-9]/.test(formData.password) ? 'check' : 'times'} me-1`}></i>
                    At least one number
                  </li>
                  <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-success' : 'text-muted'}>
                    <i className={`fas fa-${/[^A-Za-z0-9]/.test(formData.password) ? 'check' : 'times'} me-1`}></i>
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading || success}
                required
              />
            </div>
            {formData.password && formData.confirmPassword && (
              <small className={formData.password === formData.confirmPassword ? 'text-success' : 'text-danger'}>
                {formData.password === formData.confirmPassword 
                  ? '✓ Passwords match' 
                  : '✗ Passwords do not match'}
              </small>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading || success}
            >
              <option value="patient">Patient</option>
              <option value="dentist">Dentist</option>
              <option value="receptionist">Receptionist</option>
            </select>
            <small className="form-text text-muted">
              Note: Staff accounts may require admin approval before activation
            </small>
          </div>
          
          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : 'Register'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Log In</Link>
          </p>
          <p className="mt-3 terms-text">
            By registering, you agree to our 
            <Link to="/terms" className="auth-link mx-1">Terms of Service</Link>
            and
            <Link to="/privacy" className="auth-link ms-1">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;