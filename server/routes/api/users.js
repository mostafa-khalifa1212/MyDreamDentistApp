const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { authenticate, isAdmin } = require('../../middleware/auth');

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 * @access  Private
 */
router.get('/:id', async (req, res, next) => {
  try {
    // Check if the user is requesting their own profile or is an admin
    if (req.user.id === req.params.id || req.user.role === 'admin') {
      await userController.getUserById(req, res, next);
    } else {
      return res.status(403).json({ error: 'Unauthorized: You can only access your own profile' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user's information (excluding password)
 * @access  Private - User can only update their own info, unless admin
 */
router.put('/:id', async (req, res, next) => {
  try {
    // Check if the user is updating their own profile or is an admin
    if (req.user.id === req.params.id || req.user.role === 'admin') {
      await userController.updateUser(req, res, next);
    } else {
      return res.status(403).json({ error: 'Unauthorized: You can only update your own profile' });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Private - Admin only, or user can delete their own account
 */
router.delete('/:id', async (req, res, next) => {
  try {
    // Check if the user is deleting their own profile or is an admin
    if (req.user.id === req.params.id || req.user.role === 'admin') {
      await userController.deleteUser(req, res, next);
    } else {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own profile' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;