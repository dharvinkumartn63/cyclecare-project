const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Full name is required.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('userId')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('User ID must be 3–30 characters.')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('User ID can only contain letters, numbers, and underscores.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters.')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match.');
      return true;
    }),
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('identifier').trim().notEmpty().withMessage('User ID or email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
