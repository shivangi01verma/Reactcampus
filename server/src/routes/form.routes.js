const router = require('express').Router();
const ctrl = require('../controllers/form.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/form.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('form:create'), validate(schema.createForm), ctrl.createForm);
router.get('/', authenticate, authorize('form:read'), ctrl.getForms);
router.get('/:id', authenticate, authorize('form:read'), ctrl.getFormById);
router.patch('/:id', authenticate, authorize('form:update'), validate(schema.updateForm), ctrl.updateForm);
router.delete('/:id', authenticate, authorize('form:delete'), ctrl.deleteForm);
router.patch('/:id/publish', authenticate, authorize('form:publish'), validate(schema.publishForm), ctrl.publishForm);
router.patch('/:id/pages', authenticate, authorize('form:update'), validate(schema.assignPages), ctrl.assignPages);

module.exports = router;
