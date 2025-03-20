// client/src/layouts/MainLayout.js - completed version
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/App';

// Icons (using inline SVG for simplicity)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const AppointmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const FinancialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const LightModeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const DarkModeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0011 2H3zm5 6a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L8 13.586V9z" clipRule="evenodd" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, darkMode, toggleTheme } = useApp();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Navigation items
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/appointments', name: 'Appointments', icon: <AppointmentIcon /> },
    { path: '/financials', name: 'Financials', icon: <FinancialIcon /> },
    { path: '/profile', name: 'Profile', icon: <UserIcon /> }
  ];
  
  // Admin-only navigation items
  const adminNavItems = [
    { path: '/users', name: 'User Management', icon: <UsersIcon /> }
  ];
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Mobile header */}
      <div className="md:hidden bg-[#201A23] text-white p-4 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold">Dream Dentist Clinic</h1>
        <button
          onClick={toggleTheme}
          className="text-white focus:outline-none"
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className="flex flex-1">
        <aside
          className={`
            bg-[#201A23] text-white w-64 flex-shrink-0 fixed h-full z-10 transition-transform duration-300
            md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-[#8E7C93]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Dream Dentist</h2>
              <button
                onClick={toggleSidebar}
                className="md:hidden text-white focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {user && (
              <div className="mt-2 text-sm">
                <div className="font-medium">{user.fullName}</div>
                <div className="text-[#C5BAC9]">{user.role}</div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-2 rounded-md transition-colors
                      ${isActive 
                        ? 'bg-[#8E7C93] text-white' 
                        : 'text-[#C5BAC9] hover:bg-[#8E7C93] hover:bg-opacity-25 hover:text-white'}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
              
              {/* Admin navigation */}
              {user && user.role === 'admin' && (
                <>
                  <li className="mt-6 mb-2">
                    <div className="px-4 text-xs font-semibold text-[#8E7C93] uppercase tracking-wider">
                      Admin
                    </div>
                  </li>
                  {adminNavItems.map(item => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) => `
                          flex items-center px-4 py-2 rounded-md transition-colors
                          ${isActive 
                            ? 'bg-[#8E7C93] text-white' 
                            : 'text-[#C5BAC9] hover:bg-[#8E7C93] hover:bg-opacity-25 hover:text-white'}
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="absolute bottom-0 w-full p-4 border-t border-[#8E7C93]">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="flex items-center text-[#C5BAC9] hover:text-white transition-colors"
              >
                <span className="mr-2">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </span>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-[#C5BAC9] hover:text-white transition-colors"
              >
                <span className="mr-2">
                  <LogoutIcon />
                </span>
                Logout
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 ${darkMode ? 'bg-[#000009] text-white' : 'bg-[#FCF7FF] text-[#201A23]'}`}>
          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between p-4 border-b border-[#C5BAC9]">
            <h1 className="text-2xl font-bold">Dream Dentist Clinic</h1>
          </div>
          
          {/* Page content */}
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;