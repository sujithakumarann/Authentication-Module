// src/components/Layout.jsx
import React from 'react';
import { isAuthenticated, logout, getUser } from '../utils/auth';
import './Layout.css';

const Layout = ({ children }) => {
  const user = getUser();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🔐</div>
            <h1 className="logo-text">SecureAuth</h1>
          </div>
          
          {isAuthenticated() && (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">Welcome, {user?.name}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span>Logout</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; 2025 SecureAuth. Built with React & Node.js</p>
      </footer>
    </div>
  );
};

export default Layout;