const config = require('./config');
const logger = require('./config/logger');
const connectDB = require('./config/db');
const app = require('./app');
const { loadPermissions } = require('./permissions/permissionLoader');

const start = async () => {
  await connectDB();
  await loadPermissions();
  app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
