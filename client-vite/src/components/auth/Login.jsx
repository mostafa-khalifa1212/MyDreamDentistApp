import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);    
    try {      
      const { success, error } = await login(credentials.username, credentials.password, rememberMe);      
      
      if (!success) {
          let errorMessage = 'Invalid username or password';
          if (error === 'User not found') {
            errorMessage = 'User not found';
          } else if (error === 'Incorrect password') {
            errorMessage = 'Incorrect password';
          }
          setError(errorMessage);
      } else {
          // Clear any previous errors on success (though redirect should happen)
          setError('');
      }
      // Successful login will redirect via the useEffect above
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container bg-primary-50">
      <div className="auth-card shadow-lg">
        <div className="auth-header bg-primary-500 text-white">
          <h2 className="text-xl font-bold">Sign In</h2>
        </div>
        
        <div className="auth-body">
          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit} autoComplete='off'>
            <div className="form-group">
              <label htmlFor="username" className="form-label text-primary-900">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control bg-primary-50 border-primary-300"
                value={credentials.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label text-primary-900">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control bg-primary-50 border-primary-300"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-500 border-primary-300 rounded"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-primary-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="auth-link text-primary-500 hover:text-primary-700">
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className="auth-btn bg-primary-500 hover:bg-primary-600 text-white"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="social-login border-t border-primary-300 mt-6 pt-6">
              <p className="mb-4 text-primary-600">Or sign in with</p>
              <button type="button" className="social-btn google mb-2 bg-blue-500 hover:bg-blue-600">
                <i className="fab fa-google"></i> Google
              </button>
              <button type="button" className="social-btn facebook bg-blue-800 hover:bg-blue-900">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
            </div>
          </form>
        </div>
        
        <div className="auth-footer bg-primary-100 text-primary-700">
          Don't have an account? <Link to="/register" className="auth-link text-primary-500 hover:text-primary-700">Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
