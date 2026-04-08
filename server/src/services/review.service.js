const Review = require('../models/Review.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/**
 * Submit a new review.
 */
const submitReview = async (data, userId = null) => {
  const review = await Review.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'review',
    resourceId: review._id,
    details: {
      college: review.college,
      rating: review.rating,
      authorName: review.authorName,
    },
  });

  return review;
};

/**
 * Get paginated list of reviews.
 */
const getReviews = async (query = {}, options = {}) => {
  const filter = {};

  if (query.college) {
    filter.college = query.college;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.user) {
    filter.user = query.user;
  }

  if (query.minRating || query.maxRating) {
    filter.rating = {};
    if (query.minRating) filter.rating.$gte = Number(query.minRating);
    if (query.maxRating) filter.rating.$lte = Number(query.maxRating);
  }

  return paginate(Review, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || [
      { path: 'college', select: 'name slug' },
      { path: 'user', select: 'firstName lastName' },
      { path: 'moderatedBy', select: 'firstName lastName' },
    ],
  });
};

/**
 * Get a single review by ID.
 */
const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate('college', 'name slug')
    .populate('user', 'firstName lastName')
    .populate('moderatedBy', 'firstName lastName');

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  return review;
};

/**
 * Moderate a review (approve or reject).
 */
const moderateReview = async (id, { status, moderatedBy }) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  const previousStatus = review.status;
  review.status = status;
  review.moderatedBy = moderatedBy;
  review.moderatedAt = new Date();
  await review.save();

  await AuditLog.create({
    user: moderatedBy,
    action: 'moderated',
    resource: 'review',
    resourceId: review._id,
    details: { from: previousStatus, to: status },
  });

  return review;
};

/**
 * Delete a review.
 */
const deleteReview = async (id, userId = null) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  await review.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'review',
    resourceId: review._id,
    details: {
      college: review.college,
      rating: review.rating,
      authorName: review.authorName,
    },
  });

  return review;
};

/**
 * Get aggregate review statistics for a college.
 * Returns average rating, count, and per-aspect averages.
 */
const getCollegeReviewStats = async (collegeId) => {
  const result = await Review.aggregate([
    { $match: { college: collegeId, status: 'approved' } },
    {
      $group: {
        _id: '$college',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
        avgAcademics: { $avg: '$aspects.academics' },
        avgFaculty: { $avg: '$aspects.faculty' },
        avgInfrastructure: { $avg: '$aspects.infrastructure' },
        avgPlacement: { $avg: '$aspects.placement' },
        avgCampus: { $avg: '$aspects.campus' },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      averageRating: 0,
      count: 0,
      aspects: {
        academics: 0,
        faculty: 0,
        infrastructure: 0,
        placement: 0,
        campus: 0,
      },
    };
  }

  const stats = result[0];
  return {
    averageRating: Math.round(stats.averageRating * 100) / 100,
    count: stats.count,
    aspects: {
      academics: Math.round((stats.avgAcademics || 0) * 100) / 100,
      faculty: Math.round((stats.avgFaculty || 0) * 100) / 100,
      infrastructure: Math.round((stats.avgInfrastructure || 0) * 100) / 100,
      placement: Math.round((stats.avgPlacement || 0) * 100) / 100,
      campus: Math.round((stats.avgCampus || 0) * 100) / 100,
    },
  };
};

module.exports = {
  submitReview,
  getReviews,
  getReviewById,
  moderateReview,
  deleteReview,
  getCollegeReviewStats,
};
