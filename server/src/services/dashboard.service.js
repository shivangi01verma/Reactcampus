const College = require('../models/College.model');
const Course = require('../models/Course.model');
const Exam = require('../models/Exam.model');
const Lead = require('../models/Lead.model');
const User = require('../models/User.model');
const DynamicForm = require('../models/DynamicForm.model');
const AuditLog = require('../models/AuditLog.model');

/**
 * Get dashboard summary statistics.
 * Returns total counts for colleges, courses, exams, leads, users, and forms.
 */
const getStats = async () => {
  const [totalColleges, publishedColleges, totalCourses, totalExams, totalLeads, totalUsers] = await Promise.all([
    College.countDocuments({ deletedAt: null }),
    College.countDocuments({ deletedAt: null, status: 'published' }),
    Course.countDocuments({ deletedAt: null }),
    Exam.countDocuments({ deletedAt: null }),
    Lead.countDocuments({ deletedAt: null }),
    User.countDocuments({ deletedAt: null }),
  ]);

  return { totalColleges, publishedColleges, totalCourses, totalExams, totalLeads, totalUsers };
};

/**
 * Get lead pipeline: leads grouped by status.
 */
const getLeadPipeline = async () => {
  const pipeline = await Lead.aggregate([
    { $match: { deletedAt: null } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return pipeline.map((item) => ({
    status: item._id,
    count: item.count,
  }));
};

/**
 * Get recent activity: the last 20 audit log entries.
 */
const getRecentActivity = async () => {
  const entries = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'firstName lastName email');

  return entries.map((entry) => {
    const userName = entry.user
      ? `${entry.user.firstName} ${entry.user.lastName}`
      : 'System';
    return {
      type: entry.action,
      message: `${userName} ${entry.action} a ${entry.resource}`,
      timestamp: entry.createdAt,
      user: userName,
    };
  });
};

module.exports = {
  getStats,
  getLeadPipeline,
  getRecentActivity,
};
