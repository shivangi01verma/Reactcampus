const User = require('../models/User.model');
const Role = require('../models/Role.model');
const Permission = require('../models/Permission.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const permissionCache = require('../permissions/permissionCache');

/**
 * Check if a user has the super_admin role.
 */
const _isSuperAdmin = async (userId) => {
  const user = await User.findById(userId).populate('roles', 'name');
  return user?.roles?.some((r) => r.name === 'super_admin') || false;
};

/**
 * Create a new user.
 */
const createUser = async ({ firstName, lastName, email, password, roles }, userId = null) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
    roles: roles || [],
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'user',
    resourceId: user._id,
    details: { firstName, lastName, email, roles: roles || [] },
  });

  return user;
};

/**
 * Get paginated list of users.
 */
const getUsers = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (typeof query.isActive === 'boolean') {
    filter.isActive = query.isActive;
  }

  if (query.role) {
    filter.roles = query.role;
  }

  return paginate(User, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || { path: 'roles', select: 'name displayName' },
  });
};

/**
 * Get a single user by ID.
 */
const getUserById = async (id) => {
  const user = await User.findById(id).populate({
    path: 'roles',
    populate: { path: 'permissions', select: 'key resource action' },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

/**
 * Update user fields (not roles or password).
 */
const updateUser = async (id, data, userId = null) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Only allow safe fields
  const allowedFields = ['firstName', 'lastName', 'email'];
  const updates = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updates[key] = data[key];
    }
  }

  // Check for duplicate email when email is being changed
  if (updates.email && updates.email !== user.email) {
    const existing = await User.findOne({ email: updates.email, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, 'A user with this email already exists');
    }
  }

  if (data.password) {
    updates.passwordHash = data.password;
  }

  Object.assign(user, updates);
  await user.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'user',
    resourceId: user._id,
    details: { updatedFields: Object.keys(updates) },
  });

  return user;
};

/**
 * Soft-delete a user.
 */
const deleteUser = async (id, userId = null) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent users from deleting themselves
  if (userId && id.toString() === userId.toString()) {
    throw new ApiError(403, 'You cannot delete your own account');
  }

  // Prevent anyone from deleting a super_admin
  const targetIsSuperAdmin = await _isSuperAdmin(id);
  if (targetIsSuperAdmin) {
    throw new ApiError(403, 'Super admin account cannot be deleted');
  }

  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  permissionCache.invalidate(user._id);

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'user',
    resourceId: user._id,
    details: { email: user.email },
  });

  return user;
};

/**
 * Activate or deactivate a user.
 */
const activateUser = async (id, isActive, userId = null) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent users from deactivating themselves
  if (userId && id.toString() === userId.toString()) {
    throw new ApiError(403, 'You cannot change your own activation status');
  }

  // Prevent anyone from deactivating a super_admin
  const targetIsSuperAdmin = await _isSuperAdmin(id);
  if (targetIsSuperAdmin) {
    throw new ApiError(403, 'Super admin account cannot be deactivated');
  }

  user.isActive = typeof isActive === 'boolean' ? isActive : !user.isActive;
  await user.save();

  if (!user.isActive) {
    permissionCache.invalidate(user._id);
  }

  await AuditLog.create({
    user: userId,
    action: user.isActive ? 'activated' : 'deactivated',
    resource: 'user',
    resourceId: user._id,
    details: { isActive: user.isActive },
  });

  return user;
};

/**
 * Assign roles to a user with privilege-escalation prevention.
 * The requesting user must already possess every permission contained
 * in the roles being assigned.
 */
const assignRoles = async (targetUserId, roleIds, requestingUserPermissions, requestingUserId = null) => {
  const user = await User.findById(targetUserId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Prevent anyone other than the super_admin themselves from changing super_admin roles
  const targetIsSuperAdmin = await _isSuperAdmin(targetUserId);
  if (targetIsSuperAdmin && (!requestingUserId || targetUserId.toString() !== requestingUserId.toString())) {
    throw new ApiError(403, 'Only the super admin can modify their own roles');
  }

  // Gather all permission keys for the roles being assigned
  const permissions = await Permission.find({
    _id: {
      $in: await _getPermissionIdsForRoles(roleIds),
    },
  });

  const requiredKeys = permissions.map((p) => p.key);
  const callerPermissions = new Set(requestingUserPermissions);

  for (const key of requiredKeys) {
    if (!callerPermissions.has(key)) {
      throw new ApiError(
        403,
        `Privilege escalation denied: you do not have the '${key}' permission`
      );
    }
  }

  user.roles = roleIds;
  await user.save();

  // Invalidate cached permissions for the target user
  permissionCache.invalidate(targetUserId);

  await AuditLog.create({
    user: requestingUserId,
    action: 'roles_assigned',
    resource: 'user',
    resourceId: user._id,
    details: { roleIds },
  });

  return user;
};

/**
 * Helper: get all permission ObjectIds associated with a list of role IDs.
 */
const _getPermissionIdsForRoles = async (roleIds) => {
  const Role = require('../models/Role.model');
  const roles = await Role.find({ _id: { $in: roleIds } }).select('permissions');
  const ids = new Set();
  for (const role of roles) {
    for (const pid of role.permissions) {
      ids.add(pid.toString());
    }
  }
  return [...ids];
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  assignRoles,
};
