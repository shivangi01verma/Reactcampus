const router = require('express').Router();
const ctrl = require('../controllers/contentAssignment.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/contentAssignment.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('assignment:create'), validate(schema.createAssignment), ctrl.createAssignment);
router.get('/', authenticate, authorize('assignment:read'), ctrl.getAssignments);
router.get('/:id', authenticate, authorize('assignment:read'), validate(schema.getAssignment), ctrl.getAssignmentById);
router.patch('/:id', authenticate, authorize('assignment:update'), validate(schema.updateAssignment), ctrl.updateAssignment);
router.delete('/:id', authenticate, authorize('assignment:delete'), validate(schema.deleteAssignment), ctrl.deleteAssignment);

module.exports = router;
