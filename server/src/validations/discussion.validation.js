const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const submitDiscussion = {
  body: Joi.object({
    college: objectId,
    course: objectId,
    exam: objectId,
    content: Joi.string().trim().min(1).max(5000).required(),
    authorName: Joi.string().trim().max(200).allow(''),
    authorEmail: Joi.string().email().allow(''),
  }).xor('college', 'course', 'exam'),
};

const moderateDiscussion = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
  }),
};

const listDiscussions = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    college: objectId,
    course: objectId,
    exam: objectId,
    status: Joi.string().valid('pending', 'approved', 'rejected'),
  }),
};

module.exports = {
  submitDiscussion,
  moderateDiscussion,
  listDiscussions,
};
