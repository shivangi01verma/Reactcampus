const Permission = require('../models/Permission.model');
const Role = require('../models/Role.model');
const logger = require('../config/logger');

const ROLE_DEFINITIONS = [
  {
    name: 'super_admin',
    displayName: 'Super Admin',
    isSystem: true,
    // All permissions
    permissionKeys: null,
  },
  {
    name: 'content_manager',
    displayName: 'Content Manager',
    isSystem: true,
    permissionKeys: [
      // College management
      'college:create', 'college:read', 'college:update', 'college:delete',
      'college:publish', 'college:manage-courses', 'college:manage-exams',
      // Course management
      'course:create', 'course:read', 'course:update', 'course:delete',
      // Exam management
      'exam:create', 'exam:read', 'exam:update', 'exam:delete',
      // Content section management
      'content-section:create', 'content-section:read', 'content-section:update', 'content-section:delete',
      // Review management
      'review:read', 'review:moderate', 'review:delete',
      // SEO management
      'seo:create', 'seo:read', 'seo:update', 'seo:delete',
    ],
  },
  {
    name: 'lead_manager',
    displayName: 'Lead Manager',
    isSystem: true,
    permissionKeys: [
      // Lead management
      'lead:create', 'lead:read', 'lead:update', 'lead:delete',
      'lead:assign', 'lead:manage', 'lead:export', 'lead:view-stats',
      // Form submissions
      'form:view-submissions',
      // Dashboard
      'dashboard:view',
    ],
  },
  {
    name: 'counselor',
    displayName: 'Counselor',
    isSystem: true,
    permissionKeys: [
      'lead:read',
      'lead:update',
      'lead:manage',
      'lead:create',
    ],
  },
];

const seedRoles = async () => {
  // Get all permissions to map keys to ObjectIds
  const allPermissions = await Permission.find({});
  const permKeyToId = {};
  for (const perm of allPermissions) {
    permKeyToId[perm.key] = perm._id;
  }

  for (const roleDef of ROLE_DEFINITIONS) {
    let permissionIds;

    if (roleDef.permissionKeys === null) {
      // All permissions (super_admin)
      permissionIds = allPermissions.map((p) => p._id);
    } else {
      permissionIds = roleDef.permissionKeys
        .map((key) => permKeyToId[key])
        .filter(Boolean);
    }

    await Role.findOneAndUpdate(
      { name: roleDef.name },
      {
        name: roleDef.name,
        displayName: roleDef.displayName,
        isSystem: roleDef.isSystem,
        permissions: permissionIds,
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  logger.info(`Seeded ${ROLE_DEFINITIONS.length} roles`);
};

module.exports = seedRoles;
