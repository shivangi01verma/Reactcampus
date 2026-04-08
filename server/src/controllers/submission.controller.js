const asyncHandler = require('../middlewares/asyncHandler');
const submissionService = require('../services/submission.service');
const ApiResponse = require('../utils/ApiResponse');

const submitForm = asyncHandler(async (req, res) => {
  const submission = await submissionService.submitForm(req.params.formId, {
    data: req.body.data,
    pageContext: req.body.pageContext,
    submittedBy: req.user?._id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  ApiResponse.created(res, 'Form submitted successfully', submission);
});

const getSubmissions = asyncHandler(async (req, res) => {
  const result = await submissionService.getSubmissions(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Submissions retrieved successfully', result);
});

const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmissionById(req.params.id);
  ApiResponse.success(res, 'Submission retrieved successfully', submission);
});

module.exports = {
  submitForm,
  getSubmissions,
  getSubmissionById,
};
