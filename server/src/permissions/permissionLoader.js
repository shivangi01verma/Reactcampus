const Permission = require('../models/Permission.model');
const Role = require('../models/Role.model');
const User = require('../models/User.model');
const permissionCache = require('./permissionCache');
const { PERMISSIONS } = require('./permissionRegistry');
const logger = require('../config/logger');

const loadPermissions = async () => {
  for (const perm of PERMISSIONS) {
    await Permission.findOneAndUpdate(
      { key: perm.key },
      perm,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  logger.info(`Permissions synced: ${PERMISSIONS.length} total`);

  // Always keep super_admin role in sync with all permissions
  const allPermissions = await Permission.find({}).select('_id');
  const allPermissionIds = allPermissions.map((p) => p._id);
  const superAdmin = await Role.findOne({ name: 'super_admin' });

  if (superAdmin) {
    const currentCount = superAdmin.permissions.length;
    if (currentCount !== allPermissionIds.length) {
      superAdmin.permissions = allPermissionIds;
      await superAdmin.save();

      // Invalidate permission cache for all super_admin users
      const affectedUsers = await User.find({ roles: superAdmin._id }).select('_id');
      for (const u of affectedUsers) {
        permissionCache.invalidate(u._id);
      }
      logger.info(`Super admin role updated: ${currentCount} → ${allPermissionIds.length} permissions`);
    }
  }
};

module.exports = { loadPermissions };
