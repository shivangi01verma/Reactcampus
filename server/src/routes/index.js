const router = require('express').Router();

router.use('/auth', require('../auth/auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/roles', require('./role.routes'));
router.use('/permissions', require('./permission.routes'));
router.use('/colleges', require('./college.routes'));
router.use('/categories', require('./category.routes'));
router.use('/courses', require('./course.routes'));
router.use('/exams', require('./exam.routes'));
router.use('/content-sections', require('./contentSection.routes'));
router.use('/forms', require('./form.routes'));
router.use('/submissions', require('./submission.routes'));
router.use('/leads', require('./lead.routes'));
router.use('/reviews', require('./review.routes'));
router.use('/discussions', require('./discussion.routes'));
router.use('/seo', require('./seo.routes'));
router.use('/pages', require('./page.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/site-settings', require('./siteSettings.routes'));
router.use('/content-assignments', require('./contentAssignment.routes'));
router.use('/public', require('./public.routes'));

module.exports = router;
