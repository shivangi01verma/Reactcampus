const Role = require('../models/Role.model');
const Permission = require('../models/Permission.model');
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const permissionCache = require('../permissions/permissionCache');

/**
 * Create a new role.
 */
const createRole = async (data, userId = null) => {
  const existing = await Role.findOne({ name: data.name });
  if (existing) {
    throw new ApiError(409, 'A role with this name already exists');
  }

  const role = await Role.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'role',
    resourceId: role._id,
    details: { name: role.name, displayName: role.displayName },
  });

  return role;
};

/**
 * Get paginated list of roles.
 */
const getRoles = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { displayName: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (typeof query.isActive === 'boolean') {
    filter.isActive = query.isActive;
  }

  return paginate(Role, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || { path: 'permissions', select: 'key resource action description' },
  });
};

/**
 * Get a single role by ID.
 */
const getRoleById = async (id) => {
  const role = await Role.findById(id).populate('permissions');
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  return role;
};

/**
 * Update a role (cannot change system roles' name or isSystem flag).
 */
const updateRole = async (id, data, userId = null) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  if (role.isSystem && data.name && data.name !== role.name) {
    throw new ApiError(403, 'Cannot rename a system role');
  }

  const allowedFields = ['displayName', 'isActive'];
  if (!role.isSystem) {
    allowedFields.push('name');
  }

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      role[key] = data[key];
    }
  }

  await role.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'role',
    resourceId: role._id,
    details: { updatedFields: Object.keys(data) },
  });

  return role;
};

/**
 * Delete a role. System roles cannot be deleted.
 */
const deleteRole = async (id, userId = null) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  if (role.isSystem) {
    throw new ApiError(403, 'System roles cannot be deleted');
  }

  await role.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'role',
    resourceId: role._id,
    details: { name: role.name },
  });

  return role;
};

/**
 * Assign permissions to a role with privilege-escalation prevention.
 * The requesting user must already possess every permission being assigned.
 */
const assignPermissions = async (roleId, permissionIds, requestingUserPermissions, userId = null) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  // Fetch full permission docs to check keys
  const permissions = await Permission.find({ _id: { $in: permissionIds } });

  if (permissions.length !== permissionIds.length) {
    throw new ApiError(400, 'One or more permission IDs are invalid');
  }

  const callerPerms = new Set(requestingUserPermissions);
  for (const perm of permissions) {
    if (!callerPerms.has(perm.key)) {
      throw new ApiError(
        403,
        `Privilege escalation denied: you do not have the '${perm.key}' permission`
      );
    }
  }

  role.permissions = permissionIds;
  await role.save();

  // Invalidate cache for all users who have this role
  const affectedUsers = await User.find({ roles: roleId }).select('_id');
  for (const u of affectedUsers) {
    permissionCache.invalidate(u._id);
  }

  await AuditLog.create({
    user: userId,
    action: 'permissions_assigned',
    resource: 'role',
    resourceId: role._id,
    details: { permissionIds },
  });

  return role.populate('permissions');
};

module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissions,
};
