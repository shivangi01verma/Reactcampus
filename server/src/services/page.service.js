const Page = require('../models/Page.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new page.
 */
const createPage = async (data, userId) => {
  const slug = await ensureUniqueSlug(Page, data.title);

  const page = await Page.create({
    ...data,
    slug,
    createdBy: userId,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'page',
    resourceId: page._id,
    details: { title: page.title, slug: page.slug },
  });

  return page;
};

/**
 * Get paginated list of pages.
 */
const getPages = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (options.assignedContentIds) {
    filter._id = { $in: options.assignedContentIds };
  }

  return paginate(Page, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    populate: [{ path: 'createdBy', select: 'firstName lastName' }],
  });
};

/**
 * Get a single page by ID.
 */
const getPageById = async (id) => {
  const page = await Page.findById(id)
    .populate('collegeFilter.courses', 'name slug level')
    .populate('collegeFilter.exams', 'name slug')
    .populate('createdBy', 'firstName lastName');

  if (!page) {
    throw new ApiError(404, 'Page not found');
  }

  return page;
};

/**
 * Get a single page by slug.
 */
const getPageBySlug = async (slug) => {
  const page = await Page.findOne({ slug })
    .populate('collegeFilter.courses', 'name slug level')
    .populate('collegeFilter.exams', 'name slug')
    .populate('createdBy', 'firstName lastName');

  if (!page) {
    throw new ApiError(404, 'Page not found');
  }

  return page;
};

/**
 * Update a page.
 */
const updatePage = async (id, data, userId = null) => {
  const page = await Page.findById(id);
  if (!page) {
    throw new ApiError(404, 'Page not found');
  }

  // Re-generate slug if title changes
  if (data.title && data.title !== page.title) {
    data.slug = await ensureUniqueSlug(Page, data.title, page._id);
  }

  Object.assign(page, data);
  await page.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'page',
    resourceId: page._id,
    details: { updatedFields: Object.keys(data) },
  });

  return page;
};

/**
 * Soft-delete a page.
 */
const deletePage = async (id, userId = null) => {
  const page = await Page.findById(id);
  if (!page) {
    throw new ApiError(404, 'Page not found');
  }

  page.deletedAt = new Date();
  await page.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'page',
    resourceId: page._id,
    details: { title: page.title },
  });

  return page;
};

/**
 * Publish or change the status of a page.
 */
const publishPage = async (id, status, userId = null) => {
  const page = await Page.findById(id);
  if (!page) {
    throw new ApiError(404, 'Page not found');
  }

  const previousStatus = page.status;
  page.status = status;
  await page.save();

  await AuditLog.create({
    user: userId,
    action: 'status_changed',
    resource: 'page',
    resourceId: page._id,
    details: { from: previousStatus, to: status },
  });

  return page;
};

module.exports = {
  createPage,
  getPages,
  getPageById,
  getPageBySlug,
  updatePage,
  deletePage,
  publishPage,
};
