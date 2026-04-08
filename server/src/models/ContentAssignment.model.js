const mongoose = require('mongoose');
const { CONTENT_ASSIGNMENT_TYPES, CONTENT_ASSIGNMENT_SCOPES, CONTENT_ASSIGNMENT_ACTIONS } = require('../utils/constants');

const contentAssignmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contentType: { type: String, enum: CONTENT_ASSIGNMENT_TYPES, required: true },
    scope: { type: String, enum: CONTENT_ASSIGNMENT_SCOPES, required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    categories: [{ type: String }],
    actions: {
      type: [{ type: String, enum: CONTENT_ASSIGNMENT_ACTIONS }],
      validate: [(v) => v.length >= 1, 'At least one action is required'],
    },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

contentAssignmentSchema.index({ user: 1, contentType: 1 });
contentAssignmentSchema.index({ contentId: 1 });
contentAssignmentSchema.index(
  { user: 1, contentType: 1, scope: 1, contentId: 1 },
  { unique: true, partialFilterExpression: { scope: 'individual' } }
);

module.exports = mongoose.model('ContentAssignment', contentAssignmentSchema);
