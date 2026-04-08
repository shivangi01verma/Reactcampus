const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    description: { type: String, default: '' },

    contentBlocks: [
      {
        title: { type: String, default: '' },
        contentType: { type: String, enum: ['richtext', 'table', 'faq', 'list'], default: 'richtext' },
        content: { type: mongoose.Schema.Types.Mixed, default: null },
        order: { type: Number, default: 0 },
      },
    ],

    collegeFilter: {
      enabled: { type: Boolean, default: false },
      filterBy: { type: String, enum: ['course', 'exam', 'type', 'state', 'city', 'all'], default: 'all' },
      courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
      exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
      collegeType: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
    },

    sidebarLinks: [
      {
        title: { type: String, default: '' },
        links: [
          {
            label: { type: String, default: '' },
            url: { type: String, default: '' },
          },
        ],
      },
    ],

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String, trim: true }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

pageSchema.index({ title: 'text', description: 'text' });
pageSchema.index({ status: 1, deletedAt: 1 });

pageSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('Page', pageSchema);
