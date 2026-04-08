const mongoose = require('mongoose');
const { DISCUSSION_STATUSES } = require('../utils/constants');

const discussionSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      default: null,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    authorName: { type: String, trim: true, default: 'Anonymous' },
    authorEmail: { type: String, trim: true, default: '' },
    content: { type: String, required: true, trim: true },
    status: { type: String, enum: DISCUSSION_STATUSES, default: 'pending' },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

discussionSchema.index({ college: 1, status: 1 });
discussionSchema.index({ course: 1, status: 1 });
discussionSchema.index({ exam: 1, status: 1 });

module.exports = mongoose.model('Discussion', discussionSchema);
