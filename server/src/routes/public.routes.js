const mongoose = require('mongoose');
const router = require('express').Router();
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validateRequest');
const { optionalAuth } = require('../middlewares/authenticate');
const College = require('../models/College.model');
const Course = require('../models/Course.model');
const Exam = require('../models/Exam.model');
const Review = require('../models/Review.model');
const ContentSection = require('../models/ContentSection.model');
const DynamicForm = require('../models/DynamicForm.model');
const SEO = require('../models/SEO.model');
const submissionService = require('../services/submission.service');
const reviewCtrl = require('../controllers/review.controller');
const reviewSchema = require('../validations/review.validation');
const Discussion = require('../models/Discussion.model');
const discussionCtrl = require('../controllers/discussion.controller');
const discussionSchema = require('../validations/discussion.validation');
const Lead = require('../models/Lead.model');
const siteSettingsService = require('../services/siteSettings.service');
const siteSettingsSchema = require('../validations/siteSettings.validation');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// List active categories
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const Category = require('../models/Category.model');
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    ApiResponse.success(res, 'Categories retrieved successfully', categories);
  })
);

// List published colleges
router.get(
  '/colleges',
  asyncHandler(async (req, res) => {
    const { type, category, city, state, search, page = 1, limit = 20 } = req.query;
    // Express qs parser turns "location.city" into req.query.location = { city: ... }
    const qCity = city || req.query.location?.city;
    const qState = state || req.query.location?.state;
    const filter = { status: 'published' };

    if (type) filter.type = type;
    if (category) filter.categories = { $in: Array.isArray(category) ? category : [category] };
    if (qCity) filter['location.city'] = { $regex: qCity, $options: 'i' };
    if (qState) filter['location.state'] = { $regex: qState, $options: 'i' };
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const [docs, total] = await Promise.all([
      College.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      College.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Colleges retrieved successfully',
      data: docs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Get college by slug (must be published)
router.get(
  '/colleges/:slug',
  asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, status: 'published' })
      .populate('courses')
      .populate('exams');

    if (!college) {
      throw new ApiError(404, 'College not found');
    }

    ApiResponse.success(res, 'College retrieved successfully', college);
  })
);

// Get approved reviews for a college by slug
router.get(
  '/colleges/:slug/reviews',
  asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, status: 'published' });
    if (!college) {
      throw new ApiError(404, 'College not found');
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);
    const filter = { college: college._id, status: 'approved' };

    const [docs, total] = await Promise.all([
      Review.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Review.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: docs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Get visible content sections for a college by slug
router.get(
  '/colleges/:slug/sections',
  asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, status: 'published' });
    if (!college) {
      throw new ApiError(404, 'College not found');
    }

    const sections = await ContentSection.find({ college: college._id, isVisible: true }).sort({ order: 1 });
    ApiResponse.success(res, 'Content sections retrieved successfully', sections);
  })
);

// Get visible content sections for an exam by slug
router.get(
  '/exams/:slug/sections',
  asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ slug: req.params.slug, isActive: true });
    if (!exam) {
      throw new ApiError(404, 'Exam not found');
    }

    const sections = await ContentSection.find({ exam: exam._id, isVisible: true }).sort({ order: 1 });
    ApiResponse.success(res, 'Content sections retrieved successfully', sections);
  })
);

// List active courses
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const { search, level, stream, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (level) filter.level = level;
    if (stream) filter.stream = stream;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const [docs, total] = await Promise.all([
      Course.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Course.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: docs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Get course by slug
router.get(
  '/courses/:slug',
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    ApiResponse.success(res, 'Course retrieved successfully', course);
  })
);

// List colleges offering a course
router.get(
  '/courses/:slug/colleges',
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }
    const colleges = await College.find({ courses: course._id, status: 'published' })
      .select('name slug type location ranking established fees logo accreditation')
      .sort({ ranking: 1, name: 1 })
      .limit(50);
    ApiResponse.success(res, 'Colleges retrieved successfully', colleges);
  })
);

// Get visible content sections for a course by slug
router.get(
  '/courses/:slug/sections',
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) {
      throw new ApiError(404, 'Course not found');
    }

    const sections = await ContentSection.find({ course: course._id, isVisible: true }).sort({ order: 1 });
    ApiResponse.success(res, 'Content sections retrieved successfully', sections);
  })
);

// List active exams
router.get(
  '/exams',
  asyncHandler(async (req, res) => {
    const { search, examType, category, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (examType) filter.examType = examType;
    if (category) filter.categories = { $in: Array.isArray(category) ? category : [category] };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const [docs, total] = await Promise.all([
      Exam.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Exam.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Exams retrieved successfully',
      data: docs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Get exam by slug
router.get(
  '/exams/:slug',
  asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ slug: req.params.slug, isActive: true });
    if (!exam) {
      throw new ApiError(404, 'Exam not found');
    }
    ApiResponse.success(res, 'Exam retrieved successfully', exam);
  })
);

// Get forms assigned to a specific page type + entity
router.get(
  '/forms/for-page',
  asyncHandler(async (req, res) => {
    const { pageType, entityId } = req.query;
    if (!pageType) throw new ApiError(400, 'pageType is required');

    const allType = `all_${pageType}s`; // e.g. 'college' -> 'all_colleges'

    const query = {
      isPublished: true,
      $or: [
        { 'assignedPages.pageType': allType },
        { 'assignedPages.pageType': 'homepage', ...(pageType === 'homepage' ? {} : { _id: { $exists: false } }) },
      ],
    };

    if (pageType === 'homepage') {
      query.$or = [{ 'assignedPages.pageType': 'homepage' }];
    } else if (entityId) {
      query.$or.push({
        'assignedPages': {
          $elemMatch: {
            pageType,
            entityId: new mongoose.Types.ObjectId(entityId),
          },
        },
      });
    }

    const forms = await DynamicForm.find(query).select(
      'title slug description fields postSubmitAction successMessage redirectUrl assignedPages'
    );

    const result = forms.map((form) => {
      const assignment =
        form.assignedPages.find((p) => p.pageType === allType) ||
        form.assignedPages.find((p) => p.pageType === 'homepage' && pageType === 'homepage') ||
        form.assignedPages.find(
          (p) => p.pageType === pageType && entityId && p.entityId && p.entityId.toString() === entityId
        );

      const { assignedPages, ...formData } = form.toObject();
      return { ...formData, displayConfig: assignment || null };
    }).filter((f) => f.displayConfig);

    ApiResponse.success(res, 'Forms retrieved successfully', result);
  })
);

// Get form schema (published forms only)
router.get(
  '/forms/:slug',
  asyncHandler(async (req, res) => {
    const form = await DynamicForm.findOne({ slug: req.params.slug, isPublished: true });
    if (!form) {
      throw new ApiError(404, 'Form not found');
    }

    ApiResponse.success(res, 'Form retrieved successfully', {
      title: form.title,
      description: form.description,
      fields: form.fields,
      successMessage: form.successMessage,
      postSubmitAction: form.postSubmitAction,
    });
  })
);

// Submit form (public)
router.post(
  '/forms/:slug/submit',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const form = await DynamicForm.findOne({ slug: req.params.slug, isPublished: true });
    if (!form) {
      throw new ApiError(404, 'Form not found');
    }

    const submission = await submissionService.submitForm(form._id, {
      data: req.body.data,
      pageContext: req.body.pageContext,
      submittedBy: req.user?._id,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    ApiResponse.created(res, 'Form submitted successfully', submission);
  })
);

// Submit review (public)
router.post('/reviews', validate(reviewSchema.submitReview), reviewCtrl.submitReview);

// Submit discussion (public)
router.post('/discussions', optionalAuth, validate(discussionSchema.submitDiscussion), discussionCtrl.submitDiscussion);

// Get approved discussions for a college by slug
router.get(
  '/colleges/:slug/discussions',
  asyncHandler(async (req, res) => {
    const college = await College.findOne({ slug: req.params.slug, status: 'published' });
    if (!college) throw new ApiError(404, 'College not found');
    if (college.pageFeatures && college.pageFeatures.discussion === false) {
      return ApiResponse.success(res, 'Discussions disabled', []);
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);
    const filter = { college: college._id, status: 'approved' };

    const [docs, total] = await Promise.all([
      Discussion.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Discussion.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Discussions retrieved successfully',
      data: docs,
      pagination: { total, page: parseInt(page, 10), limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  })
);

// Get approved discussions for a course by slug
router.get(
  '/courses/:slug/discussions',
  asyncHandler(async (req, res) => {
    const course = await Course.findOne({ slug: req.params.slug, isActive: true });
    if (!course) throw new ApiError(404, 'Course not found');
    if (course.pageFeatures && course.pageFeatures.discussion === false) {
      return ApiResponse.success(res, 'Discussions disabled', []);
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);
    const filter = { course: course._id, status: 'approved' };

    const [docs, total] = await Promise.all([
      Discussion.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Discussion.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Discussions retrieved successfully',
      data: docs,
      pagination: { total, page: parseInt(page, 10), limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  })
);

// Get approved discussions for an exam by slug
router.get(
  '/exams/:slug/discussions',
  asyncHandler(async (req, res) => {
    const exam = await Exam.findOne({ slug: req.params.slug, isActive: true });
    if (!exam) throw new ApiError(404, 'Exam not found');
    if (exam.pageFeatures && exam.pageFeatures.discussion === false) {
      return ApiResponse.success(res, 'Discussions disabled', []);
    }

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);
    const filter = { exam: exam._id, status: 'approved' };

    const [docs, total] = await Promise.all([
      Discussion.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Discussion.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Discussions retrieved successfully',
      data: docs,
      pagination: { total, page: parseInt(page, 10), limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  })
);

// List published pages
router.get(
  '/pages',
  asyncHandler(async (req, res) => {
    const Page = require('../models/Page.model');
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { status: 'published' };

    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const limitNum = parseInt(limit, 10);

    const [docs, total] = await Promise.all([
      Page.find(filter)
        .select('title slug description metaTitle metaDescription createdAt')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Page.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Pages retrieved successfully',
      data: docs,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Get page by slug (must be published)
router.get(
  '/pages/:slug',
  asyncHandler(async (req, res) => {
    const Page = require('../models/Page.model');
    const page = await Page.findOne({ slug: req.params.slug, status: 'published' })
      .populate('collegeFilter.courses', 'name slug level')
      .populate('collegeFilter.exams', 'name slug');

    if (!page) {
      throw new ApiError(404, 'Page not found');
    }

    // If college listing is enabled, fetch matching colleges
    let colleges = [];
    if (page.collegeFilter && page.collegeFilter.enabled) {
      const collegeFilter = { status: 'published' };

      switch (page.collegeFilter.filterBy) {
        case 'course':
          if (page.collegeFilter.courses.length) {
            collegeFilter.courses = { $in: page.collegeFilter.courses.map((c) => c._id || c) };
          }
          break;
        case 'exam':
          if (page.collegeFilter.exams.length) {
            collegeFilter.exams = { $in: page.collegeFilter.exams.map((e) => e._id || e) };
          }
          break;
        case 'type':
          if (page.collegeFilter.collegeType) {
            collegeFilter.type = page.collegeFilter.collegeType;
          }
          break;
        case 'state':
          if (page.collegeFilter.state) {
            collegeFilter['location.state'] = { $regex: page.collegeFilter.state, $options: 'i' };
          }
          break;
        case 'city':
          if (page.collegeFilter.city) {
            collegeFilter['location.city'] = { $regex: page.collegeFilter.city, $options: 'i' };
          }
          break;
        case 'all':
        default:
          break;
      }

      colleges = await College.find(collegeFilter)
        .select('name slug type location fees ranking established')
        .limit(50)
        .sort({ ranking: 1, createdAt: -1 });
    }

    ApiResponse.success(res, 'Page retrieved successfully', {
      ...page.toObject(),
      colleges,
    });
  })
);

// Get SEO data for a target
router.get(
  '/seo/:targetType/:targetId',
  asyncHandler(async (req, res) => {
    const { targetType, targetId } = req.params;
    const seo = await SEO.findOne({ targetType, targetId });
    if (!seo) {
      throw new ApiError(404, 'SEO data not found');
    }
    ApiResponse.success(res, 'SEO data retrieved successfully', seo);
  })
);

// Get public site settings
router.get(
  '/site-settings',
  asyncHandler(async (req, res) => {
    const settings = await siteSettingsService.getPublicSiteSettings();
    ApiResponse.success(res, 'Site settings retrieved successfully', settings);
  })
);

// Submit contact form
router.post(
  '/contact',
  validate(siteSettingsSchema.submitContact),
  asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    await Lead.create({
      name,
      email,
      phone: phone || '',
      data: { message },
      source: { channel: 'contact_form' },
      status: 'new',
      statusHistory: [{ to: 'new', changedAt: new Date() }],
    });

    ApiResponse.created(res, 'Your message has been sent successfully');
  })
);

// College Insights (public analytics)
router.get(
  '/college-insights',
  asyncHandler(async (req, res) => {
    const analyticsService = require('../services/analytics.service');
    const insights = await analyticsService.getPublicInsights();
    ApiResponse.success(res, 'College insights retrieved successfully', insights);
  })
);

module.exports = router;
