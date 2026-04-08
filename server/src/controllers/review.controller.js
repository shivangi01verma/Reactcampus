const asyncHandler = require('../middlewares/asyncHandler');
const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/ApiResponse');

const submitReview = asyncHandler(async (req, res) => {
  const review = await reviewService.submitReview(req.body);
  ApiResponse.created(res, 'Review submitted successfully', review);
});

const getReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getReviews(req.query, {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  });
  ApiResponse.paginated(res, 'Reviews retrieved successfully', result);
});

const getReviewById = asyncHandler(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  ApiResponse.success(res, 'Review retrieved successfully', review);
});

const moderateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.moderateReview(req.params.id, req.body, req.user._id);
  ApiResponse.success(res, 'Review moderated successfully', review);
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id);
  ApiResponse.success(res, 'Review deleted successfully');
});

module.exports = {
  submitReview,
  getReviews,
  getReviewById,
  moderateReview,
  deleteReview,
};
