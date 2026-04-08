const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DynamicForm',
      required: true,
    },
    formVersion: { type: Number, required: true },
    formSnapshot: { type: mongoose.Schema.Types.Mixed, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    pageContext: {
      pageType: { type: String, default: '' },
      entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
      url: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

formSubmissionSchema.index({ form: 1, createdAt: -1 });
formSubmissionSchema.index({ submittedBy: 1 });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
