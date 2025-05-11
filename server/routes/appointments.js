const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
// const Appointment = require('../models/Appointment');
// const Patient = require('../models/Patient');
// const User = require('../models/User');
const appointmentController = require('../controllers/appointmentController');

// Middleware to check if user is staff
const isStaff = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'dentist' || req.user.role === 'receptionist') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Staff only.' });
};

// Create a new appointment
router.post('/', authenticate, isStaff, appointmentController.createAppointment);

// Get all appointments (optionally with filters)
router.get('/', authenticate, appointmentController.getAppointments);

// Get appointment by ID
router.get('/:id', authenticate, appointmentController.getAppointments); // Optionally, create a getAppointmentById controller

// Update appointment
router.put('/:id', authenticate, isStaff, appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', authenticate, isStaff, appointmentController.deleteAppointment);

module.exports = router;