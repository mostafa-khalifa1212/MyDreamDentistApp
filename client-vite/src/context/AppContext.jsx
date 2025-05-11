import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
};

const ActionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  AUTH_ERROR: 'AUTH_ERROR',
  USER_LOADED: 'USER_LOADED',
  LOADING: 'LOADING',
  TOGGLE_THEME: 'TOGGLE_THEME'
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.USER_LOADED:
      return { ...state, isAuthenticated: true, user: action.payload, loading: false };
    case ActionTypes.LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload.user, loading: false };
    case ActionTypes.AUTH_ERROR:
    case ActionTypes.LOGOUT:
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return { ...state, isAuthenticated: false, user: null, loading: false };
    case ActionTypes.LOADING:
      return { ...state, loading: true };
    case ActionTypes.TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode);
      return { ...state, darkMode: newDarkMode };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        dispatch({ type: ActionTypes.AUTH_ERROR });
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Authentication failed');
        const data = await response.json();
        dispatch({ type: ActionTypes.USER_LOADED, payload: data.user });
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: ActionTypes.AUTH_ERROR });
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', state.darkMode);
  }, [state.darkMode]);

  const auth = {
    login: async (username, password, rememberMe = false) => {
      try {
        dispatch({ type: ActionTypes.LOADING });
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        if (rememberMe) {
          localStorage.setItem('token', data.token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', data.token);
          localStorage.removeItem('token');
        }
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
        return { success: true };
      } catch (error) {
        dispatch({ type: ActionTypes.AUTH_ERROR });
        return { success: false, error: error.message };
      }
    },
    register: async (userData) => {
      try {
        dispatch({ type: ActionTypes.LOADING });
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Registration failed');
        const data = await response.json();
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
        return { success: true };
      } catch (error) {
        dispatch({ type: ActionTypes.AUTH_ERROR });
        return { success: false, error: error.message };
      }
    },
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME })
  };

  return (
    <AppContext.Provider value={{ ...state, ...auth }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}; 