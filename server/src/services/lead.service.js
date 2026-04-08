const Lead = require('../models/Lead.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/**
 * Create a new lead.
 */
const createLead = async (data, userId = null) => {
  const lead = await Lead.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'lead',
    resourceId: lead._id,
    details: { name: lead.name, email: lead.email, source: lead.source },
  });

  return lead;
};

/**
 * Get paginated list of leads.
 */
const getLeads = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  if (query.college) {
    filter.college = query.college;
  }

  if (query.course) {
    filter.course = query.course;
  }

  if (query.form) {
    filter['source.form'] = query.form;
  }

  if (query.tags && query.tags.length > 0) {
    filter.tags = { $in: query.tags };
  }

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }

  return paginate(Lead, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || [
      { path: 'college', select: 'name slug' },
      { path: 'course', select: 'name slug' },
      { path: 'assignedTo', select: 'firstName lastName' },
      { path: 'source.form', select: 'title slug' },
    ],
  });
};

/**
 * Get a single lead by ID.
 */
const getLeadById = async (id) => {
  const lead = await Lead.findById(id)
    .populate('college', 'name slug')
    .populate('course', 'name slug')
    .populate('assignedTo', 'firstName lastName email')
    .populate('source.form', 'title slug purpose')
    .populate('source.submission')
    .populate('statusHistory.changedBy', 'firstName lastName')
    .populate('notes.createdBy', 'firstName lastName');

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  return lead;
};

/**
 * Update lead data.
 */
const updateLead = async (id, data, userId = null) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  const allowedFields = ['name', 'email', 'phone', 'data', 'college', 'course', 'priority', 'tags'];
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      lead[key] = data[key];
    }
  }

  await lead.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'lead',
    resourceId: lead._id,
    details: { updatedFields: Object.keys(data) },
  });

  return lead;
};

/**
 * Soft-delete a lead.
 */
const deleteLead = async (id, userId = null) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  lead.deletedAt = new Date();
  await lead.save();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'lead',
    resourceId: lead._id,
    details: { name: lead.name },
  });

  return lead;
};

/**
 * Change lead status with history tracking.
 */
const changeStatus = async (id, { status, note, changedBy }) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  const previousStatus = lead.status;
  lead.status = status;
  lead.statusHistory.push({
    from: previousStatus,
    to: status,
    changedBy,
    changedAt: new Date(),
    note: note || '',
  });

  await lead.save();

  await AuditLog.create({
    user: changedBy,
    action: 'status_changed',
    resource: 'lead',
    resourceId: lead._id,
    details: { from: previousStatus, to: status, note },
  });

  return lead;
};

/**
 * Assign a lead to a user.
 */
const assignLead = async (id, assignedTo, userId = null) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  const previousAssignee = lead.assignedTo;
  lead.assignedTo = assignedTo;
  await lead.save();

  await AuditLog.create({
    user: userId,
    action: 'assigned',
    resource: 'lead',
    resourceId: lead._id,
    details: { previousAssignee, newAssignee: assignedTo },
  });

  return lead;
};

/**
 * Add a note to a lead.
 */
const addNote = async (id, { content, createdBy }) => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  lead.notes.push({
    content,
    createdBy,
    createdAt: new Date(),
  });

  await lead.save();

  await AuditLog.create({
    user: createdBy,
    action: 'note_added',
    resource: 'lead',
    resourceId: lead._id,
    details: { noteContent: content },
  });

  return lead;
};

/**
 * Get aggregate lead statistics.
 * Returns counts by status, by priority, total new today, and total this week.
 */
const getLeadStats = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const [byStatus, byPriority, newToday, newThisWeek] = await Promise.all([
    Lead.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
    Lead.countDocuments({ deletedAt: null, createdAt: { $gte: startOfDay } }),
    Lead.countDocuments({ deletedAt: null, createdAt: { $gte: startOfWeek } }),
  ]);

  return {
    byStatus: byStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byPriority: byPriority.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    newToday,
    newThisWeek,
  };
};

/**
 * Export all matching leads without pagination (for CSV export).
 */
const exportLeads = async (query = {}) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;
  if (query.college) filter.college = query.college;
  if (query.course) filter.course = query.course;
  if (query.form) filter['source.form'] = query.form;

  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }

  const leads = await Lead.find(filter)
    .sort({ createdAt: -1 })
    .populate('college', 'name')
    .populate('course', 'name')
    .populate('assignedTo', 'firstName lastName email')
    .populate('source.form', 'title');

  return leads;
};

/**
 * Perform bulk actions on multiple leads.
 */
const bulkAction = async (ids, action, value, userId = null) => {
  const leads = await Lead.find({ _id: { $in: ids }, deletedAt: null });
  let count = 0;

  for (const lead of leads) {
    if (action === 'changeStatus') {
      const previousStatus = lead.status;
      lead.status = value;
      lead.statusHistory.push({
        from: previousStatus,
        to: value,
        changedBy: userId,
        changedAt: new Date(),
        note: 'Bulk status change',
      });
      await lead.save();
      count++;
    } else if (action === 'assign') {
      lead.assignedTo = value;
      await lead.save();
      count++;
    } else if (action === 'delete') {
      lead.deletedAt = new Date();
      await lead.save();
      count++;
    }
  }

  await AuditLog.create({
    user: userId,
    action: `bulk_${action}`,
    resource: 'lead',
    resourceId: null,
    details: { ids, action, value, affectedCount: count },
  });

  return count;
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  changeStatus,
  assignLead,
  addNote,
  getLeadStats,
  exportLeads,
  bulkAction,
};
