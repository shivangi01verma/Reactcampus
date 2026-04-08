const Category = require('../models/Category.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

const createCategory = async (data, userId) => {
  const slug = await ensureUniqueSlug(Category, data.name);

  const category = await Category.create({
    ...data,
    slug,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'category',
    resourceId: category._id,
    details: { name: category.name, slug: category.slug },
  });

  return category;
};

const getCategories = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true' || query.isActive === true;
  }

  return paginate(Category, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { order: 1, name: 1 },
  });
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
  return category;
};

const updateCategory = async (id, data, userId = null) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (data.name && data.name !== category.name) {
    data.slug = await ensureUniqueSlug(Category, data.name, category._id);
  }

  Object.assign(category, data);
  await category.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'category',
    resourceId: category._id,
    details: { updatedFields: Object.keys(data) },
  });

  return category;
};

const deleteCategory = async (id, userId = null) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  await category.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'category',
    resourceId: category._id,
    details: { name: category.name },
  });

  return category;
};

const getActiveCategories = async () => {
  return Category.find({ isActive: true }).sort({ order: 1, name: 1 });
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getActiveCategories,
};
