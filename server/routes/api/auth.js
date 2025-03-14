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

// server/routes/api/appointments.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointmentController');
const { authenticate } = require('../../middleware/auth');

// Protect all appointment routes
router.use(authenticate);

// Appointment routes
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.get('/financial/daily', appointmentController.getDailyFinancial);

module.exports = router;

// server/routes/api/financial.js
const express = require('express');
const router = express.Router();
const financialController = require('../../controllers/financialController');
const { authenticate } = require('../../middleware/auth');

// Protect all financial routes
router.use(authenticate);

// Financial routes
router.post('/transactions', financialController.createTransaction);
router.get('/summary/daily', financialController.getDailySummary);
router.get('/summary/monthly', financialController.getMonthlySummary);

module.exports = router;

// server/routes/index.js
const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./api/auth');
const appointmentRoutes = require('./api/appointments');
const financialRoutes = require('./api/financial');

// API routes
router.use('/api/auth', authRoutes);
router.use('/api/appointments', appointmentRoutes);
router.use('/api/financial', financialRoutes);

module.exports = router;
