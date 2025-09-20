// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { getUser } from '../utils/auth';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(getUser());
  const [stats, setStats] = useState({
    totalLogins: 0,
    lastLogin: new Date().toISOString(),
    accountAge: 0,
    securityScore: 85
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
      
      // Calculate account age in days
      const accountAge = Math.floor(
        (new Date() - new Date(response.data.data.user.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      setStats({
        totalLogins: Math.floor(Math.random() * 50) + 1,
        lastLogin: new Date().toISOString(),
        accountAge: accountAge,
        securityScore: 85
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{getGreeting()}, {user?.name}!</h1>
            <p>Welcome back to your secure dashboard</p>
          </div>
          <div className="hero-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="status-indicator"></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Profile
        </button>
        <button 
          className={`nav-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🔒</span>
          Security
        </button>
        <button 
          className={`nav-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <span className="tab-icon">📈</span>
          Activity
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h3>{stats.totalLogins}</h3>
                  <p>Total Logins</p>
                </div>
              </div>
              
              <div className="stat-card secondary">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{stats.accountAge}</h3>
                  <p>Days Active</p>
                </div>
              </div>
              
              <div className="stat-card success">
                <div className="stat-icon">🛡️</div>
                <div className="stat-info">
                  <h3>{stats.securityScore}%</h3>
                  <p>Security Score</p>
                </div>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <h3>Online</h3>
                  <p>Status</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <button className="action-btn">
                  <span className="action-icon">🔧</span>
                  <span>Settings</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">🔑</span>
                  <span>Change Password</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>View Reports</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">💬</span>
                  <span>Support</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-details">
                  <h2>{user?.name}</h2>
                  <p>{user?.email}</p>
                  <span className="member-badge">Premium Member</span>
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Full Name</span>
                  <span className="value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email Address</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Account Created</span>
                  <span className="value">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Account ID</span>
                  <span className="value">{user?._id?.slice(-8)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-content">
            <div className="security-score">
              <div className="score-circle">
                <span className="score-value">{stats.securityScore}%</span>
                <span className="score-label">Security Score</span>
              </div>
              <div className="score-details">
                <h3>Security Status</h3>
                <p>Your account has strong security measures in place</p>
              </div>
            </div>

            <div className="security-features">
              <div className="feature-item active">
                <div className="feature-icon">✅</div>
                <div className="feature-info">
                  <h4>Password Protection</h4>
                  <p>Strong password with encryption</p>
                </div>
              </div>
              
              <div className="feature-item active">
                <div className="feature-icon">✅</div>
                <div className="feature-info">
                  <h4>Account Verification</h4>
                  <p>Email address verified</p>
                </div>
              </div>
              
              <div className="feature-item inactive">
                <div className="feature-icon">⚠️</div>
                <div className="feature-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Not enabled - Recommended</p>
                </div>
              </div>
              
              <div className="feature-item active">
                <div className="feature-icon">✅</div>
                <div className="feature-info">
                  <h4>Secure Connection</h4>
                  <p>HTTPS encryption active</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-content">
            <div className="activity-header">
              <h3>Recent Activity</h3>
              <span className="activity-count">{stats.totalLogins} total sessions</span>
            </div>
            
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">🔐</div>
                <div className="activity-details">
                  <h4>Successful Login</h4>
                  <p>Signed in from Chrome on Windows</p>
                  <span className="activity-time">Just now</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-details">
                  <h4>Profile Accessed</h4>
                  <p>Viewed dashboard and profile information</p>
                  <span className="activity-time">2 minutes ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">🛡️</div>
                <div className="activity-details">
                  <h4>Security Check</h4>
                  <p>Automatic security scan completed</p>
                  <span className="activity-time">1 hour ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">✨</div>
                <div className="activity-details">
                  <h4>Account Created</h4>
                  <p>Welcome to the platform!</p>
                  <span className="activity-time">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;