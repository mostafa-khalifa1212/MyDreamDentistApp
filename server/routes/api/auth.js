// server/routes/api/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { authenticate, isAdmin } = require('../../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);

// Admin routes
router.get('/users', authenticate, isAdmin, authController.getAllUsers);
router.put('/users/status', authenticate, isAdmin, authController.updateUserStatus);

module.exports = router;


