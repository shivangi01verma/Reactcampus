const COLLEGE_STATUS = ['draft', 'published', 'archived'];
const COLLEGE_TYPES = ['public', 'private', 'deemed', 'autonomous'];
const COURSE_LEVELS = ['undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate'];
const EXAM_TYPES = ['national', 'state', 'university', 'institutional'];
const CONTENT_TYPES = ['richtext', 'table', 'faq', 'gallery', 'list'];
const FORM_PURPOSES = ['lead_capture', 'review', 'generic'];
const FORM_FIELD_TYPES = ['text', 'email', 'phone', 'number', 'dropdown', 'checkbox', 'radio', 'textarea', 'date', 'file', 'hidden'];
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost', 'closed'];
const LEAD_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const REVIEW_STATUSES = ['pending', 'approved', 'rejected'];
const DISCUSSION_STATUSES = ['pending', 'approved', 'rejected'];

const CONTENT_ASSIGNMENT_TYPES = ['college', 'page'];
const CONTENT_ASSIGNMENT_SCOPES = ['individual', 'category'];
const CONTENT_ASSIGNMENT_ACTIONS = ['read', 'update', 'delete', 'publish'];

module.exports = {
  COLLEGE_STATUS,
  COLLEGE_TYPES,
  COURSE_LEVELS,
  EXAM_TYPES,
  CONTENT_TYPES,
  FORM_PURPOSES,
  FORM_FIELD_TYPES,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  REVIEW_STATUSES,
  DISCUSSION_STATUSES,
  CONTENT_ASSIGNMENT_TYPES,
  CONTENT_ASSIGNMENT_SCOPES,
  CONTENT_ASSIGNMENT_ACTIONS,
};
