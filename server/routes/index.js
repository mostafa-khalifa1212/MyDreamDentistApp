// server/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const appointmentRoutes = require('./appointments'); // Corrected path

// ... other routes

// Use route modules
router.use('/auth', authRoutes); // Authentication routes
router.use('/users', userRoutes); // User management routes
router.use('/appointments', appointmentRoutes); // Appointment routes
// ... other routes

module.exports = router;

