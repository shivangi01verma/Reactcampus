const mongoose = require('mongoose');
const { COURSE_LEVELS } = require('../utils/constants');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    level: { type: String, enum: COURSE_LEVELS, required: true },
    duration: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['years', 'months'], default: 'years' },
    },
    stream: { type: String, trim: true, default: '' },
    specializations: [{ type: String, trim: true }],
    fees: {
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      per: { type: String, enum: ['year', 'semester', 'total'], default: 'year' },
    },
    description: { type: String, default: '' },
    eligibility: { type: String, default: '' },
    pageFeatures: {
      faq: { type: Boolean, default: true },
      discussion: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

courseSchema.index({ name: 'text', stream: 'text' });

courseSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('Course', courseSchema);
