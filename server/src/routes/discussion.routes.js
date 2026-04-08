const router = require('express').Router();
const ctrl = require('../controllers/discussion.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/discussion.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/', authenticate, authorize('discussion:read'), ctrl.getDiscussions);
router.get('/:id', authenticate, authorize('discussion:read'), ctrl.getDiscussionById);
router.patch('/:id/moderate', authenticate, authorize('discussion:moderate'), validate(schema.moderateDiscussion), ctrl.moderateDiscussion);
router.delete('/:id', authenticate, authorize('discussion:delete'), ctrl.deleteDiscussion);

module.exports = router;
