const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

const connectDB = async () => {
  const conn = await mongoose.connect(config.mongoUri);
  logger.info(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
