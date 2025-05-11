const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const treatmentController = require('../controllers/treatmentController');

// All endpoints require authentication
router.post('/', authenticate, treatmentController.createTreatment);
router.get('/', authenticate, treatmentController.getTreatments);
router.put('/:id', authenticate, treatmentController.updateTreatment);
router.delete('/:id', authenticate, treatmentController.deleteTreatment);

module.exports = router; 