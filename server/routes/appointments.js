const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Middleware to check if user is staff
const isStaff = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'dentist' || req.user.role === 'receptionist') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Staff only.' });
};

// @route   POST /api/appointments
// @desc    Create a new appointment
// @access  Private (Staff only)
router.post('/', auth, isStaff, async (req, res) => {
  try {
    const { patientId, dentistId, dateTime, duration, type, notes } = req.body;

    // Validate patient and dentist
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const dentist = await User.findById(dentistId);
    if (!dentist || dentist.role !== 'dentist') {
      return res.status(404).json({ error: 'Dentist not found' });
    }

    // Check for conflicting appointments
    const appointmentDate = new Date(dateTime);
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    const conflictingAppointment = await Appointment.findOne({
      dentist: dentistId,
      status: { $in: ['scheduled', 'confirmed'] },
      $or: [
        {
          dateTime: { $lt: endTime },
          $expr: { 
            $gt: [
              { $add: ['$dateTime', { $multiply: ['$duration', 60000] }] },
              appointmentDate.getTime()
            ]
          }
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: 'Appointment time conflicts with an existing appointment' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: patientId,
      dentist: dentistId,
      dateTime: appointmentDate,
      duration,
      type,
      notes,
      status: 'scheduled'
    });

    await appointment.save();

    // Return the appointment with populated references
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', ['user'])
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('dentist', ['name']);

    res.json(populatedAppointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.dateTime = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by patient for staff
    if (req.query.patientId && (req.user.role === 'admin' || req.user.role === 'dentist' || req.user.role === 'receptionist')) {
      query.patient = req.query.patientId;
    }
    
    // Filter by dentist
    if (req.query.dentistId) {
      query.dentist = req.query.dentistId;
    }
    
    // If user is a patient, only show their appointments
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      query.patient = patient._id;
    }
    
    // If user is a dentist, only show their appointments
    if (req.user.role === 'dentist') {
      query.dentist = req.user.id;
    }
    
    const appointments = await Appointment.find(query)
      .sort({ dateTime: 1 })
      .populate('patient', ['user'])
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('dentist', ['name']);
    
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', ['user'])
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('dentist', ['name']);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check permission
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'receptionist' && 
      appointment.dentist._id.toString() !== req.user.id
    ) {
      // Check if it's the patient's own appointment
      const patient = await Patient.findOne({ user: req.user.id });
      if (!patient || appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private (Staff only)
router.put('/:id', auth, isStaff, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Update fields
    const { dateTime, duration, status, type, notes } = req.body;
    
    if (dateTime) appointment.dateTime = new Date(dateTime);
    if (duration) appointment.duration = duration;
    if (status) appointment.status = status;
    if (type) appointment.type = type;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();
    
    // Return updated appointment with populated references
    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', ['user'])
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name'
        }
      })
      .populate('dentist', ['name']);
    
    res.json(updatedAppointment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (Staff only)
router.delete('/:id', auth, isStaff, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.remove();
    res.json({ msg: 'Appointment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;