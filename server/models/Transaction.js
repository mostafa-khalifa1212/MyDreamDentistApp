// server/models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required']
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  type: {
    type: String,
    enum: ['payment', 'refund', 'adjustment'],
    required: [true, 'Transaction type is required']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'insurance', 'other'],
    required: [true, 'Payment method is required']
  },
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
TransactionSchema.index({ date: 1 });
TransactionSchema.index({ appointmentId: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
