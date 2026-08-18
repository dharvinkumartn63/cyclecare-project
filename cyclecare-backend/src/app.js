require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const periodRoutes = require('./routes/periodRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const cycleRoutes = require('./routes/cycleRoutes');
const hydrationRoutes = require('./routes/hydrationRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimiter');

// Connect to MongoDB
connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl/Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev friendly
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// General rate limiting
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CycleCare API is running 🌸', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/hydration', hydrationRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
