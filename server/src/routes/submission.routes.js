const router = require('express').Router();
const ctrl = require('../controllers/submission.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/', authenticate, authorize('form:view-submissions'), ctrl.getSubmissions);
router.get('/:id', authenticate, authorize('form:view-submissions'), ctrl.getSubmissionById);

module.exports = router;
