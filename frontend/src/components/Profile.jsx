// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { getUser, isAuthenticated } from '../utils/auth';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
      setEditData({
        name: response.data.data.user.name,
        email: response.data.data.user.email
      });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch profile');
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email
    });
  };

  const handleSave = async () => {
    // In a real app, you'd have an update profile API endpoint
    console.log('Save profile:', editData);
    setIsEditing(false);
    // For demo purposes, just update local state
    setUser({ ...user, ...editData });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-large"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="member-since">
            Member since {new Date(user?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </span>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={handleEdit} className="edit-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Save
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {error}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            <div className="card-icon">👤</div>
          </div>
          <div className="card-content">
            {!isEditing ? (
              <>
                <div className="info-row">
                  <span className="label">Full Name:</span>
                  <span className="value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email Address:</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Account Created:</span>
                  <span className="value">
                    {new Date(user?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </>
            ) : (
              <div className="edit-form">
                <div className="input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="edit-input"
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="edit-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h3>Account Security</h3>
            <div className="card-icon">🔒</div>
          </div>
          <div className="card-content">
            <div className="security-item">
              <div className="security-status good">
                <div className="status-dot"></div>
                <span>Password Protected</span>
              </div>
              <button className="security-action">Change</button>
            </div>
            <div className="security-item">
              <div className="security-status good">
                <div className="status-dot"></div>
                <span>Email Verified</span>
              </div>
              <span className="verified-badge">✓ Verified</span>
            </div>
            <div className="security-item">
              <div className="security-status warning">
                <div className="status-dot"></div>
                <span>Two-Factor Authentication</span>
              </div>
              <button className="security-action">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;