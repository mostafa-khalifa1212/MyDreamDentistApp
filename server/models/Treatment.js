const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreatmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false // Not required for MVP
  },
  duration: {
    type: Number, // in minutes
    required: false // Not required for MVP
  },
  category: {
    type: String,
    enum: ['preventive', 'restorative', 'cosmetic', 'orthodontic', 'surgical', 'emergency'],
    required: false // Not required for MVP
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
TreatmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Treatment', TreatmentSchema);