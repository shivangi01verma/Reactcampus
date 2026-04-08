const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createSEO = {
  body: Joi.object({
    targetType: Joi.string().valid('college', 'course', 'exam', 'page').required(),
    targetId: objectId.allow(null),
    slug: Joi.string().trim().max(500).allow(''),
    metaTitle: Joi.string().trim().max(200).allow(''),
    metaDescription: Joi.string().trim().max(500).allow(''),
    metaKeywords: Joi.array().items(Joi.string().trim().max(100)),
    canonicalUrl: Joi.string().uri().allow(''),
    ogTitle: Joi.string().trim().max(200).allow(''),
    ogDescription: Joi.string().trim().max(500).allow(''),
    ogImage: Joi.string().uri().allow(''),
    structuredData: Joi.any().allow(null),
    robots: Joi.string().trim().max(200).allow(''),
  }),
};

const updateSEO = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    targetType: Joi.string().valid('college', 'course', 'exam', 'page'),
    targetId: objectId.allow(null),
    slug: Joi.string().trim().max(500).allow(''),
    metaTitle: Joi.string().trim().max(200).allow(''),
    metaDescription: Joi.string().trim().max(500).allow(''),
    metaKeywords: Joi.array().items(Joi.string().trim().max(100)),
    canonicalUrl: Joi.string().uri().allow(''),
    ogTitle: Joi.string().trim().max(200).allow(''),
    ogDescription: Joi.string().trim().max(500).allow(''),
    ogImage: Joi.string().uri().allow(''),
    structuredData: Joi.any().allow(null),
    robots: Joi.string().trim().max(200).allow(''),
  }).min(1),
};

const listSEO = {
  query: Joi.object({
    targetType: Joi.string().valid('college', 'course', 'exam', 'page'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const getSEO = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteSEO = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createSEO,
  updateSEO,
  listSEO,
  getSEO,
  deleteSEO,
};
