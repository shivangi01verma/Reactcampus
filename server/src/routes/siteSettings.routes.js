const router = require('express').Router();
const ctrl = require('../controllers/siteSettings.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/siteSettings.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/', authenticate, authorize('site-settings:read'), ctrl.getSiteSettings);
router.patch('/', authenticate, authorize('site-settings:update'), validate(schema.updateSiteSettings), ctrl.updateSiteSettings);

module.exports = router;
