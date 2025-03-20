// client/src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp } from '../context/App';
import { authAPI } from '../services/api';

const Register = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Phone number validation for Egypt, Saudi Arabia, and UAE
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      // Regex for Egyptian (+20), Saudi (+966), and UAE (+971) numbers
      const phoneRegex = /^(\+20|00201)[0-9]{9}$|^(\+966|00966)[0-9]{9}$|^(\+971|00971)[0-9]{9}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number for Egypt, Saudi Arabia, or UAE';
      }
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      const response = await authAPI.register(userData);
      
      setRegistrationSuccess(true);
      toast.success('Registration successful! Your account is pending approval by an administrator.');
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
        email: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error messages from API
      if (error.message && error.message.includes('already exists')) {
        toast.error('Username or email already exists');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF7FF]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#201A23] mb-6">
          Dream Dentist Clinic
        </h2>
        <h3 className="text-xl text-center text-[#8E7C93] mb-8">
          Create a new account
        </h3>
        
        {registrationSuccess ? (
          <div className="text-center">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your account has been created successfully and is pending approval by an administrator.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-block bg-[#8E7C93] text-white py-2 px-4 rounded-md hover:bg-[#201A23] transition-colors"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label 
                  htmlFor="fullName" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.fullName ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.username ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label 
                  htmlFor="phoneNumber" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Phone Number (Egypt, Saudi Arabia, or UAE)
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.phoneNumber ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="e.g., +20xxxxxxxxx, +966xxxxxxxxx, or +971xxxxxxxxx"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: Country code (+20 for Egypt, +966 for Saudi Arabia, +971 for UAE) followed by your number
                </p>
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-[#201A23] mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#C5BAC9]'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#8E7C93]`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#8E7C93] text-white py-2 px-4 rounded-md hover:bg-[#201A23] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
            
            <p className="mt-6 text-center text-[#8E7C93]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#201A23] font-medium hover:underline">
                Login here
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;