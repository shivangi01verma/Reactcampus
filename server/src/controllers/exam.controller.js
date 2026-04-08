const asyncHandler = require('../middlewares/asyncHandler');
const examService = require('../services/exam.service');
const ApiResponse = require('../utils/ApiResponse');

const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);
  ApiResponse.created(res, 'Exam created successfully', exam);
});

const getExams = asyncHandler(async (req, res) => {
  const { search, examType, page, limit, sort } = req.query;
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (examType) {
    filter.examType = examType;
  }

  const result = await examService.getExams(filter, { page, limit, sort });
  ApiResponse.paginated(res, 'Exams retrieved successfully', result);
});

const getExamById = asyncHandler(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  ApiResponse.success(res, 'Exam retrieved successfully', exam);
});

const updateExam = asyncHandler(async (req, res) => {
  const exam = await examService.updateExam(req.params.id, req.body);
  ApiResponse.success(res, 'Exam updated successfully', exam);
});

const deleteExam = asyncHandler(async (req, res) => {
  await examService.deleteExam(req.params.id);
  ApiResponse.success(res, 'Exam deleted successfully');
});

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};
