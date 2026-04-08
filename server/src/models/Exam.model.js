const mongoose = require('mongoose');
const { EXAM_TYPES } = require('../utils/constants');

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    conductedBy: { type: String, trim: true, default: '' },
    examType: { type: String, enum: EXAM_TYPES, required: true },
    categories: [{ type: String }],
    pattern: {
      mode: { type: String, enum: ['online', 'offline', 'both'], default: 'online' },
      duration: { type: String, default: '' },
      totalMarks: { type: Number, default: null },
      sections: [{ name: String, questions: Number, marks: Number }],
    },
    importantDates: [
      {
        event: { type: String, required: true },
        date: { type: Date },
        description: { type: String, default: '' },
      },
    ],
    eligibility: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    pageFeatures: {
      faq: { type: Boolean, default: true },
      discussion: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

examSchema.index({ name: 'text' });

examSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('Exam', examSchema);
