const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/category.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('category:create'), validate(schema.createCategory), ctrl.createCategory);
router.get('/', authenticate, authorize('category:read'), ctrl.getCategories);
router.get('/:id', authenticate, authorize('category:read'), validate(schema.getCategory), ctrl.getCategoryById);
router.patch('/:id', authenticate, authorize('category:update'), validate(schema.updateCategory), ctrl.updateCategory);
router.delete('/:id', authenticate, authorize('category:delete'), validate(schema.deleteCategory), ctrl.deleteCategory);

module.exports = router;
