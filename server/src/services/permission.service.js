const Permission = require('../models/Permission.model');

/**
 * Get all permissions, optionally filtered by group or resource.
 */
const getPermissions = async (query = {}) => {
  const filter = {};

  if (query.group) {
    filter.group = query.group;
  }

  if (query.resource) {
    filter.resource = query.resource;
  }

  if (query.search) {
    filter.$or = [
      { key: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const permissions = await Permission.find(filter).sort({ group: 1, resource: 1, action: 1 });
  return permissions;
};

module.exports = {
  getPermissions,
};
