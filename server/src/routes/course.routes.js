const router = require('express').Router();
const ctrl = require('../controllers/course.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/course.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('course:create'), validate(schema.createCourse), ctrl.createCourse);
router.get('/', authenticate, authorize('course:read'), ctrl.getCourses);
router.get('/:id/colleges', authenticate, authorize('course:read'), ctrl.getCollegesByCourse);
router.get('/:id', authenticate, authorize('course:read'), ctrl.getCourseById);
router.patch('/:id', authenticate, authorize('course:update'), validate(schema.updateCourse), ctrl.updateCourse);
router.delete('/:id', authenticate, authorize('course:delete'), ctrl.deleteCourse);

module.exports = router;
