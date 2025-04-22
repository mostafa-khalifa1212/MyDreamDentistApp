// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// Create an admin user if it doesn't exist
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'Mostafa' });
    
    if (!adminExists) {
      await User.create({
        username: 'Mostafa',
        password: 'mostafa2121', // Will be hashed by pre-save hook
        name: 'Mostafa Admin', // Changed from fullName to name
        phoneNumber: '+201550881126',
        email: 'admin@dreamdentist.com',
        role: 'admin',
        status: 'approved'
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
};

// User registration
const register = async (req, res, next) => {
  try {
    const { username, password, fullName, phoneNumber, email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(createError(409, 'Username or email already exists'));
    }
    
    // Create new user with pending status
    const user = await User.create({
      username,
      password,
      fullName,
      phoneNumber,
      email,
      status: 'pending'
    });
    
    res.status(201).json({ 
      success: true,
      message: 'Registration successful. Your account is pending approval.',
      userId: user._id
    });
  } catch (error) {
    next(error);
  }
};

// User login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return next(createError(401, 'Invalid credentials'));
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    console.log(`Password match result: ${isMatch}`);
    if (!isMatch) {
      return next(createError(401, 'Invalid credentials'));
    }
    
    // Check user status
    if (user.status === 'pending') {
      return next(createError(403, 'Your account is pending approval by an administrator'));
    }
    
    if (user.status === 'banned') {
      return next(createError(403, 'Your account has been banned. Please contact the administrator'));
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,  // Changed from fullName to name
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('createdAt');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update user status
const updateUserStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    
    if (!['pending', 'approved', 'banned'].includes(status)) {
      return next(createError(400, 'Invalid status value'));
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    user.status = status;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      user: {
        id: user._id,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Initialize admin account when server starts
initializeAdmin();

// Export all functions in one place
module.exports = {
  initializeAdmin,
  register,
  login,
  getProfile,
  getAllUsers,
  updateUserStatus
};
