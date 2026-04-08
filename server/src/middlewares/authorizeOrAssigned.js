const ApiError = require('../utils/ApiError');
const { resolveAssignedContentIds } = require('../services/contentAssignment.service');
const asyncHandler = require('./asyncHandler');

/**
 * Middleware that checks global permission first, falls back to assignment-based access.
 * Sets req.assignmentScope to 'global' or 'assigned' and req.assignedContentIds.
 */
const authorizeOrAssigned = (globalPerm, assignedPerm, contentType, action) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.permissions) {
      throw new ApiError(401, 'Authentication required');
    }

    // Check global permission first
    if (req.permissions.includes(globalPerm)) {
      req.assignmentScope = 'global';
      return next();
    }

    // Check assigned permission
    if (req.permissions.includes(assignedPerm)) {
      req.assignmentScope = 'assigned';
      req.assignedContentIds = await resolveAssignedContentIds(
        req.user._id,
        contentType,
        action
      );
      return next();
    }

    throw new ApiError(403, 'Insufficient permissions');
  });

/**
 * Middleware for single-item routes. Checks if the item ID is in assignedContentIds.
 */
const checkAssignedItem = (paramName = 'id') => (req, _res, next) => {
  if (req.assignmentScope === 'global') {
    return next();
  }

  if (req.assignmentScope === 'assigned') {
    const itemId = req.params[paramName];
    const hasAccess = req.assignedContentIds.some(
      (id) => id.toString() === itemId
    );

    if (!hasAccess) {
      throw new ApiError(403, 'You do not have access to this content');
    }

    return next();
  }

  throw new ApiError(403, 'Insufficient permissions');
};

module.exports = { authorizeOrAssigned, checkAssignedItem };
