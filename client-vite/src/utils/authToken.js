import axios from 'axios';

// Set auth token as default header
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Remove auth token from headers
export const removeAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};