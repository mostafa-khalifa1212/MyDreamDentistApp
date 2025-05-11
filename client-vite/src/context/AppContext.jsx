import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
};

const ActionTypes = {
  TOGGLE_THEME: 'TOGGLE_THEME',
};

const appReducer = (state, action) => {
  switch (action.type) {
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
    document.body.classList.toggle('dark-mode', state.darkMode);
  }, [state.darkMode]);

  const toggleTheme = () => dispatch({ type: ActionTypes.TOGGLE_THEME });

  return (
    <AppContext.Provider value={{ darkMode: state.darkMode, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}; 