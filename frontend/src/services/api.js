// src/services/api.js - Enhanced with debugging
import axios from 'axios';

const API_BASE_URL = 'https://authentication-module-g8h8.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests with debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 API Request Debug:');
  console.log('  URL:', config.url);
  console.log('  Method:', config.method);
  console.log('  Token exists:', !!token);
  
  if (token) {
    console.log('  Token (first 50 chars):', token.substring(0, 50) + '...');
    config.headers.Authorization = `Bearer ${token}`;
    console.log('  Authorization header set:', config.headers.Authorization.substring(0, 60) + '...');
  } else {
    console.log('  ❌ No token found in localStorage');
  }
  
  console.log('  Final headers:', config.headers);
  return config;
});

// Response interceptor with debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.status);
    return response;
  },
  (error) => {
    console.log('❌ API Response Error:');
    console.log('  Status:', error.response?.status);
    console.log('  Message:', error.response?.data?.message);
    console.log('  Full error:', error.response?.data);
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export default api;