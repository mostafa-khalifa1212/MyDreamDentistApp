import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Layout.css';

const Layout = ({ children }) => {
  const { darkMode, toggleTheme } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <i className="fas fa-tooth me-2"></i>
              Dream Dentist
            </Link>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarContent"
              aria-controls="navbarContent" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} to="/">
                    Home
                  </Link>
                </li>
                
                {isAuthenticated && (
                  <>
                    <li className="nav-item">
                      <Link className={`nav-link ${isActive('/appointments')}`} to="/appointments">
                        Appointments
                      </Link>
                    </li>
                    
                    {(user?.role === 'admin' || user?.role === 'dentist' || user?.role === 'receptionist') && (
                      <>
                        <li className="nav-item">
                          <Link className={`nav-link ${isActive('/patients')}`} to="/patients">
                            Patients
                          </Link>
                        </li>
                        
                        {(user?.role === 'admin' || user?.role === 'dentist') && (
                          <li className="nav-item">
                            <Link className={`nav-link ${isActive('/treatments')}`} to="/treatments">
                              Treatments
                            </Link>
                          </li>
                        )}
                        
                        {user?.role === 'admin' && (
                          <li className="nav-item">
                            <Link className={`nav-link ${isActive('/users')}`} to="/users">
                              Users
                            </Link>
                          </li>
                        )}
                      </>
                    )}
                  </>
                )}
              </ul>
              
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-link theme-toggle me-3" 
                  onClick={toggleTheme}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {darkMode ? (
                    <i className="fas fa-sun"></i>
                  ) : (
                    <i className="fas fa-moon"></i>
                  )}
                </button>
                
                {isAuthenticated ? (
                  <div className="dropdown">
                    <button 
                      className="btn user-menu dropdown-toggle" 
                      type="button" 
                      id="userMenuDropdown" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                    >
                      <i className="fas fa-user-circle me-1"></i>
                      {user?.name || 'User'}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
                      <li className="dropdown-header">
                        <strong>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</strong>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <i className="fas fa-id-card me-2"></i>
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          <i className="fas fa-cog me-2"></i>
                          Settings
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={logout}>
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <Link to="/login" className="btn btn-outline-primary me-2">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="app-content">
        <div className="container py-4">
          {children}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; {new Date().getFullYear()} Dream Dentist. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="me-3">Privacy Policy</a>
              <a href="#" className="me-3">Terms of Service</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;