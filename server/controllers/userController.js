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

// Update user information (can be called by user for themselves, or by admin for any user)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, username, phoneNumber, status } = req.body; // Added role, username, phoneNumber, status
    const userId = req.params.id;

    let user = await User.findById(userId);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    // Authorization: User can update their own profile, or admin can update any profile.
    // This check is already implicitly handled by the route's middleware or specific checks in the route.
    // However, ensuring an admin isn't accidentally de-admining themselves or changing critical fields without specific intent might be a future thought.
    // For now, if req.user.role === 'admin', they can update these fields for the target user.

    // Update basic fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber; // Added phoneNumber

    // Update email with uniqueness check
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        return next(createError(400, 'Email already in use by another user'));
      }
      user.email = email.toLowerCase();
    }

    // Update username with uniqueness check (Only if admin is making the change or if it's part of self-update and allowed)
    if (username && username !== user.username) {
      // Typically, username changes are sensitive. Admins might be allowed.
      // Self-update of username might be restricted or have additional checks.
      // For this admin CRUD, we assume admin can change it.
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return next(createError(400, 'Username already in use by another user'));
      }
      user.username = username;
    }
    
    // Update role (typically admin-only action for other users)
    if (role && req.user.role === 'admin') { // Ensure only admin can change roles
      const validRoles = User.schema.path('role').enumValues;
      if (!validRoles.includes(role)) {
        return next(createError(400, 'Invalid role specified'));
      }
      // Prevent admin from changing their own role if they are the only admin? (Future consideration)
      user.role = role;
    } else if (role && req.user.id === userId && user.role !== role) {
        // Prevent user from changing their own role
        return next(createError(403, 'Users cannot change their own role.'));
    }

    // Update status (typically admin-only action)
    if (status && req.user.role === 'admin') { // Ensure only admin can change status
        const validStatuses = User.schema.path('status').enumValues;
        if (!validStatuses.includes(status)) {
            return next(createError(400, 'Invalid status specified'));
        }
        user.status = status;
    } else if (status && req.user.id === userId && user.status !== status) {
        // Prevent user from changing their own status
        return next(createError(403, 'Users cannot change their own status.'));
    }


    const updatedUser = await user.save();

    // Prepare response object (excluding password)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    // Check for MongoDB duplicate key errors (e.g., if unique index is violated despite above checks)
    if (error.code === 11000) {
        // Determine which field caused the error
        let field = Object.keys(error.keyValue)[0];
        field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
        return next(createError(400, `${field} already in use.`));
    }
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

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};

module.exports = exports;