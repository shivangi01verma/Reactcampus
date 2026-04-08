const DynamicForm = require('../models/DynamicForm.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new dynamic form.
 */
const createForm = async (data, userId) => {
  const slug = await ensureUniqueSlug(DynamicForm, data.title);

  const form = await DynamicForm.create({
    ...data,
    slug,
    createdBy: userId,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'form',
    resourceId: form._id,
    details: { title: form.title, slug: form.slug, purpose: form.purpose },
  });

  return form;
};

/**
 * Get paginated list of forms.
 */
const getForms = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.purpose) {
    filter.purpose = query.purpose;
  }

  if (typeof query.isPublished === 'boolean') {
    filter.isPublished = query.isPublished;
  }

  return paginate(DynamicForm, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || { path: 'createdBy', select: 'firstName lastName' },
  });
};

/**
 * Get a single form by ID.
 */
const getFormById = async (id) => {
  const form = await DynamicForm.findById(id).populate('createdBy', 'firstName lastName');
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }
  return form;
};

/**
 * Get a single form by slug.
 */
const getFormBySlug = async (slug) => {
  const form = await DynamicForm.findOne({ slug }).populate('createdBy', 'firstName lastName');
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }
  return form;
};

/**
 * Update a form and increment its version.
 */
const updateForm = async (id, data, userId = null) => {
  const form = await DynamicForm.findById(id);
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }

  // Re-generate slug if title changes
  if (data.title && data.title !== form.title) {
    data.slug = await ensureUniqueSlug(DynamicForm, data.title, form._id);
  }

  Object.assign(form, data);
  form.version += 1;
  await form.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'form',
    resourceId: form._id,
    details: { updatedFields: Object.keys(data), version: form.version },
  });

  return form;
};

/**
 * Soft-delete a form.
 */
const deleteForm = async (id, userId = null) => {
  const form = await DynamicForm.findById(id);
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }

  form.deletedAt = new Date();
  form.isPublished = false;
  await form.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'form',
    resourceId: form._id,
    details: { title: form.title },
  });

  return form;
};

/**
 * Publish or unpublish a form.
 */
const publishForm = async (id, isPublished, userId = null) => {
  const form = await DynamicForm.findById(id);
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }

  form.isPublished = isPublished;
  await form.save();

  await AuditLog.create({
    user: userId,
    action: isPublished ? 'published' : 'unpublished',
    resource: 'form',
    resourceId: form._id,
    details: { title: form.title },
  });

  return form;
};

/**
 * Set the assignedPages array for a form.
 */
const assignPages = async (id, assignedPages, userId = null) => {
  const form = await DynamicForm.findById(id);
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }

  form.assignedPages = assignedPages;
  await form.save();

  await AuditLog.create({
    user: userId,
    action: 'pages_assigned',
    resource: 'form',
    resourceId: form._id,
    details: { assignedPages },
  });

  return form;
};

/**
 * Get the public schema of a published form (by ID or slug).
 * Returns only the fields array and display metadata, not internal details.
 */
const getFormSchema = async (formIdOrSlug) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(formIdOrSlug);
  const query = isObjectId ? { _id: formIdOrSlug } : { slug: formIdOrSlug };

  const form = await DynamicForm.findOne({
    ...query,
    isPublished: true,
  }).select('title slug description purpose fields postSubmitAction successMessage redirectUrl visibility');

  if (!form) {
    throw new ApiError(404, 'Published form not found');
  }

  return form;
};

module.exports = {
  createForm,
  getForms,
  getFormById,
  getFormBySlug,
  updateForm,
  deleteForm,
  publishForm,
  assignPages,
  getFormSchema,
};
