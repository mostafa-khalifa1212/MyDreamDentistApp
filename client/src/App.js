import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
};

// Action types
const ActionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  AUTH_ERROR: 'AUTH_ERROR',
  USER_LOADED: 'USER_LOADED',
  LOADING: 'LOADING',
  TOGGLE_THEME: 'TOGGLE_THEME'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case ActionTypes.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
      };
    case ActionTypes.AUTH_ERROR:
    case ActionTypes.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case ActionTypes.LOADING:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.TOGGLE_THEME:
      const newDarkMode = !state.darkMode;
      localStorage.setItem('darkMode', newDarkMode);
      return {
        ...state,
        darkMode: newDarkMode,
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: ActionTypes.AUTH_ERROR });
        return;
      }

      try {
        // Set auth token in headers
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        dispatch({
          type: ActionTypes.USER_LOADED,
          payload: data.user
        });
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: ActionTypes.AUTH_ERROR });
      }
    };

    loadUser();
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (state.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [state.darkMode]);

  // Authentication actions
  const login = async (username, password) => {
    try {
      dispatch({ type: ActionTypes.LOADING });
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: ActionTypes.AUTH_ERROR });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const toggleTheme = () => {
    dispatch({ type: ActionTypes.TOGGLE_THEME });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        toggleTheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the auth context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;