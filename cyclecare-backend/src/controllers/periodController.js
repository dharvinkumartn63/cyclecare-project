const { validationResult } = require('express-validator');
const PeriodRecord = require('../models/PeriodRecord');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get all period records for current user
// @route   GET /api/periods
// @access  Private
const getPeriods = async (req, res, next) => {
  try {
    const periods = await PeriodRecord.find({ userId: req.user._id }).sort({ startDate: -1 });
    return successResponse(res, 'Period records fetched.', { periods, count: periods.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a period record
// @route   POST /api/periods
// @access  Private
const createPeriod = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 422, errors.array());
    }

    const { startDate, endDate, notes } = req.body;

    // Validate end date
    if (endDate && new Date(endDate) < new Date(startDate)) {
      return errorResponse(res, 'End date cannot be before start date.', 422);
    }

    const period = await PeriodRecord.create({
      userId: req.user._id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      notes: notes || '',
    });

    // Update user's lastPeriodStartDate if this is the most recent
    const mostRecent = await PeriodRecord.findOne({ userId: req.user._id }).sort({ startDate: -1 });
    if (mostRecent && mostRecent._id.toString() === period._id.toString()) {
      await User.findByIdAndUpdate(req.user._id, { lastPeriodStartDate: period.startDate });
    }

    return successResponse(res, 'Period record saved successfully.', { period }, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a period record
// @route   PUT /api/periods/:id
// @access  Private
const updatePeriod = async (req, res, next) => {
  try {
    const period = await PeriodRecord.findById(req.params.id);

    if (!period) {
      return errorResponse(res, 'Period record not found.', 404);
    }

    // Ownership check
    if (period.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to edit this record.', 403);
    }

    const { startDate, endDate, notes } = req.body;

    const newStart = startDate ? new Date(startDate) : period.startDate;
    const newEnd = endDate ? new Date(endDate) : period.endDate;

    if (newEnd && newEnd < newStart) {
      return errorResponse(res, 'End date cannot be before start date.', 422);
    }

    period.startDate = newStart;
    period.endDate = newEnd;
    if (notes !== undefined) period.notes = notes;

    await period.save(); // pre-save hook recalculates duration

    return successResponse(res, 'Period record updated successfully.', { period });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a period record
// @route   DELETE /api/periods/:id
// @access  Private
const deletePeriod = async (req, res, next) => {
  try {
    const period = await PeriodRecord.findById(req.params.id);

    if (!period) {
      return errorResponse(res, 'Period record not found.', 404);
    }

    // Ownership check
    if (period.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized to delete this record.', 403);
    }

    await period.deleteOne();

    // Update lastPeriodStartDate in user profile
    const latestPeriod = await PeriodRecord.findOne({ userId: req.user._id }).sort({ startDate: -1 });
    await User.findByIdAndUpdate(req.user._id, {
      lastPeriodStartDate: latestPeriod ? latestPeriod.startDate : null,
    });

    return successResponse(res, 'Period record deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPeriods, createPeriod, updatePeriod, deletePeriod };
