const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    icon: { type: String, default: 'building' },
    color: { type: String, default: 'text-brand-600' },
  },
  { _id: false }
);

const ctaButtonSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    variant: { type: String, enum: ['primary', 'outline'], default: 'primary' },
    icon: { type: String, default: '' },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    to: { type: String, default: '' },
  },
  { _id: false }
);

const footerLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const footerSectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    links: [footerLinkSchema],
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: 'Find the Right College' },
      titleHighlight: { type: String, default: 'for Your Future' },
      subtitle: { type: String, default: 'Explore thousands of colleges, courses, and exams. Compare, shortlist, and make the right choice.' },
      searchPlaceholder: { type: String, default: 'Search colleges, courses, exams...' },
      categories: [categorySchema],
    },
    stats: [statSchema],
    featuredColleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    featuredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    featuredExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    cta: {
      title: { type: String, default: 'Need Help Choosing the Right College?' },
      subtitle: { type: String, default: 'Get personalized recommendations based on your preferences, budget, and career goals.' },
      buttons: [ctaButtonSchema],
    },
    contact: {
      email: { type: String, default: 'info@campusoption.com' },
      phone: { type: String, default: '08042401736' },
      address: { type: String, default: '4th Floor, 563-564, Niran Arcade, RMV 2nd Stage, New BEL Road, Bangalore, Karnataka 560094' },
      mapEmbedUrl: { type: String, default: '' },
    },
    sectionVisibility: {
      featuredColleges: { type: Boolean, default: true },
      featuredCourses: { type: Boolean, default: true },
      featuredExams: { type: Boolean, default: true },
      browseByStream: { type: Boolean, default: true },
      whyChooseUs: { type: Boolean, default: true },
      cta: { type: Boolean, default: true },
    },
    about: {
      content: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
    },
    footer: {
      tagline: { type: String, default: 'Your trusted platform for discovering colleges, courses, and exams across India.' },
      sections: [footerSectionSchema],
      socialLinks: [socialLinkSchema],
      bottomLinks: [footerLinkSchema],
      copyrightText: { type: String, default: '' },
      newsletter: {
        enabled: { type: Boolean, default: true },
        title: { type: String, default: 'Stay Updated' },
        subtitle: { type: String, default: 'Get the latest college news, exam dates & counselling tips.' },
      },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
