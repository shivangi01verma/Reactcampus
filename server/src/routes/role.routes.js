const router = require('express').Router();
const ctrl = require('../controllers/role.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/role.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('role:create'), validate(schema.createRole), ctrl.createRole);
router.get('/', authenticate, authorize('role:read'), ctrl.getRoles);
router.get('/:id', authenticate, authorize('role:read'), ctrl.getRoleById);
router.patch('/:id', authenticate, authorize('role:update'), validate(schema.updateRole), ctrl.updateRole);
router.delete('/:id', authenticate, authorize('role:delete'), ctrl.deleteRole);
router.patch('/:id/permissions', authenticate, authorize('role:assign-permission'), validate(schema.assignPermissions), ctrl.assignPermissions);

module.exports = router;
