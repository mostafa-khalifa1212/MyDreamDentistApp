// server/controllers/financialController.js
const Transaction = require('../models/Transaction');
const Appointment = require('../models/Appointment');
const createError = require('http-errors');
const moment = require('moment-timezone');

// Record a new transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { patientName, appointmentId, amount, type, paymentMethod, notes, date } = req.body;
    const timezone = req.body.timezone || 'Africa/Cairo';
    
    // Create transaction
    const transaction = await Transaction.create({
      patientName,
      appointmentId,
      amount,
      type,
      paymentMethod,
      notes,
      date: date ? moment.tz(date, timezone).toDate() : new Date(),
      createdBy: req.user.id
    });
    
    // If this is a payment for an appointment, update the appointment payment status
    if (appointmentId && (type === 'payment' || type === 'refund')) {
      const appointment = await Appointment.findById(appointmentId);
      
      if (appointment) {
        // For payment, add to the amount
        if (type === 'payment') {
          appointment.payment.amount = (appointment.payment.amount || 0) + amount;
        } 
        // For refund, subtract from the amount
        else if (type === 'refund') {
          appointment.payment.amount = Math.max(0, (appointment.payment.amount || 0) - amount);
        }
        
        // Update payment status based on the procedure cost (assumed to be stored elsewhere)
        // This is a simplified version; you might want to compare with a 'totalCost' field
        appointment.payment.method = paymentMethod;
        
        if (appointment.payment.amount <= 0) {
          appointment.payment.status = 'pending';
        } else {
          appointment.payment.status = 'paid';
        }
        
        await appointment.save();
      }
    }
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Get daily financial summary
exports.getDailySummary = async (req, res, next) => {
  try {
    const { date, timezone = 'Africa/Cairo' } = req.query;
    
    if (!date) {
      return next(createError(400, 'Date is required'));
    }
    
    // Convert date to start and end of day in UTC
    const startOfDay = moment.tz(date, timezone).startOf('day').toDate();
    const endOfDay = moment.tz(date, timezone).endOf('day').toDate();
    
    // Get all transactions for the day
    const transactions = await Transaction.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort('date');
    
    // Calculate daily totals
    const totalPayments = transactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalRefunds = transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalAdjustments = transactions
      .filter(t => t.type === 'adjustment')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = totalPayments - totalRefunds + totalAdjustments;
    
    // Get payment method breakdown
    const paymentMethodBreakdown = {
      cash: transactions
        .filter(t => t.paymentMethod === 'cash' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0),
      card: transactions
        .filter(t => t.paymentMethod === 'card' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0),
      insurance: transactions
        .filter(t => t.paymentMethod === 'insurance' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0),
      other: transactions
        .filter(t => t.paymentMethod === 'other' && t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0)
    };
    
    res.status(200).json({
      success: true,
      date: moment.tz(startOfDay, timezone).format('YYYY-MM-DD'),
      totalPayments,
      totalRefunds,
      totalAdjustments,
      netIncome,
      paymentMethodBreakdown,
      transactions
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly summary (aggregated by day)
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const { month, year, timezone = 'Africa/Cairo' } = req.query;
    
    if (!month || !year) {
      return next(createError(400, 'Month and year are required'));
    }
    
    // Convert to start and end of month in UTC
    const startOfMonth = moment.tz(`${year}-${month}-01`, timezone).startOf('month').toDate();
    const endOfMonth = moment.tz(`${year}-${month}-01`, timezone).endOf('month').toDate();
    
    // Aggregate daily summaries
    const dailySummaries = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $project: {
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$date', timezone }
          },
          amount: 1,
          type: 1
        }
      },
      {
        $group: {
          _id: {
            date: '$date',
            type: '$type'
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          transactions: {
            $push: {
              type: '$_id.type',
              amount: '$totalAmount'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Calculate monthly totals
    const monthlyTotal = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Format the response
    const totalsByType = {};
    monthlyTotal.forEach(item => {
      totalsByType[item._id] = item.totalAmount;
    });
    
    const netIncome = (totalsByType.payment || 0) - (totalsByType.refund || 0) + (totalsByType.adjustment || 0);
    
    res.status(200).json({
      success: true,
      month: parseInt(month),
      year: parseInt(year),
      totalPayments: totalsByType.payment || 0,
      totalRefunds: totalsByType.refund || 0,
      totalAdjustments: totalsByType.adjustment || 0,
      netIncome,
      dailySummaries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
