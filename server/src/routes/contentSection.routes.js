const router = require('express').Router();
const ctrl = require('../controllers/contentSection.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/contentSection.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('content-section:create'), validate(schema.createContentSection), ctrl.create);
router.get('/', authenticate, authorize('content-section:read'), validate(schema.listContentSections), ctrl.getByCollege);
router.get('/:id', authenticate, authorize('content-section:read'), ctrl.getById);
router.patch('/:id', authenticate, authorize('content-section:update'), validate(schema.updateContentSection), ctrl.update);
router.delete('/:id', authenticate, authorize('content-section:delete'), ctrl.remove);

module.exports = router;
