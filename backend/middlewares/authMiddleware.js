const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('🔐 Auth Middleware Debug:');
    console.log('  Headers received:', req.headers);
    
    const authHeader = req.header('Authorization');
    console.log('  Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('  ❌ Invalid or missing Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('  Token extracted (first 50 chars):', token.substring(0, 50) + '...');
    console.log('  JWT_SECRET exists:', !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('  Token decoded successfully. User ID:', decoded.id);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('  ❌ User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    console.log('  ✅ User found:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.log('  ❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed.',
    });
  }
};

module.exports = authMiddleware;