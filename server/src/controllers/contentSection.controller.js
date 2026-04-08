const asyncHandler = require('../middlewares/asyncHandler');
const contentSectionService = require('../services/contentSection.service');
const ApiResponse = require('../utils/ApiResponse');

const create = asyncHandler(async (req, res) => {
  const section = await contentSectionService.create(req.body);
  ApiResponse.created(res, 'Content section created successfully', section);
});

const getByCollege = asyncHandler(async (req, res) => {
  const sections = await contentSectionService.getByCollege(req.query.college, req.query.exam, req.query.course);
  ApiResponse.success(res, 'Content sections retrieved successfully', sections);
});

const getById = asyncHandler(async (req, res) => {
  const section = await contentSectionService.getById(req.params.id);
  ApiResponse.success(res, 'Content section retrieved successfully', section);
});

const update = asyncHandler(async (req, res) => {
  const section = await contentSectionService.update(req.params.id, req.body);
  ApiResponse.success(res, 'Content section updated successfully', section);
});

const remove = asyncHandler(async (req, res) => {
  await contentSectionService.remove(req.params.id);
  ApiResponse.success(res, 'Content section deleted successfully');
});

module.exports = {
  create,
  getByCollege,
  getById,
  update,
  remove,
};
