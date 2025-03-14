// client/src/layouts/MainLayout.js - completed version
import React, { useState, useContext } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
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
  const history = useHistory();
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
    history.push('/login');
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
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar - mobile version */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dream Dentist</h1>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleSidebar}
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.path
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
            <button
              onClick={toggleDarkMode}
              className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
            >
              {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - desktop version */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 shadow">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dream Dentist</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md"
              >
                {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow md:hidden">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dream Dentist</h1>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleSidebar}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;