// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, error: authError } = useContext(AuthContext);
  const history = useHistory();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }, [isAuthenticated, history]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError) {
      setErrors({ general: authError });
      setIsSubmitting(false);
    }
  }, [authError]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      console.error('Login error:', error);
      setIsSubmitting(false);
      setErrors({ 
        general: error.response?.data?.error || 'Login failed. Please try again.' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF7FF]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#201A23] mb-6">
          Dream Dentist Clinic
        </h2>
        <h3 className="text-xl text-center text-[#8E7C93] mb-8">
          Login to your account
        </h3>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-6">
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
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8E7C93] text-white py-2 px-4 rounded-md hover:bg-[#201A23] transition-colors duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-[#8E7C93]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#201A23] font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

// client/src/pages/Register.js
//import React, { useState, useContext, useEffect } from 'react';
//import { Link, useHistory } from 'react-router-dom';
//import AuthContext from '../context/AuthContext';
// THE REST IS DELETED AND CAN BE FOUND AND RECOVERED FROM COPILOT  
