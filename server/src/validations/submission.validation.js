const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const submitForm = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    data: Joi.object().required(),
    pageContext: Joi.object({
      pageType: Joi.string().trim().max(100).allow(''),
      entityId: objectId.allow(null),
      url: Joi.string().max(2000).allow(''),
    }),
  }),
};

const listSubmissions = {
  query: Joi.object({
    form: objectId.required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const getSubmission = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  submitForm,
  listSubmissions,
  getSubmission,
};
