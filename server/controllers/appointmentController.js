// server/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const createError = require('http-errors');
const moment = require('moment-timezone');

// Get appointments for a date range
exports.getAppointments = async (req, res, next) => {
  try {
    const { start, end, timezone = 'Africa/Cairo' } = req.query;
    
    // Validate date parameters
    if (!start || !end) {
      return next(createError(400, 'Start and end dates are required'));
    }
    
    // Convert dates to UTC for database query
    const startDate = moment.tz(start, timezone).toDate();
    const endDate = moment.tz(end, timezone).toDate();
    
    // Query appointments
    const appointments = await Appointment.find({
      $or: [
        { startTime: { $gte: startDate, $lte: endDate } },
        { endTime: { $gte: startDate, $lte: endDate } },
        { $and: [{ startTime: { $lte: startDate } }, { endTime: { $gte: endDate } }] }
      ]
    }).sort('startTime');
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// Create new appointment
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, procedure, startTime, endTime, notes, colorCode, payment } = req.body;
    const timezone = req.body.timezone || 'Africa/Cairo';
    
    // Convert times to UTC
    const utcStartTime = moment.tz(startTime, timezone).toDate();
    const utcEndTime = moment.tz(endTime, timezone).toDate();
    
    // Check for scheduling conflicts
    const conflictingAppointment = await Appointment.findOne({
      $and: [
        { _id: { $ne: req.params.id } }, // Exclude current appointment if updating
        {
          $or: [
            { startTime: { $lt: utcEndTime, $gte: utcStartTime } },
            { endTime: { $gt: utcStartTime, $lte: utcEndTime } },
            { $and: [{ startTime: { $lte: utcStartTime } }, { endTime: { $gte: utcEndTime } }] }
          ]
        }
      ]
    });
    
    if (conflictingAppointment) {
      return next(createError(409, 'This time slot conflicts with an existing appointment'));
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      procedure,
      startTime: utcStartTime,
      endTime: utcEndTime,
      notes,
      colorCode,
      createdBy: req.user.id,
      payment: payment || {}
    });
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment
exports.updateAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, procedure, startTime, endTime, notes, colorCode, status, payment } = req.body;
    const timezone = req.body.timezone || 'Africa/Cairo';
    
    // Find appointment
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(createError(404, 'Appointment not found'));
    }
    
    // Convert times to UTC if provided
    let utcStartTime, utcEndTime;
    if (startTime) utcStartTime = moment.tz(startTime, timezone).toDate();
    if (endTime) utcEndTime = moment.tz(endTime, timezone).toDate();
    
    // Check for scheduling conflicts if times are being updated
    if (utcStartTime && utcEndTime) {
      const conflictingAppointment = await Appointment.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          {
            $or: [
              { startTime: { $lt: utcEndTime, $gte: utcStartTime } },
              { endTime: { $gt: utcStartTime, $lte: utcEndTime } },
              { $and: [{ startTime: { $lte: utcStartTime } }, { endTime: { $gte: utcEndTime } }] }
            ]
          }
        ]
      });
      
      if (conflictingAppointment) {
        return next(createError(409, 'This time slot conflicts with an existing appointment'));
      }
    }
    
    // Update fields
    if (patientName) appointment.patientName = patientName;
    if (patientPhone) appointment.patientPhone = patientPhone;
    if (procedure) appointment.procedure = procedure;
    if (utcStartTime) appointment.startTime = utcStartTime;
    if (utcEndTime) appointment.endTime = utcEndTime;
    if (notes !== undefined) appointment.notes = notes;
    if (colorCode) appointment.colorCode = colorCode;
    if (status && ['scheduled', 'completed', 'cancelled', 'no-show'].includes(status)) {
      appointment.status = status;
    }
    
    // Update payment if provided
    if (payment) {
      if (payment.amount !== undefined) appointment.payment.amount = payment.amount;
      if (payment.status) appointment.payment.status = payment.status;
      if (payment.method) appointment.payment.method = payment.method;
      if (payment.notes !== undefined) appointment.payment.notes = payment.notes;
    }
    
    // Save updated appointment
    await appointment.save();
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(createError(404, 'Appointment not found'));
    }
    
    await appointment.remove();
    
    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get daily financial summary
exports.getDailyFinancial = async (req, res, next) => {
  try {
    const { date, timezone = 'Africa/Cairo' } = req.query;
    
    if (!date) {
      return next(createError(400, 'Date is required'));
    }
    
    // Convert date to start and end of day in UTC
    const startOfDay = moment.tz(date, timezone).startOf('day').toDate();
    const endOfDay = moment.tz(date, timezone).endOf('day').toDate();
    
    // Find appointments for the day
    const appointments = await Appointment.find({
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).sort('startTime');
    
    // Calculate financial summary
    const totalEarnings = appointments.reduce((sum, apt) => sum + (apt.payment.amount || 0), 0);
    const paidAppointments = appointments.filter(apt => apt.payment.status === 'paid').length;
    
    res.status(200).json({
      success: true,
      date: moment.tz(startOfDay, timezone).format('YYYY-MM-DD'),
      totalAppointments: appointments.length,
      totalEarnings,
      paidAppointments,
      pendingPayments: appointments.length - paidAppointments,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
