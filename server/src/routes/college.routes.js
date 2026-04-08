const router = require('express').Router();
const ctrl = require('../controllers/college.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/college.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');
const { authorizeOrAssigned, checkAssignedItem } = require('../middlewares/authorizeOrAssigned');

router.post('/', authenticate, authorize('college:create'), validate(schema.createCollege), ctrl.createCollege);
router.get('/', authenticate, authorizeOrAssigned('college:read', 'college:read-assigned', 'college', 'read'), ctrl.getColleges);
router.get('/:id', authenticate, authorizeOrAssigned('college:read', 'college:read-assigned', 'college', 'read'), checkAssignedItem(), ctrl.getCollegeById);
router.patch('/:id', authenticate, authorizeOrAssigned('college:update', 'college:update-assigned', 'college', 'update'), checkAssignedItem(), validate(schema.updateCollege), ctrl.updateCollege);
router.delete('/:id', authenticate, authorizeOrAssigned('college:delete', 'college:delete-assigned', 'college', 'delete'), checkAssignedItem(), ctrl.deleteCollege);
router.patch('/:id/publish', authenticate, authorizeOrAssigned('college:publish', 'college:publish-assigned', 'college', 'publish'), checkAssignedItem(), validate(schema.publish), ctrl.publishCollege);
router.patch('/:id/courses', authenticate, authorize('college:manage-courses'), validate(schema.manageCourses), ctrl.manageCourses);
router.patch('/:id/exams', authenticate, authorize('college:manage-exams'), validate(schema.manageExams), ctrl.manageExams);

module.exports = router;
