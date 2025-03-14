// Example: server/routes/api/appointments.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');

// Protect all appointment routes
router.use(authenticate);

// Define the appointment routes
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.get('/financial/daily', appointmentController.getDailyFinancial);

// Export the router directly—not wrapped in another object
module.exports = router;
