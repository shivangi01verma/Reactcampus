const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createRole = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    displayName: Joi.string().trim().min(1).max(200).required(),
    permissions: Joi.array().items(objectId).default([]),
  }),
};

const updateRole = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    displayName: Joi.string().trim().min(1).max(200),
    permissions: Joi.array().items(objectId),
  }).min(1),
};

const assignPermissions = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    permissions: Joi.array().items(objectId.required()).required(),
  }),
};

const listRoles = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    isActive: Joi.boolean(),
  }),
};

const getRole = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteRole = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createRole,
  updateRole,
  assignPermissions,
  listRoles,
  getRole,
  deleteRole,
};
