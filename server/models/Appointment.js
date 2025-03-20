// server/models/Appointment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  dentist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Dentist is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 30
  },
  type: {
    type: String,
    enum: ['checkup', 'cleaning', 'filling', 'extraction', 'root-canal', 'crown', 'consultation', 'other'],
    required: [true, 'Appointment type is required']
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  colorCode: {
    type: String,
    default: '#4287f5' // Default blue color
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment: {
    amount: {
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
  
  // Calculate duration based on start and end time
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime.getTime() - this.startTime.getTime();
    this.duration = Math.round(durationMs / (60 * 1000)); // Convert to minutes
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
