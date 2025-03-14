// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, error: authError } = useContext(AuthContext);
  const history = useHistory();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/dashboard');
    }

    if (authError) {
      setError(authError);
      setLoading(false);
    }
  }, [isAuthenticated, authError, history]);

  const { username, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-e0f7fa">
      <div className="w-full max-w-md m-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Dream Dentist</h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <div className="text-center mt-8">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
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
