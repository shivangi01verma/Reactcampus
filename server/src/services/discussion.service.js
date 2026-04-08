const Discussion = require('../models/Discussion.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/**
 * Submit a new discussion comment.
 */
const submitDiscussion = async (data, userId = null) => {
  const discussion = await Discussion.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'discussion',
    resourceId: discussion._id,
    details: {
      college: discussion.college,
      course: discussion.course,
      exam: discussion.exam,
      authorName: discussion.authorName,
    },
  });

  return discussion;
};

/**
 * Get paginated list of discussions.
 */
const getDiscussions = async (query = {}, options = {}) => {
  const filter = {};

  if (query.college) filter.college = query.college;
  if (query.course) filter.course = query.course;
  if (query.exam) filter.exam = query.exam;
  if (query.status) filter.status = query.status;

  return paginate(Discussion, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || [
      { path: 'college', select: 'name slug' },
      { path: 'course', select: 'name slug' },
      { path: 'exam', select: 'name slug' },
      { path: 'user', select: 'firstName lastName' },
      { path: 'moderatedBy', select: 'firstName lastName' },
    ],
  });
};

/**
 * Get a single discussion by ID.
 */
const getDiscussionById = async (id) => {
  const discussion = await Discussion.findById(id)
    .populate('college', 'name slug')
    .populate('course', 'name slug')
    .populate('exam', 'name slug')
    .populate('user', 'firstName lastName')
    .populate('moderatedBy', 'firstName lastName');

  if (!discussion) {
    throw new ApiError(404, 'Discussion not found');
  }

  return discussion;
};

/**
 * Moderate a discussion (approve or reject).
 */
const moderateDiscussion = async (id, { status }, moderatedBy) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw new ApiError(404, 'Discussion not found');
  }

  const previousStatus = discussion.status;
  discussion.status = status;
  discussion.moderatedBy = moderatedBy;
  discussion.moderatedAt = new Date();
  await discussion.save();

  await AuditLog.create({
    user: moderatedBy,
    action: 'moderated',
    resource: 'discussion',
    resourceId: discussion._id,
    details: { from: previousStatus, to: status },
  });

  return discussion;
};

/**
 * Delete a discussion.
 */
const deleteDiscussion = async (id, userId = null) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw new ApiError(404, 'Discussion not found');
  }

  await discussion.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'discussion',
    resourceId: discussion._id,
    details: {
      college: discussion.college,
      course: discussion.course,
      exam: discussion.exam,
      authorName: discussion.authorName,
    },
  });

  return discussion;
};

module.exports = {
  submitDiscussion,
  getDiscussions,
  getDiscussionById,
  moderateDiscussion,
  deleteDiscussion,
};
