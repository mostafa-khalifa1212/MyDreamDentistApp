const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Middleware to check if user is staff or admin
const isStaff = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'dentist' || req.user.role === 'receptionist') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Staff only.' });
};

// @route   POST /api/patients
// @desc    Register a new patient
// @access  Private (Staff only)
router.post('/', auth.authenticate, isStaff, async (req, res) => {
  try {
    const {
      userId,
      dateOfBirth,
      contactNumber,
      address,
      medicalHistory,
      insuranceInfo,
      dentalHistory
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if patient profile already exists
    let patient = await Patient.findOne({ user: userId });
    if (patient) {
      return res.status(400).json({ error: 'Patient profile already exists for this user' });
    }

    // Create new patient profile
    patient = new Patient({
      user: userId,
      dateOfBirth,
      contactNumber,
      address,
      medicalHistory,
      insuranceInfo,
      dentalHistory
    });

    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Staff only)
router.get('/', auth.authenticate, isStaff, async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', ['name', 'email']);
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private (Staff or own patient record)
router.get('/:id', auth.authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', ['name', 'email']);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if user has permission to view this patient
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'dentist' && 
      req.user.role !== 'receptionist' && 
      patient.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient information
// @access  Private (Staff only)
router.put('/:id', auth.authenticate, isStaff, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Update fields that are sent in the request
    const updateFields = [
      'dateOfBirth', 'contactNumber', 'address', 
      'medicalHistory', 'insuranceInfo', 'dentalHistory'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/patients/:id
// @desc    Delete a patient
// @access  Private (Admin only)
router.delete('/:id', auth.authenticate, async (req, res) => { // auth.isAdmin could be added here if needed, after auth.authenticate
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }

  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await patient.remove();
    res.json({ msg: 'Patient removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;