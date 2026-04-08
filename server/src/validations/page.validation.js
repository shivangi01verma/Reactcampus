const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const contentBlockSchema = Joi.object({
  title: Joi.string().max(500).allow(''),
  contentType: Joi.string().valid('richtext', 'table', 'faq', 'list').default('richtext'),
  content: Joi.any(),
  order: Joi.number().integer().min(0),
});

const sidebarLinkGroupSchema = Joi.object({
  title: Joi.string().max(300).allow(''),
  links: Joi.array().items(
    Joi.object({
      label: Joi.string().max(200).allow(''),
      url: Joi.string().max(500).allow(''),
    })
  ),
});

const collegeFilterSchema = Joi.object({
  enabled: Joi.boolean(),
  filterBy: Joi.string().valid('course', 'exam', 'type', 'state', 'city', 'all'),
  courses: Joi.array().items(objectId),
  exams: Joi.array().items(objectId),
  collegeType: Joi.string().max(100).allow(''),
  state: Joi.string().max(100).allow(''),
  city: Joi.string().max(100).allow(''),
});

const createPage = {
  body: Joi.object({
    title: Joi.string().trim().min(1).max(500).required(),
    status: Joi.string().valid('draft', 'published', 'archived'),
    description: Joi.string().max(50000).allow(''),
    contentBlocks: Joi.array().items(contentBlockSchema),
    collegeFilter: collegeFilterSchema,
    sidebarLinks: Joi.array().items(sidebarLinkGroupSchema),
    metaTitle: Joi.string().max(200).allow(''),
    metaDescription: Joi.string().max(500).allow(''),
    metaKeywords: Joi.array().items(Joi.string().trim().max(100)),
  }),
};

const updatePage = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    title: Joi.string().trim().min(1).max(500),
    status: Joi.string().valid('draft', 'published', 'archived'),
    description: Joi.string().max(50000).allow(''),
    contentBlocks: Joi.array().items(contentBlockSchema),
    collegeFilter: collegeFilterSchema,
    sidebarLinks: Joi.array().items(sidebarLinkGroupSchema),
    metaTitle: Joi.string().max(200).allow(''),
    metaDescription: Joi.string().max(500).allow(''),
    metaKeywords: Joi.array().items(Joi.string().trim().max(100)),
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

const listPages = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    status: Joi.string().valid('draft', 'published', 'archived'),
  }),
};

const getPage = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const deletePage = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createPage,
  updatePage,
  publish,
  listPages,
  getPage,
  deletePage,
};
