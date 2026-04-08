const asyncHandler = require('../middlewares/asyncHandler');
const leadService = require('../services/lead.service');
const ApiResponse = require('../utils/ApiResponse');

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body);
  ApiResponse.created(res, 'Lead created successfully', lead);
});

const buildLeadFilter = (query) => {
  const { search, status, priority, assignedTo, college, dateFrom, dateTo } = query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  if (college) {
    filter.college = college;
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  return filter;
};

const getLeads = asyncHandler(async (req, res) => {
  const { page, limit, sort } = req.query;
  const filter = buildLeadFilter(req.query);

  const result = await leadService.getLeads(filter, { page, limit, sort });
  ApiResponse.paginated(res, 'Leads retrieved successfully', result);
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id);
  ApiResponse.success(res, 'Lead retrieved successfully', lead);
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body);
  ApiResponse.success(res, 'Lead updated successfully', lead);
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id);
  ApiResponse.success(res, 'Lead deleted successfully');
});

const changeStatus = asyncHandler(async (req, res) => {
  const lead = await leadService.changeStatus(req.params.id, {
    status: req.body.status,
    note: req.body.note,
    changedBy: req.user._id,
  });
  ApiResponse.success(res, 'Lead status updated successfully', lead);
});

const assignLead = asyncHandler(async (req, res) => {
  const lead = await leadService.assignLead(req.params.id, req.body.assignedTo);
  ApiResponse.success(res, 'Lead assigned successfully', lead);
});

const addNote = asyncHandler(async (req, res) => {
  const lead = await leadService.addNote(req.params.id, {
    content: req.body.content,
    createdBy: req.user._id,
  });
  ApiResponse.success(res, 'Note added successfully', lead);
});

const exportLeads = asyncHandler(async (req, res) => {
  const filter = buildLeadFilter(req.query);
  const leads = await leadService.exportLeads(filter);

  const csvHeader = 'Name,Email,Phone,Status,Priority,Assigned To,College,Course,Tags,Created At';
  const csvRows = leads.map((lead) => {
    const assignedName = lead.assignedTo
      ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}`
      : '';
    const collegeName = lead.college ? lead.college.name : '';
    const courseName = lead.course ? lead.course.name : '';
    const tags = (lead.tags || []).join('; ');
    const createdAt = new Date(lead.createdAt).toISOString();

    return [
      lead.name,
      lead.email,
      lead.phone,
      lead.status,
      lead.priority,
      assignedName,
      collegeName,
      courseName,
      tags,
      createdAt,
    ]
      .map((field) => `"${String(field || '').replace(/"/g, '""')}"`)
      .join(',');
  });

  const csv = [csvHeader, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csv);
});

const bulkAction = asyncHandler(async (req, res) => {
  const { ids, action, value } = req.body;
  const count = await leadService.bulkAction(ids, action, value, req.user._id);
  ApiResponse.success(res, `Bulk ${action} completed for ${count} leads`, { count });
});

const getLeadStats = asyncHandler(async (req, res) => {
  const stats = await leadService.getLeadStats();
  ApiResponse.success(res, 'Lead statistics retrieved successfully', stats);
});

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  changeStatus,
  assignLead,
  addNote,
  exportLeads,
  getLeadStats,
  bulkAction,
};
