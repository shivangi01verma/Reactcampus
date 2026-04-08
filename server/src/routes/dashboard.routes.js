const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/stats', authenticate, authorize('dashboard:view'), ctrl.getStats);
router.get('/pipeline', authenticate, authorize('dashboard:view'), ctrl.getLeadPipeline);
router.get('/activity', authenticate, authorize('dashboard:analytics'), ctrl.getRecentActivity);
router.get('/analytics', authenticate, authorize('dashboard:analytics'), ctrl.getAnalytics);

module.exports = router;
