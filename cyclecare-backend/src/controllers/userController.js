const { validationResult } = require('express-validator');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  return successResponse(res, 'Profile fetched.', { user: req.user });
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 422, errors.array());
    }

    const allowedFields = [
      'name',
      'avatar',
      'dateOfBirth',
      'averageCycleLength',
      'averagePeriodDuration',
      'lastPeriodStartDate',
      'dailyHydrationGoal',
      'profileSetupComplete',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Profile updated successfully.', { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/user/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 422, errors.array());
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+passwordHash');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect.', 400);
    }

    user.passwordHash = newPassword; // pre-save hook will hash it
    await user.save();

    return successResponse(res, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification preferences
// @route   PUT /api/user/notifications
// @access  Private
const updateNotificationPreferences = async (req, res, next) => {
  try {
    const { periodReminder, hydrationReminder, cycleUpdateReminder } = req.body;
    const prefs = {};
    if (periodReminder !== undefined) prefs['notificationPreferences.periodReminder'] = periodReminder;
    if (hydrationReminder !== undefined) prefs['notificationPreferences.hydrationReminder'] = hydrationReminder;
    if (cycleUpdateReminder !== undefined) prefs['notificationPreferences.cycleUpdateReminder'] = cycleUpdateReminder;

    const user = await User.findByIdAndUpdate(req.user._id, { $set: prefs }, { new: true });
    return successResponse(res, 'Notification preferences updated.', { notificationPreferences: user.notificationPreferences });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, updateNotificationPreferences };
