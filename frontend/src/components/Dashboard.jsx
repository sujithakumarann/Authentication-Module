// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { getUser } from '../utils/auth';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(getUser());
  const [stats, setStats] = useState({
    totalSessions: 0,
    lastLogin: new Date().toISOString(),
    accountCreated: user?.createdAt || new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
      
      // Simulate some stats (in real app, these would come from backend)
      setStats({
        totalSessions: Math.floor(Math.random() * 50) + 1,
        lastLogin: new Date().toISOString(),
        accountCreated: response.data.data.user.createdAt
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Here's what's happening with your account today.</p>
        </div>
        <div className="quick-actions">
          <button className="action-btn primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Edit Profile
          </button>
          <button className="action-btn secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Security
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Account Overview</h3>
            <div className="card-icon">👤</div>
          </div>
          <div className="card-content">
            <div className="info-row">
              <span className="label">Full Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Member Since:</span>
              <span className="value">
                {new Date(stats.accountCreated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Activity Stats</h3>
            <div className="card-icon">📊</div>
          </div>
          <div className="card-content">
            <div className="stat-item">
              <div className="stat-number">{stats.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {new Date(stats.lastLogin).toLocaleDateString()}
              </div>
              <div className="stat-label">Last Login</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Security Status</h3>
            <div className="card-icon">🔒</div>
          </div>
          <div className="card-content">
            <div className="security-item">
              <div className="security-status good">
                <div className="status-dot"></div>
                <span>Password Protected</span>
              </div>
            </div>
            <div className="security-item">
              <div className="security-status good">
                <div className="status-dot"></div>
                <span>Account Verified</span>
              </div>
            </div>
            <div className="security-item">
              <div className="security-status warning">
                <div className="status-dot"></div>
                <span>2FA Not Enabled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <div className="card-icon">📝</div>
          </div>
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🔐</div>
                <div className="activity-details">
                  <div className="activity-title">Successful Login</div>
                  <div className="activity-time">Just now</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-details">
                  <div className="activity-title">Account Created</div>
                  <div className="activity-time">
                    {new Date(stats.accountCreated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;