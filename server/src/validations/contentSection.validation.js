const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createContentSection = {
  body: Joi.object({
    college: objectId,
    exam: objectId,
    course: objectId,
    sectionKey: Joi.string().trim().min(1).max(200).required(),
    title: Joi.string().trim().min(1).max(300).required(),
    content: Joi.any(),
    contentType: Joi.string().valid('richtext', 'table', 'faq', 'gallery', 'list').default('richtext'),
    order: Joi.number().integer().min(0).default(0),
    isVisible: Joi.boolean().default(true),
  }),
};

const updateContentSection = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(1).max(300),
    content: Joi.any(),
    contentType: Joi.string().valid('richtext', 'table', 'faq', 'gallery', 'list'),
    order: Joi.number().integer().min(0),
    isVisible: Joi.boolean(),
  }).min(1),
};

const listContentSections = {
  query: Joi.object({
    college: objectId,
    exam: objectId,
    course: objectId,
  }).or('college', 'exam', 'course'),
};

const getContentSection = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteContentSection = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createContentSection,
  updateContentSection,
  listContentSections,
  getContentSection,
  deleteContentSection,
};
