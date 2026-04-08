const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createLead = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    email: Joi.string().email().allow(''),
    phone: Joi.string().trim().max(20).allow(''),
    college: objectId.allow(null),
    course: objectId.allow(null),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    tags: Joi.array().items(Joi.string().trim().max(100)),
    data: Joi.object(),
  }),
};

const updateLead = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200),
    email: Joi.string().email().allow(''),
    phone: Joi.string().trim().max(20).allow(''),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    tags: Joi.array().items(Joi.string().trim().max(100)),
  }).min(1),
};

const changeStatus = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    status: Joi.string().valid('new', 'contacted', 'qualified', 'converted', 'lost', 'closed').required(),
    note: Joi.string().max(1000).allow(''),
  }),
};

const assignLead = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    assignedTo: objectId.required(),
  }),
};

const addNote = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    content: Joi.string().trim().min(1).max(5000).required(),
  }),
};

const listLeads = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    status: Joi.string().valid('new', 'contacted', 'qualified', 'converted', 'lost', 'closed'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    assignedTo: objectId,
    college: objectId,
    sortBy: Joi.string().valid('createdAt', '-createdAt', 'name', '-name', 'priority', '-priority', 'status', '-status'),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
  }),
};

const getLead = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteLead = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const exportLeads = {
  query: Joi.object({
    status: Joi.string().valid('new', 'contacted', 'qualified', 'converted', 'lost', 'closed'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    assignedTo: objectId,
    college: objectId,
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
  }),
};

const bulkAction = {
  body: Joi.object({
    ids: Joi.array().items(objectId.required()).min(1).required(),
    action: Joi.string().valid('changeStatus', 'assign', 'delete').required(),
    value: Joi.string().allow('').default(''),
  }),
};

module.exports = {
  createLead,
  updateLead,
  changeStatus,
  assignLead,
  addNote,
  listLeads,
  getLead,
  deleteLead,
  exportLeads,
  bulkAction,
};
