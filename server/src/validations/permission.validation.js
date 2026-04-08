const Joi = require('joi');

const listPermissions = {
  query: Joi.object({
    group: Joi.string().trim().max(100).allow(''),
    resource: Joi.string().trim().max(100).allow(''),
  }),
};

module.exports = {
  listPermissions,
};
