// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const createError = require('http-errors');
const path = require('path');
require('dotenv').config();

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamDentistDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet(), compression(), morgan('dev'), cors(), express.json(), express.urlencoded({ extended: true }));

// API Routes
app.use('/', routes);

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/build', 'index.html')));
}

const { initializeAdmin } = require('./controllers/authController');

// After MongoDB connection is established
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    initializeAdmin(); // Create admin user if doesn't exist
  })
  .catch((err) => console.error('MongoDB connection error:', err));
  
// Error handling
app.use((req, res, next) => next(createError(404, 'Endpoint not found')));
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Server error' : err.message;
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;


