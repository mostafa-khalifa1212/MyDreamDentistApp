// client/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add auth token if it exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    // Prepare the request URL
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    // Handle token expiration
    if (error.message === 'Token expired' || error.message === 'Invalid token') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  register: async (userData) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  getProfile: async () => {
    return await apiRequest('/profile');
  },

  logout: async () => {
    localStorage.removeItem('token');
    return true;
  }
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: async (start, end, timezone) => {
    const query = new URLSearchParams({ start, end, timezone }).toString();
    return await apiRequest(`/appointments?${query}`);
  },
  
  createAppointment: async (appointmentData) => {
    return await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  },
  
  updateAppointment: async (id, appointmentData) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    });
  },
  
  deleteAppointment: async (id) => {
    return await apiRequest(`/appointments/${id}`, {
      method: 'DELETE'
    });
  },
  
  getDailyFinancial: async (date, timezone) => {
    const query = new URLSearchParams({ date, timezone }).toString();
    return await apiRequest(`/appointments/financial/daily?${query}`);
  }
};

// Financial API
export const financialAPI = {
  createTransaction: async (transactionData) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  },
  
  getDailySummary: async (date, timezone) => {
    const query = new URLSearchParams({ date, timezone }).toString();
    return await apiRequest(`/financial/daily?${query}`);
  },
  
  getMonthlySummary: async (month, year, timezone) => {
    const query = new URLSearchParams({ month, year, timezone }).toString();
    return await apiRequest(`/financial/monthly?${query}`);
  }
};

// User Management API (Admin)
export const userAPI = {
  getAllUsers: async () => {
    return await apiRequest('/users');
  },
  
  updateUserStatus: async (userId, status) => {
    return await apiRequest('/users/status', {
      method: 'PUT',
      body: JSON.stringify({ userId, status })
    });
  }
};

export default { authAPI, appointmentsAPI, financialAPI, userAPI };
