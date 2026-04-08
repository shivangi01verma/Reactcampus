const ContentAssignment = require('../models/ContentAssignment.model');
const College = require('../models/College.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/**
 * Create a new content assignment.
 */
const createAssignment = async (data, userId) => {
  const assignment = await ContentAssignment.create({
    ...data,
    assignedBy: userId,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'content-assignment',
    resourceId: assignment._id,
    details: { contentType: data.contentType, scope: data.scope, user: data.user },
  });

  return assignment.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'assignedBy', select: 'firstName lastName' },
  ]);
};

/**
 * Get paginated list of content assignments.
 */
const getAssignments = async (query = {}, options = {}) => {
  const filter = {};

  if (query.contentType) {
    filter.contentType = query.contentType;
  }

  if (query.user) {
    filter.user = query.user;
  }

  return paginate(ContentAssignment, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    populate: [
      { path: 'user', select: 'firstName lastName email' },
      { path: 'assignedBy', select: 'firstName lastName' },
    ],
  });
};

/**
 * Get a single assignment by ID.
 */
const getAssignmentById = async (id) => {
  const assignment = await ContentAssignment.findById(id)
    .populate('user', 'firstName lastName email')
    .populate('assignedBy', 'firstName lastName');

  if (!assignment) {
    throw new ApiError(404, 'Content assignment not found');
  }

  return assignment;
};

/**
 * Update an assignment.
 */
const updateAssignment = async (id, data, userId) => {
  const assignment = await ContentAssignment.findById(id);
  if (!assignment) {
    throw new ApiError(404, 'Content assignment not found');
  }

  Object.assign(assignment, data);
  await assignment.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'content-assignment',
    resourceId: assignment._id,
    details: { updatedFields: Object.keys(data) },
  });

  return assignment.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'assignedBy', select: 'firstName lastName' },
  ]);
};

/**
 * Delete an assignment (hard delete).
 */
const deleteAssignment = async (id, userId) => {
  const assignment = await ContentAssignment.findById(id);
  if (!assignment) {
    throw new ApiError(404, 'Content assignment not found');
  }

  await assignment.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'content-assignment',
    resourceId: id,
    details: { contentType: assignment.contentType, user: assignment.user },
  });
};

/**
 * Resolve assigned content IDs for a user, content type, and action.
 * Returns a merged unique array of ObjectIds the user has access to.
 */
const resolveAssignedContentIds = async (userId, contentType, action) => {
  const assignments = await ContentAssignment.find({
    user: userId,
    contentType,
    actions: action,
  });

  const idSet = new Set();

  const individualIds = [];
  const allCategories = [];

  for (const assignment of assignments) {
    if (assignment.scope === 'individual' && assignment.contentId) {
      individualIds.push(assignment.contentId);
      idSet.add(assignment.contentId.toString());
    } else if (assignment.scope === 'category' && assignment.categories.length > 0) {
      allCategories.push(...assignment.categories);
    }
  }

  if (allCategories.length > 0 && contentType === 'college') {
    const colleges = await College.find({
      categories: { $in: allCategories },
    }).select('_id');

    for (const college of colleges) {
      if (!idSet.has(college._id.toString())) {
        individualIds.push(college._id);
        idSet.add(college._id.toString());
      }
    }
  }

  return individualIds;
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  resolveAssignedContentIds,
};
