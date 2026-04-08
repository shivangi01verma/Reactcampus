const Permission = require('../models/Permission.model');
const { PERMISSIONS } = require('../permissions/permissionRegistry');
const logger = require('../config/logger');

const seedPermissions = async () => {
  for (const perm of PERMISSIONS) {
    await Permission.findOneAndUpdate(
      { key: perm.key },
      perm,
      { upsert: true, setDefaultsOnInsert: true }
    );
  }
  logger.info(`Seeded ${PERMISSIONS.length} permissions`);
};

module.exports = seedPermissions;
