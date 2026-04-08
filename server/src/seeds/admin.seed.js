const config = require('../config');
const User = require('../models/User.model');
const Role = require('../models/Role.model');
const logger = require('../config/logger');

const seedAdmin = async () => {
  const superAdminRole = await Role.findOne({ name: 'super_admin' });
  if (!superAdminRole) {
    throw new Error('super_admin role not found. Please seed roles first.');
  }

  let user = await User.findOne({ email: config.admin.email, includeDeleted: true });
  if (!user) {
    user = new User({
      firstName: config.admin.firstName,
      lastName: config.admin.lastName,
      email: config.admin.email,
      passwordHash: config.admin.password,
      roles: [superAdminRole._id],
      isActive: true,
    });
    await user.save(); // triggers pre-save hook to hash password
  } else {
    user.roles = [superAdminRole._id];
    user.isActive = true;
    await user.save();
  }

  logger.info(`Seeded admin user: ${config.admin.email}`);
};

module.exports = seedAdmin;
