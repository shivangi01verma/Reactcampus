const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const categorySchema = Joi.object({
  label: Joi.string().trim().max(100).required(),
  icon: Joi.string().max(50).allow(''),
  to: Joi.string().max(500).allow(''),
});

const statSchema = Joi.object({
  label: Joi.string().trim().max(100).required(),
  value: Joi.string().trim().max(50).required(),
  icon: Joi.string().max(50).allow(''),
  color: Joi.string().max(50).allow(''),
});

const ctaButtonSchema = Joi.object({
  label: Joi.string().trim().max(100).required(),
  to: Joi.string().trim().max(500).required(),
  variant: Joi.string().valid('primary', 'outline'),
  icon: Joi.string().max(50).allow(''),
});

const updateSiteSettings = {
  body: Joi.object({
    hero: Joi.object({
      title: Joi.string().trim().max(200).allow(''),
      titleHighlight: Joi.string().trim().max(200).allow(''),
      subtitle: Joi.string().trim().max(500).allow(''),
      searchPlaceholder: Joi.string().trim().max(200).allow(''),
      categories: Joi.array().items(categorySchema),
    }),
    stats: Joi.array().items(statSchema),
    featuredColleges: Joi.array().items(objectId),
    featuredCourses: Joi.array().items(objectId),
    featuredExams: Joi.array().items(objectId),
    cta: Joi.object({
      title: Joi.string().trim().max(300).allow(''),
      subtitle: Joi.string().trim().max(500).allow(''),
      buttons: Joi.array().items(ctaButtonSchema),
    }),
    contact: Joi.object({
      email: Joi.string().email().allow(''),
      phone: Joi.string().max(20).allow(''),
      address: Joi.string().max(500).allow(''),
      mapEmbedUrl: Joi.string().max(2000).allow(''),
    }),
    sectionVisibility: Joi.object({
      featuredColleges: Joi.boolean(),
      featuredCourses: Joi.boolean(),
      featuredExams: Joi.boolean(),
      browseByStream: Joi.boolean(),
      whyChooseUs: Joi.boolean(),
      cta: Joi.boolean(),
    }),
    about: Joi.object({
      content: Joi.string().max(50000).allow(''),
      mission: Joi.string().max(5000).allow(''),
      vision: Joi.string().max(5000).allow(''),
    }),
    footer: Joi.object({
      tagline: Joi.string().max(500).allow(''),
      sections: Joi.array().items(Joi.object({
        title: Joi.string().trim().max(100).required(),
        links: Joi.array().items(Joi.object({
          label: Joi.string().trim().max(100).required(),
          to: Joi.string().trim().max(500).required(),
        })),
      })),
      socialLinks: Joi.array().items(Joi.object({
        platform: Joi.string().trim().max(50).required(),
        url: Joi.string().trim().max(500).required(),
        label: Joi.string().max(50).allow(''),
      })),
      bottomLinks: Joi.array().items(Joi.object({
        label: Joi.string().trim().max(100).required(),
        to: Joi.string().trim().max(500).required(),
      })),
      copyrightText: Joi.string().max(200).allow(''),
      newsletter: Joi.object({
        enabled: Joi.boolean(),
        title: Joi.string().max(200).allow(''),
        subtitle: Joi.string().max(500).allow(''),
      }),
    }),
  }).min(1),
};

const submitContact = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().max(20).allow(''),
    message: Joi.string().trim().min(1).max(5000).required(),
  }),
};

module.exports = {
  updateSiteSettings,
  submitContact,
};
