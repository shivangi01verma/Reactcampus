const asyncHandler = require('../middlewares/asyncHandler');
const pageService = require('../services/page.service');
const ApiResponse = require('../utils/ApiResponse');

const createPage = asyncHandler(async (req, res) => {
  const page = await pageService.createPage(req.body, req.user._id);
  ApiResponse.created(res, 'Page created successfully', page);
});

const getPages = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  };

  if (req.assignmentScope === 'assigned') {
    options.assignedContentIds = req.assignedContentIds;
  }

  const result = await pageService.getPages(req.query, options);
  ApiResponse.paginated(res, 'Pages retrieved successfully', result);
});

const getPageById = asyncHandler(async (req, res) => {
  const page = await pageService.getPageById(req.params.id);
  ApiResponse.success(res, 'Page retrieved successfully', page);
});

const updatePage = asyncHandler(async (req, res) => {
  const page = await pageService.updatePage(req.params.id, req.body);
  ApiResponse.success(res, 'Page updated successfully', page);
});

const deletePage = asyncHandler(async (req, res) => {
  await pageService.deletePage(req.params.id);
  ApiResponse.success(res, 'Page deleted successfully');
});

const publishPage = asyncHandler(async (req, res) => {
  const page = await pageService.publishPage(req.params.id, req.body.status);
  ApiResponse.success(res, 'Page publish status updated', page);
});

module.exports = {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  publishPage,
};
