const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createUser = {
  body: Joi.object({
    firstName: Joi.string().trim().min(1).max(50).required(),
    lastName: Joi.string().trim().min(1).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    roles: Joi.array().items(objectId).default([]),
  }),
};

const updateUser = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    firstName: Joi.string().trim().min(1).max(50),
    lastName: Joi.string().trim().min(1).max(50),
    email: Joi.string().email(),
  }).min(1),
};

const assignRoles = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    roles: Joi.array().items(objectId.required()).required(),
  }),
};

const activateUser = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deactivateUser = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const listUsers = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    isActive: Joi.boolean(),
    role: objectId,
  }),
};

const getUser = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteUser = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createUser,
  updateUser,
  assignRoles,
  activateUser,
  deactivateUser,
  listUsers,
  getUser,
  deleteUser,
};
