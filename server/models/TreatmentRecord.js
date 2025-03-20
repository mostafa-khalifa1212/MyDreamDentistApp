const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreatmentRecordSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  dentist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  treatment: {
    type: Schema.Types.ObjectId,
    ref: 'Treatment',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String
  },
  toothNumbers: {
    type: [Number],
    default: []
  },
  images: {
    type: [String], // URLs to dental images
    default: []
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'follow-up-required'],
    default: 'planned'
  },
  cost: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid', 'insurance-pending', 'insurance-covered'],
    default: 'unpaid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
TreatmentRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TreatmentRecord', TreatmentRecordSchema);