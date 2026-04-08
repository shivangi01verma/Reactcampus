const router = require('express').Router();
const ctrl = require('../controllers/exam.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/exam.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('exam:create'), validate(schema.createExam), ctrl.createExam);
router.get('/', authenticate, authorize('exam:read'), ctrl.getExams);
router.get('/:id', authenticate, authorize('exam:read'), ctrl.getExamById);
router.patch('/:id', authenticate, authorize('exam:update'), validate(schema.updateExam), ctrl.updateExam);
router.delete('/:id', authenticate, authorize('exam:delete'), ctrl.deleteExam);

module.exports = router;
