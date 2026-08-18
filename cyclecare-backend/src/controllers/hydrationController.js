const HydrationRecord = require('../models/HydrationRecord');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// Get today's date string YYYY-MM-DD
const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// @desc    Get today's hydration record
// @route   GET /api/hydration
// @access  Private
const getTodayHydration = async (req, res, next) => {
  try {
    const today = getTodayStr();
    let record = await HydrationRecord.findOne({ userId: req.user._id, date: today });

    if (!record) {
      // Create a new record for today with user's goal
      record = await HydrationRecord.create({
        userId: req.user._id,
        date: today,
        completedGlasses: 0,
        dailyGoal: req.user.dailyHydrationGoal || 8,
      });
    }

    return successResponse(res, "Today's hydration fetched.", { hydration: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update today's hydration
// @route   PUT /api/hydration
// @access  Private
const updateHydration = async (req, res, next) => {
  try {
    const { completedGlasses, dailyGoal } = req.body;
    const today = getTodayStr();

    let record = await HydrationRecord.findOne({ userId: req.user._id, date: today });

    if (!record) {
      record = new HydrationRecord({
        userId: req.user._id,
        date: today,
        completedGlasses: 0,
        dailyGoal: req.user.dailyHydrationGoal || 8,
      });
    }

    if (completedGlasses !== undefined) {
      const goal = dailyGoal || record.dailyGoal;
      record.completedGlasses = Math.min(Math.max(0, completedGlasses), goal);
    }
    if (dailyGoal !== undefined) {
      record.dailyGoal = dailyGoal;
    }

    await record.save();

    return successResponse(res, 'Hydration updated.', { hydration: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset today's hydration
// @route   POST /api/hydration/reset
// @access  Private
const resetHydration = async (req, res, next) => {
  try {
    const today = getTodayStr();
    const record = await HydrationRecord.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { completedGlasses: 0 },
      { new: true }
    );
    return successResponse(res, "Today's hydration reset.", { hydration: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hydration history (last 30 days)
// @route   GET /api/hydration/history
// @access  Private
const getHydrationHistory = async (req, res, next) => {
  try {
    const records = await HydrationRecord.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    return successResponse(res, 'Hydration history fetched.', { history: records });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTodayHydration, updateHydration, resetHydration, getHydrationHistory };
