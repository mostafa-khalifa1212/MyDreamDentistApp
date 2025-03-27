import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
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
    <div className="auth-container bg-primary-50">
      <div className="auth-card shadow-lg">
        <div className="auth-header bg-primary-500 text-white">
          <h2 className="text-xl font-bold">Create an Account</h2>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="font-medium">Success:</span> Registration successful! Redirecting to login...
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label text-primary-900">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-primary-400"></i>
                </div>
                <input
                  type="text"
                  className="form-control pl-10 bg-primary-50 border-primary-300"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="username" className="form-label text-primary-900">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-at text-primary-400"></i>
                </div>
                <input
                  type="text"
                  className="form-control pl-10 bg-primary-50 border-primary-300"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <small className="text-primary-600 text-xs mt-1 block">3-20 characters, letters, numbers and underscore only</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label text-primary-900">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-primary-400"></i>
                </div>
                <input
                  type="email"
                  className="form-control pl-10 bg-primary-50 border-primary-300"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label text-primary-900">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-primary-400"></i>
                </div>
                <input
                  type="password"
                  className="form-control pl-10 bg-primary-50 border-primary-300"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      passwordStrength.color === 'danger' ? 'bg-red-500' : 
                      passwordStrength.color === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{width: `${(passwordStrength.score / 5) * 100}%`}}
                  ></div>
                </div>
                <small className={`
                  ${passwordStrength.color === 'danger' ? 'text-red-500' : 
                  passwordStrength.color === 'warning' ? 'text-yellow-600' : 'text-green-600'}
                  text-xs mt-1 block
                `}>
                  Password strength: {passwordStrength.message}
                </small>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label text-primary-900">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-primary-400"></i>
                </div>
                <input
                  type="password"
                  className="form-control pl-10 bg-primary-50 border-primary-300"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="role" className="form-label text-primary-900">I am a</label>
              <select
                className="form-control bg-primary-50 border-primary-300"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="patient">Patient</option>
                <option value="dentist">Dentist</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="auth-btn bg-primary-500 hover:bg-primary-600 text-white"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
        
        <div className="auth-footer bg-primary-100 text-primary-700">
          Already have an account? <Link to="/login" className="auth-link text-primary-500 hover:text-primary-700">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;