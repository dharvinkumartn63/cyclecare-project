const { errorResponse } = require('../utils/responseHelper');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID.';
  }

  // Never expose stack traces to users in production
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  return errorResponse(res, message, statusCode);
};

// 404 handler
const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
};

module.exports = { errorHandler, notFound };
