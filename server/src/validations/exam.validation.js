const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createExam = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300).required(),
    examType: Joi.string().valid('national', 'state', 'university', 'institutional').required(),
    categories: Joi.array().items(Joi.string().max(100)),
    conductedBy: Joi.string().trim().max(300).allow(''),
    pattern: Joi.object({
      mode: Joi.string().valid('online', 'offline', 'both').default('online'),
      duration: Joi.string().max(100).allow(''),
      totalMarks: Joi.number().integer().min(0).allow(null),
      sections: Joi.array().items(
        Joi.object({
          name: Joi.string().trim().max(200),
          questions: Joi.number().integer().min(0),
          marks: Joi.number().min(0),
        })
      ),
    }),
    importantDates: Joi.array().items(
      Joi.object({
        event: Joi.string().trim().max(200).required(),
        date: Joi.date().iso(),
        description: Joi.string().max(500).allow(''),
      })
    ),
    eligibility: Joi.string().max(2000).allow(''),
    description: Joi.string().max(5000).allow(''),
    website: Joi.string().uri().allow(''),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }),
};

const updateExam = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(300),
    examType: Joi.string().valid('national', 'state', 'university', 'institutional'),
    categories: Joi.array().items(Joi.string().max(100)),
    conductedBy: Joi.string().trim().max(300).allow(''),
    pattern: Joi.object({
      mode: Joi.string().valid('online', 'offline', 'both').default('online'),
      duration: Joi.string().max(100).allow(''),
      totalMarks: Joi.number().integer().min(0).allow(null),
      sections: Joi.array().items(
        Joi.object({
          name: Joi.string().trim().max(200),
          questions: Joi.number().integer().min(0),
          marks: Joi.number().min(0),
        })
      ),
    }),
    importantDates: Joi.array().items(
      Joi.object({
        event: Joi.string().trim().max(200).required(),
        date: Joi.date().iso(),
        description: Joi.string().max(500).allow(''),
      })
    ),
    eligibility: Joi.string().max(2000).allow(''),
    description: Joi.string().max(5000).allow(''),
    website: Joi.string().uri().allow(''),
    pageFeatures: Joi.object({
      faq: Joi.boolean(),
      discussion: Joi.boolean(),
    }),
  }).min(1),
};

const listExams = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    examType: Joi.string().valid('national', 'state', 'university', 'institutional'),
  }),
};

const getExam = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const deleteExam = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createExam,
  updateExam,
  listExams,
  getExam,
  deleteExam,
};
