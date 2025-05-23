// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Standardized to /api
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Profile specific API calls
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (profileData) => api.put('/auth/profile', profileData);

// Treatment specific API calls
export const getTreatments = () => api.get('/treatments'); // Assuming treatments route is mounted at /api/treatments

// You might want to export 'api' if other parts of the app use it for different endpoints
// Or export specific functions for each endpoint group
export default api; 
// Consider changing the default export if you only want to export specific functions like getProfile, updateProfile, etc.
// For example:
// export { getProfile, updateProfile };
// And then import them like: import { getProfile } from './services/api';
