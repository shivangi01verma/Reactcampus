const mongoose = require('mongoose');
const DynamicForm = require('../models/DynamicForm.model');
const FormSubmission = require('../models/FormSubmission.model');
const Lead = require('../models/Lead.model');
const Review = require('../models/Review.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

/* ------------------------------------------------------------------ */
/*  Field-level validation helpers                                     */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a single field value against its definition.
 * Returns an error string or null.
 */
const _validateField = (field, value) => {
  const v = field.validation || {};
  const label = field.label;

  // Required check
  if (v.required) {
    if (value === undefined || value === null || value === '') {
      return `${label} is required`;
    }
    if (Array.isArray(value) && value.length === 0) {
      return `${label} is required`;
    }
  }

  // If value is empty and not required, skip further checks
  if (value === undefined || value === null || value === '') {
    return null;
  }

  // Type-specific validations
  switch (field.type) {
    case 'email':
      if (!EMAIL_RE.test(String(value))) {
        return `${label} must be a valid email address`;
      }
      break;

    case 'number': {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return `${label} must be a number`;
      }
      if (v.min !== null && v.min !== undefined && num < v.min) {
        return `${label} must be at least ${v.min}`;
      }
      if (v.max !== null && v.max !== undefined && num > v.max) {
        return `${label} must be at most ${v.max}`;
      }
      break;
    }

    case 'text':
    case 'textarea':
    case 'phone': {
      const str = String(value);
      if (v.minLength !== null && v.minLength !== undefined && str.length < v.minLength) {
        return `${label} must be at least ${v.minLength} characters`;
      }
      if (v.maxLength !== null && v.maxLength !== undefined && str.length > v.maxLength) {
        return `${label} must be at most ${v.maxLength} characters`;
      }
      if (v.pattern) {
        const re = new RegExp(v.pattern);
        if (!re.test(str)) {
          return v.customMessage || `${label} format is invalid`;
        }
      }
      break;
    }

    case 'dropdown':
    case 'radio': {
      const validValues = (field.options || []).map((o) => o.value);
      if (!validValues.includes(String(value))) {
        return `${label} has an invalid option`;
      }
      break;
    }

    case 'checkbox': {
      const validValues = (field.options || []).map((o) => o.value);
      const selected = Array.isArray(value) ? value : [value];
      for (const s of selected) {
        if (!validValues.includes(String(s))) {
          return `${label} contains an invalid option: ${s}`;
        }
      }
      break;
    }

    case 'date': {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        return `${label} must be a valid date`;
      }
      break;
    }

    default:
      break;
  }

  return null;
};

/* ------------------------------------------------------------------ */
/*  Main submit function                                               */
/* ------------------------------------------------------------------ */

/**
 * Submit a form: validate, save submission, and execute post-submit actions.
 */
const submitForm = async (formId, { data, pageContext, submittedBy, ip, userAgent }) => {
  // 1. Load form and verify it is published
  const form = await DynamicForm.findById(formId);
  if (!form) {
    throw new ApiError(404, 'Form not found');
  }
  if (!form.isPublished) {
    throw new ApiError(400, 'This form is not currently accepting submissions');
  }

  const fields = form.fields || [];
  const fieldNameSet = new Set(fields.map((f) => f.name));

  // 2. Validate data against form fields
  const errors = [];
  for (const field of fields) {
    const err = _validateField(field, data[field.name]);
    if (err) {
      errors.push({ field: field.name, message: err });
    }
  }

  if (errors.length > 0) {
    throw new ApiError(422, 'Validation failed', errors);
  }

  // 3. Sanitize data — only accept known field names
  const sanitizedData = {};
  for (const key of Object.keys(data)) {
    if (fieldNameSet.has(key)) {
      sanitizedData[key] = data[key];
    }
  }

  // 4. Save submission with frozen form snapshot
  const submission = await FormSubmission.create({
    form: form._id,
    formVersion: form.version,
    formSnapshot: fields,
    data: sanitizedData,
    submittedBy: submittedBy || null,
    ip: ip || '',
    userAgent: userAgent || '',
    pageContext: pageContext || {},
  });

  // 5. Post-submit actions based on form purpose
  if (form.purpose === 'lead_capture') {
    await _createLeadFromSubmission(form, sanitizedData, submission);
  } else if (form.purpose === 'review') {
    await _createReviewFromSubmission(form, sanitizedData, submission);
  }

  await AuditLog.create({
    user: submittedBy || null,
    action: 'submitted',
    resource: 'formSubmission',
    resourceId: submission._id,
    details: { formId: form._id, formTitle: form.title, purpose: form.purpose },
  });

  return submission;
};

/* ------------------------------------------------------------------ */
/*  Post-submit helpers                                                */
/* ------------------------------------------------------------------ */

/**
 * Auto-detect lead field from common field name patterns when no explicit mapping set.
 */
const AUTO_LEAD_FIELD_PATTERNS = {
  name: /^(name|full[_\s-]?name|your[_\s-]?name|student[_\s-]?name)$/i,
  email: /^(email|e[_\s-]?mail|email[_\s-]?address|your[_\s-]?email)$/i,
  phone: /^(phone|mobile|contact|phone[_\s-]?number|mobile[_\s-]?number|contact[_\s-]?number)$/i,
  message: /^(message|query|comment|remarks|description)$/i,
};

const _guessLeadField = (fieldName) => {
  for (const [leadField, pattern] of Object.entries(AUTO_LEAD_FIELD_PATTERNS)) {
    if (pattern.test(fieldName)) return leadField;
  }
  return null;
};

/**
 * Create a Lead from form submission using leadFieldMapping on each field.
 * Falls back to auto-detection from field names when no explicit mapping exists.
 */
const _createLeadFromSubmission = async (form, data, submission) => {
  const leadData = {
    source: {
      form: form._id,
      submission: submission._id,
      channel: 'form',
    },
    data: {},
  };

  const mappedKeys = new Set();

  // First pass: use explicit leadFieldMapping
  for (const field of form.fields) {
    if (field.leadFieldMapping && data[field.name] !== undefined) {
      leadData[field.leadFieldMapping] = data[field.name];
      mappedKeys.add(field.name);
    }
  }

  // Second pass: auto-detect from field name or label when no explicit mappings exist
  const hasExplicitMappings = mappedKeys.size > 0;
  if (!hasExplicitMappings) {
    for (const field of form.fields) {
      if (mappedKeys.has(field.name) || data[field.name] === undefined) continue;
      const guessed = _guessLeadField(field.name) || _guessLeadField(field.label);
      if (guessed && leadData[guessed] === undefined) {
        leadData[guessed] = data[field.name];
        mappedKeys.add(field.name);
      }
    }
  }

  // Unmapped fields go into lead.data
  for (const [key, value] of Object.entries(data)) {
    if (!mappedKeys.has(key)) {
      leadData.data[key] = value;
    }
  }

  // Ensure a name exists (required by Lead model)
  if (!leadData.name) {
    leadData.name = leadData.email || 'Unknown';
  }

  // If a college or course value is a valid ObjectId, keep it; otherwise move to data
  if (leadData.college && !mongoose.Types.ObjectId.isValid(leadData.college)) {
    leadData.data.college = leadData.college;
    delete leadData.college;
  }
  if (leadData.course && !mongoose.Types.ObjectId.isValid(leadData.course)) {
    leadData.data.course = leadData.course;
    delete leadData.course;
  }

  await Lead.create(leadData);
};

/**
 * Create a Review from form submission using leadFieldMapping hints.
 * Expected mappings: college (ObjectId), rating, title, content, authorName, authorEmail
 */
const _createReviewFromSubmission = async (form, data, submission) => {
  const reviewData = {};

  for (const field of form.fields) {
    if (field.leadFieldMapping && data[field.name] !== undefined) {
      // Re-use leadFieldMapping for review fields by convention
      reviewData[field.leadFieldMapping] = data[field.name];
    }
  }

  // Map common aliases
  const review = {
    college: reviewData.college || null,
    rating: Number(reviewData.rating) || 3,
    title: reviewData.title || '',
    content: reviewData.message || reviewData.content || '',
    authorName: reviewData.name || 'Anonymous',
    authorEmail: reviewData.email || '',
    status: 'pending',
  };

  if (review.college && !mongoose.Types.ObjectId.isValid(review.college)) {
    delete review.college;
  }

  if (review.college) {
    await Review.create(review);
  }
};

/* ------------------------------------------------------------------ */
/*  Read operations                                                    */
/* ------------------------------------------------------------------ */

/**
 * Get paginated list of submissions.
 */
const getSubmissions = async (query = {}, options = {}) => {
  const filter = {};

  if (query.form) {
    filter.form = query.form;
  }

  if (query.submittedBy) {
    filter.submittedBy = query.submittedBy;
  }

  return paginate(FormSubmission, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
    populate: options.populate || [
      { path: 'form', select: 'title slug purpose' },
      { path: 'submittedBy', select: 'firstName lastName email' },
    ],
  });
};

/**
 * Get a single submission by ID.
 */
const getSubmissionById = async (id) => {
  const submission = await FormSubmission.findById(id)
    .populate('form', 'title slug purpose fields')
    .populate('submittedBy', 'firstName lastName email');

  if (!submission) {
    throw new ApiError(404, 'Submission not found');
  }

  return submission;
};

module.exports = {
  submitForm,
  getSubmissions,
  getSubmissionById,
};
