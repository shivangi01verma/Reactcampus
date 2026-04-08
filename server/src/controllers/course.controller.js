const asyncHandler = require('../middlewares/asyncHandler');
const courseService = require('../services/course.service');
const College = require('../models/College.model');
const ApiResponse = require('../utils/ApiResponse');

const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  ApiResponse.created(res, 'Course created successfully', course);
});

const getCourses = asyncHandler(async (req, res) => {
  const { search, level, stream, page, limit, sort } = req.query;
  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (level) {
    filter.level = level;
  }

  if (stream) {
    filter.stream = stream;
  }

  const result = await courseService.getCourses(filter, { page, limit, sort });
  ApiResponse.paginated(res, 'Courses retrieved successfully', result);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  ApiResponse.success(res, 'Course retrieved successfully', course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  ApiResponse.success(res, 'Course updated successfully', course);
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  ApiResponse.success(res, 'Course deleted successfully');
});

const getCollegesByCourse = asyncHandler(async (req, res) => {
  const colleges = await College.find({ courses: req.params.id, deletedAt: null })
    .select('name slug type location ranking established fees logo accreditation status')
    .sort({ name: 1 });
  ApiResponse.success(res, 'Colleges retrieved', colleges);
});

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCollegesByCourse,
};
