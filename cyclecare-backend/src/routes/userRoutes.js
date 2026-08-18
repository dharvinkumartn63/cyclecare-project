const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword, updateNotificationPreferences } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
    body('averageCycleLength').optional().isInt({ min: 15, max: 60 }).withMessage('Cycle length must be between 15 and 60 days.'),
    body('averagePeriodDuration').optional().isInt({ min: 1, max: 14 }).withMessage('Period duration must be between 1 and 14 days.'),
    body('dailyHydrationGoal').optional().isInt({ min: 1, max: 20 }).withMessage('Hydration goal must be between 1 and 20 glasses.'),
  ],
  updateProfile
);

router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain uppercase, lowercase, and a number.'),
    body('confirmNewPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('Passwords do not match.');
      return true;
    }),
  ],
  changePassword
);

router.put('/notifications', updateNotificationPreferences);

module.exports = router;
