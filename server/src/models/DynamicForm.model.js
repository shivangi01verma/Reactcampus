const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { FORM_PURPOSES, FORM_FIELD_TYPES } = require('../utils/constants');

const fieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, default: () => uuidv4() },
    type: { type: String, enum: FORM_FIELD_TYPES, required: true },
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    placeholder: { type: String, default: '' },
    defaultValue: { type: mongoose.Schema.Types.Mixed, default: null },
    validation: {
      required: { type: Boolean, default: false },
      minLength: { type: Number, default: null },
      maxLength: { type: Number, default: null },
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      pattern: { type: String, default: null },
      customMessage: { type: String, default: '' },
    },
    options: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0 },
    conditionalOn: {
      fieldName: { type: String, default: null },
      value: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    leadFieldMapping: {
      type: String,
      default: null,
      enum: [null, 'name', 'email', 'phone', 'college', 'course', 'message'],
    },
  },
  { _id: false }
);

const dynamicFormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    purpose: { type: String, enum: FORM_PURPOSES, default: 'generic' },
    fields: [fieldSchema],
    postSubmitAction: {
      type: String,
      enum: ['message', 'redirect', 'both'],
      default: 'message',
    },
    successMessage: { type: String, default: 'Thank you for your submission!' },
    redirectUrl: { type: String, default: '' },
    assignedPages: [
      {
        pageType: { type: String, required: true },
        entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
        displayAs: { type: String, enum: ['popup', 'inline', 'slide_in'], default: 'popup' },
        trigger: { type: String, enum: ['immediate', 'delay', 'scroll', 'exit_intent'], default: 'delay' },
        delaySeconds: { type: Number, default: 5, min: 0, max: 300 },
        scrollPercent: { type: Number, default: 50, min: 0, max: 100 },
        showOnce: { type: Boolean, default: true },
      },
    ],
    visibility: {
      requiresAuth: { type: Boolean, default: false },
      allowedRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    },
    isPublished: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

dynamicFormSchema.index({ isPublished: 1, deletedAt: 1 });
dynamicFormSchema.index({ 'assignedPages.pageType': 1, 'assignedPages.entityId': 1 });

dynamicFormSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('DynamicForm', dynamicFormSchema);
