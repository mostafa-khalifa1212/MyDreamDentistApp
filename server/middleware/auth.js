const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');

// Define the authenticate middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'No token provided, authorization denied'));
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID (excluding the password field)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(createError(401, 'Invalid token, user not found'));
    }
    
    // Additional check for user status (e.g., pending approval, banned)
    if (user.status !== 'approved') {
      return next(createError(403, 'Your account is not active'));
    }
    
    // Set the user in the request object for later use
    req.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    next(error);
  }
};

// Define the isAdmin middleware
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(createError(403, 'Access denied. Admin privilege required'));
  }
  next();
};

module.exports = { authenticate, isAdmin };
