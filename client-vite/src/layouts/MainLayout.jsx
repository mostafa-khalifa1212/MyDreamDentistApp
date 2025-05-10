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

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Add actual dark mode implementation with CSS variables or Tailwind classes
    document.body.classList.toggle('dark-mode');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <FaCalendarAlt className="mr-2" />
    },
    {
      path: '/appointments',
      name: 'Appointments',
      icon: <FaCalendarAlt className="mr-2" />
    },
    {
      path: '/financials',
      name: 'Financials',
      icon: <FaChartLine className="mr-2" />
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: <FaUserCircle className="mr-2" />
    }
  ];
  
  // Add admin-only navigation
  if (user && user.role === 'admin') {
    navItems.push({
      path: '/users',
      name: 'User Management',
      icon: <FaUsers className="mr-2" />
    });
  }
  
  return (
    <div className="min-h-screen bg-primary-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-900">
                  Dream Dentist
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="text-primary-900 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/appointments" className="text-primary-900 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                  Appointments
                </Link>
                <Link to="/financials" className="text-primary-900 hover:text-primary-700 px-3 py-2 rounded-md text-sm font-medium">
                  Financials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;