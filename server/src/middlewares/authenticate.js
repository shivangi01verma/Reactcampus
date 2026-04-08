const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User.model');
const permissionCache = require('../permissions/permissionCache');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, config.jwt.secret);

  const user = await User.findById(decoded.sub).populate({
    path: 'roles',
    match: { isActive: true },
    populate: { path: 'permissions' },
  });

  if (!user || !user.isActive) {
    throw new ApiError(401, 'User not found or deactivated');
  }

  // Check cache first
  let permissions = permissionCache.getPermissions(user._id);
  if (!permissions) {
    const permSet = new Set();
    for (const role of user.roles) {
      if (!role) continue;
      for (const perm of role.permissions) {
        permSet.add(perm.key);
      }
    }
    permissions = [...permSet];
    permissionCache.setPermissions(user._id, permissions);
  }

  req.user = user;
  req.permissions = permissions;
  next();
});

// Optional auth — doesn't fail if no token, but populates user if present
const optionalAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.sub);
    if (user?.isActive) {
      req.user = user;
    }
  } catch {
    // Ignore auth errors for optional auth
  }
  next();
});

module.exports = { authenticate, optionalAuth };
