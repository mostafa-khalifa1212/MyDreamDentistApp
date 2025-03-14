// server/validators/appointmentValidator.js
const { body } = require('express-validator');

exports.createAppointmentValidator = [
  body('patientName')
    .not()
    .isEmpty()
    .withMessage('Patient name is required'),
  body('patientPhone')
    .not()
    .isEmpty()
    .withMessage('Patient phone is required'),
  body('procedure')
    .not()
    .isEmpty()
    .withMessage('Procedure is required'),
  body('startTime')
    .not()
    .isEmpty()
    .withMessage('Start time is required'),
  body('endTime')
    .not()
    .isEmpty()
    .withMessage('End time is required'),
];
