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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dream-dentist', {

  
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // HTTP request logger
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/', routes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((req, res, next) => {
  next(createError(404, 'Endpoint not found'));
});

app.use((err, req, res, next) => {
  console.error(err);
  
  // Set locals, only providing error in development
  const statusCode = err.status || 500;
  const errorMessage = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Server error'
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;


