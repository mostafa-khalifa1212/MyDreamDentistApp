// client/src/layouts/MainLayout.js - completed version
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import { 
  FaCalendarAlt, 
  FaChartLine, 
  FaUsers, 
  FaUserCircle, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt, 
  FaMoon, 
  FaSun 
} from 'react-icons/fa';
import { useApp } from '../context/AppContext.jsx';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { darkMode: appDarkMode, toggleTheme } = useApp();

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaCalendarAlt className="mr-2" /> },
    { path: '/appointments', name: 'Appointments', icon: <FaCalendarAlt className="mr-2" /> },
    { path: '/financials', name: 'Financials', icon: <FaChartLine className="mr-2" /> },
    { path: '/profile', name: 'Profile', icon: <FaUserCircle className="mr-2" /> }
  ];
  if (user && user.role === 'admin') {
    navItems.push({ path: '/users', name: 'User Management', icon: <FaUsers className="mr-2" /> });
  }

  // Apply dark mode class to root element
  React.useEffect(() => {
    if (appDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [appDarkMode]);

  return (
    <div className={`min-h-screen ${appDarkMode ? 'dark-mode' : ''}`}>
      <header className="app-header">
        <nav className="navbar navbar-expand-lg flex items-center">
          <div className="container-fluid flex items-center">
            <Link className="navbar-brand" to="/">
              <i className="fas fa-tooth me-2"></i>
              Dream Dentist
            </Link>
            <div className="flex-1 flex items-center gap-4 ml-8">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="ms-auto flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-primary-100 hover:bg-primary-200 transition"
                title={appDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {appDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;