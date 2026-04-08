const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createAssignment = {
  body: Joi.object({
    user: objectId.required(),
    contentType: Joi.string().valid('college', 'page').required(),
    scope: Joi.string().valid('individual', 'category').required(),
    contentId: objectId.when('scope', {
      is: 'individual',
      then: Joi.required(),
      otherwise: Joi.allow(null).default(null),
    }),
    categories: Joi.array()
      .items(Joi.string().max(100))
      .when('scope', {
        is: 'category',
        then: Joi.array().min(1).required(),
        otherwise: Joi.array().default([]),
      }),
    actions: Joi.array()
      .items(Joi.string().valid('read', 'update', 'delete', 'publish'))
      .min(1)
      .required(),
  }),
};

const updateAssignment = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    contentType: Joi.string().valid('college', 'page'),
    scope: Joi.string().valid('individual', 'category'),
    contentId: objectId.allow(null),
    categories: Joi.array().items(Joi.string().max(100)),
    actions: Joi.array()
      .items(Joi.string().valid('read', 'update', 'delete', 'publish'))
      .min(1),
  }).min(1),
};

const deleteAssignment = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const getAssignment = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const listAssignments = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    contentType: Joi.string().valid('college', 'page'),
    user: objectId,
  }),
};

module.exports = {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignment,
  listAssignments,
};
