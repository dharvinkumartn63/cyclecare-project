const PeriodRecord = require('../models/PeriodRecord');
const { calculatePrediction } = require('../services/predictionService');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get cycle prediction for current user
// @route   GET /api/prediction
// @access  Private
const getPrediction = async (req, res, next) => {
  try {
    const periodRecords = await PeriodRecord.find({ userId: req.user._id }).sort({ startDate: 1 });
    const prediction = calculatePrediction(periodRecords, req.user);
    return successResponse(res, 'Prediction calculated.', { prediction });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cycle statistics
// @route   GET /api/cycles
// @access  Private
const getCycleStats = async (req, res, next) => {
  try {
    const records = await PeriodRecord.find({ userId: req.user._id }).sort({ startDate: 1 });

    if (records.length === 0) {
      return successResponse(res, 'No cycle data available.', {
        cycles: [],
        averageCycleLength: null,
        averagePeriodDuration: null,
        totalRecords: 0,
      });
    }

    // Calculate cycle lengths
    const cycles = [];
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      let cycleLength = null;
      if (i > 0) {
        const diff = new Date(rec.startDate) - new Date(records[i - 1].startDate);
        cycleLength = Math.round(diff / (1000 * 60 * 60 * 24));
      }
      cycles.push({
        index: i + 1,
        startDate: rec.startDate,
        endDate: rec.endDate,
        duration: rec.duration,
        cycleLength,
        month: new Date(rec.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    }

    // Averages
    const durations = records.filter((r) => r.duration).map((r) => r.duration);
    const cycleLengths = cycles.filter((c) => c.cycleLength).map((c) => c.cycleLength);

    const avgDuration = durations.length
      ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
      : null;

    const avgCycleLength = cycleLengths.length
      ? Math.round((cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) * 10) / 10
      : null;

    return successResponse(res, 'Cycle statistics fetched.', {
      cycles,
      averageCycleLength: avgCycleLength,
      averagePeriodDuration: avgDuration,
      totalRecords: records.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPrediction, getCycleStats };
