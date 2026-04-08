const mongoose = require('mongoose');
const { REVIEW_STATUSES } = require('../utils/constants');

const reviewSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    authorName: { type: String, trim: true, default: 'Anonymous' },
    authorEmail: { type: String, trim: true, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    content: { type: String, trim: true, default: '' },
    aspects: {
      academics: { type: Number, min: 1, max: 5, default: null },
      faculty: { type: Number, min: 1, max: 5, default: null },
      infrastructure: { type: Number, min: 1, max: 5, default: null },
      placement: { type: Number, min: 1, max: 5, default: null },
      campus: { type: Number, min: 1, max: 5, default: null },
    },
    status: { type: String, enum: REVIEW_STATUSES, default: 'pending' },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reviewSchema.index({ college: 1, status: 1 });
reviewSchema.index({ user: 1, college: 1 });

module.exports = mongoose.model('Review', reviewSchema);
