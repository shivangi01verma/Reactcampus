const asyncHandler = require('../middlewares/asyncHandler');
const contentAssignmentService = require('../services/contentAssignment.service');
const ApiResponse = require('../utils/ApiResponse');

const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await contentAssignmentService.createAssignment(req.body, req.user._id);
  ApiResponse.created(res, 'Content assignment created successfully', assignment);
});

const getAssignments = asyncHandler(async (req, res) => {
  const result = await contentAssignmentService.getAssignments(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Content assignments retrieved successfully', result);
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await contentAssignmentService.getAssignmentById(req.params.id);
  ApiResponse.success(res, 'Content assignment retrieved successfully', assignment);
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await contentAssignmentService.updateAssignment(req.params.id, req.body, req.user._id);
  ApiResponse.success(res, 'Content assignment updated successfully', assignment);
});

const deleteAssignment = asyncHandler(async (req, res) => {
  await contentAssignmentService.deleteAssignment(req.params.id, req.user._id);
  ApiResponse.success(res, 'Content assignment deleted successfully');
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
