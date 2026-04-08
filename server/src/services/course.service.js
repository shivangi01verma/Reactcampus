const Course = require('../models/Course.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new course.
 */
const createCourse = async (data, userId = null) => {
  const slug = await ensureUniqueSlug(Course, data.name);

  const course = await Course.create({
    ...data,
    slug,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'course',
    resourceId: course._id,
    details: { name: course.name, slug: course.slug, level: course.level },
  });

  return course;
};

/**
 * Get paginated list of courses.
 */
const getCourses = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.level) {
    filter.level = query.level;
  }

  if (query.stream) {
    filter.stream = { $regex: query.stream, $options: 'i' };
  }

  if (typeof query.isActive === 'boolean') {
    filter.isActive = query.isActive;
  }

  return paginate(Course, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate,
  });
};

/**
 * Get a single course by ID.
 */
const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

/**
 * Get a single course by slug.
 */
const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug });
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

/**
 * Update a course.
 */
const updateCourse = async (id, data, userId = null) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  // Re-generate slug if name changes
  if (data.name && data.name !== course.name) {
    data.slug = await ensureUniqueSlug(Course, data.name, course._id);
  }

  Object.assign(course, data);
  await course.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'course',
    resourceId: course._id,
    details: { updatedFields: Object.keys(data) },
  });

  return course;
};

/**
 * Soft-delete a course.
 */
const deleteCourse = async (id, userId = null) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  course.deletedAt = new Date();
  course.isActive = false;
  await course.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'course',
    resourceId: course._id,
    details: { name: course.name },
  });

  return course;
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
};
