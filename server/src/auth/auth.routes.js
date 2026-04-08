const router = require('express').Router();
const ctrl = require('./auth.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('./auth.validation');
const { authenticate } = require('../middlewares/authenticate');

router.post('/register', validate(schema.register), ctrl.register);
router.post('/login', validate(schema.login), ctrl.login);
router.post('/refresh', validate(schema.refreshToken), ctrl.refreshToken);
router.post('/logout', ctrl.logout);

// Protected
router.get('/me', authenticate, ctrl.me);
router.patch('/me', authenticate, validate(schema.updateProfile), ctrl.updateProfile);
router.post('/change-password', authenticate, validate(schema.changePassword), ctrl.changePassword);

module.exports = router;
