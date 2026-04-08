export const COLLEGE_STATUS = ['draft', 'published', 'archived'] as const;
export const COLLEGE_TYPES = ['public', 'private', 'deemed', 'autonomous'] as const;
export const COURSE_LEVELS = ['undergraduate', 'postgraduate', 'diploma', 'doctorate', 'certificate'] as const;
export const EXAM_TYPES = ['national', 'state', 'university', 'institutional'] as const;
export const CONTENT_TYPES = ['richtext', 'table', 'faq', 'gallery', 'list'] as const;
export const FORM_PURPOSES = ['lead_capture', 'review', 'generic'] as const;
export const FORM_FIELD_TYPES = ['text', 'email', 'phone', 'number', 'dropdown', 'checkbox', 'radio', 'textarea', 'date', 'file', 'hidden'] as const;
export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost', 'closed'] as const;
export const LEAD_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const;
export const DISCUSSION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export const SEO_TARGET_TYPES = ['college', 'course', 'exam', 'page'] as const;
export const PAGE_STATUSES = ['draft', 'published', 'archived'] as const;
export const EXAM_MODES = ['online', 'offline', 'both'] as const;
export const DURATION_UNITS = ['years', 'months'] as const;
export const FEE_PER = ['year', 'semester', 'total'] as const;
export const POST_SUBMIT_ACTIONS = ['message', 'redirect', 'both'] as const;
export const LEAD_FIELD_MAPPINGS = [null, 'name', 'email', 'phone', 'college', 'course', 'message'] as const;

export type CollegeStatus = (typeof COLLEGE_STATUS)[number];
export type CollegeType = (typeof COLLEGE_TYPES)[number];
export type CourseLevel = (typeof COURSE_LEVELS)[number];
export type ExamType = (typeof EXAM_TYPES)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];
export type FormPurpose = (typeof FORM_PURPOSES)[number];
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];
export type DiscussionStatus = (typeof DISCUSSION_STATUSES)[number];
export type PageStatus = (typeof PAGE_STATUSES)[number];
export type SeoTargetType = (typeof SEO_TARGET_TYPES)[number];

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const COLLEGE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export const REVIEW_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const DISCUSSION_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const PAGE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-brand-100 text-brand-800',
  urgent: 'bg-red-100 text-red-800',
};
