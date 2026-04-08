const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createCollege = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300).required(),
    type: Joi.string().valid('public', 'private', 'deemed', 'autonomous').required(),
    categories: Joi.array().items(Joi.string().max(100)),
    description: Joi.string().max(5000).allow(''),
    logo: Joi.string().max(2000).allow(''),
    coverImage: Joi.string().max(2000).allow(''),
    location: Joi.object({
      address: Joi.string().max(500).allow(''),
      city: Joi.string().max(100).allow(''),
      state: Joi.string().max(100).allow(''),
      pincode: Joi.string().max(10).allow(''),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().ordered(
          Joi.number().min(-180).max(180),
          Joi.number().min(-90).max(90)
        ).length(2),
      }),
    }),
    fees: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }),
    ranking: Joi.number().integer().min(1).allow(null),
    established: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null),
    website: Joi.string().uri().allow(''),
    accreditation: Joi.string().max(300).allow(''),
    affiliation: Joi.string().max(300).allow(''),
    facilities: Joi.array().items(Joi.string().max(100)),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }),
};

const updateCollege = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300),
    type: Joi.string().valid('public', 'private', 'deemed', 'autonomous'),
    categories: Joi.array().items(Joi.string().max(100)),
    description: Joi.string().max(5000).allow(''),
    logo: Joi.string().max(2000).allow(''),
    coverImage: Joi.string().max(2000).allow(''),
    location: Joi.object({
      address: Joi.string().max(500).allow(''),
      city: Joi.string().max(100).allow(''),
      state: Joi.string().max(100).allow(''),
      pincode: Joi.string().max(10).allow(''),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().ordered(
          Joi.number().min(-180).max(180),
          Joi.number().min(-90).max(90)
        ).length(2),
      }),
    }),
    fees: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }),
    ranking: Joi.number().integer().min(1).allow(null),
    established: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null),
    website: Joi.string().uri().allow(''),
    accreditation: Joi.string().max(300).allow(''),
    affiliation: Joi.string().max(300).allow(''),
    facilities: Joi.array().items(Joi.string().max(100)),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }).min(1),
};

const publish = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('draft', 'published', 'archived').required(),
  }),
};

const manageCourses = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    courses: Joi.array().items(objectId.required()).required(),
  }),
};

const manageExams = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    exams: Joi.array().items(objectId.required()).required(),
  }),
};

const listColleges = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    type: Joi.string().valid('public', 'private', 'deemed', 'autonomous'),
    status: Joi.string().valid('draft', 'published', 'archived'),
    city: Joi.string().trim().max(100).allow(''),
    state: Joi.string().trim().max(100).allow(''),
    sortBy: Joi.string().valid('name', 'ranking', 'established', 'createdAt', '-name', '-ranking', '-established', '-createdAt'),
  }),
};

const getCollege = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const deleteCollege = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createCollege,
  updateCollege,
  publish,
  manageCourses,
  manageExams,
  listColleges,
  getCollege,
  deleteCollege,
};
