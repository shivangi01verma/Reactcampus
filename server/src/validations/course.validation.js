const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createCourse = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300).required(),
    level: Joi.string().valid('undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate').required(),
    duration: Joi.object({
      value: Joi.number().min(0).required(),
      unit: Joi.string().valid('years', 'months').default('years'),
    }).required(),
    stream: Joi.string().trim().max(200).allow(''),
    specializations: Joi.array().items(Joi.string().trim().max(200)),
    fees: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string().max(10).default('INR'),
      per: Joi.string().valid('year', 'semester', 'total').default('year'),
    }),
    description: Joi.string().max(5000).allow(''),
    eligibility: Joi.string().max(2000).allow(''),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }),
};

const updateCourse = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300),
    level: Joi.string().valid('undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate'),
    duration: Joi.object({
      value: Joi.number().min(0).required(),
      unit: Joi.string().valid('years', 'months').default('years'),
    }),
    stream: Joi.string().trim().max(200).allow(''),
    specializations: Joi.array().items(Joi.string().trim().max(200)),
    fees: Joi.object({
      amount: Joi.number().min(0),
      currency: Joi.string().max(10).default('INR'),
      per: Joi.string().valid('year', 'semester', 'total').default('year'),
    }),
    description: Joi.string().max(5000).allow(''),
    eligibility: Joi.string().max(2000).allow(''),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }).min(1),
};

const listCourses = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    level: Joi.string().valid('undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate'),
    stream: Joi.string().trim().max(200).allow(''),
  }),
};

const getCourse = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const deleteCourse = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createCourse,
  updateCourse,
  listCourses,
  getCourse,
  deleteCourse,
};
