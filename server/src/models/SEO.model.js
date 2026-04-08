const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      required: true,
      enum: ['college', 'course', 'exam', 'page'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    slug: { type: String, default: '' },
    metaTitle: { type: String, trim: true, default: '' },
    metaDescription: { type: String, trim: true, default: '' },
    metaKeywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, default: '' },
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    ogType: { type: String, default: 'website' },
    twitterCard: { type: String, default: 'summary_large_image' },
    structuredData: { type: mongoose.Schema.Types.Mixed, default: null },
    robots: { type: String, default: 'index, follow' },
  },
  { timestamps: true }
);

seoSchema.index({ targetType: 1, targetId: 1 }, { unique: true, sparse: true });
seoSchema.index({ targetType: 1, slug: 1 });

module.exports = mongoose.model('SEO', seoSchema);
