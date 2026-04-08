const asyncHandler = require('../middlewares/asyncHandler');
const collegeService = require('../services/college.service');
const ApiResponse = require('../utils/ApiResponse');

const createCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.createCollege(req.body, req.user._id);
  ApiResponse.created(res, 'College created successfully', college);
});

const getColleges = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  };

  if (req.assignmentScope === 'assigned') {
    options.assignedContentIds = req.assignedContentIds;
  }

  const result = await collegeService.getColleges(req.query, options);
  ApiResponse.paginated(res, 'Colleges retrieved successfully', result);
});

const getCollegeById = asyncHandler(async (req, res) => {
  const college = await collegeService.getCollegeById(req.params.id);
  ApiResponse.success(res, 'College retrieved successfully', college);
});

const updateCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.updateCollege(req.params.id, req.body);
  ApiResponse.success(res, 'College updated successfully', college);
});

const deleteCollege = asyncHandler(async (req, res) => {
  await collegeService.deleteCollege(req.params.id);
  ApiResponse.success(res, 'College deleted successfully');
});

const publishCollege = asyncHandler(async (req, res) => {
  const college = await collegeService.publishCollege(req.params.id, req.body.status);
  ApiResponse.success(res, 'College publish status updated', college);
});

const manageCourses = asyncHandler(async (req, res) => {
  const college = await collegeService.manageCourses(req.params.id, req.body.courses);
  ApiResponse.success(res, 'College courses updated successfully', college);
});

const manageExams = asyncHandler(async (req, res) => {
  const college = await collegeService.manageExams(req.params.id, req.body.exams);
  ApiResponse.success(res, 'College exams updated successfully', college);
});

module.exports = {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  publishCollege,
  manageCourses,
  manageExams,
};
