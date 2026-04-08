const mongoose = require('mongoose');
const { LEAD_STATUSES, LEAD_PRIORITIES } = require('../utils/constants');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    source: {
      form: { type: mongoose.Schema.Types.ObjectId, ref: 'DynamicForm', default: null },
      submission: { type: mongoose.Schema.Types.ObjectId, ref: 'FormSubmission', default: null },
      channel: { type: String, default: 'form' },
    },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', default: null },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    status: { type: String, enum: LEAD_STATUSES, default: 'new' },
    statusHistory: [
      {
        from: { type: String },
        to: { type: String, required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    priority: { type: String, enum: LEAD_PRIORITIES, default: 'medium' },
    tags: [{ type: String, trim: true }],
    notes: [
      {
        content: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1, assignedTo: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ college: 1 });
leadSchema.index({ deletedAt: 1 });

leadSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('Lead', leadSchema);
