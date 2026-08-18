const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 422, errors.array());
    }

    const { name, email, userId, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    // Check if userId already exists
    const userIdExists = await User.findOne({ userId });
    if (userIdExists) {
      return errorResponse(res, 'User ID already exists. Please choose a different one.', 409);
    }

    // Create user (passwordHash stores the plain password, pre-save hook hashes it)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      userId,
      passwordHash: password,
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      'Account created successfully! Welcome to CycleCare.',
      { token, user },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, errors.array()[0].msg, 422, errors.array());
    }

    const { identifier, password } = req.body; // identifier = userId or email

    // Find user by email or userId
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { userId: identifier },
      ],
    }).select('+passwordHash');

    if (!user) {
      return errorResponse(res, 'Invalid credentials. Please check your User ID/email and password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials. Please check your User ID/email and password.', 401);
    }

    const token = generateToken(user._id);
    const userObj = user.toJSON(); // removes passwordHash

    return successResponse(res, 'Logged in successfully.', { token, user: userObj });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return successResponse(res, 'User fetched successfully.', { user: req.user });
};

// @desc    Logout (client-side clears token, but we confirm here)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  return successResponse(res, 'Logged out successfully.');
};

module.exports = { register, login, getMe, logout };
