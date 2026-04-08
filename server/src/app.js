const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Security
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Trust proxy for IP extraction
app.set('trust proxy', 1);

// Routes
app.use('/api/v1', require('./routes'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((_req, _res, next) => {
  const ApiError = require('./utils/ApiError');
  next(new ApiError(404, 'Route not found'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
