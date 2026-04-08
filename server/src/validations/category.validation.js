const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createCategory = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    icon: Joi.string().max(100).allow(''),
    order: Joi.number().integer().min(0).default(0),
    isActive: Joi.boolean().default(true),
  }),
};

const updateCategory = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(100),
    icon: Joi.string().max(100).allow(''),
    order: Joi.number().integer().min(0),
    isActive: Joi.boolean(),
  }).min(1),
};

const getCategory = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteCategory = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
};
