// server/routes/index.js
const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const appointmentRoutes = require('./appointments'); // Corrected path
const treatmentRoutes = require('./treatments');
const patientsRoutes = require('./patients'); // Import patients routes

// ... other routes

// Use route modules
router.use('/auth', authRoutes); // Authentication routes
router.use('/users', userRoutes); // User management routes
router.use('/appointments', appointmentRoutes); // Appointment routes
router.use('/treatments', treatmentRoutes);
router.use('/patients', patientsRoutes); // Patient management routes
// ... other routes

module.exports = router;

