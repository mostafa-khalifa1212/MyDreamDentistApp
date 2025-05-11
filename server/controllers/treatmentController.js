const Treatment = require('../models/Treatment');
const createError = require('http-errors');

// Create a new treatment
exports.createTreatment = async (req, res, next) => {
  try {
    const { name, cost, description, duration, category } = req.body;
    if (!name || cost === undefined) {
      return next(createError(400, 'Name and cost are required'));
    }
    const treatment = await Treatment.create({ name, cost, description, duration, category });
    res.status(201).json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
};

// Get all treatments
exports.getTreatments = async (req, res, next) => {
  try {
    const treatments = await Treatment.find().sort('name');
    res.status(200).json({ success: true, data: treatments });
  } catch (error) {
    next(error);
  }
};

// Update a treatment
exports.updateTreatment = async (req, res, next) => {
  try {
    const { name, cost, description, duration, category } = req.body;
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return next(createError(404, 'Treatment not found'));
    }
    if (name) treatment.name = name;
    if (cost !== undefined) treatment.cost = cost;
    if (description !== undefined) treatment.description = description;
    if (duration !== undefined) treatment.duration = duration;
    if (category !== undefined) treatment.category = category;
    await treatment.save();
    res.status(200).json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
};

// Delete a treatment
exports.deleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) {
      return next(createError(404, 'Treatment not found'));
    }
    await treatment.remove();
    res.status(200).json({ success: true, message: 'Treatment deleted' });
  } catch (error) {
    next(error);
  }
}; 