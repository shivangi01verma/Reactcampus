const Exam = require('../models/Exam.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new exam.
 */
const createExam = async (data, userId = null) => {
  const slug = await ensureUniqueSlug(Exam, data.name);

  const exam = await Exam.create({
    ...data,
    slug,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'exam',
    resourceId: exam._id,
    details: { name: exam.name, slug: exam.slug, examType: exam.examType },
  });

  return exam;
};

/**
 * Get paginated list of exams.
 */
const getExams = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.examType) {
    filter.examType = query.examType;
  }

  if (typeof query.isActive === 'boolean') {
    filter.isActive = query.isActive;
  }

  return paginate(Exam, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate,
  });
};

/**
 * Get a single exam by ID.
 */
const getExamById = async (id) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  return exam;
};

/**
 * Get a single exam by slug.
 */
const getExamBySlug = async (slug) => {
  const exam = await Exam.findOne({ slug });
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }
  return exam;
};

/**
 * Update an exam.
 */
const updateExam = async (id, data, userId = null) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  // Re-generate slug if name changes
  if (data.name && data.name !== exam.name) {
    data.slug = await ensureUniqueSlug(Exam, data.name, exam._id);
  }

  Object.assign(exam, data);
  await exam.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'exam',
    resourceId: exam._id,
    details: { updatedFields: Object.keys(data) },
  });

  return exam;
};

/**
 * Soft-delete an exam.
 */
const deleteExam = async (id, userId = null) => {
  const exam = await Exam.findById(id);
  if (!exam) {
    throw new ApiError(404, 'Exam not found');
  }

  exam.deletedAt = new Date();
  exam.isActive = false;
  await exam.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'exam',
    resourceId: exam._id,
    details: { name: exam.name },
  });

  return exam;
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  getExamBySlug,
  updateExam,
  deleteExam,
};
