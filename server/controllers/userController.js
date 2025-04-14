// server/controllers/userController.js
const User = require('../models/User');
const createError = require('http-errors');

// Get user by ID
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Allow admins to access any user, or users to access their own profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return next(createError(403, 'Unauthorized'));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Update user information (excluding password)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, /* other fields */ } = req.body; // Extract fields to update
    const userId = req.params.id;

    let user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Allow admins to update any user, or users to update their own profile
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return next(createError(403, 'Unauthorized'));
    }

    // Update user information
    user.name = name || user.name;
    user.email = email || user.email;
    // Update other fields similarly

    user = await user.save();

    // Remove password from the response
    const updatedUser = { ...user.toObject() };
    delete updatedUser.password;

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Allow admins to delete any user, or users to delete their own profile (if allowed)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return next(createError(403, 'Unauthorized'));
    }

    await user.remove();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;