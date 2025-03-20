const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const financialController = require('../controllers/financialController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Auth routes (public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected routes (require authentication)
router.use('/api', authenticate);

// User profile routes
router.get('/api/profile', authController.getProfile);

// Admin routes
router.get('/api/users', authenticate, isAdmin, authController.getAllUsers);
router.put('/api/users/status', authenticate, isAdmin, authController.updateUserStatus);

// Appointment routes
router.get('/api/appointments', appointmentController.getAppointments);
router.post('/api/appointments', appointmentController.createAppointment);
router.put('/api/appointments/:id', appointmentController.updateAppointment);
router.delete('/api/appointments/:id', appointmentController.deleteAppointment);
router.get('/api/appointments/financial/daily', appointmentController.getDailyFinancial);

// Financial routes
router.post('/api/transactions', financialController.createTransaction);
router.get('/api/financial/daily', financialController.getDailySummary);
router.get('/api/financial/monthly', financialController.getMonthlySummary);

module.exports = router;
