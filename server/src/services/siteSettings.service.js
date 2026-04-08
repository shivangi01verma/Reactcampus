const SiteSettings = require('../models/SiteSettings.model');
const AuditLog = require('../models/AuditLog.model');

/**
 * Get site settings (admin - full data).
 */
const getSiteSettings = async () => {
  let settings = await SiteSettings.findOne()
    .populate('featuredColleges', 'name slug type location ranking')
    .populate('featuredCourses', 'name slug level duration stream')
    .populate('featuredExams', 'name slug examType conductedBy')
    .populate('updatedBy', 'firstName lastName');

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  return settings;
};

/**
 * Get public site settings (filters unpublished/inactive items).
 */
const getPublicSiteSettings = async () => {
  let settings = await SiteSettings.findOne()
    .populate({
      path: 'featuredColleges',
      match: { status: 'published', deletedAt: null },
      select: 'name slug type location fees ranking established logo accreditation',
    })
    .populate({
      path: 'featuredCourses',
      match: { isActive: true, deletedAt: null },
      select: 'name slug level duration stream fees',
    })
    .populate({
      path: 'featuredExams',
      match: { isActive: true, deletedAt: null },
      select: 'name slug examType conductedBy pattern',
    });

  if (!settings) {
    settings = await SiteSettings.create({});
  }

  // Filter out null entries (items that didn't match populate conditions)
  const obj = settings.toObject();
  obj.featuredColleges = (obj.featuredColleges || []).filter(Boolean);
  obj.featuredCourses = (obj.featuredCourses || []).filter(Boolean);
  obj.featuredExams = (obj.featuredExams || []).filter(Boolean);

  return obj;
};

/**
 * Update site settings (partial update with upsert).
 */
const updateSiteSettings = async (data, userId) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
  }

  for (const [key, value] of Object.entries(data)) {
    settings.set(key, value);
  }
  settings.updatedBy = userId;
  await settings.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'site-settings',
    resourceId: settings._id,
    details: { updatedFields: Object.keys(data) },
  });

  return SiteSettings.findById(settings._id)
    .populate('featuredColleges', 'name slug type location ranking')
    .populate('featuredCourses', 'name slug level duration stream')
    .populate('featuredExams', 'name slug examType conductedBy');
};

module.exports = {
  getSiteSettings,
  getPublicSiteSettings,
  updateSiteSettings,
};
