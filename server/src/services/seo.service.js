const SEO = require('../models/SEO.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/**
 * Create a new SEO entry.
 */
const createSEO = async (data, userId = null) => {
  // Check for duplicate target
  if (data.targetType && data.targetId) {
    const existing = await SEO.findOne({
      targetType: data.targetType,
      targetId: data.targetId,
    });
    if (existing) {
      throw new ApiError(409, 'SEO entry for this target already exists');
    }
  }

  const seo = await SEO.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'seo',
    resourceId: seo._id,
    details: { targetType: seo.targetType, targetId: seo.targetId },
  });

  return seo;
};

/**
 * Get paginated list of SEO entries.
 */
const getSEOEntries = async (query = {}, options = {}) => {
  const filter = {};

  if (query.targetType) {
    filter.targetType = query.targetType;
  }

  if (query.search) {
    filter.$or = [
      { metaTitle: { $regex: query.search, $options: 'i' } },
      { slug: { $regex: query.search, $options: 'i' } },
    ];
  }

  return paginate(SEO, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate,
  });
};

/**
 * Get a single SEO entry by ID.
 */
const getSEOById = async (id) => {
  const seo = await SEO.findById(id);
  if (!seo) {
    throw new ApiError(404, 'SEO entry not found');
  }
  return seo;
};

/**
 * Get SEO entry by target type and target ID.
 */
const getSEOByTarget = async (targetType, targetId) => {
  const seo = await SEO.findOne({ targetType, targetId });
  if (!seo) {
    throw new ApiError(404, 'SEO entry not found for this target');
  }
  return seo;
};

/**
 * Update an SEO entry.
 */
const updateSEO = async (id, data, userId = null) => {
  const seo = await SEO.findById(id);
  if (!seo) {
    throw new ApiError(404, 'SEO entry not found');
  }

  Object.assign(seo, data);
  await seo.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'seo',
    resourceId: seo._id,
    details: { updatedFields: Object.keys(data) },
  });

  return seo;
};

/**
 * Delete an SEO entry.
 */
const deleteSEO = async (id, userId = null) => {
  const seo = await SEO.findById(id);
  if (!seo) {
    throw new ApiError(404, 'SEO entry not found');
  }

  await seo.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'seo',
    resourceId: seo._id,
    details: { targetType: seo.targetType, targetId: seo.targetId },
  });

  return seo;
};

module.exports = {
  createSEO,
  getSEOEntries,
  getSEOById,
  getSEOByTarget,
  updateSEO,
  deleteSEO,
};
