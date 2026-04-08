const asyncHandler = require('../middlewares/asyncHandler');
const categoryService = require('../services/category.service');
const ApiResponse = require('../utils/ApiResponse');

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user._id);
  ApiResponse.created(res, 'Category created successfully', category);
});

const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Categories retrieved successfully', result);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  ApiResponse.success(res, 'Category retrieved successfully', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body, req.user._id);
  ApiResponse.success(res, 'Category updated successfully', category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id, req.user._id);
  ApiResponse.success(res, 'Category deleted successfully');
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
