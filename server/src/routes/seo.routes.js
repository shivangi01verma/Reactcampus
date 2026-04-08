const router = require('express').Router();
const ctrl = require('../controllers/seo.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/seo.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('seo:create'), validate(schema.createSEO), ctrl.createSEO);
router.get('/', authenticate, authorize('seo:read'), ctrl.getSEOEntries);
router.get('/:id', authenticate, authorize('seo:read'), ctrl.getSEOById);
router.patch('/:id', authenticate, authorize('seo:update'), validate(schema.updateSEO), ctrl.updateSEO);
router.delete('/:id', authenticate, authorize('seo:delete'), ctrl.deleteSEO);

module.exports = router;
