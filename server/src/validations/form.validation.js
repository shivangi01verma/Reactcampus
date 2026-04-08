const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const fieldValidationSchema = Joi.object({
  required: Joi.boolean(),
  minLength: Joi.number().integer().min(0).allow(null),
  maxLength: Joi.number().integer().min(0).allow(null),
  min: Joi.number().allow(null),
  max: Joi.number().allow(null),
  pattern: Joi.string().allow(null, ''),
  customMessage: Joi.string().max(500).allow(''),
});

const fieldOptionSchema = Joi.object({
  label: Joi.string().trim().max(200).required(),
  value: Joi.string().trim().max(200).required(),
});

const fieldSchema = Joi.object({
  type: Joi.string()
    .valid('text', 'email', 'phone', 'number', 'dropdown', 'checkbox', 'radio', 'textarea', 'date', 'file', 'hidden')
    .required(),
  label: Joi.string().trim().min(1).max(300).required(),
  name: Joi.string().trim().min(1).max(200).required(),
  placeholder: Joi.string().max(300).allow(''),
  validation: fieldValidationSchema,
  options: Joi.array().items(fieldOptionSchema),
  order: Joi.number().integer().min(0),
  conditionalOn: Joi.object({
    fieldName: Joi.string().trim().max(200).allow(null, ''),
    value: Joi.any(),
  }).allow(null),
  leadFieldMapping: Joi.string().valid('name', 'email', 'phone', 'college', 'course', 'message').allow(null),
});

const pageAssignmentSchema = Joi.object({
  pageType: Joi.string().trim().min(1).max(100).required(),
  entityId: objectId.allow(null),
  displayAs: Joi.string().valid('popup', 'inline', 'slide_in'),
  trigger: Joi.string().valid('immediate', 'delay', 'scroll', 'exit_intent'),
  delaySeconds: Joi.number().integer().min(0).max(300),
  scrollPercent: Joi.number().integer().min(0).max(100),
  showOnce: Joi.boolean(),
});

const createForm = {
  body: Joi.object({
    title: Joi.string().trim().min(1).max(300).required(),
    purpose: Joi.string().valid('lead_capture', 'review', 'generic').required(),
    description: Joi.string().max(2000).allow(''),
    fields: Joi.array().items(fieldSchema),
    postSubmitAction: Joi.string().valid('message', 'redirect', 'both'),
    successMessage: Joi.string().max(1000).allow(''),
    redirectUrl: Joi.string().uri().allow(''),
    assignedPages: Joi.array().items(pageAssignmentSchema),
    visibility: Joi.object({
      requiresAuth: Joi.boolean(),
      allowedRoles: Joi.array().items(objectId),
    }),
  }),
};

const updateForm = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(1).max(300),
    purpose: Joi.string().valid('lead_capture', 'review', 'generic'),
    description: Joi.string().max(2000).allow(''),
    fields: Joi.array().items(fieldSchema),
    postSubmitAction: Joi.string().valid('message', 'redirect', 'both'),
    successMessage: Joi.string().max(1000).allow(''),
    redirectUrl: Joi.string().uri().allow(''),
    assignedPages: Joi.array().items(pageAssignmentSchema),
    visibility: Joi.object({
      requiresAuth: Joi.boolean(),
      allowedRoles: Joi.array().items(objectId),
    }),
  }).min(1),
};

const publishForm = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    isPublished: Joi.boolean().required(),
  }),
};

const assignPages = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    assignedPages: Joi.array().items(pageAssignmentSchema).required(),
  }),
};

const listForms = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    purpose: Joi.string().valid('lead_capture', 'review', 'generic'),
    isPublished: Joi.boolean(),
  }),
};

const getForm = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const deleteForm = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createForm,
  updateForm,
  publishForm,
  assignPages,
  listForms,
  getForm,
  deleteForm,
};
