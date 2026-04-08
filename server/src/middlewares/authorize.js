const ApiError = require('../utils/ApiError');

// AND logic — user must have ALL specified permissions
const authorize = (...requiredPermissions) => (req, _res, next) => {
  if (!req.permissions) {
    throw new ApiError(401, 'Authentication required');
  }

  const hasAll = requiredPermissions.every((p) => req.permissions.includes(p));
  if (!hasAll) {
    throw new ApiError(403, 'Insufficient permissions');
  }
  next();
};

// OR logic — user must have at least ONE of the specified permissions
const authorizeAny = (...requiredPermissions) => (req, _res, next) => {
  if (!req.permissions) {
    throw new ApiError(401, 'Authentication required');
  }

  const hasAny = requiredPermissions.some((p) => req.permissions.includes(p));
  if (!hasAny) {
    throw new ApiError(403, 'Insufficient permissions');
  }
  next();
};

module.exports = { authorize, authorizeAny };
