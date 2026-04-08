const router = require('express').Router();
const ctrl = require('../controllers/page.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/page.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');
const { authorizeOrAssigned, checkAssignedItem } = require('../middlewares/authorizeOrAssigned');

router.post('/', authenticate, authorize('page:create'), validate(schema.createPage), ctrl.createPage);
router.get('/', authenticate, authorizeOrAssigned('page:read', 'page:read-assigned', 'page', 'read'), ctrl.getPages);
router.get('/:id', authenticate, authorizeOrAssigned('page:read', 'page:read-assigned', 'page', 'read'), checkAssignedItem(), ctrl.getPageById);
router.patch('/:id', authenticate, authorizeOrAssigned('page:update', 'page:update-assigned', 'page', 'update'), checkAssignedItem(), validate(schema.updatePage), ctrl.updatePage);
router.delete('/:id', authenticate, authorizeOrAssigned('page:delete', 'page:delete-assigned', 'page', 'delete'), checkAssignedItem(), ctrl.deletePage);
router.patch('/:id/publish', authenticate, authorizeOrAssigned('page:publish', 'page:publish-assigned', 'page', 'publish'), checkAssignedItem(), validate(schema.publish), ctrl.publishPage);

module.exports = router;
