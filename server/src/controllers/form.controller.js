const asyncHandler = require('../middlewares/asyncHandler');
const formService = require('../services/form.service');
const ApiResponse = require('../utils/ApiResponse');

const createForm = asyncHandler(async (req, res) => {
  const form = await formService.createForm(req.body, req.user._id);
  ApiResponse.created(res, 'Form created successfully', form);
});

const getForms = asyncHandler(async (req, res) => {
  const result = await formService.getForms(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Forms retrieved successfully', result);
});

const getFormById = asyncHandler(async (req, res) => {
  const form = await formService.getFormById(req.params.id);
  ApiResponse.success(res, 'Form retrieved successfully', form);
});

const updateForm = asyncHandler(async (req, res) => {
  const form = await formService.updateForm(req.params.id, req.body);
  ApiResponse.success(res, 'Form updated successfully', form);
});

const deleteForm = asyncHandler(async (req, res) => {
  await formService.deleteForm(req.params.id);
  ApiResponse.success(res, 'Form deleted successfully');
});

const publishForm = asyncHandler(async (req, res) => {
  const form = await formService.publishForm(req.params.id, req.body.isPublished);
  ApiResponse.success(res, 'Form published successfully', form);
});

const assignPages = asyncHandler(async (req, res) => {
  const form = await formService.assignPages(req.params.id, req.body.assignedPages);
  ApiResponse.success(res, 'Pages assigned to form successfully', form);
});

module.exports = {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
  publishForm,
  assignPages,
};
