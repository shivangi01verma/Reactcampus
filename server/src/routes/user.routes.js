const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/user.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('user:create'), validate(schema.createUser), ctrl.createUser);
router.get('/', authenticate, authorize('user:read'), ctrl.getUsers);
router.get('/:id', authenticate, authorize('user:read'), ctrl.getUserById);
router.patch('/:id', authenticate, authorize('user:update'), validate(schema.updateUser), ctrl.updateUser);
router.delete('/:id', authenticate, authorize('user:delete'), ctrl.deleteUser);
router.patch('/:id/activate', authenticate, authorize('user:activate'), ctrl.activateUser);
router.patch('/:id/roles', authenticate, authorize('user:assign-role'), validate(schema.assignRoles), ctrl.assignRoles);

module.exports = router;
