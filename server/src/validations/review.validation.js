const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const submitReview = {
  body: Joi.object({
    college: objectId.required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().trim().max(300).allow(''),
    content: Joi.string().trim().max(5000).allow(''),
    authorName: Joi.string().trim().max(200).allow(''),
    authorEmail: Joi.string().email().allow(''),
    aspects: Joi.object({
      academics: Joi.number().integer().min(1).max(5).allow(null),
      faculty: Joi.number().integer().min(1).max(5).allow(null),
      infrastructure: Joi.number().integer().min(1).max(5).allow(null),
      placement: Joi.number().integer().min(1).max(5).allow(null),
      campus: Joi.number().integer().min(1).max(5).allow(null),
    }),
  }),
};

const moderateReview = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
  }),
};

const listReviews = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    college: objectId,
    status: Joi.string().valid('pending', 'approved', 'rejected'),
  }),
};

const getReview = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  submitReview,
  moderateReview,
  listReviews,
  getReview,
};
