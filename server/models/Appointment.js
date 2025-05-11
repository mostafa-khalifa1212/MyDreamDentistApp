// server/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  patientPhone: {
    type: String,
    required: [true, 'Patient phone is required']
  },
  treatments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Treatment',
    required: false
  }],
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in-clinic', 'cancelled'],
    default: 'pending'
  },
  colorCode: {
    type: String,
    default: '#4287f5' // Default blue color
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment: {
    total: {
      type: Number,
      default: 0
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    amountRemaining: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'other'],
      default: 'cash'
    },
    notes: String
  }
}, {
  timestamps: true
});

// Make sure end time is after start time
AppointmentSchema.pre('validate', function(next) {
  if (this.endTime <= this.startTime) {
    this.invalidate('endTime', 'End time must be after start time');
  }
  next();
});

// Round times to nearest 5 minute increment
AppointmentSchema.pre('save', function(next) {
  // Function to round to nearest 5 minutes
  const roundTo5Min = (date) => {
    const ms = 5 * 60 * 1000; // 5 minutes in milliseconds
    return new Date(Math.round(date.getTime() / ms) * ms);
  };
  
  this.startTime = roundTo5Min(new Date(this.startTime));
  this.endTime = roundTo5Min(new Date(this.endTime));
  next();
});

// Index for faster querying by date range
AppointmentSchema.index({ startTime: 1, endTime: 1 });

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
