const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/review.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/', authenticate, authorize('review:read'), ctrl.getReviews);
router.get('/:id', authenticate, authorize('review:read'), ctrl.getReviewById);
router.patch('/:id/moderate', authenticate, authorize('review:moderate'), validate(schema.moderateReview), ctrl.moderateReview);
router.delete('/:id', authenticate, authorize('review:delete'), ctrl.deleteReview);

module.exports = router;
