const College = require('../models/College.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new college.
 */
const createCollege = async (data, userId) => {
  const slug = await ensureUniqueSlug(College, data.name);

  const college = await College.create({
    ...data,
    slug,
    createdBy: userId,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'college',
    resourceId: college._id,
    details: { name: college.name, slug: college.slug },
  });

  return college;
};

/**
 * Get paginated list of colleges.
 */
const getColleges = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.city) {
    filter['location.city'] = { $regex: query.city, $options: 'i' };
  }

  if (query.state) {
    filter['location.state'] = { $regex: query.state, $options: 'i' };
  }

  if (options.assignedContentIds) {
    filter._id = { $in: options.assignedContentIds };
  }

  return paginate(College, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || [
      { path: 'courses', select: 'name slug level' },
      { path: 'exams', select: 'name slug' },
    ],
  });
};

/**
 * Get a single college by ID.
 */
const getCollegeById = async (id) => {
  const college = await College.findById(id)
    .populate('courses', 'name slug level duration')
    .populate('exams', 'name slug examType')
    .populate('createdBy', 'firstName lastName');

  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  return college;
};

/**
 * Get a single college by slug.
 */
const getCollegeBySlug = async (slug) => {
  const college = await College.findOne({ slug })
    .populate('courses', 'name slug level duration')
    .populate('exams', 'name slug examType')
    .populate('createdBy', 'firstName lastName');

  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  return college;
};

/**
 * Update a college.
 */
const updateCollege = async (id, data, userId = null) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  // Re-generate slug if name changes
  if (data.name && data.name !== college.name) {
    data.slug = await ensureUniqueSlug(College, data.name, college._id);
  }

  Object.assign(college, data);
  await college.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'college',
    resourceId: college._id,
    details: { updatedFields: Object.keys(data) },
  });

  return college;
};

/**
 * Soft-delete a college.
 */
const deleteCollege = async (id, userId = null) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  college.deletedAt = new Date();
  await college.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'college',
    resourceId: college._id,
    details: { name: college.name },
  });

  return college;
};

/**
 * Publish or change the status of a college.
 */
const publishCollege = async (id, status, userId = null) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  const previousStatus = college.status;
  college.status = status;
  await college.save();

  await AuditLog.create({
    user: userId,
    action: 'status_changed',
    resource: 'college',
    resourceId: college._id,
    details: { from: previousStatus, to: status },
  });

  return college;
};

/**
 * Manage courses associated with a college.
 */
const manageCourses = async (id, courseIds, userId = null) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  college.courses = courseIds;
  await college.save();

  await AuditLog.create({
    user: userId,
    action: 'courses_updated',
    resource: 'college',
    resourceId: college._id,
    details: { courseIds },
  });

  return college.populate('courses', 'name slug level');
};

/**
 * Manage exams associated with a college.
 */
const manageExams = async (id, examIds, userId = null) => {
  const college = await College.findById(id);
  if (!college) {
    throw new ApiError(404, 'College not found');
  }

  college.exams = examIds;
  await college.save();

  await AuditLog.create({
    user: userId,
    action: 'exams_updated',
    resource: 'college',
    resourceId: college._id,
    details: { examIds },
  });

  return college.populate('exams', 'name slug examType');
};

module.exports = {
  createCollege,
  getColleges,
  getCollegeById,
  getCollegeBySlug,
  updateCollege,
  deleteCollege,
  publishCollege,
  manageCourses,
  manageExams,
};
