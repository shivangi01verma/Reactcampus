const router = require('express').Router();
const ctrl = require('../controllers/permission.controller');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.get('/', authenticate, authorize('permission:read'), ctrl.getPermissions);

module.exports = router;
