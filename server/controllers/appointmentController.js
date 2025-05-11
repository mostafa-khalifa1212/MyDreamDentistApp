// server/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const createError = require('http-errors');
const moment = require('moment-timezone');

// Get appointments for a date range
const getAppointments = async (req, res, next) => {
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
const createAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, treatments, startTime, endTime, notes, colorCode, status, payment } = req.body;
    const timezone = req.body.timezone || 'Africa/Cairo';

    // Validate required fields
    if (!patientName || !patientPhone || !startTime || !endTime) {
      return next(createError(400, 'Missing required fields'));
    }

    // Convert times to UTC
    const utcStartTime = moment.tz(startTime, timezone).toDate();
    const utcEndTime = moment.tz(endTime, timezone).toDate();

    // Check for scheduling conflicts
    const conflictingAppointment = await Appointment.findOne({
      $or: [
        { startTime: { $lt: utcEndTime, $gte: utcStartTime } },
        { endTime: { $gt: utcStartTime, $lte: utcEndTime } },
        { $and: [{ startTime: { $lte: utcStartTime } }, { endTime: { $gte: utcEndTime } }] }
      ]
    });
    if (conflictingAppointment) {
      return next(createError(409, 'This time slot conflicts with an existing appointment'));
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      treatments,
      startTime: utcStartTime,
      endTime: utcEndTime,
      notes,
      colorCode,
      status: status || 'pending',
      createdBy: req.user.id,
      payment: payment || {}
    });

    await appointment.populate('treatments').populate('createdBy');

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment
const updateAppointment = async (req, res, next) => {
  try {
    const { patientName, patientPhone, treatments, startTime, endTime, notes, colorCode, status, payment } = req.body;
    const timezone = req.body.timezone || 'Africa/Cairo';

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
        _id: { $ne: req.params.id },
        $or: [
          { startTime: { $lt: utcEndTime, $gte: utcStartTime } },
          { endTime: { $gt: utcStartTime, $lte: utcEndTime } },
          { $and: [{ startTime: { $lte: utcStartTime } }, { endTime: { $gte: utcEndTime } }] }
        ]
      });
      if (conflictingAppointment) {
        return next(createError(409, 'This time slot conflicts with an existing appointment'));
      }
    }

    // Update fields
    if (patientName) appointment.patientName = patientName;
    if (patientPhone) appointment.patientPhone = patientPhone;
    if (treatments) appointment.treatments = treatments;
    if (utcStartTime) appointment.startTime = utcStartTime;
    if (utcEndTime) appointment.endTime = utcEndTime;
    if (notes !== undefined) appointment.notes = notes;
    if (colorCode) appointment.colorCode = colorCode;
    if (status && ['pending', 'approved', 'in-clinic', 'cancelled'].includes(status)) {
      appointment.status = status;
    }
    // Update payment if provided
    if (payment) {
      if (payment.total !== undefined) appointment.payment.total = payment.total;
      if (payment.amountPaid !== undefined) appointment.payment.amountPaid = payment.amountPaid;
      if (payment.amountRemaining !== undefined) appointment.payment.amountRemaining = payment.amountRemaining;
      if (payment.status) appointment.payment.status = payment.status;
      if (payment.method) appointment.payment.method = payment.method;
      if (payment.notes !== undefined) appointment.payment.notes = payment.notes;
    }

    await appointment.save();
    await appointment.populate('treatments').populate('createdBy');

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Delete appointment
const deleteAppointment = async (req, res, next) => {
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
const getDailyFinancial = async (req, res, next) => {
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

// Get last clinic visit for a patient
const getLastClinicVisit = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Try to find by patientName (for MVP, as appointments use patientName)
    const lastAppointment = await Appointment.find({ patientName: id })
      .sort({ endTime: -1 })
      .limit(1);
    if (!lastAppointment.length) {
      return res.status(200).json({ lastVisit: 'First time' });
    }
    return res.status(200).json({ lastVisit: lastAppointment[0].endTime });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDailyFinancial,
  getLastClinicVisit
};
