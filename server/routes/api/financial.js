// Example: server/routes/api/financial.js
const express = require('express');
const router = express.Router();
const financialController = require('../../controllers/financialController');
const { authenticate } = require('../../middleware/auth');

// Protect all financial routes
router.use(authenticate);

// Define the financial routes
router.post('/transactions', financialController.createTransaction);
router.get('/summary/daily', financialController.getDailySummary);
router.get('/summary/monthly', financialController.getMonthlySummary);

// Export the router directly
module.exports = router;
