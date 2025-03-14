// server/validators/userValidator.js
const { body } = require('express-validator');

exports.registerValidator = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('email')
    .isEmail()
    .withMessage('Enter a valid email address'),
  body('phoneNumber')
    .matches(/^(\+20|00201)[0-9]{9}$|^(\+966|00966)[0-9]{9}$|^(\+971|00971)[0-9]{9}$/)
    .withMessage('Enter a valid phone number for Egypt, Saudi Arabia, or UAE'),
];
